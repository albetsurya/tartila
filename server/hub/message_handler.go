package hub

import (
	"encoding/json"
	"fmt"
	"log"
	"math/rand"
	"sort"
	"time"

	"tartila-server/models"
)

// Strip correct answers from questions for client broadcast (ANTI-CHEAT)
func ToClientQuestion(q models.Question, index int, total int) models.ClientQuestion {
	clientOptions := make([]models.QuestionOption, len(q.Options))
	for i, opt := range q.Options {
		clientOptions[i] = models.QuestionOption{
			ID:     opt.ID,
			Text:   opt.Text,
			Arabic: opt.Arabic,
			// isCorrect explicitly omitted
		}
	}

	return models.ClientQuestion{
		ID:                q.ID,
		QuestionIndex:     index,
		TotalQuestions:    total,
		Type:              q.Type,
		Category:          q.Category,
		Title:             q.Title,
		Prompt:            q.Prompt,
		ArabicPrompt:      q.ArabicPrompt,
		AudioURL:          q.AudioURL,
		FillBlankTemplate: q.FillBlankTemplate,
		Options:           clientOptions,
		TimeLimitSeconds:  q.TimeLimitSeconds,
	}
}

func (h *RoomHub) SendInitialRoomState(c *Client) {
	h.Mu.RLock()
	room, exists := h.Rooms[c.RoomPIN]
	h.Mu.RUnlock()

	if !exists {
		c.SendJSON(models.WSMessage{
			Type:    "error",
			Payload: map[string]string{"message": "Room tidak ditemukan"},
		})
		return
	}

	// Prepare player list
	playersList := make([]*models.Player, 0, len(room.Players))
	for _, p := range room.Players {
		playersList = append(playersList, p)
	}

	payload := map[string]interface{}{
		"roomPin":   room.PIN,
		"roomType":  room.RoomType,
		"status":    room.Status,
		"kkm":       room.KKM,
		"players":   playersList,
		"totalQ":    len(room.Questions),
		"question":  room.CurrentQuestionIndex,
	}

	// Include reconnecting player's specific state
	if c.PlayerID != "" {
		if p, ok := room.Players[c.PlayerID]; ok {
			payload["myScore"] = p.Score
			payload["violations"] = p.Violations
			payload["disqualified"] = p.Disqualified
		}
	}

	// If finished, provide final leaderboard
	if room.Status == models.RoomStatusFinished {
		payload["leaderboard"] = h.buildLeaderboard(room)
	}

	// If currently playing, send active question (without answer!)
	if room.Status == models.RoomStatusPlaying && room.CurrentQuestionIndex < len(room.Questions) {
		q := room.Questions[room.CurrentQuestionIndex]
		payload["currentQuestion"] = ToClientQuestion(q, room.CurrentQuestionIndex, len(room.Questions))
	}

	c.SendJSON(models.WSMessage{
		Type:    "room_state",
		Payload: payload,
	})
}

func (c *Client) SendJSON(msg models.WSMessage) {
	bytes, err := json.Marshal(msg)
	if err != nil {
		return
	}
	select {
	case c.Send <- bytes:
	default:
	}
}

