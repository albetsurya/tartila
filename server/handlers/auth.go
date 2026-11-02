package handlers

import (
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"net/http"
	"net/url"
	"os"
	"strings"

	"github.com/google/uuid"
	"github.com/gorilla/sessions"
	"github.com/markbates/goth"
	"github.com/markbates/goth/gothic"
	"github.com/markbates/goth/providers/google"
	"tartila-server/hub"
)

// InitAuth menginisialisasi Goth provider Google dan session store Gothic.
func InitAuth() {
	sessionSecret := os.Getenv("SESSION_SECRET")
	if sessionSecret == "" {
		sessionSecret = hub.GetJWTSecret()
	}
	cookieStore := sessions.NewCookieStore([]byte(sessionSecret))
	cookieStore.MaxAge(86400 * 30)
	cookieStore.Options.Path = "/"
	cookieStore.Options.HttpOnly = true
	cookieStore.Options.Secure = true
	cookieStore.Options.SameSite = http.SameSiteNoneMode
	gothic.Store = cookieStore

	gothic.GetProviderName = func(req *http.Request) (string, error) {
		if p := req.URL.Query().Get("provider"); p != "" {
			return p, nil
		}
		return "google", nil
	}

	clientID := strings.TrimSpace(os.Getenv("GOOGLE_CLIENT_ID"))
	clientSecret := strings.TrimSpace(os.Getenv("GOOGLE_CLIENT_SECRET"))
	callbackURL := getGoogleCallbackURL()

	if clientID != "" && clientSecret != "" {
		goth.UseProviders(
			google.New(clientID, clientSecret, callbackURL, "email", "profile"),
		)
		log.Printf("[Auth] Goth Google provider initialized (callback: %s)", callbackURL)
	} else {
		log.Printf("[Auth] Notice: GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET not set; Google OAuth disabled")
	}
}

func getGoogleCallbackURL() string {
	if cb := strings.TrimSpace(os.Getenv("GOOGLE_CALLBACK_URL")); cb != "" {
		return cb
	}
	backendURL := strings.TrimSpace(os.Getenv("BACKEND_URL"))
	if backendURL == "" {
		backendURL = strings.TrimSpace(os.Getenv("RENDER_EXTERNAL_URL"))
	}
	if backendURL == "" {
		backendURL = "http://localhost:8080"
	}
	return strings.TrimRight(backendURL, "/") + "/api/auth/google/callback"
}

// UpsertGoogleUser menyisipkan atau memperbarui data pengguna Google di SQLite.
func (api *APIHandler) UpsertGoogleUser(email, name string) (string, string, error) {
	email = strings.ToLower(strings.TrimSpace(email))
	if email == "" {
		return "", "", errors.New("email is required")
	}

	if api.db == nil {
		return uuid.NewString(), "member", nil
	}

	var userID, role string
	err := api.db.QueryRow("SELECT id, role FROM users WHERE LOWER(email) = ?", email).Scan(&userID, &role)
	if err == nil && userID != "" {
		_, _ = api.db.Exec("UPDATE users SET updated_at = datetime('now') WHERE id = ?", userID)
		if role == "" {
			role = "member"
		}
		return userID, role, nil
	}

	userID = uuid.NewString()
	role = "member"
	_, err = api.db.Exec(`
		INSERT INTO users (id, email, role, created_at, updated_at)
		VALUES (?, ?, 'member', datetime('now'), datetime('now'))
		ON CONFLICT(id) DO UPDATE SET
			email = excluded.email,
			updated_at = datetime('now')
	`, userID, email)
	if err != nil {
		return "", "", fmt.Errorf("upsert user failed: %w", err)
	}

	return userID, role, nil
}

// HandleGoogleLogin memulai alur autentikasi OAuth Google via Gothic.
func (api *APIHandler) HandleGoogleLogin(w http.ResponseWriter, r *http.Request) {
	q := r.URL.Query()
	q.Set("provider", "google")
	r.URL.RawQuery = q.Encode()

	gothic.BeginAuthHandler(w, r)
}

// HandleGoogleCallback menangani redirect callback dari Google OAuth.
func (api *APIHandler) HandleGoogleCallback(w http.ResponseWriter, r *http.Request) {
	q := r.URL.Query()
	q.Set("provider", "google")
	r.URL.RawQuery = q.Encode()

	frontendURL := hub.GetFrontendURL()

	gothUser, err := gothic.CompleteUserAuth(w, r)
	if err != nil {
		log.Printf("[Auth] CompleteUserAuth failed: %v", err)
		http.Redirect(w, r, frontendURL+"/login?error="+url.QueryEscape("Login Google gagal: "+err.Error()), http.StatusTemporaryRedirect)
		return
	}

	userID, role, err := api.UpsertGoogleUser(gothUser.Email, gothUser.Name)
	if err != nil {
		log.Printf("[Auth] UpsertGoogleUser failed: %v", err)
		http.Redirect(w, r, frontendURL+"/login?error="+url.QueryEscape("Database error saat login"), http.StatusTemporaryRedirect)
		return
	}

	token, err := hub.GenerateToken(userID, gothUser.Email, role)
	if err != nil {
		log.Printf("[Auth] GenerateToken failed: %v", err)
		http.Redirect(w, r, frontendURL+"/login?error="+url.QueryEscape("Gagal menerbitkan token"), http.StatusTemporaryRedirect)
		return
	}

	hub.SetAuthCookie(w, r, token)
	http.Redirect(w, r, frontendURL, http.StatusTemporaryRedirect)
}

// HandleLogout menghapus cookie HttpOnly token dan sesi Gothic.
func (api *APIHandler) HandleLogout(w http.ResponseWriter, r *http.Request) {
	hub.ClearAuthCookie(w, r)
	_ = gothic.Logout(w, r)

	w.Header().Set("Content-Type", "application/json")
	_ = json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"message": "Berhasil keluar",
	})
}
