package hub

import (
	"crypto/ecdsa"
	"crypto/elliptic"
	"crypto/rand"
	"encoding/base64"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

func generateTestES256Key(t *testing.T, kid string) (*ecdsa.PrivateKey, []byte) {
	t.Helper()
	priv, err := ecdsa.GenerateKey(elliptic.P256(), rand.Reader)
	if err != nil {
		t.Fatalf("generate key: %v", err)
	}

	xBytes := priv.PublicKey.X.Bytes()
	yBytes := priv.PublicKey.Y.Bytes()

	xPadded := make([]byte, 32)
	yPadded := make([]byte, 32)
	copy(xPadded[32-len(xBytes):], xBytes)
	copy(yPadded[32-len(yBytes):], yBytes)

	jwk := map[string]interface{}{
		"kty": "EC",
		"crv": "P-256",
		"alg": "ES256",
		"use": "sig",
		"kid": kid,
		"x":   base64.RawURLEncoding.EncodeToString(xPadded),
		"y":   base64.RawURLEncoding.EncodeToString(yPadded),
	}
	jwks := map[string]interface{}{
		"keys": []interface{}{jwk},
	}
	data, err := json.Marshal(jwks)
	if err != nil {
		t.Fatalf("marshal jwks: %v", err)
	}
	return priv, data
}

func TestParseAuthToken_SupabaseES256_Valid(t *testing.T) {
	kid := "test-supabase-kid-1"
	priv, jwksBytes := generateTestES256Key(t, kid)

	ts := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path == "/auth/v1/.well-known/jwks.json" {
			w.Header().Set("Content-Type", "application/json")
			w.Write(jwksBytes)
			return
		}
		http.NotFound(w, r)
	}))
	defer ts.Close()

	t.Setenv("SUPABASE_URL", ts.URL)
	SetJWKS(nil)
	defer SetJWKS(nil)

	userUUID := "4f1837e2-a0b8-4e33-8a9d-b4b0e9f023d1"
	userEmail := "santri-es256@tartila.com"

	claims := jwt.MapClaims{
		"sub":   userUUID,
		"email": userEmail,
		"iss":   ts.URL + "/auth/v1",
		"aud":   "authenticated",
		"role":  "authenticated",
		"exp":   time.Now().Add(time.Hour).Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodES256, claims)
	token.Header["kid"] = kid

	tokenStr, err := token.SignedString(priv)
	if err != nil {
		t.Fatalf("failed to sign ES256 token: %v", err)
	}

	// 1. Validasi via Authorization: Bearer <token>
	req := httptest.NewRequest("GET", "/api/v1/user/profile", nil)
	req.Header.Set("Authorization", "Bearer "+tokenStr)

	gotID, gotClaims, err := ParseAuthToken(req)
	if err != nil {
		t.Fatalf("ParseAuthToken failed for valid ES256 token: %v", err)
	}
	if gotID != userUUID {
		t.Fatalf("expected userID=%s, got %s", userUUID, gotID)
	}
	if gotClaims["email"] != userEmail {
		t.Fatalf("expected email=%s, got %v", userEmail, gotClaims["email"])
	}
}

func TestParseAuthToken_SupabaseES256_InvalidIssuer(t *testing.T) {
	kid := "test-supabase-kid-2"
	priv, jwksBytes := generateTestES256Key(t, kid)

	ts := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path == "/auth/v1/.well-known/jwks.json" {
			w.Header().Set("Content-Type", "application/json")
			w.Write(jwksBytes)
			return
		}
		http.NotFound(w, r)
	}))
	defer ts.Close()

	t.Setenv("SUPABASE_URL", ts.URL)
	SetJWKS(nil)
	defer SetJWKS(nil)

	// Klaim dengan issuer yang tidak cocok
	claims := jwt.MapClaims{
		"sub":   "user-uuid",
		"iss":   "https://wrong-supabase.supabase.co/auth/v1",
		"aud":   "authenticated",
		"role":  "authenticated",
		"exp":   time.Now().Add(time.Hour).Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodES256, claims)
	token.Header["kid"] = kid

	tokenStr, err := token.SignedString(priv)
	if err != nil {
		t.Fatalf("failed to sign ES256 token: %v", err)
	}

	req := httptest.NewRequest("GET", "/api/v1/user/profile", nil)
	req.Header.Set("Authorization", "Bearer "+tokenStr)

	_, _, err = ParseAuthToken(req)
	if err != ErrInvalidToken {
		t.Fatalf("expected ErrInvalidToken for invalid issuer, got %v", err)
	}
}

