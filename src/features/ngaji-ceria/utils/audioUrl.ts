/**
 * Resolves Tilawati audio URLs.
 * Returns canonical audio path directly (pure pass-through per AUDIO_GUIDELINE.md:87-88).
 * Note: Old localStorage data may contain `/src/assets/audio/...` paths;
 * sanitiseAudioUrl() should be applied before calling new Audio().
 */
export function getAudioUrl(url: string | null | undefined): string | null {
  return url ?? null;
}

/**
 * Sanitizes Tilawati audio URL for playback.
 * Converts legacy `/src/assets/audio/tilawati/...` → `/audio/tilawati/...`.
 */
export function sanitizeAudioUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  // Convert internal asset paths to public URL (for legacy data compatibility)
  if (url.startsWith("/src/assets/audio/tilawati/")) {
    return url.replace(/^\/src\/assets\/audio\/tilawati\//, "/audio/tilawati/");
  }
  return url;
}

/** Hook version maintaining compatibility with callers. */
export function useAudioUrl(url: string | null | undefined): string | null {
  return getAudioUrl(url);
}
