package handlers

import (
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"strconv"
	"strings"
	"time"

	_ "github.com/jackc/pgx/v5/stdlib"

	"tartila-server/hub"
)

// Timeline data lives in Postgres (`tilawati_timeline_edits`), separate from
// the SQLite persistent store. Connection is opened lazily on first request.
func (api *APIHandler) timelinePool() (*sql.DB, error) {
	api.timelineOnce.Do(func() {
		url := os.Getenv("TILAWATI_DATABASE_URL")
		if url == "" {
			url = "postgresql://postgres:postgres@127.0.0.1:54322/postgres"
		}
		db, err := sql.Open("pgx", url)
		if err != nil {
			api.timelineErr = fmt.Errorf("open tilawati db: %w", err)
			return
		}
		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()
		if err := db.PingContext(ctx); err != nil {
			api.timelineErr = fmt.Errorf("ping tilawati db: %w", err)
			return
		}
		log.Printf("[DB] Tilawati timeline Postgres pool ready")
		api.timelineDB = db
	})
	return api.timelineDB, api.timelineErr
}

// normalizeTimelineEdit coerces the JSONB payload into the TimelineEdit shape
// the frontend expects: { published?: {...}, audioOrder?, textLinks?,
// textAdditions?, textEdits? }. A row saved as a bare PublishedTimeline
// (timeline/questions/revision at the root) is wrapped under `published`.
func normalizeTimelineEdit(raw map[string]interface{}) map[string]interface{} {
	if raw == nil {
		raw = map[string]interface{}{}
	}
	if _, hasPublished := raw["published"]; hasPublished {
		return raw
	}
	if _, hasTimeline := raw["timeline"]; hasTimeline {
		revision, _ := raw["revision"].(string)
		return map[string]interface{}{"published": raw, "revision": revision}
	}
	return raw
}

func extractRevision(edit map[string]interface{}) string {
	if published, ok := edit["published"].(map[string]interface{}); ok {
		if revision, ok := published["revision"].(string); ok && revision != "" {
			return revision
		}
	}
	revision, _ := edit["revision"].(string)
	return revision
}

func asMap(value interface{}) map[string]interface{} {
	if m, ok := value.(map[string]interface{}); ok {
		return m
	}
	return nil
}

// timelineRoleAllowed enforces tartila_admin / superadmin for every write.
func timelineRoleAllowed(claims map[string]interface{}) bool {
	role, _ := claims["role"].(string)
	return role == "tartila_admin" || role == "superadmin"
}

