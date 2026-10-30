package handlers

import (
	"crypto/rand"
	"database/sql"
	"encoding/json"
	"fmt"
	"math/big"
	"net/http"
	"strings"
	"time"

	"log"

	"tartila-server/hub"
	"tartila-server/models"
)

type APIHandler struct {
	Hub *hub.RoomHub
	db  *sql.DB
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

// POST /api/exam/violation (Tahap 7)
func (api *APIHandler) RecordViolation(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
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
		var userId, gameId, createdAt string
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
func (api *APIHandler) GetNgajiCeriaGlobalLeaderboard(w http.ResponseWriter, r *http.Request) {

// GET /api/v1/user/profile returns the authenticated user's profile,
// including feedback-prompt fields that are persisted server-side so a user
// who clears cache or swaps device does not keep seeing the prompt.
func (api *APIHandler) GetUserProfile(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	userID, err := api.userIDFromRequest(r)
	if err != nil {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
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
