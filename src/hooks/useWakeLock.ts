import { useEffect } from "react";

interface MinimalWakeLockSentinel {
  release: () => Promise<void>;
}

interface NavigatorWithWakeLock {
  wakeLock?: {
    request: (type: "screen") => Promise<MinimalWakeLockSentinel>;
  };
}

/**
 * Holds a screen wake lock as long as the component is mounted and `active`
 * is true. Lock is automatically released on unmount or when the document
 * is hidden, then re-acquired when visible again.
 */
export function useWakeLock(active: boolean) {
  useEffect(() => {
    if (!active) return;
    if (typeof navigator === "undefined") return;
    const nav = navigator as unknown as NavigatorWithWakeLock;
    if (!nav.wakeLock) return;

    let sentinel: MinimalWakeLockSentinel | null = null;
    let cancelled = false;

    async function acquire() {
      try {
        const lock = await nav.wakeLock!.request("screen");
        if (cancelled) {
          await lock.release().catch(() => undefined);
          return;
        }
        sentinel = lock;
      } catch {
        // permission denied or unavailable — silently ignore
      }
    }

    function onVisibility() {
      if (document.visibilityState === "visible") {
        void acquire();
      }
    }

    void acquire();
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelled = true;
      document.removeEventListener("visibilitychange", onVisibility);
      sentinel?.release().catch(() => undefined);
      sentinel = null;
    };
  }, [active]);
}
