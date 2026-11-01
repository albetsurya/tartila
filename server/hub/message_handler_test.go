package hub

import (
	"testing"
	"time"

	"tartila-server/models"
)

func TestSubmitScoreAuthentication(t *testing.T) {
	h := NewRoomHub()
	go h.Run()

	room := &models.Room{
		ID:        "room-1",
		PIN:       "123456",
		Players:   make(map[string]*models.Player),
		CreatedAt: time.Now(),
	}
	room.Players["ply-1"] = &models.Player{
		ID:     "ply-1",
		UserID: "user-1",
		Score:  0,
	}
	h.Rooms["123456"] = room

	// 1. Unauthenticated client (UserID == "")
	unauthClient := &Client{
		Hub:      h,
		Send:     make(chan []byte, 10),
		RoomPIN:  "123456",
		PlayerID: "ply-1",
		UserID:   "",
	}

	h.HandleClientMessage(unauthClient, models.WSMessage{
		Type:  "submit_score",
		Score: 500,
	})

	if room.Players["ply-1"].Score != 0 {
		t.Fatalf("expected unauthenticated client score not to be applied, got %d", room.Players["ply-1"].Score)
	}

	// 2. Authenticated client
	authClient := &Client{
		Hub:      h,
		Send:     make(chan []byte, 10),
		RoomPIN:  "123456",
		PlayerID: "ply-1",
		UserID:   "user-1",
	}

	h.HandleClientMessage(authClient, models.WSMessage{
		Type:  "submit_score",
		Score: 350,
	})

	if room.Players["ply-1"].Score != 350 {
		t.Fatalf("expected authenticated client score to be 350, got %d", room.Players["ply-1"].Score)
	}
}

func TestRecordViolationAuthentication(t *testing.T) {
	h := NewRoomHub()
	go h.Run()

	room := &models.Room{
		ID:         "room-1",
		PIN:        "123456",
		Players:    make(map[string]*models.Player),
		Violations: make([]models.ViolationRecord, 0),
		CreatedAt:  time.Now(),
	}
	room.Players["ply-1"] = &models.Player{
		ID:         "ply-1",
		UserID:     "user-1",
		Nickname:   "Santri 1",
		Violations: 0,
	}
	h.Rooms["123456"] = room

	// 1. Unauthenticated client
	unauthClient := &Client{
		Hub:      h,
		Send:     make(chan []byte, 10),
		RoomPIN:  "123456",
		PlayerID: "ply-1",
		UserID:   "",
	}

	h.HandleClientMessage(unauthClient, models.WSMessage{
		Type: "record_violation",
	})

	if room.Players["ply-1"].Violations != 0 {
		t.Fatalf("expected unauthenticated violation to be rejected, got %d", room.Players["ply-1"].Violations)
	}

	// 2. Authenticated client
	authClient := &Client{
		Hub:      h,
		Send:     make(chan []byte, 10),
		RoomPIN:  "123456",
		PlayerID: "ply-1",
		UserID:   "user-1",
	}

	h.HandleClientMessage(authClient, models.WSMessage{
		Type: "record_violation",
	})

	if room.Players["ply-1"].Violations != 1 {
		t.Fatalf("expected authenticated violation to be recorded, got %d", room.Players["ply-1"].Violations)
	}
}
