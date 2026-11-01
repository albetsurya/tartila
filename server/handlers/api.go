package handlers

import (
	"context"
	"crypto/rand"
	"database/sql"
	"encoding/json"
	"fmt"
	"math/big"
	"net/http"
	"os"
	"strings"
	"time"

	"log"
	"sync"

	"tartila-server/hub"
	"tartila-server/models"
)

type APIHandler struct {
	Hub *hub.RoomHub
	db  *sql.DB

	// Tilawati timeline Postgres pool, opened lazily on first request.
	timelineOnce sync.Once
	timelineDB   *sql.DB
	timelineErr  error
}

func NewAPIHandler(h *hub.RoomHub) *APIHandler {
	return &APIHandler{Hub: h}
}

// SetDB wires the persistent database store. It is set after InitDB() in main().
func (api *APIHandler) SetDB(db *sql.DB) {
	api.db = db
}

// userIDFromRequest extracts the authenticated user's Tartila ID from the
// request's Authorization: Bearer header, following the same convention the
// WebSocket handlers use (HS256 token carrying a `user_id` claim).
func (api *APIHandler) userIDFromRequest(r *http.Request) (string, error) {
	userID, _, err := hub.ParseAuthToken(r)
	return userID, err
}

func (api *APIHandler) userAuthFromRequest(r *http.Request) (string, string, error) {
	userID, claims, err := hub.ParseAuthToken(r)
	if err != nil {
		return "", "", err
	}
	role, _ := claims["role"].(string)
	return userID, role, nil
}

// Generate random 6-digit PIN
func GeneratePIN() string {
	n, _ := rand.Int(rand.Reader, big.NewInt(900000))
	return fmt.Sprintf("%06d", n.Int64()+100000)
}

// Generate random 8-digit Exam Token
func GenerateExamToken() string {
	n, _ := rand.Int(rand.Reader, big.NewInt(90000000))
	return fmt.Sprintf("%08d", n.Int64()+10000000)
}

type CreateRoomRequest struct {
	HostID       string            `json:"hostId"`
	RoomType     models.RoomType   `json:"roomType"`
	KKM          int               `json:"kkm"`
	IsRandomized bool              `json:"isRandomized"`
	Tier         string            `json:"tier"` // "free" | "vip" | "premium"
	Questions    []models.Question `json:"questions"`
}

func (api *APIHandler) CreateRoom(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req CreateRoomRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid payload", http.StatusBadRequest)
		return
	}

	if req.KKM <= 0 {
		req.KKM = 75
	}
	if req.RoomType == "" {
		req.RoomType = models.RoomTypeLatihan
	}

	if callerID, err := api.userIDFromRequest(r); err == nil && callerID != "" {
		if req.HostID == "" {
			req.HostID = callerID
		}
	}

	// Terapkan batasan Tier (Tahap 4)
	tier := strings.ToLower(req.Tier)
	maxQuestions := 5
	switch tier {
	case "vip":
		maxQuestions = 20
	case "premium":
		maxQuestions = 100 // unlimited tier
	default:
		maxQuestions = 5
	}

	if len(req.Questions) > maxQuestions {
		req.Questions = req.Questions[:maxQuestions]
	}

	// Generate unique PIN
	var pin string
	for {
		pin = GeneratePIN()
		api.Hub.Mu.RLock()
		_, exists := api.Hub.Rooms[pin]
		api.Hub.Mu.RUnlock()
		if !exists {
			break
		}
	}

	room := &models.Room{
		ID:                   fmt.Sprintf("room-%d", time.Now().UnixNano()),
		HostID:               req.HostID,
		PIN:                  pin,
		RoomType:             req.RoomType,
		Status:               models.RoomStatusWaiting,
		CurrentQuestionIndex: 0,
		KKM:                  req.KKM,
		ExamToken:            GenerateExamToken(),
		IsRandomized:         req.IsRandomized,
		Questions:            req.Questions,
		Players:              make(map[string]*models.Player),
		Answers:              make([]models.AnswerRecord, 0),
		Violations:           make([]models.ViolationRecord, 0),
		CreatedAt:            time.Now(),
	}

	api.Hub.Mu.Lock()
	api.Hub.Rooms[pin] = room
	api.Hub.Mu.Unlock()

	// Simpan room ke database SQLite jika tersedia
	if api.db != nil {
		_, _ = api.db.Exec(`INSERT OR REPLACE INTO rooms (id, host_id, pin) VALUES (?, ?, ?)`, room.ID, room.HostID, pin)
	}

	w.Header().Set("Content-Type", "application/json")
	_ = json.NewEncoder(w).Encode(map[string]interface{}{
		"success":   true,
		"room":      room,
		"pin":       pin,
		"examToken": room.ExamToken,
	})
}

