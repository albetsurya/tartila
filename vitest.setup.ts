// Vitest setup: mock localStorage for Node.js test environment
// (required by zustand persist middleware)
const localStorageMock = {
  store: new Map(),
  getItem: (key: string) => localStorageMock.store.get(key) ?? null,
  setItem: (key: string, val: string) => localStorageMock.store.set(key, val),
  removeItem: (key: string) => localStorageMock.store.delete(key),
  clear: () => localStorageMock.store.clear(),
};

(globalThis as Record<string, unknown>).localStorage = localStorageMock;
