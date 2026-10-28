package hub

import (
	"os"
	"strings"
)

// defaultAllowedOrigins matches the Vite dev server. Production deploys set
// ALLOWED_ORIGINS to their own origin list.
const defaultAllowedOrigins = "http://localhost:5173,http://127.0.0.1:5173"

var allowedOrigins = parseAllowedOrigins(os.Getenv("ALLOWED_ORIGINS"))

func parseAllowedOrigins(raw string) map[string]struct{} {
	if strings.TrimSpace(raw) == "" {
		raw = defaultAllowedOrigins
	}
	out := make(map[string]struct{})
	for _, o := range strings.Split(raw, ",") {
		if o = strings.TrimSpace(o); o != "" {
			out[o] = struct{}{}
		}
	}
	return out
}

// OriginAllowed reports whether an explicit Origin value may talk to this
// server. An empty Origin is a non-browser client that CORS does not cover, so
// it is accepted. Browser origins not in ALLOWED_ORIGINS are refused, which
// also refuses their WebSocket upgrade.
func OriginAllowed(origin string) bool {
	if origin == "" {
		return true
	}
	_, ok := allowedOrigins[origin]
	return ok
}