func (h *RoomHub) HandleClientMessage(c *Client, msg models.WSMessage) {
	h.Mu.Lock()
	defer h.Mu.Unlock()

	room, exists := h.Rooms[c.RoomPIN]
	if !exists {
		c.SendJSON(models.WSMessage{
			Type:    "error",
			Payload: map[string]string{"message": "Room tidak ditemukan"},
		})
		return
	}

	switch msg.Type {
	case "start_game":
		if !c.IsHost && room.HostID != c.PlayerID {
			c.SendJSON(models.WSMessage{Type: "error", Payload: "Hanya host yang dapat memulai kuis"})
			return
		}

		if len(room.Questions) == 0 {
			c.SendJSON(models.WSMessage{Type: "error", Payload: "Room belum memiliki soal"})
			return
		}

		if room.IsRandomized {
			// Acak urutan soal
			rand.Shuffle(len(room.Questions), func(i, j int) {
				room.Questions[i], room.Questions[j] = room.Questions[j], room.Questions[i]
			})
		}

		room.Status = models.RoomStatusPlaying
		room.CurrentQuestionIndex = 0
		room.QuestionStartTime = time.Now()

		q := room.Questions[0]
		clientQ := ToClientQuestion(q, 0, len(room.Questions))

		h.BroadcastToRoom(room.PIN, models.WSMessage{
			Type: "game_started",
			Payload: map[string]interface{}{
				"question":        clientQ,
				"questionIndex":   0,
				"totalQuestions":  len(room.Questions),
				"timeLimit":       q.TimeLimitSeconds,
				"serverTimestamp": time.Now().UnixMilli(),
			},
		})

	case "submit_answer":
		// Payload: { "questionId": string, "answer": string, "timeTakenMs": number }
		payloadMap, ok := msg.Payload.(map[string]interface{})
		if !ok {
			return
		}

		player, playerExists := room.Players[c.PlayerID]
		if !playerExists || player.Disqualified {
			return
		}

		if room.CurrentQuestionIndex >= len(room.Questions) {
			return
		}

		currentQ := room.Questions[room.CurrentQuestionIndex]
		answerStr, _ := payloadMap["answer"].(string)

		timeTakenRaw, _ := payloadMap["timeTakenMs"].(float64)
		timeTakenMs := int64(timeTakenRaw)
		if timeTakenMs <= 0 {
			timeTakenMs = time.Since(room.QuestionStartTime).Milliseconds()
		}

		// Anti-Cheat: Validate on server
		isCorrect := (answerStr == currentQ.CorrectAnswer)
		maxTimeMs := int64(currentQ.TimeLimitSeconds * 1000)
		scoreAwarded := CalculateScore(isCorrect, timeTakenMs, maxTimeMs)

		player.Score += scoreAwarded

		room.Answers = append(room.Answers, models.AnswerRecord{
			PlayerID:     player.ID,
			QuestionID:   currentQ.ID,
			Answer:       answerStr,
			TimeTakenMs:  timeTakenMs,
			IsCorrect:    isCorrect,
			ScoreAwarded: scoreAwarded,
			AnsweredAt:   time.Now(),
		})

		// Kirim konfirmasi ke pemain bersangkutan (apakah benar & poin didapat)
		c.SendJSON(models.WSMessage{
			Type: "answer_acknowledged",
			Payload: map[string]interface{}{
				"isCorrect":    isCorrect,
				"scoreAwarded": scoreAwarded,
				"totalScore":   player.Score,
			},
		})

		// Broadcast ke Host & Room bahwa peserta telah menjawab (hitung jumlah)
		answeredCount := 0
		for _, ans := range room.Answers {
			if ans.QuestionID == currentQ.ID {
				answeredCount++
			}
		}

		h.BroadcastToRoom(room.PIN, models.WSMessage{
			Type: "player_answered",
			Payload: map[string]interface{}{
				"playerId":      player.ID,
				"answeredCount": answeredCount,
				"totalPlayers":  len(room.Players),
			},
		})

	case "reveal_answer":
		// Host meminta tampilkan hasil ronde soal
		if room.CurrentQuestionIndex >= len(room.Questions) {
			return
		}
		currentQ := room.Questions[room.CurrentQuestionIndex]

		// Build current leaderboard
		leaderboard := h.buildLeaderboard(room)

		h.BroadcastToRoom(room.PIN, models.WSMessage{
			Type: "question_result",
			Payload: map[string]interface{}{
				"questionId":    currentQ.ID,
				"correctAnswer": currentQ.CorrectAnswer,
				"explanation":   currentQ.Explanation,
				"leaderboard":   leaderboard,
			},
		})

	case "next_question":
		if !c.IsHost && room.HostID != c.PlayerID {
			return
		}

		room.CurrentQuestionIndex++
		if room.CurrentQuestionIndex >= len(room.Questions) {
			// Selesai seluruh soal
			room.Status = models.RoomStatusFinished
			finalLeaderboard := h.buildLeaderboard(room)

			h.BroadcastToRoom(room.PIN, models.WSMessage{
				Type: "game_finished",
				Payload: map[string]interface{}{
					"leaderboard": finalLeaderboard,
					"kkm":         room.KKM,
				},
			})
			return
		}

		room.QuestionStartTime = time.Now()
		nextQ := room.Questions[room.CurrentQuestionIndex]
		clientQ := ToClientQuestion(nextQ, room.CurrentQuestionIndex, len(room.Questions))

		h.BroadcastToRoom(room.PIN, models.WSMessage{
			Type: "next_question",
			Payload: map[string]interface{}{
				"question":        clientQ,
				"questionIndex":   room.CurrentQuestionIndex,
				"totalQuestions":  len(room.Questions),
				"serverTimestamp": time.Now().UnixMilli(),
			},
		})

	case "record_violation":
		// Anti-Cheat Tahap 7: Deteksi perpindahan tab / fullscreen exit
		player, playerExists := room.Players[c.PlayerID]
		if !playerExists {
			return
		}

		player.Violations++
		violation := models.ViolationRecord{
			ID:            fmt.Sprintf("viol-%d", time.Now().UnixNano()),
			PlayerID:      player.ID,
			RoomID:        room.ID,
			ViolationType: "tab_switch",
			Timestamp:     time.Now(),
		}
		room.Violations = append(room.Violations, violation)

		log.Printf("[Anti-Cheat] Player %s (%s) violation #%d in Room %s", player.Nickname, player.ID, player.Violations, room.PIN)

		// Cek jika sudah melanggar 3x
		autoSubmitted := false
		if player.Violations >= 3 {
			player.Disqualified = true
			player.Submitted = true
			autoSubmitted = true
		}

		// Kirim peringatan ke peserta
		c.SendJSON(models.WSMessage{
			Type: "violation_warning",
			Payload: map[string]interface{}{
				"violations":    player.Violations,
				"maxViolations": 3,
				"autoSubmitted": autoSubmitted,
				"message":       "Peringatan! Dilarang meninggalkan layar ujian.",
			},
		})

		// Beritahu host tentang pelanggaran peserta
		h.BroadcastToRoom(room.PIN, models.WSMessage{
			Type: "player_violation",
			Payload: map[string]interface{}{
				"playerId":      player.ID,
				"nickname":      player.Nickname,
				"violations":    player.Violations,
				"autoSubmitted": autoSubmitted,
			},
		})

	case "submit_score":
		// Duel: pemain mengirim skor terkini; hub menyiarkannya ke lawan.
		// Kontrak frontend: { "type": "submit_score", "score": <skor> }.
		score := msg.Score
		if payloadMap, ok := msg.Payload.(map[string]interface{}); ok {
			score = payloadInt(payloadMap, "score")
		}
		if score < 0 {
			score = 0
		}
		player, playerExists := room.Players[c.PlayerID]
		if !playerExists {
			return
		}
		player.Score = score
		h.BroadcastToRoomExcept(room.PIN, c, models.WSMessage{
			Type: "opponent_score_update",
			Payload: map[string]interface{}{
				"playerId": player.ID,
				"score":    score,
			},
		})

	case "duel_start":
		// Duel: tandai room bermulai dan beri cap waktu server.
		if room.Status == models.RoomStatusPlaying {
			return
		}
		room.Status = models.RoomStatusPlaying
		room.QuestionStartTime = time.Now()
		h.BroadcastToRoom(room.PIN, models.WSMessage{
			Type: "duel_started",
			Payload: map[string]interface{}{
				"serverTimestamp": time.Now().UnixMilli(),
			},
		})
	}
}

// payloadInt membaca nilai numerik dari payload WS (JSON angka = float64).
func payloadInt(payload map[string]interface{}, key string) int {
	switch v := payload[key].(type) {
	case float64:
		return int(v)
	case int:
		return v
	case int64:
		return int(v)
	case json.Number:
		i, err := v.Int64()
		if err != nil {
			return 0
		}
		return int(i)
	}
	return 0
}

func (h *RoomHub) buildLeaderboard(room *models.Room) []map[string]interface{} {
	list := make([]*models.Player, 0, len(room.Players))
	for _, p := range room.Players {
		list = append(list, p)
	}

	sort.Slice(list, func(i, j int) bool {
		return list[i].Score > list[j].Score
	})

	result := make([]map[string]interface{}, len(list))
	for i, p := range list {
		result[i] = map[string]interface{}{
			"rank":         i + 1,
			"playerId":     p.ID,
			"nickname":     p.Nickname,
			"score":        p.Score,
			"violations":   p.Violations,
			"disqualified": p.Disqualified,
			"passed":       p.Score >= (room.KKM * 10), // KKM calculation
		}
	}
	return result
}
