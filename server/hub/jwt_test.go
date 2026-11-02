package hub

import (
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

func TestGenerateAndParseToken(t *testing.T) {
	secret := "test-secret-1234567890"
	t.Setenv("JWT_SECRET", secret)

	userUUID := "6a5e1234-abcd-4ef0-9123-123456789abc"
	userEmail := "santri@tartila.com"
	userRole := "ustadz"

	tokenStr, err := GenerateToken(userUUID, userEmail, userRole)
	if err != nil {
		t.Fatalf("GenerateToken failed: %v", err)
	}

	gotID, claims, err := ParseTokenString(tokenStr)
	if err != nil {
		t.Fatalf("ParseTokenString failed: %v", err)
	}

	if gotID != userUUID {
		t.Fatalf("expected userID=%s, got %s", userUUID, gotID)
	}
	if claims["email"] != userEmail {
		t.Fatalf("expected email=%s, got %v", userEmail, claims["email"])
	}
	if claims["role"] != userRole {
		t.Fatalf("expected role=%s, got %v", userRole, claims["role"])
	}
}

func TestParseAuthToken_Cookie(t *testing.T) {
	secret := "test-cookie-secret-12345"
	t.Setenv("JWT_SECRET", secret)

	userUUID := "user-cookie-uuid"
	userEmail := "cookie@tartila.com"

	tokenStr, err := GenerateToken(userUUID, userEmail, "member")
	if err != nil {
		t.Fatalf("GenerateToken failed: %v", err)
	}

	req := httptest.NewRequest("GET", "/api/v1/user/profile", nil)
	req.AddCookie(&http.Cookie{
		Name:  "token",
		Value: tokenStr,
	})

	gotID, gotClaims, err := ParseAuthToken(req)
	if err != nil {
		t.Fatalf("ParseAuthToken with cookie failed: %v", err)
	}
	if gotID != userUUID {
		t.Fatalf("expected %s, got %s", userUUID, gotID)
	}
	if gotClaims["email"] != userEmail {
		t.Fatalf("expected %s, got %v", userEmail, gotClaims["email"])
	}
}

func TestParseAuthToken_BearerHeader(t *testing.T) {
	secret := "test-bearer-secret-12345"
	t.Setenv("JWT_SECRET", secret)

	userUUID := "user-bearer-uuid"
	tokenStr, err := GenerateToken(userUUID, "bearer@tartila.com", "member")
	if err != nil {
		t.Fatalf("GenerateToken failed: %v", err)
	}

	req := httptest.NewRequest("GET", "/api/v1/user/profile", nil)
	req.Header.Set("Authorization", "Bearer "+tokenStr)

	gotID, _, err := ParseAuthToken(req)
	if err != nil {
		t.Fatalf("ParseAuthToken with Bearer failed: %v", err)
	}
	if gotID != userUUID {
		t.Fatalf("expected %s, got %s", userUUID, gotID)
	}
}

func TestParseAuthToken_QueryParam(t *testing.T) {
	secret := "test-query-secret-12345"
	t.Setenv("JWT_SECRET", secret)

	userUUID := "user-query-uuid"
	tokenStr, err := GenerateToken(userUUID, "query@tartila.com", "member")
	if err != nil {
		t.Fatalf("GenerateToken failed: %v", err)
	}

	req := httptest.NewRequest("GET", "/api/v1/user/profile?token="+tokenStr, nil)
	gotID, _, err := ParseAuthToken(req)
	if err != nil {
		t.Fatalf("ParseAuthToken with query param failed: %v", err)
	}
	if gotID != userUUID {
		t.Fatalf("expected %s, got %s", userUUID, gotID)
	}
}

func TestParseAuthToken_InvalidToken(t *testing.T) {
	t.Setenv("JWT_SECRET", "test-secret")

	// Missing token
	req := httptest.NewRequest("GET", "/api/v1/user/profile", nil)
	_, _, err := ParseAuthToken(req)
	if err != ErrInvalidToken {
		t.Fatalf("expected ErrInvalidToken, got %v", err)
	}

	// Wrong signature
	wrongToken := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub": "user-wrong",
		"exp": time.Now().Add(time.Hour).Unix(),
	})
	wrongStr, _ := wrongToken.SignedString([]byte("different-secret"))
	req = httptest.NewRequest("GET", "/api/v1/user/profile", nil)
	req.Header.Set("Authorization", "Bearer "+wrongStr)
	_, _, err = ParseAuthToken(req)
	if err != ErrInvalidToken {
		t.Fatalf("expected ErrInvalidToken for wrong signature, got %v", err)
	}
}

func TestCookieSetAndClear(t *testing.T) {
	rec := httptest.NewRecorder()
	req := httptest.NewRequest("GET", "https://tartila.pages.dev", nil)

	SetAuthCookie(rec, req, "sample-token")
	cookies := rec.Result().Cookies()
	if len(cookies) == 0 {
		t.Fatalf("expected at least one cookie")
	}
	c := cookies[0]
	if c.Name != "token" || c.Value != "sample-token" || !c.HttpOnly {
		t.Fatalf("unexpected cookie attributes: %+v", c)
	}

	clearRec := httptest.NewRecorder()
	ClearAuthCookie(clearRec, req)
	clearCookies := clearRec.Result().Cookies()
	if len(clearCookies) == 0 {
		t.Fatalf("expected clear cookie")
	}
	if clearCookies[0].MaxAge != -1 {
		t.Fatalf("expected MaxAge -1, got %d", clearCookies[0].MaxAge)
	}
}
