import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAppStore } from "../store/useAppStore";

interface LockGuardProps {
  children: ReactNode;
}

/**
 * Wraps caretaker-only routes. If the device is currently in patient mode,
 * redirect to the patient view. The mode is toggled back to "caretaker" by
 * long-pressing the lock handle in patient screens.
 */
export function LockGuard({ children }: LockGuardProps) {
  const mode = useAppStore((s) => s.mode);
  if (mode !== "caretaker") {
    return <Navigate to="/patient" replace />;
  }
  return <>{children}</>;
}
