package handlers

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"os"
	"strings"
	"testing"
	"time"

	_ "modernc.org/sqlite"

	"github.com/golang-jwt/jwt/v5"
	"tartila-server/hub"
	"tartila-server/models"
)

func newTestHandler(t *testing.T) (*APIHandler, *sql.DB) {
	t.Helper()
	t.Setenv("JWT_SECRET", "test-secret")

	roomHub := hub.NewRoomHub()
	go roomHub.Run()
	api := NewAPIHandler(roomHub)

	db, err := sqlOpenTestDB()
	if err != nil {
		t.Fatalf("sqlOpenTestDB: %v", err)
	}
	api.SetDB(db)
	return api, db
}

func sqlOpenTestDB() (*sql.DB, error) {
	db, err := sql.Open("sqlite", ":memory:")
	if err != nil {
		return nil, err
	}
	_, err = db.Exec(schema)
	return db, err
}

// schema mirrors server/db.go so the test does not depend on the file store.
const schema = `
CREATE TABLE IF NOT EXISTS feedback_prompt (
  user_id                 TEXT PRIMARY KEY,
  last_feedback_prompt_at TEXT,
  has_submitted_feedback  INTEGER NOT NULL DEFAULT 0,
  updated_at              TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS rooms (
  id          TEXT PRIMARY KEY,
  host_id     TEXT NOT NULL,
  pin         TEXT NOT NULL UNIQUE,
  created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_rooms_pin     ON rooms(pin);
CREATE INDEX IF NOT EXISTS idx_rooms_host_id ON rooms(host_id);

CREATE TABLE IF NOT EXISTS quiz_attempts (
  id          TEXT PRIMARY KEY,
  user_id     TEXT NOT NULL,
  game_id     TEXT NOT NULL,
  score       INTEGER NOT NULL DEFAULT 0,
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS user_progress (
  user_id      TEXT PRIMARY KEY,
  xp           INTEGER NOT NULL DEFAULT 0,
  coins        INTEGER NOT NULL DEFAULT 0,
  total_score  INTEGER NOT NULL DEFAULT 0,
  games_played INTEGER NOT NULL DEFAULT 0,
  updated_at   TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS users (
  id          TEXT PRIMARY KEY,
  email       TEXT,
  role        TEXT NOT NULL DEFAULT 'member',
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
);
`

func signToken(userID string) string {
	payload := jwt.MapClaims{
		"user_id": userID,
		"exp":     time.Now().Add(time.Hour).Unix(),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, payload)
	secret := []byte(os.Getenv("JWT_SECRET"))
	if len(secret) == 0 {
		secret = []byte("test-secret")
	}
	ss, err := token.SignedString(secret)
	if err != nil {
		panic(err)
	}
	return ss
}

func withAuth(req *http.Request, token string) {
	req.Header.Set("Authorization", "Bearer "+token)
}

func putFeedbackPrompt(t *testing.T, db *sql.DB, id string) {
	t.Helper()
	_, _ = db.Exec(
		`INSERT INTO feedback_prompt (user_id, last_feedback_prompt_at, has_submitted_feedback, updated_at)
		 VALUES (?, ?, 0, ?)`,
		id, "2026-10-01T00:00:00Z", time.Now().UTC().Format(time.RFC3339),
	)
}

func TestGetUserProfile(t *testing.T) {
	api, db := newTestHandler(t)
	defer db.Close()

	putFeedbackPrompt(t, db, "user-123")

	token := signToken("user-123")
	req := httptest.NewRequest("GET", "/api/v1/user/profile", nil)
	withAuth(req, token)
	rec := httptest.NewRecorder()
	api.GetUserProfile(rec, req)

	if rec.Code != 200 {
		t.Fatalf("expected 200, got %d: %s", rec.Code, rec.Body.String())
	}
}

