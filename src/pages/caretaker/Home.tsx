import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { usePatient } from "../../hooks/usePatient";
import { sortNeedsForDisplay, useNeeds } from "../../hooks/useNeeds";
import { useInteractions } from "../../hooks/useInteractions";
import { NeedTile } from "../../components/NeedTile";
import { Drawing } from "../../drawings";
import { useAppStore } from "../../store/useAppStore";
import { type NeedSlug } from "../../lib/types";
import { formatRelative } from "../../lib/time";
import { primeAudio } from "../../lib/audio";
import { useTranslation } from "../../i18n";

export function CaretakerHome() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { patient } = usePatient(user?.id);
  const { needs } = useNeeds(patient?.id);
  const { interactions } = useInteractions(patient?.id);
  const armQuestion = useAppStore((s) => s.armQuestion);
  const setMode = useAppStore((s) => s.setMode);
  const lastAnswer = useAppStore((s) => s.lastAnswer);
  const clearLastAnswer = useAppStore((s) => s.clearLastAnswer);
  const { t, locale } = useTranslation();

  const [query, setQuery] = useState("");

  const visibleNeeds = useMemo(() => {
    const enabled = needs.filter((n) => n.enabled_caretaker);
    const sorted = sortNeedsForDisplay(enabled, t.needs, locale);
    if (!query.trim()) return sorted;
    const q = query.trim().toLowerCase();
    return sorted.filter(
      (n) =>
        t.needs[n.slug].toLowerCase().includes(q) ||
        n.slug.toLowerCase().includes(q) ||
        t.needQuestions[n.slug].toLowerCase().includes(q)
    );
  }, [needs, query, t, locale]);

  const recent = interactions.slice(0, 3);

  function onAsk(slug: NeedSlug) {
    // Unlock SpeechSynthesis/Audio inside the user gesture so the question
    // screen's auto-speak works on iOS Safari.
    primeAudio();
    armQuestion(slug);
    navigate(`/patient/question/${slug}`);
  }

  function handToPatient() {
    setMode("patient");
    navigate("/patient");
  }

  return (
    <div className="flex h-[100dvh] w-full flex-col bg-bg">
      <header className="flex items-center gap-3 px-5 pt-[max(1rem,env(safe-area-inset-top))] pb-3">
        <div className="flex-1 min-w-0">
          <p className="text-xs uppercase tracking-wider text-ink-mute">
            {t.caretaker.caringFor}
          </p>
          <h1 className="truncate text-xl font-semibold tracking-tight">
            {patient?.name ?? "—"}
          </h1>
        </div>
        <button
          type="button"
          onClick={() => navigate("/caretaker/settings")}
          aria-label={t.caretaker.settingsAria}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-surface text-ink-mute active:bg-surface-hi"
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
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9c.36.16.67.42.91.74a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </button>
      </header>

      <div className="px-5 pb-3">
        <label className="flex items-center gap-3 rounded-2xl bg-surface px-4 py-3 ring-1 ring-line/30 focus-within:ring-2 focus-within:ring-accent">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5 text-ink-mute"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="search"
            placeholder={t.caretaker.search}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-base text-ink placeholder:text-ink-mute/70 outline-none"
          />
        </label>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto px-5">
        {lastAnswer && (
          <button
            type="button"
            onClick={clearLastAnswer}
            className={[
              "mb-3 flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left",
              lastAnswer.response === "yes"
                ? "bg-yes/15 text-yes-hi"
                : "bg-no/15 text-no-hi",
            ].join(" ")}
            aria-label={t.caretaker.tapToDismiss}
          >
            <Drawing slug={lastAnswer.slug} className="h-10 w-10" />
            <div className="flex-1 min-w-0">
              <p className="text-sm uppercase tracking-wider opacity-80">
                {t.caretaker.patientAnswered}
              </p>
              <p className="truncate font-semibold">
                {lastAnswer.response === "yes" ? t.patient.yes : t.patient.no}{" "}
                — {t.needQuestions[lastAnswer.slug]}
              </p>
            </div>
            <span className="text-xs opacity-70">
              {t.caretaker.tapToDismiss}
            </span>
          </button>
        )}

        <h2 className="mb-3 text-lg font-semibold tracking-tight">
          {t.caretaker.askThePatient}
        </h2>
        <div className="grid grid-cols-2 gap-3 pb-3">
          {visibleNeeds.map((need) => (
            <NeedTile
              key={need.id}
              slug={need.slug}
              label={t.needs[need.slug]}
              onSelect={onAsk}
              size="md"
            />
          ))}
          {visibleNeeds.length === 0 && (
            <p className="col-span-2 py-8 text-center text-ink-mute">
              {t.caretaker.noResults.replace("{query}", query)}
            </p>
          )}
        </div>

        {recent.length > 0 && (
          <div className="pb-3">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-lg font-semibold tracking-tight">
                {t.caretaker.recentActivity}
              </h2>
              <button
                type="button"
                onClick={() => navigate("/caretaker/history")}
                className="text-sm text-accent underline-offset-4 hover:underline"
              >
                {t.caretaker.seeAll}
              </button>
            </div>
            <ul className="flex flex-col gap-2">
              {recent.map((row) => (
                <li
                  key={row.id}
                  className="flex items-center gap-3 rounded-2xl bg-surface px-3 py-2 ring-1 ring-line/30"
                >
                  <Drawing slug={row.need_slug} className="h-9 w-9" />
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-semibold">
                      {row.kind === "patient_request"
                        ? t.caretaker.askedFor
                        : t.caretaker.answered}
                      {row.kind === "caretaker_question" && row.response
                        ? `${
                            row.response === "yes"
                              ? t.patient.yes
                              : t.patient.no
                          }: `
                        : ""}
                      {t.needs[row.need_slug].toLowerCase()}
                    </p>
                    <p className="text-xs text-ink-mute">
                      {formatRelative(row.created_at, t, undefined, locale)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <footer className="grid grid-cols-2 gap-3 px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3">
        <button
          type="button"
          onClick={() => navigate("/caretaker/history")}
          className="flex items-center justify-center gap-2 rounded-2xl bg-surface px-4 py-4 text-base font-semibold text-ink active:bg-surface-hi"
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
            <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
            <path d="M3 3v5h5" />
            <path d="M12 7v5l3 2" />
          </svg>
          {t.caretaker.history}
        </button>
        <button
          type="button"
          onClick={handToPatient}
          className="flex items-center justify-center gap-2 rounded-2xl bg-accent px-4 py-4 text-base font-semibold text-bg active:opacity-90"
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
            <path d="M17 8l4 4-4 4" />
            <path d="M3 12h18" />
          </svg>
          {t.caretaker.handToPatient}
        </button>
      </footer>
    </div>
  );
}
