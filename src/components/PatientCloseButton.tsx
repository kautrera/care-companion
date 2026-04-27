import { useNavigate } from "react-router-dom";
import { useAppStore } from "../store/useAppStore";

interface PatientCloseButtonProps {
  /** Where the close button sits relative to the safe area. */
  position?: "right" | "left";
}

/**
 * A close button shown in the corner of patient screens. Tapping it
 * switches the device back to caretaker mode and returns to the
 * caretaker home.
 */
export function PatientCloseButton({
  position = "right",
}: PatientCloseButtonProps) {
  const navigate = useNavigate();
  const setMode = useAppStore((s) => s.setMode);
  const clearArmed = useAppStore((s) => s.clearArmedQuestion);

  function close() {
    clearArmed();
    setMode("caretaker");
    navigate("/caretaker", { replace: true });
  }

  return (
    <button
      type="button"
      onClick={close}
      aria-label="Close patient mode"
      className={[
        "absolute top-[max(0.75rem,env(safe-area-inset-top))] z-10 flex h-10 w-10 items-center justify-center rounded-full bg-surface/60 text-ink-mute backdrop-blur active:bg-surface-hi",
        position === "right" ? "right-3" : "left-3",
      ].join(" ")}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5"
      >
        <path d="M18 6 6 18" />
        <path d="m6 6 12 12" />
      </svg>
    </button>
  );
}