func TestParseAuthToken_SupabaseES256_InvalidAudience(t *testing.T) {
	kid := "test-supabase-kid-3"
	priv, jwksBytes := generateTestES256Key(t, kid)

	ts := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path == "/auth/v1/.well-known/jwks.json" {
			w.Header().Set("Content-Type", "application/json")
			w.Write(jwksBytes)
			return
		}
		http.NotFound(w, r)
	}))
	defer ts.Close()

	t.Setenv("SUPABASE_URL", ts.URL)
	SetJWKS(nil)
	defer SetJWKS(nil)

	// Klaim dengan aud bukan 'authenticated' (misal: 'anon')
	claims := jwt.MapClaims{
		"sub":   "user-uuid",
		"iss":   ts.URL + "/auth/v1",
		"aud":   "anon",
		"role":  "anon",
		"exp":   time.Now().Add(time.Hour).Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodES256, claims)
	token.Header["kid"] = kid

	tokenStr, err := token.SignedString(priv)
	if err != nil {
		t.Fatalf("failed to sign ES256 token: %v", err)
	}

	req := httptest.NewRequest("GET", "/api/v1/user/profile", nil)
	req.Header.Set("Authorization", "Bearer "+tokenStr)

	_, _, err = ParseAuthToken(req)
	if err != ErrInvalidToken {
		t.Fatalf("expected ErrInvalidToken for invalid audience, got %v", err)
	}
}

func TestParseAuthToken_SupabaseES256_MissingKid(t *testing.T) {
	kid := "test-supabase-kid-4"
	priv, jwksBytes := generateTestES256Key(t, kid)

	ts := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path == "/auth/v1/.well-known/jwks.json" {
			w.Header().Set("Content-Type", "application/json")
			w.Write(jwksBytes)
			return
		}
		http.NotFound(w, r)
	}))
	defer ts.Close()

	t.Setenv("SUPABASE_URL", ts.URL)
	SetJWKS(nil)
	defer SetJWKS(nil)

	claims := jwt.MapClaims{
		"sub":   "user-uuid",
		"iss":   ts.URL + "/auth/v1",
		"aud":   "authenticated",
		"role":  "authenticated",
		"exp":   time.Now().Add(time.Hour).Unix(),
	}

	// Tanpa header kid
	token := jwt.NewWithClaims(jwt.SigningMethodES256, claims)

	tokenStr, err := token.SignedString(priv)
	if err != nil {
		t.Fatalf("failed to sign ES256 token: %v", err)
	}

	req := httptest.NewRequest("GET", "/api/v1/user/profile", nil)
	req.Header.Set("Authorization", "Bearer "+tokenStr)

	_, _, err = ParseAuthToken(req)
	if err != ErrInvalidToken {
		t.Fatalf("expected ErrInvalidToken for missing kid, got %v", err)
	}
}

func TestParseAuthToken_SupabaseES256_InvalidSignature(t *testing.T) {
	kid := "test-supabase-kid-5"
	_, jwksBytes := generateTestES256Key(t, kid)

	ts := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path == "/auth/v1/.well-known/jwks.json" {
			w.Header().Set("Content-Type", "application/json")
			w.Write(jwksBytes)
			return
		}
		http.NotFound(w, r)
	}))
	defer ts.Close()

	t.Setenv("SUPABASE_URL", ts.URL)
	SetJWKS(nil)
	defer SetJWKS(nil)

	// Buat private key lain yang TIDAK cocok dengan public key di JWKS
	differentPriv, _ := ecdsa.GenerateKey(elliptic.P256(), rand.Reader)

	claims := jwt.MapClaims{
		"sub":   "user-uuid",
		"iss":   ts.URL + "/auth/v1",
		"aud":   "authenticated",
		"role":  "authenticated",
		"exp":   time.Now().Add(time.Hour).Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodES256, claims)
	token.Header["kid"] = kid

	tokenStr, err := token.SignedString(differentPriv)
	if err != nil {
		t.Fatalf("failed to sign ES256 token: %v", err)
	}

	req := httptest.NewRequest("GET", "/api/v1/user/profile", nil)
	req.Header.Set("Authorization", "Bearer "+tokenStr)

	_, _, err = ParseAuthToken(req)
	if err != ErrInvalidToken {
		t.Fatalf("expected ErrInvalidToken for wrong signature, got %v", err)
	}
}

