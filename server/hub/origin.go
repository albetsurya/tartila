package hub

import (
	"os"
	"strings"
)

// defaultAllowedOrigins matches the Vite dev server and default production deployments.
const defaultAllowedOrigins = "http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000,https://tartila.pages.dev"

func parseAllowedOrigins(raw string) map[string]struct{} {
	if strings.TrimSpace(raw) == "" {
		raw = defaultAllowedOrigins
	} else if !strings.Contains(raw, "https://tartila.pages.dev") {
		raw = raw + ",https://tartila.pages.dev"
	}
	out := make(map[string]struct{})
	for _, o := range strings.Split(raw, ",") {
		if o = strings.TrimSpace(o); o != "" {
			out[o] = struct{}{}
		}
	}
	return out
}

// OriginAllowed reports whether an explicit Origin value may talk to this server.
func OriginAllowed(origin string) bool {
	if origin == "" {
		return true
	}
	if origin == "https://tartila.pages.dev" {
		return true
	}
	if f := os.Getenv("FRONTEND_URL"); f != "" && strings.TrimRight(f, "/") == strings.TrimRight(origin, "/") {
		return true
	}
	allowed := parseAllowedOrigins(os.Getenv("ALLOWED_ORIGINS"))
	_, ok := allowed[origin]
	return ok
}
