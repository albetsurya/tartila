package main

import (
	"bufio"
	"log"
	"net/http"
	"os"
	"strings"

	"tartila-server/handlers"
	"tartila-server/hub"
)

// loadEnv membaca berkas .env sederhana bila tersedia (.env, server/.env, ../.env)
func loadEnv() {
	paths := []string{".env", "server/.env", "../.env"}
	for _, p := range paths {
		f, err := os.Open(p)
		if err != nil {
			continue
		}
		defer f.Close()
		scanner := bufio.NewScanner(f)
		for scanner.Scan() {
			line := strings.TrimSpace(scanner.Text())
			if line == "" || strings.HasPrefix(line, "#") {
				continue
			}
			parts := strings.SplitN(line, "=", 2)
			if len(parts) == 2 {
				k := strings.TrimSpace(parts[0])
				v := strings.Trim(strings.TrimSpace(parts[1]), "\"'")
				if os.Getenv(k) == "" {
					_ = os.Setenv(k, v)
				}
			}
		}
		log.Printf("[Env] Memuat variabel lingkungan dari %s", p)
		break
	}
}

func enableCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Add("Vary", "Origin")

		if origin := r.Header.Get("Origin"); origin != "" {
			if hub.OriginAllowed(origin) {
				w.Header().Set("Access-Control-Allow-Origin", origin)
				w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, PATCH")
				w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization, Cookie")
				w.Header().Set("Access-Control-Allow-Credentials", "true")
			}
		}

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}

func main() {
	loadEnv()
	handlers.InitAuth()

	roomHub := hub.NewRoomHub()
	go roomHub.Run()

	api := handlers.NewAPIHandler(roomHub)

	// Persistent store for cross-session user state (feedback prompts, etc.).
	// Failure is fatal: the API handlers below depend on a working DB.
	if err := InitDB(); err != nil {
		log.Fatalf("DB init: %v", err)
	}
	api.SetDB(Store)

	mux := http.NewServeMux()

	// REST API Routes
	mux.HandleFunc("/api/rooms", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodPost {
			api.CreateRoom(w, r)
			return
		}
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	})

	mux.HandleFunc("/api/rooms/", func(w http.ResponseWriter, r *http.Request) {
		path := strings.TrimPrefix(r.URL.Path, "/api/rooms/")
		parts := strings.Split(path, "/")
		if len(parts) == 0 || parts[0] == "" {
			http.Error(w, "PIN required", http.StatusBadRequest)
			return
		}
		pin := parts[0]

		if len(parts) == 1 {
			if r.Method == http.MethodGet {
				api.GetRoomInfo(w, r, pin)
				return
			}
		} else if len(parts) == 2 {
			sub := parts[1]
			if sub == "join" && r.Method == http.MethodPost {
				api.JoinRoom(w, r, pin)
				return
			}
			if sub == "report" && r.Method == http.MethodGet {
				api.GetExamReport(w, r, pin)
				return
			}
		}

		http.Error(w, "Not found", http.StatusNotFound)
	})

	mux.HandleFunc("/api/exam/violation", api.AuthMiddleware(api.RecordViolation))
	mux.HandleFunc("/api/leaderboard/global", api.GetGlobalLeaderboard)

	// Ngaji Ceria leaderboard & progress routes (authoritative server-side XP & coins).
	mux.HandleFunc("/api/v1/ngaji-ceria/leaderboard/global", api.GetNgajiCeriaGlobalLeaderboard)
	mux.HandleFunc("/api/v1/ngaji-ceria/leaderboard", api.NgajiCeriaLeaderboardHandler)
	mux.HandleFunc("/api/v1/ngaji-ceria/progress", api.NgajiCeriaProgressHandler)
	mux.HandleFunc("/api/v1/ngaji-ceria/progress/events", api.AuthMiddleware(api.SubmitNgajiCeriaProgress))
	mux.HandleFunc("/api/submit-score", api.AuthMiddleware(api.SubmitNgajiCeriaProgress))

	// Tilawati timeline editor (Postgres-backed, override & fallback).
	mux.HandleFunc("/api/v1/tilawati/timeline/all", api.GetAllTimelines)
	mux.HandleFunc("/api/v1/tilawati/timeline/", api.TimelineOne)

	// Auth routes (Goth Google OAuth & Cookie Session)
	mux.HandleFunc("/api/auth/google", api.HandleGoogleLogin)
	mux.HandleFunc("/api/auth/google/callback", api.HandleGoogleCallback)
	mux.HandleFunc("/api/auth/logout", api.HandleLogout)

	// Auth & User Profile routes (Legacy sync & feedback prompt)
	mux.HandleFunc("/api/v1/auth/sync-profile", api.SyncProfile)
	mux.HandleFunc("/api/v1/auth/logout", api.HandleLogout)
	mux.HandleFunc("/api/v1/user/profile", api.GetUserProfile)
	mux.HandleFunc("/api/v1/user/feedback-prompt", api.UpdateFeedbackPrompt)

	// WebSocket Route: /api/ws/room/:pin
	mux.HandleFunc("/api/ws/room/", func(w http.ResponseWriter, r *http.Request) {
		pin := strings.TrimPrefix(r.URL.Path, "/api/ws/room/")
		if pin == "" {
			http.Error(w, "Room PIN required", http.StatusBadRequest)
			return
		}

		playerID := r.URL.Query().Get("playerId")

		// Validasi token JWT yang dikirim lewat header/koneksi
		userID, _, err := hub.ParseAuthToken(r)
		if err != nil {
			http.Error(w, "unauthorized", http.StatusUnauthorized)
			return
		}

		// Status "Host" diverifikasi di database (apakah user ID adalah host_id dari room PIN yang dimaksud)
		isHost := api.VerifyRoomHost(pin, userID)

		hub.ServeWS(roomHub, w, r, pin, playerID, isHost)
	})

	// WebSocket Route Duel: /api/ws/duel/:sessionId
	// Skor real-time (submit_score -> opponent_score_update) in-memory.
	mux.HandleFunc("/api/ws/duel/", func(w http.ResponseWriter, r *http.Request) {
		sessionID := strings.TrimPrefix(r.URL.Path, "/api/ws/duel/")
		if sessionID == "" {
			http.Error(w, "Session ID required", http.StatusBadRequest)
			return
		}

		playerID := r.URL.Query().Get("playerId")
		nickname := r.URL.Query().Get("nickname")

		hub.ServeDuelWS(roomHub, w, r, sessionID, playerID, nickname)
	})

	// Health check
	mux.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		_, _ = w.Write([]byte("Tartila Arena Real-time Server is running OK"))
	})

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	server := &http.Server{
		Addr:    ":" + port,
		Handler: enableCORS(mux),
	}

	log.Printf("==================================================")
	log.Printf("🚀 Tartila Arena WebSocket Server listening on :%s", port)
	log.Printf("   WS Endpoint  : ws://localhost:%s/api/ws/room/:pin", port)
	log.Printf("   WS Duel      : ws://localhost:%s/api/ws/duel/:sessionId", port)
	log.Printf("   REST Endpoint: http://localhost:%s/api/rooms", port)
	log.Printf("==================================================")

	if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
		log.Fatalf("Server error: %v", err)
	}
}
