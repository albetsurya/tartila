package main

import (
	"database/sql"
	"fmt"
	"log"
	"os"
	"path/filepath"

	_ "modernc.org/sqlite"
)

// Store is the application-wide SQLite database connection. It is initialized
// in main() via InitDB and shared with the API handlers. All per-user state
// that must survive cache clears / new devices (feedback prompts, etc.) lives
// here rather than in the browser's localStorage.
var Store *sql.DB

// dbDir is where the SQLite file (and migrations) live.
const dbDir = "server/data"

// InitDB opens (or creates) the SQLite database file used as the persistent
// store for cross-session user state. It is idempotent: the `feedback_prompt`
// table is created with `IF NOT EXISTS`, so subsequent starts are safe.
func InitDB() error {
	if err := os.MkdirAll(dbDir, 0o755); err != nil {
		return fmt.Errorf("mkdir %s: %w", dbDir, err)
	}

	path := filepath.Join(dbDir, "tartila.db")
	db, err := sql.Open("sqlite", path)
	if err != nil {
		return fmt.Errorf("open db: %w", err)
	}

	if err := db.Ping(); err != nil {
		return fmt.Errorf("ping db: %w", err)
	}

	const schema = `
CREATE TABLE IF NOT EXISTS feedback_prompt (
  user_id                 TEXT PRIMARY KEY,
  last_feedback_prompt_at TEXT,
  has_submitted_feedback  INTEGER NOT NULL DEFAULT 0,
  updated_at              TEXT NOT NULL
);
`
	if _, err := db.Exec(schema); err != nil {
		return fmt.Errorf("create schema: %w", err)
	}

	log.Printf("[DB] SQLite store ready at %s", path)
	Store = db
	return nil
}