func TestParseAuthToken_SupabaseJWT_HMAC(t *testing.T) {
	secret := "test-supabase-secret-1234567890"
	t.Setenv("SUPABASE_JWT_SECRET", secret)
	t.Setenv("JWT_SECRET", "") // Pastikan SUPABASE_JWT_SECRET yang diprioritaskan

	userUUID := "6a5e1234-abcd-4ef0-9123-123456789abc"
	userEmail := "santri@tartila.com"

	// 1. Buat token Supabase standar (alg: HS256, sub: UUID, email: string)
	claims := jwt.MapClaims{
		"sub":   userUUID,
		"email": userEmail,
		"role":  "authenticated",
		"aud":   "authenticated",
		"exp":   time.Now().Add(time.Hour).Unix(),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenStr, err := token.SignedString([]byte(secret))
	if err != nil {
		t.Fatalf("sign token: %v", err)
	}

	// 2. Test Authorization: Bearer <token> (standar)
	{
		req := httptest.NewRequest("GET", "/api/v1/user/profile", nil)
		req.Header.Set("Authorization", "Bearer "+tokenStr)

		gotID, gotClaims, err := ParseAuthToken(req)
		if err != nil {
			t.Fatalf("ParseAuthToken failed: %v", err)
		}
		if gotID != userUUID {
			t.Fatalf("expected userID=%s, got %s", userUUID, gotID)
		}
		if gotClaims["email"] != userEmail {
			t.Fatalf("expected email=%s, got %v", userEmail, gotClaims["email"])
		}
	}

	// 3. Test Authorization: bearer <token> (lowercase)
	{
		req := httptest.NewRequest("GET", "/api/v1/user/profile", nil)
		req.Header.Set("Authorization", "bearer "+tokenStr)

		gotID, _, err := ParseAuthToken(req)
		if err != nil {
			t.Fatalf("lowercase bearer failed: %v", err)
		}
		if gotID != userUUID {
			t.Fatalf("expected userID=%s, got %s", userUUID, gotID)
		}
	}

	// 4. Test URL Query ?token=<token>
	{
		req := httptest.NewRequest("GET", "/api/v1/user/profile?token="+tokenStr, nil)
		gotID, _, err := ParseAuthToken(req)
		if err != nil {
			t.Fatalf("query token failed: %v", err)
		}
		if gotID != userUUID {
			t.Fatalf("expected userID=%s, got %s", userUUID, gotID)
		}
	}

	// 5. Test Token dengan secret yang salah -> gagal (ErrInvalidToken)
	{
		badToken := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
		badStr, _ := badToken.SignedString([]byte("wrong-secret-key"))
		req := httptest.NewRequest("GET", "/api/v1/user/profile", nil)
		req.Header.Set("Authorization", "Bearer "+badStr)

		_, _, err := ParseAuthToken(req)
		if err != ErrInvalidToken {
			t.Fatalf("expected ErrInvalidToken for wrong secret, got %v", err)
		}
	}

	// 6. Test Request tanpa header Authorization -> gagal (ErrInvalidToken)
	{
		req := httptest.NewRequest("GET", "/api/v1/user/profile", nil)
		_, _, err := ParseAuthToken(req)
		if err != ErrInvalidToken {
			t.Fatalf("expected ErrInvalidToken for missing token, got %v", err)
		}
	}
}

func TestParseTokenString_FallbackJWTSecret(t *testing.T) {
	// Jika SUPABASE_JWT_SECRET kosong, harus fallback ke JWT_SECRET
	t.Setenv("SUPABASE_JWT_SECRET", "")
	t.Setenv("JWT_SECRET", "legacy-jwt-secret")

	claims := jwt.MapClaims{
		"sub": "user-legacy-uuid",
		"exp": time.Now().Add(time.Hour).Unix(),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenStr, _ := token.SignedString([]byte("legacy-jwt-secret"))

	id, _, err := ParseTokenString(tokenStr)
	if err != nil {
		t.Fatalf("expected fallback to work, got error: %v", err)
	}
	if id != "user-legacy-uuid" {
		t.Fatalf("expected id=user-legacy-uuid, got %s", id)
	}
}