func (api *APIHandler) GetRoomInfo(w http.ResponseWriter, r *http.Request, pin string) {
	api.Hub.Mu.RLock()
	room, exists := api.Hub.Rooms[pin]
	api.Hub.Mu.RUnlock()

	if !exists {
		http.Error(w, "Room tidak ditemukan", http.StatusNotFound)
		return
	}

	playersList := make([]*models.Player, 0, len(room.Players))
	for _, p := range room.Players {
		playersList = append(playersList, p)
	}

	w.Header().Set("Content-Type", "application/json")
	_ = json.NewEncoder(w).Encode(map[string]interface{}{
		"pin":            room.PIN,
		"roomType":       room.RoomType,
		"status":         room.Status,
		"kkm":            room.KKM,
		"totalQuestions": len(room.Questions),
		"playerCount":    len(room.Players),
		"players":        playersList,
	})
}

type JoinRoomRequest struct {
	Nickname string `json:"nickname"`
	UserID   string `json:"userId,omitempty"`
}

func (api *APIHandler) JoinRoom(w http.ResponseWriter, r *http.Request, pin string) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req JoinRoomRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil || strings.TrimSpace(req.Nickname) == "" {
		http.Error(w, "Nama panggilan wajib diisi", http.StatusBadRequest)
		return
	}

	api.Hub.Mu.Lock()
	room, exists := api.Hub.Rooms[pin]
	if !exists {
		api.Hub.Mu.Unlock()
		http.Error(w, "Room tidak ditemukan", http.StatusNotFound)
		return
	}

	if room.Status != models.RoomStatusWaiting {
		api.Hub.Mu.Unlock()
		http.Error(w, "Kuis sedang berlangsung atau sudah selesai", http.StatusBadRequest)
		return
	}

	playerID := fmt.Sprintf("ply-%d", time.Now().UnixNano())
	player := &models.Player{
		ID:       playerID,
		UserID:   req.UserID,
		Nickname: strings.TrimSpace(req.Nickname),
		Score:    0,
		IsActive: true,
		JoinedAt: time.Now(),
	}

	room.Players[playerID] = player
	api.Hub.Mu.Unlock()

	// Broadcast player joined to room
	api.Hub.BroadcastToRoom(pin, models.WSMessage{
		Type: "player_joined",
		Payload: map[string]interface{}{
			"player":       player,
			"totalPlayers": len(room.Players),
		},
	})

	w.Header().Set("Content-Type", "application/json")
	_ = json.NewEncoder(w).Encode(map[string]interface{}{
		"success":  true,
		"playerId": playerID,
		"nickname": player.Nickname,
		"roomPin":  pin,
	})
}

type ViolationRequest struct {
	RoomPIN       string `json:"roomPin"`
	PlayerID      string `json:"playerId"`
	ViolationType string `json:"violationType"`
}

// AuthMiddleware memverifikasi token JWT dari header Authorization atau query string.
// Tolak request dengan HTTP 401 Unauthorized jika user tidak terautentikasi.
func (api *APIHandler) AuthMiddleware(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		userID, err := api.userIDFromRequest(r)
		if err != nil || userID == "" {
			http.Error(w, "unauthorized", http.StatusUnauthorized)
			return
		}
		next(w, r)
	}
}