func TestUpdateFeedbackPrompt(t *testing.T) {
	api, db := newTestHandler(t)
	defer db.Close()

	token := signToken("user-123")
	req := httptest.NewRequest("PATCH", "/api/v1/user/feedback-prompt", nil)
	withAuth(req, token)
	rec := httptest.NewRecorder()
	api.UpdateFeedbackPrompt(rec, req)

	if rec.Code != 200 {
		t.Fatalf("expected 200, got %d: %s", rec.Code, rec.Body.String())
	}

	var lastAt string
	err := db.QueryRow(
		`SELECT last_feedback_prompt_at FROM feedback_prompt WHERE user_id = ?`,
		"user-123",
	).Scan(&lastAt)
	if err != nil {
		t.Fatalf("query after PATCH: %v", err)
	}
	if lastAt == "" {
		t.Fatalf("expected last_feedback_prompt_at to be set")
	}
}

func TestVerifyRoomHost(t *testing.T) {
	api, db := newTestHandler(t)
	defer db.Close()

	// Insert test room into database
	_, err := db.Exec(`INSERT INTO rooms (id, host_id, pin) VALUES (?, ?, ?)`, "room-1", "host-user-1", "123456")
	if err != nil {
		t.Fatalf("insert test room: %v", err)
	}

	// 1. Host yang cocok harus true
	if !api.VerifyRoomHost("123456", "host-user-1") {
		t.Errorf("expected host-user-1 to be verified as host for room 123456")
	}

	// 2. User lain harus false
	if api.VerifyRoomHost("123456", "attacker-user-2") {
		t.Errorf("expected attacker-user-2 to NOT be verified as host for room 123456")
	}

	// 3. Room PIN tidak ada harus false
	if api.VerifyRoomHost("999999", "host-user-1") {
		t.Errorf("expected non-existent room to return false")
	}
}

func TestRecordViolationUnauthenticated(t *testing.T) {
	api, db := newTestHandler(t)
	defer db.Close()

	// Request tanpa header Authorization / token
	payload := `{"roomPin":"123456","playerId":"ply-1","violationType":"tab_switch"}`
	req := httptest.NewRequest("POST", "/api/exam/violation", strings.NewReader(payload))
	req.Header.Set("Content-Type", "application/json")
	rec := httptest.NewRecorder()

	api.RecordViolation(rec, req)

	// Tolak request jika tidak terautentikasi (401)
	if rec.Code != http.StatusUnauthorized {
		t.Fatalf("expected 401 Unauthorized, got %d: %s", rec.Code, rec.Body.String())
	}
}

func TestRecordViolationAuthenticated(t *testing.T) {
	api, db := newTestHandler(t)
	defer db.Close()

	// Setup in-memory room & player
	pin := "123456"
	room := &models.Room{
		ID:         "room-1",
		HostID:     "host-user",
		PIN:        pin,
		Players:    make(map[string]*models.Player),
		Violations: make([]models.ViolationRecord, 0),
	}
	room.Players["ply-1"] = &models.Player{
		ID:         "ply-1",
		UserID:     "student-user",
		Nickname:   "Santri 1",
		Violations: 0,
	}
	api.Hub.Rooms[pin] = room

	// 1. Request dengan token valid pemain itu sendiri
	token := signToken("student-user")
	payload := `{"roomPin":"123456","playerId":"ply-1","violationType":"tab_switch"}`
	req := httptest.NewRequest("POST", "/api/exam/violation", strings.NewReader(payload))
	req.Header.Set("Content-Type", "application/json")
	withAuth(req, token)
	rec := httptest.NewRecorder()

	api.RecordViolation(rec, req)

	if rec.Code != http.StatusOK {
		t.Fatalf("expected 200 OK, got %d: %s", rec.Code, rec.Body.String())
	}

	if room.Players["ply-1"].Violations != 1 {
		t.Fatalf("expected 1 violation, got %d", room.Players["ply-1"].Violations)
	}

	// 2. Request dari user lain yang bukan pemilik player dan bukan host (harus 403)
	attackerToken := signToken("attacker-user")
	req2 := httptest.NewRequest("POST", "/api/exam/violation", strings.NewReader(payload))
	req2.Header.Set("Content-Type", "application/json")
	withAuth(req2, attackerToken)
	rec2 := httptest.NewRecorder()

	api.RecordViolation(rec2, req2)

	if rec2.Code != http.StatusForbidden {
		t.Fatalf("expected 403 Forbidden, got %d: %s", rec2.Code, rec2.Body.String())
	}
}

