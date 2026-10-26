package hub

import (
	"net/http"
	"time"

	"tartila-server/models"
)

// EnsureDuelRoom membuat room ringan untuk sesi duel bila belum ada.
// Room duel memakai sessionId sebagai PIN sehingga klien cukup membuka
// ws://.../api/ws/duel/:sessionId.
func (h *RoomHub) EnsureDuelRoom(sessionID string) *models.Room {
	h.Mu.Lock()
	defer h.Mu.Unlock()
	if room, ok := h.Rooms[sessionID]; ok {
		return room
	}
	room := &models.Room{
		ID:        sessionID,
		PIN:       sessionID,
		RoomType:  models.RoomTypeLatihan,
		Status:    models.RoomStatusWaiting,
		Players:   make(map[string]*models.Player),
		Questions: []models.Question{},
		CreatedAt: time.Now(),
	}
	h.Rooms[sessionID] = room
	return room
}

// AddDuelPlayer menambahkan pemain duel ke room (idempotent).
func (h *RoomHub) AddDuelPlayer(sessionID, playerID, nickname string) {
	if playerID == "" {
		return
	}
	h.Mu.Lock()
	defer h.Mu.Unlock()
	room, ok := h.Rooms[sessionID]
	if !ok {
		return
	}
	if _, exists := room.Players[playerID]; exists {
		return
	}
	if nickname == "" {
		nickname = "Pemain"
	}
	room.Players[playerID] = &models.Player{
		ID:       playerID,
		Nickname: nickname,
		Score:    0,
		IsActive: true,
		JoinedAt: time.Now(),
	}
}

// ServeDuelWS menangani koneksi WebSocket duel /api/ws/duel/:sessionId.
// State skor bersifat in-memory; state kanonik disimpan pengajian-backend
// lewat REST /api/v1/duel/*.
func ServeDuelWS(h *RoomHub, w http.ResponseWriter, r *http.Request, sessionID, playerID, nickname string) {
	h.EnsureDuelRoom(sessionID)
	h.AddDuelPlayer(sessionID, playerID, nickname)
	ServeWS(h, w, r, sessionID, playerID, false)
}