// VerifyRoomHost memverifikasi apakah userID adalah host_id dari room PIN yang dimaksud.
// Pemeriksaan dilakukan di database (SQLite Store, Postgres fallback) dan in-memory hub.
func (api *APIHandler) VerifyRoomHost(pin, userID string) bool {
	if pin == "" || userID == "" {
		return false
	}

	// 1. Verifikasi di SQLite database
	if api.db != nil {
		var hostID string
		err := api.db.QueryRow("SELECT host_id FROM rooms WHERE pin = ?", pin).Scan(&hostID)
		if err == nil {
			return hostID == userID
		}
	}

	// 2. Verifikasi di Postgres (Supabase) database jika ENV database dikonfigurasi
	if os.Getenv("TILAWATI_DATABASE_URL") != "" || os.Getenv("DATABASE_URL") != "" {
		if pgDB, err := api.timelinePool(); err == nil && pgDB != nil {
			ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
			defer cancel()
			var hostID string
			err := pgDB.QueryRowContext(ctx, "SELECT host_id FROM rooms WHERE pin = $1 OR room_code = $1", pin).Scan(&hostID)
			if err == nil {
				return hostID == userID
			}
		}
	}

	// 3. Fallback verifikasi di in-memory hub room state
	if api.Hub != nil {
		api.Hub.Mu.RLock()
		room, exists := api.Hub.Rooms[pin]
		api.Hub.Mu.RUnlock()
		if exists && room.HostID != "" {
			return room.HostID == userID
		}
	}

	return false
}

// POST /api/exam/violation (Tahap 7)
func (api *APIHandler) RecordViolation(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Tolak request jika data pelanggaran dikirim oleh user yang tidak terautentikasi
	userID, err := api.userIDFromRequest(r)
	if err != nil || userID == "" {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}

	var req ViolationRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid payload", http.StatusBadRequest)
		return
	}

	api.Hub.Mu.Lock()
	room, exists := api.Hub.Rooms[req.RoomPIN]
	if !exists {
		api.Hub.Mu.Unlock()
		http.Error(w, "Room tidak ditemukan", http.StatusNotFound)
		return
	}

	player, pExists := room.Players[req.PlayerID]
	if !pExists {
		api.Hub.Mu.Unlock()
		http.Error(w, "Peserta tidak ditemukan", http.StatusNotFound)
		return
	}

	// Tolak jika actor yang mengirim pelanggaran bukan pemain bersangkutan atau host room
	if player.UserID != "" && player.UserID != userID && room.HostID != userID {
		api.Hub.Mu.Unlock()
		http.Error(w, "forbidden: caller cannot record violation for another player", http.StatusForbidden)
		return
	}

	player.Violations++
	autoSubmitted := false
	if player.Violations >= 3 {
		player.Disqualified = true
		player.Submitted = true
		autoSubmitted = true
	}

	violation := models.ViolationRecord{
		ID:            fmt.Sprintf("viol-%d", time.Now().UnixNano()),
		PlayerID:      player.ID,
		RoomID:        room.ID,
		ViolationType: req.ViolationType,
		Timestamp:     time.Now(),
	}
	room.Violations = append(room.Violations, violation)
	api.Hub.Mu.Unlock()

	// Broadcast violation event
	api.Hub.BroadcastToRoom(req.RoomPIN, models.WSMessage{
		Type: "player_violation",
		Payload: map[string]interface{}{
			"playerId":      player.ID,
			"nickname":      player.Nickname,
			"violations":    player.Violations,
			"autoSubmitted": autoSubmitted,
		},
	})

	w.Header().Set("Content-Type", "application/json")
	_ = json.NewEncoder(w).Encode(map[string]interface{}{
		"success":       true,
		"violations":    player.Violations,
		"autoSubmitted": autoSubmitted,
	})
}

