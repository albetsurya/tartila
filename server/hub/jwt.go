package hub

import (
	"errors"
	"net/http"
	"os"
	"strings"

	"github.com/golang-jwt/jwt/v5"
)

// ErrMissingJWTSecret is returned when JWT_SECRET is not configured.
var ErrMissingJWTSecret = errors.New("JWT_SECRET is not configured")

// ErrInvalidToken is returned when the token is missing or invalid.
var ErrInvalidToken = errors.New("token is missing or invalid")

// ParseAuthToken validates the JWT and returns the user_id claim.
// Priority: query param "token", then "Authorization: Bearer".
func ParseAuthToken(r *http.Request) (string, jwt.MapClaims, error) {
	tok := r.URL.Query().Get("token")
	if tok == "" {
		if auth := r.Header.Get("Authorization"); strings.HasPrefix(auth, "Bearer ") {
			tok = auth[7:]
		}
	}
	if tok == "" {
		return "", nil, ErrInvalidToken
	}

	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		return "", nil, ErrMissingJWTSecret
	}

	parsed, err := jwt.Parse(tok, func(t *jwt.Token) (interface{}, error) {
		return []byte(secret), nil
	}, jwt.WithValidMethods([]string{"HS256"}))
	if err != nil || !parsed.Valid {
		return "", nil, ErrInvalidToken
	}

	claims, ok := parsed.Claims.(jwt.MapClaims)
	if !ok {
		return "", nil, ErrInvalidToken
	}

	userID, ok := claims["user_id"].(string)
	if userID == "" {
		return "", nil, ErrInvalidToken
	}
	return userID, claims, nil
}
