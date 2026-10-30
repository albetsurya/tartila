import { useRegisterSW } from "virtual:pwa-register/react";

/**
 * PWA update prompt state.
 *
 * Wraps `useRegisterSW` so App.tsx consumes a single boolean prop and a
 * `dismiss` callback instead of the raw `[boolean, Dispatch]` tuple.
 *
 * Works with `vite.config.ts` `registerType: 'prompt'` + `skipWaiting: false`:
 * when a new service worker is waiting, `needRefresh` flips to `true` and the
 * UI can call `updateServiceWorker(true)` to activate it on user confirm.
 */
export function usePWAUpdate() {
  const { needRefresh, updateServiceWorker } = useRegisterSW();
  return {
    needRefresh: needRefresh[0],
    updateServiceWorker,
    dismiss: () => needRefresh[1](false),
  };
}
