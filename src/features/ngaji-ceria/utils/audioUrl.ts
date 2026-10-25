/**
 * Resolves Tilawati audio URLs. Returns canonical audio path directly.
 */
export function getAudioUrl(url: string | null | undefined): string | null {
  return url ?? null;
}

/** Hook version maintaining compatibility with callers. */
export function useAudioUrl(url: string | null | undefined): string | null {
  return getAudioUrl(url);
}
