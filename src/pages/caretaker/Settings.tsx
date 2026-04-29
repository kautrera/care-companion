import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { usePatient } from "../../hooks/usePatient";
import { sortNeedsForDisplay, useNeeds } from "../../hooks/useNeeds";
import { Drawing } from "../../drawings";
import { supabase } from "../../lib/supabase";
import { useAppStore } from "../../store/useAppStore";
import { LANGS, useTranslation, type Lang } from "../../i18n";

export function Settings() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { patient, refresh: refreshPatient } = usePatient(user?.id);
  const { needs, refresh: refreshNeeds } = useNeeds(patient?.id);
  const { t, lang, locale } = useTranslation();
  const setLanguage = useAppStore((s) => s.setLanguage);

  const [name, setName] = useState(patient?.name ?? "");
  const [savingName, setSavingName] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  useEffect(() => {
    if (patient) setName(patient.name);
  }, [patient]);

  const saveName = useCallback(async () => {
    if (!patient) return;
    if (name.trim().length < 1) return;
    setSavingName(true);
    setError(null);
    const { error: err } = await supabase
      .from("patients")
      .update({ name: name.trim() })
      .eq("id", patient.id);
    setSavingName(false);
    if (err) {
      setError(err.message);
      return;
    }
    setInfo(t.settings.nameSaved);
    await refreshPatient();
  }, [patient, name, refreshPatient, t]);

  const toggleNeed = useCallback(
    async (
      needId: string,
      column: "enabled_patient" | "enabled_caretaker",
      enabled: boolean
    ) => {
      const { error: err } = await supabase
        .from("needs")
        .update({ [column]: enabled })
        .eq("id", needId);
      if (err) {
        setError(err.message);
        return;
      }
      await refreshNeeds();
    },
    [refreshNeeds]
  );

  const moveNeed = useCallback(
    async (needId: string, direction: -1 | 1) => {
      const ordered = sortNeedsForDisplay(needs, t.needs, locale);
      const idx = ordered.findIndex((n) => n.id === needId);
      const newIdx = idx + direction;
      if (idx < 0 || newIdx < 0 || newIdx >= ordered.length) return;

      // Move the target into its new position then rewrite every row's
      // sort_order so the new order persists. After this point the patient's
      // grid is in "manual order" mode (every row has an explicit index)
      // and stays that way until reset.
      const next = [...ordered];
      const [moved] = next.splice(idx, 1);
      next.splice(newIdx, 0, moved);

      const results = await Promise.all(
        next.map((n, i) =>
          supabase
            .from("needs")
            .update({ sort_order: i })
            .eq("id", n.id)
        )
      );
      const firstErr = results.find((r) => r.error)?.error;
      if (firstErr) {
        setError(firstErr.message);
        return;
      }
      await refreshNeeds();
    },
    [needs, t, locale, refreshNeeds]
  );

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    navigate("/login", { replace: true });
  }, [navigate]);

  const sortedNeeds = sortNeedsForDisplay(needs, t.needs, locale);

  return (
    <div className="flex h-[100dvh] w-full flex-col bg-bg">
      <header className="flex items-center gap-3 px-5 pt-[max(1rem,env(safe-area-inset-top))] pb-3">
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label={t.settings.backAria}
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
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>
        <h1 className="text-xl font-semibold tracking-tight">
          {t.settings.title}
        </h1>
      </header>

      <div className="flex-1 min-h-0 overflow-y-auto px-5 pb-[max(1rem,env(safe-area-inset-bottom))]">
        {error && (
          <p className="mb-3 rounded-xl bg-no/15 px-4 py-3 text-sm text-no-hi">
            {error}
          </p>
        )}
        {info && (
          <p className="mb-3 rounded-xl bg-yes/15 px-4 py-3 text-sm text-yes-hi">
            {info}
          </p>
        )}

        <section className="mb-6">
          <h2 className="mb-2 text-sm uppercase tracking-wider text-ink-mute">
            {t.settings.patient}
          </h2>
          <div className="flex flex-col gap-2 rounded-2xl bg-surface p-4 ring-1 ring-line/30">
            <label className="flex flex-col gap-2 text-sm">
              <span className="text-ink-mute">{t.settings.name}</span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="rounded-xl bg-surface-hi px-3 py-3 text-base text-ink outline-none focus:ring-2 focus:ring-accent"
              />
            </label>
            <button
              type="button"
              onClick={saveName}
              disabled={
                savingName ||
                name.trim() === (patient?.name ?? "") ||
                name.trim().length < 1
              }
              className="self-end rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-bg disabled:opacity-50"
            >
              {savingName ? t.settings.saving : t.settings.save}
            </button>
          </div>
        </section>

        <section className="mb-6">
          <h2 className="mb-2 text-sm uppercase tracking-wider text-ink-mute">
            {t.settings.language}
          </h2>
          <div className="flex flex-col gap-2 rounded-2xl bg-surface p-2 ring-1 ring-line/30">
            {LANGS.map((l) => (
              <button
                key={l.code}
                type="button"
                onClick={() => setLanguage(l.code as Lang)}
                className={[
                  "flex items-center justify-between rounded-xl px-3 py-3 text-base font-medium",
                  lang === l.code
                    ? "bg-accent text-bg"
                    : "bg-transparent text-ink active:bg-surface-hi",
                ].join(" ")}
              >
                <span>{l.label}</span>
                {lang === l.code && (
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M5 12l5 5L20 7" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </section>

        <section className="mb-6">
          <h2 className="mb-2 text-sm uppercase tracking-wider text-ink-mute">
            {t.settings.needs}
          </h2>
          <ul className="flex flex-col gap-2">
            {sortedNeeds.map((need, i) => (
              <li
                key={need.id}
                className="flex flex-col gap-3 rounded-2xl bg-surface p-3 ring-1 ring-line/30"
              >
                <div className="flex items-center gap-3">
                  <Drawing slug={need.slug} className="h-10 w-10" />
                  <span className="flex-1 truncate text-base font-semibold">
                    {t.needs[need.slug]}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => moveNeed(need.id, -1)}
                      disabled={i === 0}
                      aria-label={t.settings.moveUp}
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-hi text-ink-mute disabled:opacity-30"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={() => moveNeed(need.id, 1)}
                      disabled={i === sortedNeeds.length - 1}
                      aria-label={t.settings.moveDown}
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-hi text-ink-mute disabled:opacity-30"
                    >
                      ↓
                    </button>
                  </div>
                </div>
                <div className="flex flex-col gap-2 pl-1">
                  <label className="flex items-center justify-between gap-3">
                    <span className="text-sm text-ink-mute">
                      {t.settings.showInPatient}
                    </span>
                    <input
                      type="checkbox"
                      checked={need.enabled_patient}
                      onChange={(e) =>
                        toggleNeed(need.id, "enabled_patient", e.target.checked)
                      }
                      className="peer sr-only"
                    />
                    <span className="relative h-6 w-11 shrink-0 rounded-full bg-surface-hi transition-colors peer-checked:bg-accent">
                      <span className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-ink transition-transform peer-checked:translate-x-5" />
                    </span>
                  </label>
                  <label className="flex items-center justify-between gap-3">
                    <span className="text-sm text-ink-mute">
                      {t.settings.showInCaretaker}
                    </span>
                    <input
                      type="checkbox"
                      checked={need.enabled_caretaker}
                      onChange={(e) =>
                        toggleNeed(
                          need.id,
                          "enabled_caretaker",
                          e.target.checked
                        )
                      }
                      className="peer sr-only"
                    />
                    <span className="relative h-6 w-11 shrink-0 rounded-full bg-surface-hi transition-colors peer-checked:bg-accent">
                      <span className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-ink transition-transform peer-checked:translate-x-5" />
                    </span>
                  </label>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="mb-2 text-sm uppercase tracking-wider text-ink-mute">
            {t.settings.account}
          </h2>
          <div className="flex flex-col gap-2 rounded-2xl bg-surface p-4 ring-1 ring-line/30">
            <p className="truncate text-sm text-ink-mute">
              {t.settings.signedInAs} {user?.email ?? "—"}
            </p>
            <button
              type="button"
              onClick={signOut}
              className="self-start rounded-xl bg-no px-4 py-2 text-sm font-semibold text-white active:bg-no-hi"
            >
              {t.settings.signOut}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
