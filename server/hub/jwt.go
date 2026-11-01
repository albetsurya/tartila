package hub

import (
	"errors"
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"

	"github.com/golang-jwt/jwt/v5"
)

// ErrMissingJWTSecret is returned when neither SUPABASE_JWT_SECRET nor JWT_SECRET is configured.
var ErrMissingJWTSecret = errors.New("SUPABASE_JWT_SECRET (or JWT_SECRET) is not configured")

// ErrInvalidToken is returned when the token is missing, invalid, or expired.
var ErrInvalidToken = errors.New("token is missing or invalid")

// GetJWTSecret returns SUPABASE_JWT_SECRET (preferred for Supabase Auth) or JWT_SECRET (legacy fallback).
func GetJWTSecret() string {
	secret := strings.TrimSpace(os.Getenv("SUPABASE_JWT_SECRET"))
	if secret == "" {
		secret = strings.TrimSpace(os.Getenv("JWT_SECRET"))
	}
	return secret
}

// ParseTokenString validates the raw JWT string using the Supabase JWT secret and returns the user ID and claims.
func ParseTokenString(tok string) (string, jwt.MapClaims, error) {
	tok = strings.TrimSpace(tok)
	if tok == "" {
		return "", nil, ErrInvalidToken
	}

	secret := GetJWTSecret()
	if secret == "" {
		log.Printf("[Auth] Error: SUPABASE_JWT_SECRET (or JWT_SECRET) is not configured")
		return "", nil, ErrMissingJWTSecret
	}

	parsed, err := jwt.Parse(tok, func(t *jwt.Token) (interface{}, error) {
		// Validasi algoritma HMAC (HS256) sesuai standar token Supabase JWT
		if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing algorithm: %v", t.Header["alg"])
		}
		return []byte(secret), nil
	}, jwt.WithValidMethods([]string{"HS256", "HS384", "HS512"}))

	if err != nil {
		log.Printf("[Auth] JWT verification failed: %v", err)
		return "", nil, ErrInvalidToken
	}

	if !parsed.Valid {
		log.Printf("[Auth] JWT is invalid")
		return "", nil, ErrInvalidToken
	}

	claims, ok := parsed.Claims.(jwt.MapClaims)
	if !ok {
		log.Printf("[Auth] Failed to parse JWT claims")
		return "", nil, ErrInvalidToken
	}

	// 1. Ambil UUID user dari klaim 'sub' (standar Supabase Auth), fallback ke 'user_id'
	userID, _ := claims["sub"].(string)
	if userID == "" {
		if uid, ok := claims["user_id"].(string); ok && uid != "" {
			userID = uid
		}
	}

	if userID == "" {
		log.Printf("[Auth] Token missing user UUID in 'sub' or 'user_id' claim")
		return "", nil, errors.New("token missing user identifier (sub or user_id)")
	}

	return userID, claims, nil
}

// ParseAuthToken extracts and validates the JWT from Authorization: Bearer <token> header
// or ?token=<token> query parameter.
func ParseAuthToken(r *http.Request) (string, jwt.MapClaims, error) {
	tok := ""
	auth := strings.TrimSpace(r.Header.Get("Authorization"))
	if auth != "" {
		parts := strings.SplitN(auth, " ", 2)
		if len(parts) == 2 && strings.EqualFold(parts[0], "bearer") {
			tok = strings.TrimSpace(parts[1])
		} else if !strings.Contains(auth, " ") {
			// Jika client mengirimkan token mentah langsung di header Authorization
			tok = auth
		}
	}

	// Fallback ke parameter URL ?token=
	if tok == "" {
		tok = strings.TrimSpace(r.URL.Query().Get("token"))
	}

	return ParseTokenString(tok)
}
