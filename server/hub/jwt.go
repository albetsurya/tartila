package hub

import (
	"errors"
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

// ErrMissingJWTSecret is returned when neither JWT_SECRET nor SUPABASE_JWT_SECRET is configured.
var ErrMissingJWTSecret = errors.New("JWT_SECRET is not configured")

// ErrInvalidToken is returned when the token is missing, invalid, or expired.
var ErrInvalidToken = errors.New("token is missing or invalid")

// GetJWTSecret returns JWT_SECRET or SUPABASE_JWT_SECRET (legacy fallback).
func GetJWTSecret() string {
	secret := strings.TrimSpace(os.Getenv("JWT_SECRET"))
	if secret == "" {
		secret = strings.TrimSpace(os.Getenv("SUPABASE_JWT_SECRET"))
	}
	if secret == "" {
		secret = "tartila-default-jwt-secret-key-change-in-production"
	}
	return secret
}

// GetFrontendURL returns the frontend application URL for redirects.
func GetFrontendURL() string {
	if u := strings.TrimSpace(os.Getenv("FRONTEND_URL")); u != "" {
		return strings.TrimRight(u, "/")
	}
	appEnv := strings.ToLower(strings.TrimSpace(os.Getenv("APP_ENV")))
	if appEnv == "" {
		appEnv = strings.ToLower(strings.TrimSpace(os.Getenv("GO_ENV")))
	}
	if appEnv == "production" {
		return "https://tartila.pages.dev"
	}
	return "http://localhost:5173"
}

// GenerateToken creates a signed HS256 JWT for the given user (valid for 30 days).
func GenerateToken(userID, email, role string) (string, error) {
	secret := GetJWTSecret()
	if secret == "" {
		return "", ErrMissingJWTSecret
	}

	if role == "" {
		role = "member"
	}

	now := time.Now()
	claims := jwt.MapClaims{
		"sub":     userID,
		"user_id": userID,
		"email":   email,
		"role":    role,
		"iat":     now.Unix(),
		"exp":     now.Add(30 * 24 * time.Hour).Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(secret))
}

// SetAuthCookie writes the JWT into an HttpOnly cookie.
func SetAuthCookie(w http.ResponseWriter, r *http.Request, tokenStr string) {
	frontendURL := GetFrontendURL()
	secure := true
	sameSite := http.SameSiteNoneMode

	// Jika murni di localhost non-HTTPS, SameSite=Lax tanpa Secure flag agar cookie diterima browser lokal
	if r.TLS == nil && (strings.HasPrefix(r.Host, "localhost") || strings.HasPrefix(r.Host, "127.0.0.1")) && !strings.HasPrefix(frontendURL, "https://") {
		secure = false
		sameSite = http.SameSiteLaxMode
	}

	http.SetCookie(w, &http.Cookie{
		Name:     "token",
		Value:    tokenStr,
		Path:     "/",
		HttpOnly: true,
		Secure:   secure,
		SameSite: sameSite,
		MaxAge:   86400 * 30, // 30 hari
	})
}

// ClearAuthCookie deletes the JWT auth cookie.
func ClearAuthCookie(w http.ResponseWriter, r *http.Request) {
	frontendURL := GetFrontendURL()
	secure := true
	sameSite := http.SameSiteNoneMode

	if r.TLS == nil && (strings.HasPrefix(r.Host, "localhost") || strings.HasPrefix(r.Host, "127.0.0.1")) && !strings.HasPrefix(frontendURL, "https://") {
		secure = false
		sameSite = http.SameSiteLaxMode
	}

	http.SetCookie(w, &http.Cookie{
		Name:     "token",
		Value:    "",
		Path:     "/",
		HttpOnly: true,
		Secure:   secure,
		SameSite: sameSite,
		MaxAge:   -1,
		Expires:  time.Unix(0, 0),
	})
}

// ParseTokenString validates the raw JWT string using HS256 secret.
func ParseTokenString(tok string) (string, jwt.MapClaims, error) {
	tok = strings.TrimSpace(tok)
	if tok == "" {
		return "", nil, ErrInvalidToken
	}

	secret := GetJWTSecret()
	if secret == "" {
		log.Printf("[Auth] Error: JWT_SECRET is not configured")
		return "", nil, ErrMissingJWTSecret
	}

	parsed, err := jwt.Parse(tok, func(t *jwt.Token) (interface{}, error) {
		if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing algorithm: %v", t.Header["alg"])
		}
		return []byte(secret), nil
	}, jwt.WithValidMethods([]string{"HS256", "HS384", "HS512"}))

	if err != nil {
		log.Printf("[Auth] JWT verification failed: %v", err)
		return "", nil, ErrInvalidToken
	}

	if parsed == nil || !parsed.Valid {
		log.Printf("[Auth] JWT is invalid")
		return "", nil, ErrInvalidToken
	}

	claims, ok := parsed.Claims.(jwt.MapClaims)
	if !ok {
		log.Printf("[Auth] Failed to parse JWT claims")
		return "", nil, ErrInvalidToken
	}

	userID, _ := claims["sub"].(string)
	if userID == "" {
		if uid, ok := claims["user_id"].(string); ok && uid != "" {
			userID = uid
		}
	}

	if userID == "" {
		log.Printf("[Auth] Token missing user identifier (sub or user_id)")
		return "", nil, errors.New("token missing user identifier (sub or user_id)")
	}

	return userID, claims, nil
}

// ParseAuthToken extracts and validates the JWT from HttpOnly Cookie 'token',
// with fallback to Authorization: Bearer <token> and ?token=<token>.
func ParseAuthToken(r *http.Request) (string, jwt.MapClaims, error) {
	tok := ""

	// 1. Prioritaskan pengecekan dari HttpOnly Cookie
	if cookie, err := r.Cookie("token"); err == nil && strings.TrimSpace(cookie.Value) != "" {
		tok = strings.TrimSpace(cookie.Value)
	}

	// 2. Fallback: Authorization: Bearer <token>
	if tok == "" {
		auth := strings.TrimSpace(r.Header.Get("Authorization"))
		if auth != "" {
			parts := strings.SplitN(auth, " ", 2)
			if len(parts) == 2 && strings.EqualFold(parts[0], "bearer") {
				tok = strings.TrimSpace(parts[1])
			} else if !strings.Contains(auth, " ") {
				tok = auth
			}
		}
	}

	// 3. Fallback: URL query ?token=
	if tok == "" {
		tok = strings.TrimSpace(r.URL.Query().Get("token"))
	}

	return ParseTokenString(tok)
}
