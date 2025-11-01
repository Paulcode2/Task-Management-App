// Lightweight debounced localStorage writer and safe JSON helpers.
export function safeParse<T>(value: string | null, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch (e) {
    console.warn("safeParse failed", e);
    return fallback;
  }
}

export function readFromLocalStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    return safeParse<T>(localStorage.getItem(key), fallback);
  } catch (e) {
    console.warn("readFromLocalStorage", e);
    return fallback;
  }
}

/**
 * Debounced writer for localStorage. Returns a function to schedule saving an object.
 * It keeps a single timeout per key so rapid updates result in a single write.
 */
export function createDebouncedWriter(key: string, wait = 250) {
  let timeout: number | undefined;
  return function save<T>(value: T) {
    if (typeof window === "undefined") return;
    try {
      if (timeout) window.clearTimeout(timeout as any);
      timeout = window.setTimeout(() => {
        try {
          localStorage.setItem(key, JSON.stringify(value));
        } catch (err) {
          console.error("Failed to write localStorage", err);
        }
      }, wait);
    } catch (err) {
      console.error("createDebouncedWriter save error", err);
    }
  };
}
