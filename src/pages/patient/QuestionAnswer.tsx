import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { usePatient } from "../../hooks/usePatient";
import { useInteractions } from "../../hooks/useInteractions";
import { Drawing } from "../../drawings";
import { YesNoButtons } from "../../components/YesNoButtons";
import {
  playYesChime,
  playNoChime,
  vibrateShort,
  vibrateLong,
} from "../../lib/audio";
import { NEED_QUESTIONS, type NeedSlug } from "../../lib/types";
import { useAppStore } from "../../store/useAppStore";

export function QuestionAnswer() {
  const { slug } = useParams<{ slug: NeedSlug }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { patient } = usePatient(user?.id);
  const { log } = useInteractions(patient?.id);
  const setLastAnswer = useAppStore((s) => s.setLastAnswer);
  const clearArmed = useAppStore((s) => s.clearArmedQuestion);
  const setMode = useAppStore((s) => s.setMode);

  const [submitting, setSubmitting] = useState(false);
  const [answered, setAnswered] = useState<"yes" | "no" | null>(null);

  useEffect(() => {
    if (!slug) navigate("/patient", { replace: true });
  }, [slug, navigate]);

  const respond = useCallback(
    async (response: "yes" | "no") => {
      if (!slug || !patient || submitting) return;
      setSubmitting(true);
      await log("caretaker_question", slug as NeedSlug, response);
      if (response === "yes") {
        playYesChime();
        vibrateShort();
      } else {
        playNoChime();
        vibrateLong();
      }
      setLastAnswer(slug as NeedSlug, response);
      clearArmed();
      setAnswered(response);
      // Auto-return to caretaker mode so they can read the answer.
      // The caretaker initiated the question, so this is intentional.
      window.setTimeout(() => {
        setMode("caretaker");
        navigate("/caretaker", { replace: true });
      }, 1500);
    },
    [slug, patient, submitting, log, setLastAnswer, clearArmed, setMode, navigate]
  );

  const cancel = useCallback(() => {
    if (submitting) return;
    clearArmed();
    setMode("caretaker");
    navigate("/caretaker", { replace: true });
  }, [submitting, clearArmed, setMode, navigate]);

  if (!slug) return null;

  const question = NEED_QUESTIONS[slug as NeedSlug];

  return (
    <div className="relative flex h-[100dvh] w-full flex-col bg-bg">
      <button
        type="button"
        onClick={cancel}
        disabled={submitting || answered !== null}
        aria-label="Back to caretaker"
        className="absolute left-3 top-[max(0.75rem,env(safe-area-inset-top))] z-10 flex h-10 items-center gap-2 rounded-full bg-surface/60 pl-2 pr-4 text-ink-mute backdrop-blur active:bg-surface-hi disabled:opacity-40"
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
          <path d="m15 18-6-6 6-6" />
        </svg>
        <span className="text-sm font-medium">Back</span>
      </button>
      <div className="flex h-[66.66%] flex-col items-center justify-center px-6 pt-[max(3rem,env(safe-area-inset-top))]">
        <Drawing slug={slug as NeedSlug} className="h-56 w-56 text-ink" />
        <p className="mt-6 text-center text-3xl font-semibold tracking-tight">
          {question}
        </p>
      </div>
      <div className="flex flex-1 flex-col justify-end px-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        {answered === null ? (
          <YesNoButtons
            onYes={() => respond("yes")}
            onNo={() => respond("no")}
            disabled={submitting}
            withThumbs
          />
        ) : (
          <div
            className={[
              "flex h-32 items-center justify-center rounded-3xl text-3xl font-bold text-white",
              answered === "yes" ? "bg-yes" : "bg-no",
            ].join(" ")}
          >
            {answered === "yes" ? "Yes" : "No"}
          </div>
        )}
      </div>
    </div>
  );
}
