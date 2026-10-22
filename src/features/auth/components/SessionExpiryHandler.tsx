import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { setUnauthorizedHandler } from "@/services/api";

/**
 * Mounted inside `<BrowserRouter>`. Registers the global 401/403 handler so any
 * API call that reports an expired/invalid session logs the user out and
 * redirects to `/login`. Renders nothing.
 */
export function SessionExpiryHandler() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const logoutRef = useRef(logout);
  const navigateRef = useRef(navigate);

  useEffect(() => {
    logoutRef.current = logout;
    navigateRef.current = navigate;
  });

  useEffect(() => {
    setUnauthorizedHandler(() => {
      void logoutRef.current().finally(() => {
        navigateRef.current("/login", { replace: true });
      });
    });
    return () => setUnauthorizedHandler(null);
  }, []);

  return null;
}
