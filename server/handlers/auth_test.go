package handlers

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestHandleLogout(t *testing.T) {
	api, _ := newTestHandler(t)

	req := httptest.NewRequest("POST", "/api/auth/logout", nil)
	rec := httptest.NewRecorder()

	api.HandleLogout(rec, req)

	if rec.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d", rec.Code)
	}

	var res map[string]interface{}
	if err := json.NewDecoder(rec.Body).Decode(&res); err != nil {
		t.Fatalf("failed to decode json: %v", err)
	}

	if res["success"] != true {
		t.Fatalf("expected success true, got %v", res["success"])
	}

	cookies := rec.Result().Cookies()
	if len(cookies) == 0 {
		t.Fatalf("expected cookie to be cleared")
	}
	if cookies[0].MaxAge != -1 {
		t.Fatalf("expected MaxAge -1, got %d", cookies[0].MaxAge)
	}
}

func TestUpsertGoogleUser(t *testing.T) {
	api, db := newTestHandler(t)

	email := "santri.google@tartila.com"
	name := "Santri Google"

	// 1. Insert first time
	userID, role, err := api.UpsertGoogleUser(email, name)
	if err != nil {
		t.Fatalf("UpsertGoogleUser failed: %v", err)
	}
	if userID == "" {
		t.Fatalf("expected non-empty userID")
	}
	if role != "member" {
		t.Fatalf("expected member role, got %s", role)
	}

	// 2. Query DB to verify
	var dbEmail, dbRole string
	err = db.QueryRow("SELECT email, role FROM users WHERE id = ?", userID).Scan(&dbEmail, &dbRole)
	if err != nil {
		t.Fatalf("query db: %v", err)
	}
	if dbEmail != email {
		t.Fatalf("expected email %s, got %s", email, dbEmail)
	}

	// 3. Upsert again with same email -> should return SAME userID
	secondID, secondRole, err := api.UpsertGoogleUser(email, name)
	if err != nil {
		t.Fatalf("second upsert failed: %v", err)
	}
	if secondID != userID {
		t.Fatalf("expected same userID %s, got %s", userID, secondID)
	}
	if secondRole != "member" {
		t.Fatalf("expected member role, got %s", secondRole)
	}
}