// GET /api/rooms/:pin/report (Tahap 8)
func (api *APIHandler) GetExamReport(w http.ResponseWriter, r *http.Request, pin string) {
	api.Hub.Mu.RLock()
	room, exists := api.Hub.Rooms[pin]
	api.Hub.Mu.RUnlock()

	if !exists {
		http.Error(w, "Room tidak ditemukan", http.StatusNotFound)
		return
	}

	totalQuestions := len(room.Questions)
	maxPossibleScore := totalQuestions * 1000
	if maxPossibleScore == 0 {
		maxPossibleScore = 1
	}

	// Category analysis
	categoryScores := make(map[string][]int) // category -> []percentage
	for _, q := range room.Questions {
		if _, ok := categoryScores[q.Category]; !ok {
			categoryScores[q.Category] = make([]int, 0)
		}
	}

	type PlayerReport struct {
		ID           string `json:"id"`
		Nickname     string `json:"nickname"`
		Score        int    `json:"score"`
		Percentage   int    `json:"percentage"`
		Passed       bool   `json:"passed"`
		Violations   int    `json:"violations"`
		Disqualified bool   `json:"disqualified"`
	}

	playerReports := make([]PlayerReport, 0, len(room.Players))
	for _, p := range room.Players {
		percentage := int(float64(p.Score) / float64(maxPossibleScore) * 100)
		passed := percentage >= room.KKM && !p.Disqualified
		playerReports = append(playerReports, PlayerReport{
			ID:           p.ID,
			Nickname:     p.Nickname,
			Score:        p.Score,
			Percentage:   percentage,
			Passed:       passed,
			Violations:   p.Violations,
			Disqualified: p.Disqualified,
		})
	}

	// Per-category averages based on answers
	categoryAverages := make(map[string]int)
	for cat := range categoryScores {
		correctInCat := 0
		totalInCat := 0
		for _, ans := range room.Answers {
			// Find question category
			for _, q := range room.Questions {
				if q.ID == ans.QuestionID && q.Category == cat {
					totalInCat++
					if ans.IsCorrect {
						correctInCat++
					}
				}
			}
		}
		if totalInCat > 0 {
			categoryAverages[cat] = int(float64(correctInCat) / float64(totalInCat) * 100)
		} else {
			categoryAverages[cat] = 100
		}
	}

	w.Header().Set("Content-Type", "application/json")
	_ = json.NewEncoder(w).Encode(map[string]interface{}{
		"roomPin":          room.PIN,
		"roomType":         room.RoomType,
		"kkm":              room.KKM,
		"totalQuestions":   totalQuestions,
		"totalPlayers":     len(room.Players),
		"players":          playerReports,
		"categoryAverages": categoryAverages,
		"createdAt":        room.CreatedAt,
	})
}

// GET /api/leaderboard/global (Tahap 6)
func (api *APIHandler) GetGlobalLeaderboard(w http.ResponseWriter, r *http.Request) {
	dataRaw, err := api.db.Query(`
		SELECT user_id, nickname, score, game_id, created_at
		FROM quiz_attempts
		WHERE game_id = ? AND created_at >= datetime('now', ?)
		ORDER BY score DESC
		LIMIT ?
	`, "quiz-hub", "-7 days", 50)
	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		_ = json.NewEncoder(w).Encode(map[string]interface{}{
			"success": false,
			"message": "Gagal mengambil leaderboard: " + err.Error(),
		})
		return
	}
	defer dataRaw.Close()

	entries := make([]map[string]interface{}, 0)
	for dataRaw.Next() {
		var userId, nickname, gameId, createdAt string
		var score int
		if err := dataRaw.Scan(&userId, &nickname, &score, &gameId, &createdAt); err != nil {
			continue
		}
		entries = append(entries, map[string]interface{}{
			"id":        userId,
			"name":      nickname,
			"score":     score,
			"game_id":   gameId,
			"created_at": createdAt,
		})
	}

	w.Header().Set("Content-Type", "application/json")
	_ = json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"leaderboard": entries,
		"timeframe":   "weekly",
	})
}

// GET /api/v1/ngaji-ceria/leaderboard/global (Tahap 7)
// shortcut: runtime sebelumnya rusak sejak commit 9fc65058 (fungsi kosong);
// dibangun ulang minimal dari quiz_attempts SQLite, upgrade saat leaderboard
// ngaji-ceria pindah ke tabel sendiri.
func (api *APIHandler) GetNgajiCeriaGlobalLeaderboard(w http.ResponseWriter, r *http.Request) {
	dataRaw, err := api.db.Query(`
		SELECT user_id, score, game_id, created_at
		FROM quiz_attempts
		WHERE game_id LIKE 'ngaji%' AND created_at >= datetime('now', '-7 days')
		ORDER BY score DESC
		LIMIT 50
	`)
	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		_ = json.NewEncoder(w).Encode(map[string]interface{}{
			"success": false,
			"message": "Gagal mengambil leaderboard: " + err.Error(),
		})
		return
	}
	defer dataRaw.Close()

	entries := make([]map[string]interface{}, 0)
	for dataRaw.Next() {
		var userId, gameId, createdAt string
		var score int
		if err := dataRaw.Scan(&userId, &score, &gameId, &createdAt); err != nil {
			continue
		}
		entries = append(entries, map[string]interface{}{
			"id":         userId,
			"score":      score,
			"game_id":    gameId,
			"created_at": createdAt,
		})
	}

	w.Header().Set("Content-Type", "application/json")
	_ = json.NewEncoder(w).Encode(map[string]interface{}{
		"success":     true,
		"leaderboard": entries,
		"timeframe":   "weekly",
	})
}

