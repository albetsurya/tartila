package hub

import (
	"encoding/json"
	"log"
	"net/http"
	"sync"
	"time"

	"github.com/gorilla/websocket"
	"tartila-server/models"
)

const (
	writeWait      = 10 * time.Second
	pongWait       = 60 * time.Second
	pingPeriod     = 20 * time.Second // Ping every 20s to prevent tab sleep timeout
	maxMessageSize = 512 * 1024
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return OriginAllowed(r.Header.Get("Origin"))
	},
}

type Client struct {
	Hub      *RoomHub
	Conn     *websocket.Conn
	Send     chan []byte
	RoomPIN  string
	PlayerID string
	IsHost   bool
}

type RoomHub struct {
	Rooms      map[string]*models.Room
	Clients    map[string]map[*Client]bool // roomPIN -> clients
	Register   chan *Client
	Unregister chan *Client
	Broadcast  chan RoomBroadcast
	Mu         sync.RWMutex
}

type RoomBroadcast struct {
	RoomPIN string
	Message []byte
	Except  *Client
}

func NewRoomHub() *RoomHub {
	return &RoomHub{
		Rooms:      make(map[string]*models.Room),
		Clients:    make(map[string]map[*Client]bool),
		Register:   make(chan *Client),
		Unregister: make(chan *Client),
		Broadcast:  make(chan RoomBroadcast),
	}
}

func (h *RoomHub) Run() {
	for {
		select {
		case client := <-h.Register:
			h.Mu.Lock()
			if _, ok := h.Clients[client.RoomPIN]; !ok {
				h.Clients[client.RoomPIN] = make(map[*Client]bool)
			}
			h.Clients[client.RoomPIN][client] = true
			h.Mu.Unlock()
			log.Printf("[Hub] Client registered: Room %s (Player: %s, Host: %t)", client.RoomPIN, client.PlayerID, client.IsHost)

		case client := <-h.Unregister:
			h.Mu.Lock()
			if clients, ok := h.Clients[client.RoomPIN]; ok {
				if _, has := clients[client]; has {
					delete(clients, client)
					close(client.Send)
					if len(clients) == 0 {
						delete(h.Clients, client.RoomPIN)
					}
				}
			}
			h.Mu.Unlock()
			log.Printf("[Hub] Client unregistered: Room %s (Player: %s)", client.RoomPIN, client.PlayerID)

		case broadcast := <-h.Broadcast:
			h.Mu.RLock()
			clients := h.Clients[broadcast.RoomPIN]
			for client := range clients {
				if broadcast.Except != nil && client == broadcast.Except {
					continue
				}
				select {
				case client.Send <- broadcast.Message:
				default:
					close(client.Send)
					delete(clients, client)
				}
			}
			h.Mu.RUnlock()
		}
	}
}

func (h *RoomHub) BroadcastToRoom(pin string, msg models.WSMessage) {
	bytes, err := json.Marshal(msg)
	if err != nil {
		log.Printf("[Hub] Broadcast marshal error: %v", err)
		return
	}
	h.Broadcast <- RoomBroadcast{
		RoomPIN: pin,
		Message: bytes,
	}
}

// BroadcastToRoomExcept mengirim pesan ke semua klien di room kecuali pengirim.
func (h *RoomHub) BroadcastToRoomExcept(pin string, except *Client, msg models.WSMessage) {
	bytes, err := json.Marshal(msg)
	if err != nil {
		log.Printf("[Hub] Broadcast marshal error: %v", err)
		return
	}
	h.Broadcast <- RoomBroadcast{
		RoomPIN: pin,
		Message: bytes,
		Except:  except,
	}
}

func (c *Client) ReadPump() {
	defer func() {
		c.Hub.Unregister <- c
		c.Conn.Close()
	}()

	c.Conn.SetReadLimit(maxMessageSize)
	_ = c.Conn.SetReadDeadline(time.Now().Add(pongWait))
	c.Conn.SetPongHandler(func(string) error {
		_ = c.Conn.SetReadDeadline(time.Now().Add(pongWait))
		return nil
	})

	for {
		_, message, err := c.Conn.ReadMessage()
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				log.Printf("[Client] Read error: %v", err)
			}
			break
		}

		// Reset deadline on ANY incoming message (keep-alive)
		_ = c.Conn.SetReadDeadline(time.Now().Add(pongWait))

		var wsMsg models.WSMessage
		if err := json.Unmarshal(message, &wsMsg); err != nil {
			log.Printf("[Client] JSON unmarshal error: %v", err)
			continue
		}

		// Respond immediately to application-level ping/keep-alive from browser
		if wsMsg.Type == "ping" {
			c.SendJSON(models.WSMessage{
				Type: "pong",
				Payload: map[string]interface{}{
					"timestamp": time.Now().UnixMilli(),
				},
			})
			continue
		}

		c.Hub.HandleClientMessage(c, wsMsg)
	}
}

func (c *Client) WritePump() {
	ticker := time.NewTicker(pingPeriod)
	defer func() {
		ticker.Stop()
		c.Conn.Close()
	}()

	for {
		select {
		case message, ok := <-c.Send:
			_ = c.Conn.SetWriteDeadline(time.Now().Add(writeWait))
			if !ok {
				_ = c.Conn.WriteMessage(websocket.CloseMessage, []byte{})
				return
			}

			if err := c.Conn.WriteMessage(websocket.TextMessage, message); err != nil {
				return
			}

			// Drain any queued messages, sending each as its own discrete WebSocket message frame
			n := len(c.Send)
			for i := 0; i < n; i++ {
				extraMsg := <-c.Send
				if err := c.Conn.WriteMessage(websocket.TextMessage, extraMsg); err != nil {
					return
				}
			}

		case <-ticker.C:
			_ = c.Conn.SetWriteDeadline(time.Now().Add(writeWait))
			if err := c.Conn.WriteMessage(websocket.PingMessage, nil); err != nil {
				return
			}
		}
	}
}

// ServeWS handles incoming websocket requests for /api/ws/room/:pin
func ServeWS(hub *RoomHub, w http.ResponseWriter, r *http.Request, pin string, playerID string, isHost bool) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Printf("[ServeWS] Upgrade error: %v", err)
		return
	}

	client := &Client{
		Hub:      hub,
		Conn:     conn,
		Send:     make(chan []byte, 256),
		RoomPIN:  pin,
		PlayerID: playerID,
		IsHost:   isHost,
	}

	hub.Register <- client

	go client.WritePump()
	go client.ReadPump()

	// Send initial state upon connect
	hub.SendInitialRoomState(client)
}
