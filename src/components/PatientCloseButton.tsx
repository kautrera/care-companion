import { useNavigate } from "react-router-dom";
import { useAppStore } from "../store/useAppStore";
import { useTranslation } from "../i18n";

interface PatientCloseButtonProps {
  className?: string;
}

/**
 * Close button shown in the header of patient screens. Tapping it switches
 * the device back to caretaker mode and returns to the caretaker home.
 * Positioning is handled by the parent.
 */
export function PatientCloseButton({ className }: PatientCloseButtonProps) {
  const navigate = useNavigate();
  const setMode = useAppStore((s) => s.setMode);
  const clearArmed = useAppStore((s) => s.clearArmedQuestion);
  const { t } = useTranslation();

  function close() {
    clearArmed();
    setMode("caretaker");
    navigate("/caretaker", { replace: true });
  }

  return (
    <button
      type="button"
      onClick={close}
      aria-label={t.patient.closeAria}
      className={[
        "flex h-10 w-10 items-center justify-center rounded-full bg-surface/60 text-ink-mute backdrop-blur active:bg-surface-hi",
        className ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
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
