/**
 * Shared PWA install prompt singleton.
 * Both PwaInstallBanner and profile page install menu use this
 * so they share the same deferred beforeinstallprompt event.
 */

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

type Listener = (visible: boolean) => void;

let deferredPrompt: BeforeInstallPromptEvent | null = null;
const listeners = new Set<Listener>();
const DISMISSED_KEY = "tartila_pwa_dismissed";

let initialized = false;

export function getInstallPrompt(): BeforeInstallPromptEvent | null {
  return deferredPrompt;
}

export function triggerInstall(): void {
  if (!deferredPrompt) return;
  void deferredPrompt.prompt();
  void deferredPrompt.userChoice.then(() => {
    deferredPrompt = null;
    notify(false);
  });
}

export function dismissBanner(): void {
  try {
    localStorage.setItem(DISMISSED_KEY, "true");
  } catch {
    // ignore
  }
  notify(false);
}

function notify(visible: boolean) {
  listeners.forEach((l) => l(visible));
}

export function subscribePwaInstall(listener: Listener): () => void {
  ensureListener();
  listeners.add(listener);
  // immediately inform of current state (if not dismissed)
  const dismissed = localStorage.getItem(DISMISSED_KEY) === "true";
  listener(!dismissed && deferredPrompt !== null);
  return () => {
    listeners.delete(listener);
  };
}

function ensureListener() {
  if (initialized) return;
  initialized = true;

  if (localStorage.getItem(DISMISSED_KEY) === "true") return;

  window.addEventListener("beforeinstallprompt", (e) => {
    const promptEvent = e as BeforeInstallPromptEvent;
    promptEvent.preventDefault();
    deferredPrompt = promptEvent;
    notify(true);
  });
}

// Start listening as soon as module loads (SSR-safe)
if (typeof window !== "undefined") {
  ensureListener();
}