func TestAuthMiddleware(t *testing.T) {
	api, db := newTestHandler(t)
	defer db.Close()

	called := false
	handler := api.AuthMiddleware(func(w http.ResponseWriter, r *http.Request) {
		called = true
		w.WriteHeader(http.StatusOK)
	})

	// 1. Request tanpa token -> 401
	req1 := httptest.NewRequest("GET", "/test", nil)
	rec1 := httptest.NewRecorder()
	handler(rec1, req1)
	if rec1.Code != http.StatusUnauthorized {
		t.Errorf("expected 401, got %d", rec1.Code)
	}
	if called {
		t.Errorf("handler should not be called without auth")
	}

	// 2. Request dengan token valid -> 200
	req2 := httptest.NewRequest("GET", "/test", nil)
	withAuth(req2, signToken("user-1"))
	rec2 := httptest.NewRecorder()
	handler(rec2, req2)
	if rec2.Code != http.StatusOK {
		t.Errorf("expected 200, got %d", rec2.Code)
	}
	if !called {
		t.Errorf("handler should be called with valid auth")
	}
}

func TestCalculateAuthoritativeRewards(t *testing.T) {
	// 1. Normal case: score 500, baseXp 20
	// earnedCoins = max(5, (20 + 500) / 10) = 52
	// earnedXp = max(20, 500 / 10) = 50
	xp, coins := CalculateAuthoritativeRewards(500, 20)
	if xp != 50 || coins != 52 {
		t.Fatalf("expected xp=50, coins=52, got xp=%d, coins=%d", xp, coins)
	}

	// 2. Minimum coins guarantee (score 0, baseXp 0)
	// earnedCoins = max(5, 0) = 5
	// earnedXp = max(0, 0) = 0
	xpMin, coinsMin := CalculateAuthoritativeRewards(0, 0)
	if xpMin != 0 || coinsMin != 5 {
		t.Fatalf("expected xp=0, coins=5, got xp=%d, coins=%d", xpMin, coinsMin)
	}

	// 3. Level-cap enforcement: attacker sends huge score 1,000,000
	// max allowed score clamped to 100,000
	// earnedXp capped at 1,000; earnedCoins capped at 1,000
	xpCap, coinsCap := CalculateAuthoritativeRewards(1000000, 9999)
	if xpCap > 1000 || coinsCap > 1000 {
		t.Fatalf("level-cap violated: xp=%d, coins=%d (max 1000 allowed)", xpCap, coinsCap)
	}
}

func TestSubmitNgajiCeriaProgress_AuthoritativeCalculation(t *testing.T) {
	api, db := newTestHandler(t)
	defer db.Close()

	// Client mencoba mengirim earnedXp dan earnedCoins manipulatif via payload
	token := signToken("user-exploit")
	payload := `{
		"eventId": "evt-123",
		"gameId": "quiz-hub",
		"score": 800,
		"baseXp": 10,
		"earnedXp": 999999,
		"earnedCoins": 888888
	}`

	req := httptest.NewRequest("POST", "/api/v1/ngaji-ceria/progress/events", strings.NewReader(payload))
	req.Header.Set("Content-Type", "application/json")
	withAuth(req, token)
	rec := httptest.NewRecorder()

	api.SubmitNgajiCeriaProgress(rec, req)

	if rec.Code != http.StatusOK {
		t.Fatalf("expected 200 OK, got %d: %s", rec.Code, rec.Body.String())
	}

	// Expected authoritative calculation:
	// earnedCoins = max(5, (10 + 800) / 10) = 81
	// earnedXp = max(10, 800 / 10) = 80
	// Manipulasi 999999 dan 888888 dari frontend wajib diabaikan!
	var res struct {
		Success     bool `json:"success"`
		EarnedXP    int  `json:"earnedXp"`
		EarnedCoins int  `json:"earnedCoins"`
		Progress    struct {
			XP    int `json:"xp"`
			Coins int `json:"coins"`
		} `json:"progress"`
	}
	if err := json.NewDecoder(rec.Body).Decode(&res); err != nil {
		t.Fatalf("decode response: %v", err)
	}

	if res.EarnedXP != 80 {
		t.Fatalf("expected server-authoritative earnedXp=80, got %d (client exploit not blocked)", res.EarnedXP)
	}
	if res.EarnedCoins != 81 {
		t.Fatalf("expected server-authoritative earnedCoins=81, got %d (client exploit not blocked)", res.EarnedCoins)
	}

	// Pastikan data tersimpan di user_progress DB
	var dbXP, dbCoins int
	err := db.QueryRow("SELECT xp, coins FROM user_progress WHERE user_id = ?", "user-exploit").Scan(&dbXP, &dbCoins)
	if err != nil {
		t.Fatalf("query user_progress: %v", err)
	}
	if dbXP != 80 || dbCoins != 81 {
		t.Fatalf("expected DB xp=80, coins=81, got xp=%d, coins=%d", dbXP, dbCoins)
	}
}

