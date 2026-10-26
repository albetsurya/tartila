package models

import "time"

type RoomType string

const (
	RoomTypeLatihan     RoomType = "latihan"
	RoomTypeKuisHarian  RoomType = "kuis_harian"
	RoomTypeUjianResmi  RoomType = "ujian_resmi"
)

type RoomStatus string

const (
	RoomStatusWaiting  RoomStatus = "waiting"
	RoomStatusPlaying  RoomStatus = "playing"
	RoomStatusFinished RoomStatus = "finished"
)

type QuestionOption struct {
	ID        string `json:"id"`
	Text      string `json:"text"`
	Arabic    string `json:"arabic,omitempty"`
	IsCorrect bool   `json:"isCorrect,omitempty"` // Server only; stripped on client payloads
}

type Question struct {
	ID                string           `json:"id"`
	Type              string           `json:"type"`     // "multiple_choice" | "audio_guess" | "fill_blank"
	Category          string           `json:"category"` // "tilawati" | "tajwid" | "nabi"
	Title             string           `json:"title"`
	Prompt            string           `json:"prompt"`
	ArabicPrompt      string           `json:"arabicPrompt,omitempty"`
	AudioURL          string           `json:"audioUrl,omitempty"`
	FillBlankTemplate string           `json:"fillBlankTemplate,omitempty"`
	Options           []QuestionOption `json:"options"`
	CorrectAnswer     string           `json:"correctAnswer"` // Server only
	Explanation       string           `json:"explanation,omitempty"`
	TimeLimitSeconds  int              `json:"timeLimitSeconds"`
	Points            int              `json:"points"`
}

// ClientQuestion is sent to players (Anti-cheat: NO correctAnswer or isCorrect)
type ClientQuestion struct {
	ID                string           `json:"id"`
	QuestionIndex     int              `json:"questionIndex"`
	TotalQuestions    int              `json:"totalQuestions"`
	Type              string           `json:"type"`
	Category          string           `json:"category"`
	Title             string           `json:"title"`
	Prompt            string           `json:"prompt"`
	ArabicPrompt      string           `json:"arabicPrompt,omitempty"`
	AudioURL          string           `json:"audioUrl,omitempty"`
	FillBlankTemplate string           `json:"fillBlankTemplate,omitempty"`
	Options           []QuestionOption `json:"options"`
	TimeLimitSeconds  int              `json:"timeLimitSeconds"`
}

type Player struct {
	ID          string    `json:"id"`
	UserID      string    `json:"userId,omitempty"`
	Nickname    string    `json:"nickname"`
	Score       int       `json:"score"`
	IsActive    bool      `json:"isActive"`
	Violations  int       `json:"violations"`
	JoinedAt    time.Time `json:"joinedAt"`
	Submitted   bool      `json:"submitted"`
	Disqualified bool     `json:"disqualified"`
}

type AnswerRecord struct {
	PlayerID      string    `json:"playerId"`
	QuestionID    string    `json:"questionId"`
	Answer        string    `json:"answer"`
	TimeTakenMs   int64     `json:"timeTakenMs"`
	IsCorrect     bool      `json:"isCorrect"`
	ScoreAwarded  int       `json:"scoreAwarded"`
	AnsweredAt    time.Time `json:"answeredAt"`
}

type ViolationRecord struct {
	ID            string    `json:"id"`
	PlayerID      string    `json:"playerId"`
	RoomID        string    `json:"roomId"`
	ViolationType string    `json:"violationType"`
	Timestamp     time.Time `json:"timestamp"`
}

type Room struct {
	ID                   string         `json:"id"`
	HostID               string         `json:"hostId"`
	PIN                  string         `json:"pin"`
	RoomType             RoomType       `json:"roomType"`
	Status               RoomStatus     `json:"status"`
	CurrentQuestionIndex int            `json:"currentQuestionIndex"`
	KKM                  int            `json:"kkm"`
	ExamToken            string         `json:"examToken,omitempty"`
	IsRandomized         bool           `json:"isRandomized"`
	Questions            []Question     `json:"questions"`
	Players              map[string]*Player `json:"players"`
	Answers              []AnswerRecord `json:"answers"`
	Violations           []ViolationRecord `json:"violations"`
	CreatedAt            time.Time      `json:"createdAt"`
	QuestionStartTime    time.Time      `json:"questionStartTime"`
}

// WebSocket message envelope
type WSMessage struct {
	Type    string      `json:"type"`
	Sender  string      `json:"sender,omitempty"`
	Score   int         `json:"score,omitempty"` // duel: skor submit_score di level atas
	Payload interface{} `json:"payload"`
}
