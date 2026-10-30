package handlers

import (
	"database/sql"
	"net/http"
	"net/http/httptest"
	"os"
	"testing"
	"time"

	_ "modernc.org/sqlite"

	"github.com/golang-jwt/jwt/v5"
	"tartila-server/hub"
)

func newTestHandler(t *testing.T) (*APIHandler, *sql.DB) {
	t.Helper()
	t.Setenv("JWT_SECRET", "test-secret")

	roomHub := hub.NewRoomHub()
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