// CalculateAuthoritativeRewards menghitung earnedXp dan earnedCoins secara otoritatif di server.
// Nilai XP / Koin dari frontend diabaikan total, dan diterapkan level-cap keras per sesi game.
func CalculateAuthoritativeRewards(score, baseXp int) (int, int) {
	if score < 0 {
		score = 0
	}
	if score > 100000 {
		score = 100000
	}
	if baseXp < 0 {
		baseXp = 0
	}
	if baseXp > 100 {
		baseXp = 100
	}

	// Rumus resmi sesuai GUIDELINES.md Bab 2:
	// earnedCoins = max(5, floor((baseXp + score) / 10))
	// earnedXp = max(baseXp, floor(score / 10))
	earnedCoins := (baseXp + score) / 10
	if earnedCoins < 5 {
		earnedCoins = 5
	}
	// Level-cap keras per sesi game: maksimal 1.000 Koin
	if earnedCoins > 1000 {
		earnedCoins = 1000
	}

	earnedXp := score / 10
	if earnedXp < baseXp {
		earnedXp = baseXp
	}
	// Level-cap keras per sesi game: maksimal 1.000 XP
	if earnedXp > 1000 {
		earnedXp = 1000
	}

	return earnedXp, earnedCoins
}

type ProgressEventRequest struct {
	EventID        string   `json:"eventId"`
	GameID         string   `json:"gameId"`
	Score          int      `json:"score"`
	BaseXP         int      `json:"baseXp,omitempty"`
	CorrectCount   int      `json:"correctCount,omitempty"`
	Duration       int      `json:"duration,omitempty"`
	AchievementIDs []string `json:"achievementIds,omitempty"`

	// DILARANG dipercaya dari client: jika client mengirim earnedXp/earnedCoins, backend abaikan!
	EarnedXP    int `json:"earnedXp,omitempty"`
	EarnedCoins int `json:"earnedCoins,omitempty"`
}

// POST /api/v1/ngaji-ceria/progress/events atau /api/v1/ngaji-ceria/leaderboard (submit)
func (api *APIHandler) SubmitNgajiCeriaProgress(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	userID, err := api.userIDFromRequest(r)
	if err != nil || userID == "" {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}

	var req ProgressEventRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid payload", http.StatusBadRequest)
		return
	}

	// Otoritatif: hitung ulang earnedXp dan earnedCoins di server.
	// Nilai req.EarnedXP atau req.EarnedCoins dari client DIABAIKAN.
	earnedXp, earnedCoins := CalculateAuthoritativeRewards(req.Score, req.BaseXP)

	attemptID := req.EventID
	if attemptID == "" {
		attemptID = fmt.Sprintf("attempt-%d", time.Now().UnixNano())
	}
	gameID := req.GameID
	if gameID == "" {
		gameID = "ngaji-ceria"
	}

	// 1. Simpan skor ke quiz_attempts (SQLite)
	if api.db != nil {
		_, _ = api.db.Exec(`
			INSERT OR REPLACE INTO quiz_attempts (id, user_id, game_id, score, updated_at)
			VALUES (?, ?, ?, ?, datetime('now'))
		`, attemptID, userID, gameID, req.Score)

		// 2. Update progres XP dan Koin akumulatif user di user_progress (SQLite)
		_, _ = api.db.Exec(`
			INSERT INTO user_progress (user_id, xp, coins, total_score, games_played, updated_at)
			VALUES (?, ?, ?, ?, 1, datetime('now'))
			ON CONFLICT(user_id) DO UPDATE SET
				xp = xp + excluded.xp,
				coins = coins + excluded.coins,
				total_score = total_score + excluded.total_score,
				games_played = games_played + 1,
				updated_at = datetime('now')
		`, userID, earnedXp, earnedCoins, req.Score)
	}

	// Ambil total progres terkini
	var totalXP, totalCoins, totalScore, gamesPlayed int
	if api.db != nil {
		_ = api.db.QueryRow(`
			SELECT xp, coins, total_score, games_played
			FROM user_progress
			WHERE user_id = ?
		`, userID).Scan(&totalXP, &totalCoins, &totalScore, &gamesPlayed)
	}

	today := time.Now().Format("2006-01-02")
	achievements := req.AchievementIDs
	if achievements == nil {
		achievements = []string{}
	}

	progressData := map[string]interface{}{
		"xp":                   totalXP,
		"coins":                totalCoins,
		"totalScore":           totalScore,
		"gamesPlayed":          gamesPlayed,
		"currentStreak":        1,
		"dailyDate":            today,
		"dailyGamesPlayed":     1,
		"dailyTotalScore":      req.Score,
		"dailyClaimedMissions": []string{},
		"achievements":         achievements,
	}

	w.Header().Set("Content-Type", "application/json")
	_ = json.NewEncoder(w).Encode(map[string]interface{}{
		"success":     true,
		"earnedXp":    earnedXp,
		"earnedCoins": earnedCoins,
		"progress":    progressData,
	})
}