// GetAllTimelines — GET /api/v1/tilawati/timeline/all
// Response: {"status":"success","data":{"1:1":{"published":...}, ...}}
func (api *APIHandler) GetAllTimelines(w http.ResponseWriter, r *http.Request) {
	db, err := api.timelinePool()
	if err != nil {
		log.Printf("[timeline] db unavailable: %v", err)
		http.Error(w, "database unavailable", http.StatusServiceUnavailable)
		return
	}

	rows, err := db.Query(`SELECT jilid, page, published_timeline_json FROM tilawati_timeline_edits`)
	if err != nil {
		log.Printf("[timeline] query all: %v", err)
		http.Error(w, "database error", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	data := map[string]interface{}{}
	for rows.Next() {
		var jilid, page int
		var raw []byte
		if err := rows.Scan(&jilid, &page, &raw); err != nil {
			continue
		}
		var parsed map[string]interface{}
		if err := json.Unmarshal(raw, &parsed); err != nil {
			continue
		}
		edit := normalizeTimelineEdit(parsed)
		edit["revision"] = extractRevision(edit)
		data[fmt.Sprintf("%d:%d", jilid, page)] = edit
	}

	w.Header().Set("Content-Type", "application/json")
	_ = json.NewEncoder(w).Encode(map[string]interface{}{
		"status": "success",
		"data":   data,
	})
}

// TimelineOne — GET|POST /api/v1/tilawati/timeline/:jilid/:page
func (api *APIHandler) TimelineOne(w http.ResponseWriter, r *http.Request) {
	parts := strings.Split(strings.TrimPrefix(r.URL.Path, "/api/v1/tilawati/timeline/"), "/")
	if len(parts) != 2 {
		http.Error(w, "Not found", http.StatusNotFound)
		return
	}
	jilid, err := strconv.Atoi(parts[0])
	page, errPage := strconv.Atoi(parts[1])
	if err != nil || errPage != nil || jilid < 1 || jilid > 6 || page < 1 || page > 44 {
		http.Error(w, "Jilid/halaman tidak valid", http.StatusBadRequest)
		return
	}

	if r.Method == http.MethodPost {
		api.TimelineUpsert(w, r, jilid, page)
		return
	}
	if r.Method != http.MethodGet && r.Method != http.MethodOptions {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	db, err := api.timelinePool()
	if err != nil {
		log.Printf("[timeline] db unavailable: %v", err)
		http.Error(w, "database unavailable", http.StatusServiceUnavailable)
		return
	}

	var raw []byte
	err = db.QueryRow(
		`SELECT published_timeline_json FROM tilawati_timeline_edits WHERE jilid = $1 AND page = $2`,
		jilid, page,
	).Scan(&raw)
	if err != nil {
		if err == sql.ErrNoRows {
			w.Header().Set("Content-Type", "application/json")
			_ = json.NewEncoder(w).Encode(map[string]interface{}{
				"status": "success",
				"data":   map[string]interface{}{},
			})
			return
		}
		log.Printf("[timeline] query one: %v", err)
		http.Error(w, "database error", http.StatusInternalServerError)
		return
	}

	var parsed map[string]interface{}
	if err := json.Unmarshal(raw, &parsed); err != nil {
		http.Error(w, "database error", http.StatusInternalServerError)
		return
	}
	edit := normalizeTimelineEdit(parsed)
	edit["revision"] = extractRevision(edit)

	w.Header().Set("Content-Type", "application/json")
	_ = json.NewEncoder(w).Encode(map[string]interface{}{
		"status": "success",
		"data":   edit,
	})
}

// TimelineUpsert — POST handler. Merges the payload into the existing row so
// partial saves (layout/text only) never wipe `published.timeline.clips`.
func (api *APIHandler) TimelineUpsert(w http.ResponseWriter, r *http.Request, jilid, page int) {
	_, claims, err := hub.ParseAuthToken(r)
	if err != nil {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}
	if !timelineRoleAllowed(claims) {
		http.Error(w, "forbidden: hanya tartila_admin atau superadmin", http.StatusForbidden)
		return
	}

	db, err := api.timelinePool()
	if err != nil {
		log.Printf("[timeline] db unavailable: %v", err)
		http.Error(w, "database unavailable", http.StatusServiceUnavailable)
		return
	}

	body, err := io.ReadAll(io.LimitReader(r.Body, 32<<20))
	if err != nil {
		http.Error(w, "Invalid payload", http.StatusBadRequest)
		return
	}
	var payload map[string]interface{}
	if err := json.Unmarshal(body, &payload); err != nil {
		http.Error(w, "Invalid payload", http.StatusBadRequest)
		return
	}

	// Existing row: last-write-wins per key, clips untouched when absent.
	var existingJSON []byte
	err = db.QueryRow(
		`SELECT published_timeline_json FROM tilawati_timeline_edits WHERE jilid = $1 AND page = $2`,
		jilid, page,
	).Scan(&existingJSON)
	edit := map[string]interface{}{}
	if err == nil {
		var parsed map[string]interface{}
		if err := json.Unmarshal(existingJSON, &parsed); err == nil {
			edit = normalizeTimelineEdit(parsed)
		}
	} else if err != sql.ErrNoRows {
		log.Printf("[timeline] select for upsert: %v", err)
		http.Error(w, "database error", http.StatusInternalServerError)
		return
	}

	for _, field := range []string{"audioOrder", "textLinks", "textAdditions"} {
		if value, ok := payload[field]; ok && value != nil {
			edit[field] = value
		}
	}
	if published := asMap(payload["published"]); published != nil {
		edit["published"] = published
	}

	// Per-question text edits: { key: "jilid:hal:questionId", arabic?, hintTone?, ... }
	if textEdit := asMap(payload["textEdit"]); textEdit != nil {
		if key, _ := textEdit["key"].(string); key != "" {
			textEdits, _ := edit["textEdits"].(map[string]interface{})
			if textEdits == nil {
				textEdits = map[string]interface{}{}
			}
			value := map[string]interface{}{}
			for field, item := range textEdit {
				if field != "key" {
					value[field] = item
				}
			}
			textEdits[key] = value
			edit["textEdits"] = textEdits
		}
	}

	edit["revision"] = extractRevision(edit)
	if edit["revision"] == "" {
		edit["revision"] = time.Now().UTC().Format(time.RFC3339)
	}

	encoded, err := json.Marshal(edit)
	if err != nil {
		http.Error(w, "Invalid payload", http.StatusBadRequest)
		return
	}

	if _, err := db.Exec(
		`INSERT INTO tilawati_timeline_edits (jilid, page, published_timeline_json, revision, created_at, updated_at)
		 VALUES ($1, $2, $3, $4, now(), now())
		 ON CONFLICT (jilid, page) DO UPDATE
		 SET published_timeline_json = EXCLUDED.published_timeline_json,
		     revision = EXCLUDED.revision,
		     updated_at = now()`,
		jilid, page, encoded, edit["revision"],
	); err != nil {
		log.Printf("[timeline] upsert: %v", err)
		http.Error(w, "database error", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	_ = json.NewEncoder(w).Encode(map[string]interface{}{
		"status": "success",
		"data":   edit,
	})
}
