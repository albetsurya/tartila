package hub

import (
	"errors"
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"
	"sync"

	"github.com/MicahParks/keyfunc/v3"
	"github.com/golang-jwt/jwt/v5"
)

// ErrMissingJWTSecret is returned when HMAC algorithm is used but no secret is configured.
var ErrMissingJWTSecret = errors.New("SUPABASE_JWT_SECRET (or JWT_SECRET) is not configured")

// ErrInvalidToken is returned when the token is missing, invalid, or expired.
var ErrInvalidToken = errors.New("token is missing or invalid")

var (
	jwksKeyfunc keyfunc.Keyfunc
	jwksMu      sync.RWMutex
	lastJWKSURL string
)

// GetJWTSecret returns SUPABASE_JWT_SECRET (preferred for Supabase Auth) or JWT_SECRET (legacy fallback).
func GetJWTSecret() string {
	secret := strings.TrimSpace(os.Getenv("SUPABASE_JWT_SECRET"))
	if secret == "" {
		secret = strings.TrimSpace(os.Getenv("JWT_SECRET"))
	}
	return secret
}

// GetSupabaseURL returns the base URL of the Supabase project.
// Prioritizes SUPABASE_URL, then VITE_SUPABASE_URL, falling back to the project default.
func GetSupabaseURL() string {
	u := strings.TrimSpace(os.Getenv("SUPABASE_URL"))
	if u == "" {
		u = strings.TrimSpace(os.Getenv("VITE_SUPABASE_URL"))
	}
	if u == "" {
		u = "https://esmeeghztkcwxqyqbvza.supabase.co"
	}
	return strings.TrimRight(u, "/")
}

// GetSupabaseIssuer returns the expected JWT issuer (iss) URL.
func GetSupabaseIssuer() string {
	if iss := strings.TrimSpace(os.Getenv("SUPABASE_JWT_ISSUER")); iss != "" {
		return strings.TrimRight(iss, "/")
	}
	return GetSupabaseURL() + "/auth/v1"
}

// GetSupabaseJWKSURL returns the Supabase JWKS endpoint URL.
func GetSupabaseJWKSURL() string {
	if jwksURL := strings.TrimSpace(os.Getenv("SUPABASE_JWKS_URL")); jwksURL != "" {
		return jwksURL
	}
	return GetSupabaseURL() + "/auth/v1/.well-known/jwks.json"
}

// SetJWKS sets or resets the active JWKS Keyfunc instance (primarily for testing).
func SetJWKS(kf keyfunc.Keyfunc) {
	jwksMu.Lock()
	defer jwksMu.Unlock()
	jwksKeyfunc = kf
	if kf == nil {
		lastJWKSURL = ""
	}
}

// GetJWKS returns or initializes the JWKS Keyfunc client for Supabase Auth.
func GetJWKS() (keyfunc.Keyfunc, error) {
	jwksURL := GetSupabaseJWKSURL()

	jwksMu.RLock()
	if jwksKeyfunc != nil && lastJWKSURL == jwksURL {
		defer jwksMu.RUnlock()
		return jwksKeyfunc, nil
	}
	jwksMu.RUnlock()

	jwksMu.Lock()
	defer jwksMu.Unlock()

	if jwksKeyfunc != nil && lastJWKSURL == jwksURL {
		return jwksKeyfunc, nil
	}

	kf, err := keyfunc.NewDefault([]string{jwksURL})
	if err != nil {
		return nil, fmt.Errorf("failed to create JWKS keyfunc for %s: %w", jwksURL, err)
	}

	jwksKeyfunc = kf
	lastJWKSURL = jwksURL
	return jwksKeyfunc, nil
}