// GET /api/v1/ngaji-ceria/progress
func (api *APIHandler) GetNgajiCeriaProgress(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	userID, err := api.userIDFromRequest(r)
	if err != nil || userID == "" {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}

	var totalXP, totalCoins, totalScore, gamesPlayed int
	if api.db != nil {
		_ = api.db.QueryRow(`
			SELECT xp, coins, total_score, games_played
			FROM user_progress
			WHERE user_id = ?
		`, userID).Scan(&totalXP, &totalCoins, &totalScore, &gamesPlayed)
	}

	today := time.Now().Format("2006-01-02")
	progressData := map[string]interface{}{
		"xp":                   totalXP,
		"coins":                totalCoins,
		"totalScore":           totalScore,
		"gamesPlayed":          gamesPlayed,
		"currentStreak":        1,
		"dailyDate":            today,
		"dailyGamesPlayed":     0,
		"dailyTotalScore":      0,
		"dailyClaimedMissions": []string{},
		"achievements":         []string{},
	}

	w.Header().Set("Content-Type", "application/json")
	_ = json.NewEncoder(w).Encode(progressData)
}

func (api *APIHandler) NgajiCeriaProgressHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodGet {
		api.GetNgajiCeriaProgress(w, r)
		return
	}
	if r.Method == http.MethodPost {
		api.SubmitNgajiCeriaProgress(w, r)
		return
	}
	http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
}

func (api *APIHandler) NgajiCeriaLeaderboardHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodGet {
		api.GetNgajiCeriaLeaderboard(w, r)
		return
	}
	if r.Method == http.MethodPost {
		api.SubmitNgajiCeriaProgress(w, r)
		return
	}
	http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
}

// GET /api/v1/ngaji-ceria/leaderboard (Tahap 7) — skor pribadi user login.
func (api *APIHandler) GetNgajiCeriaLeaderboard(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	userID, err := api.userIDFromRequest(r)
	if err != nil {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}

	dataRaw, err := api.db.Query(`
		SELECT game_id, MAX(score), MAX(updated_at)
		FROM quiz_attempts
		WHERE user_id = ?
		GROUP BY game_id
	`, userID)
	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		_ = json.NewEncoder(w).Encode(map[string]interface{}{
			"success": false,
			"message": "Gagal mengambil leaderboard: " + err.Error(),
		})
		return
	}
	defer dataRaw.Close()

	entries := make([]map[string]interface{}, 0)
	for dataRaw.Next() {
		var gameId string
		var score int
		var updatedAt string
		if err := dataRaw.Scan(&gameId, &score, &updatedAt); err != nil {
			continue
		}
		entries = append(entries, map[string]interface{}{
			"game_id":    gameId,
			"score":      score,
			"updated_at": updatedAt,
		})
	}

	w.Header().Set("Content-Type", "application/json")
	_ = json.NewEncoder(w).Encode(map[string]interface{}{
		"success":     true,
		"leaderboard": entries,
	})
}

// GET /api/v1/user/profile returns the authenticated user's profile,
// including feedback-prompt fields that are persisted server-side so a user
// who clears cache or swaps device does not keep seeing the prompt.
func (api *APIHandler) GetUserProfile(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	userID, role, err := api.userAuthFromRequest(r)
	if err != nil {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}

	if api.db != nil {
		var dbRole string
		if err := api.db.QueryRow("SELECT role FROM users WHERE id = ?", userID).Scan(&dbRole); err == nil && dbRole != "" {
			role = dbRole
		}
	}
	if role == "" {
		role = "member"
	}

	var lastPromptAt string
	var hasSubmitted int
	err = api.db.QueryRow(
		`SELECT last_feedback_prompt_at, has_submitted_feedback
		 FROM feedback_prompt
		 WHERE user_id = ?`,
		userID,
	).Scan(&lastPromptAt, &hasSubmitted)

	if err == sql.ErrNoRows {
		err = nil // Never prompted yet.
	}
	if err != nil {
		log.Printf("[handlers] GetUserProfile query failed: %v", err)
		http.Error(w, "database error", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	_ = json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"user": map[string]interface{}{
			"id":                      userID,
			"role":                    role,
			"last_feedback_prompt_at": lastPromptAt,
			"has_submitted_feedback":  hasSubmitted == 1,
		},
		"last_feedback_prompt_at": lastPromptAt,
		"has_submitted_feedback":  hasSubmitted == 1,
	})
}