func TestSubmitNgajiCeriaProgress_Unauthenticated(t *testing.T) {
	api, db := newTestHandler(t)
	defer db.Close()

	payload := `{"eventId":"evt-1","score":100}`
	req := httptest.NewRequest("POST", "/api/v1/ngaji-ceria/progress/events", strings.NewReader(payload))
	req.Header.Set("Content-Type", "application/json")
	rec := httptest.NewRecorder()

	api.SubmitNgajiCeriaProgress(rec, req)

	if rec.Code != http.StatusUnauthorized {
		t.Fatalf("expected 401 Unauthorized, got %d", rec.Code)
	}
}

func TestSyncProfile(t *testing.T) {
	api, db := newTestHandler(t)
	defer db.Close()

	// 1. Unauthenticated request -> 401
	{
		payload := `{"email":"test@example.com"}`
		req := httptest.NewRequest("POST", "/api/v1/auth/sync-profile", strings.NewReader(payload))
		req.Header.Set("Content-Type", "application/json")
		rec := httptest.NewRecorder()

		api.SyncProfile(rec, req)
		if rec.Code != http.StatusUnauthorized {
			t.Fatalf("expected 401 Unauthorized, got %d", rec.Code)
		}
	}

	// 2. Authenticated sync -> creates member profile
	{
		token := signToken("user-oauth-1")
		payload := `{"email":"oauth-user@tartila.com"}`
		req := httptest.NewRequest("POST", "/api/v1/auth/sync-profile", strings.NewReader(payload))
		req.Header.Set("Content-Type", "application/json")
		withAuth(req, token)
		rec := httptest.NewRecorder()

		api.SyncProfile(rec, req)
		if rec.Code != http.StatusOK {
			t.Fatalf("expected 200 OK, got %d: %s", rec.Code, rec.Body.String())
		}

		var res struct {
			Success bool `json:"success"`
			User    struct {
				ID    string `json:"id"`
				Email string `json:"email"`
				Role  string `json:"role"`
			} `json:"user"`
		}
		if err := json.NewDecoder(rec.Body).Decode(&res); err != nil {
			t.Fatalf("decode: %v", err)
		}
		if !res.Success || res.User.ID != "user-oauth-1" || res.User.Email != "oauth-user@tartila.com" || res.User.Role != "member" {
			t.Fatalf("unexpected sync result: %+v", res)
		}

		// Verify in SQLite users table
		var dbRole, dbEmail string
		err := db.QueryRow("SELECT role, email FROM users WHERE id = ?", "user-oauth-1").Scan(&dbRole, &dbEmail)
		if err != nil {
			t.Fatalf("query users table: %v", err)
		}
		if dbRole != "member" || dbEmail != "oauth-user@tartila.com" {
			t.Fatalf("expected role=member, email=oauth-user@tartila.com, got role=%s, email=%s", dbRole, dbEmail)
		}
	}
}