// ParseTokenString validates the raw JWT string.
// Supports Supabase ES256 tokens verified via JWKS and legacy/test HS256 tokens.
func ParseTokenString(tok string) (string, jwt.MapClaims, error) {
	tok = strings.TrimSpace(tok)
	if tok == "" {
		return "", nil, ErrInvalidToken
	}

	// 1. Parsing token tanpa memverifikasi signature terlebih dahulu
	// untuk membaca header kid (Key ID) dan alg (ES256 / HS256).
	unverified, _, err := jwt.NewParser().ParseUnverified(tok, jwt.MapClaims{})
	if err != nil {
		log.Printf("[Auth] Failed to parse unverified token: %v", err)
		return "", nil, ErrInvalidToken
	}

	alg, _ := unverified.Header["alg"].(string)
	kid, _ := unverified.Header["kid"].(string)

	var parsed *jwt.Token
	var parseErr error

	switch alg {
	case "ES256":
		// Supabase Asymmetric Key (ES256)
		if kid == "" {
			log.Printf("[Auth] ES256 token missing 'kid' in header")
			return "", nil, ErrInvalidToken
		}

		kf, err := GetJWKS()
		if err != nil {
			log.Printf("[Auth] Failed to get JWKS keyfunc: %v", err)
			return "", nil, ErrInvalidToken
		}

		// 2. Ambil Public Key yang cocok dari JWKS Supabase berdasarkan kid & verifikasi signature
		parsed, parseErr = jwt.Parse(tok, kf.Keyfunc, jwt.WithValidMethods([]string{"ES256"}))

	case "HS256", "HS384", "HS512":
		// Fallback HMAC untuk backwards-compatibility / unit test
		secret := GetJWTSecret()
		if secret == "" {
			log.Printf("[Auth] Error: SUPABASE_JWT_SECRET (or JWT_SECRET) is not configured for HMAC token")
			return "", nil, ErrMissingJWTSecret
		}

		parsed, parseErr = jwt.Parse(tok, func(t *jwt.Token) (interface{}, error) {
			if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("unexpected signing algorithm: %v", t.Header["alg"])
			}
			return []byte(secret), nil
		}, jwt.WithValidMethods([]string{"HS256", "HS384", "HS512"}))

	default:
		log.Printf("[Auth] Unsupported JWT algorithm: %v", alg)
		return "", nil, fmt.Errorf("%w: unsupported algorithm %s", ErrInvalidToken, alg)
	}

	if parseErr != nil {
		log.Printf("[Auth] JWT verification failed (%s): %v", alg, parseErr)
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

	// 3. Validasi Klaim (Claims):
	// - Pastikan iss (Issuer) sesuai dengan https://<ref>.supabase.co/auth/v1
	// - Pastikan aud (Audience) sesuai dengan 'authenticated'
	expectedIssuer := GetSupabaseIssuer()
	if alg == "ES256" {
		iss, _ := claims.GetIssuer()
		if iss != expectedIssuer {
			log.Printf("[Auth] JWT invalid issuer: got %q, expected %q", iss, expectedIssuer)
			return "", nil, ErrInvalidToken
		}

		auds, _ := claims.GetAudience()
		audMatched := false
		for _, a := range auds {
			if a == "authenticated" {
				audMatched = true
				break
			}
		}
		if !audMatched {
			log.Printf("[Auth] JWT invalid audience: got %v, expected 'authenticated'", auds)
			return "", nil, ErrInvalidToken
		}
	} else {
		// Untuk token HMAC, jika klaim iss / aud ada, validasi agar konsisten
		if iss, _ := claims.GetIssuer(); iss != "" && iss != expectedIssuer {
			log.Printf("[Auth] JWT invalid issuer: got %q, expected %q", iss, expectedIssuer)
			return "", nil, ErrInvalidToken
		}
		if auds, _ := claims.GetAudience(); len(auds) > 0 {
			audMatched := false
			for _, a := range auds {
				if a == "authenticated" {
					audMatched = true
					break
				}
			}
			if !audMatched {
				log.Printf("[Auth] JWT invalid audience: got %v, expected 'authenticated'", auds)
				return "", nil, ErrInvalidToken
			}
		}
	}

	// 4. Ambil UUID user dari klaim 'sub' (standar Supabase Auth), fallback ke 'user_id'
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