// PATCH /api/v1/user/feedback-prompt records the moment the user was prompted
// for feedback (and whether the feedback was submitted). This lets the prompt
// cadence be enforced server-side (90 days) instead of in the browser.
func (api *APIHandler) UpdateFeedbackPrompt(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPatch {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	userID, err := api.userIDFromRequest(r)
	if err != nil {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}

	var reqBody struct {
		HasSubmitted *bool `json:"has_submitted_feedback"`
	}
	_ = json.NewDecoder(r.Body).Decode(&reqBody)

	submittedVal := 0
	if reqBody.HasSubmitted != nil && *reqBody.HasSubmitted {
		submittedVal = 1
	}

	now := time.Now().UTC().Format(time.RFC3339)
	result, err := api.db.Exec(
		`INSERT INTO feedback_prompt (user_id, last_feedback_prompt_at, has_submitted_feedback, updated_at)
		 VALUES (?, ?, ?, ?)
		 ON CONFLICT(user_id) DO UPDATE SET
		 last_feedback_prompt_at = excluded.last_feedback_prompt_at,
		 has_submitted_feedback = CASE WHEN excluded.has_submitted_feedback = 1 THEN 1 ELSE feedback_prompt.has_submitted_feedback END,
		 updated_at = excluded.updated_at`,
		userID, now, submittedVal, now,
	)
	if err != nil {
		log.Printf("[handlers] UpdateFeedbackPrompt exec failed: %v", err)
		http.Error(w, "database error", http.StatusInternalServerError)
		return
	}

	rows, _ := result.RowsAffected()
	w.Header().Set("Content-Type", "application/json")
	_ = json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"lastAt":  now,
		"updated": rows > 0,
	})
}

// POST /api/v1/auth/sync-profile
// Creates or updates user profile in SQLite Store with default role 'member' (Bagian 8.3 & 8.4).
func (api *APIHandler) SyncProfile(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	userID, claims, err := hub.ParseAuthToken(r)
	if err != nil || userID == "" {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusUnauthorized)
		_ = json.NewEncoder(w).Encode(map[string]interface{}{
			"success": false,
			"message": "unauthorized",
		})
		return
	}

	var req struct {
		Email string `json:"email"`
	}
	_ = json.NewDecoder(r.Body).Decode(&req)

	email := strings.TrimSpace(req.Email)
	if email == "" && claims != nil {
		if claimsEmail, ok := claims["email"].(string); ok {
			email = strings.TrimSpace(claimsEmail)
		}
	}

	role := "member"
	if api.db != nil {
		_, err := api.db.Exec(`
			INSERT INTO users (id, email, role, updated_at)
			VALUES (?, ?, 'member', datetime('now'))
			ON CONFLICT(id) DO UPDATE SET
				email = CASE WHEN excluded.email != '' THEN excluded.email ELSE users.email END,
				updated_at = datetime('now')
		`, userID, email)
		if err != nil {
			log.Printf("[handlers] SyncProfile db error: %v", err)
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusInternalServerError)
			_ = json.NewEncoder(w).Encode(map[string]interface{}{
				"success": false,
				"message": "database error",
			})
			return
		}

		var dbRole, dbEmail string
		if err := api.db.QueryRow("SELECT role, email FROM users WHERE id = ?", userID).Scan(&dbRole, &dbEmail); err == nil {
			if dbRole != "" {
				role = dbRole
			}
			if dbEmail != "" {
				email = dbEmail
			}
		}
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	_ = json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"message": "Profil berhasil disinkronisasi",
		"user": map[string]interface{}{
			"id":    userID,
			"email": email,
			"role":  role,
		},
	})
}
