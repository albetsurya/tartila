package hub

import (
	"net/http/httptest"
	"testing"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

func TestParseAuthToken_SupabaseJWT(t *testing.T) {
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
