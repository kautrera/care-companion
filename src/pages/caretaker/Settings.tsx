import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { usePatient } from "../../hooks/usePatient";
import { useNeeds } from "../../hooks/useNeeds";
import { Drawing } from "../../drawings";
import { supabase } from "../../lib/supabase";

export function Settings() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { patient, refresh: refreshPatient } = usePatient(user?.id);
  const { needs, refresh: refreshNeeds } = useNeeds(patient?.id);

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
    setInfo("Name saved");
    await refreshPatient();
  }, [patient, name, refreshPatient]);

  const toggleNeed = useCallback(
    async (needId: string, enabled: boolean) => {
      const { error: err } = await supabase
        .from("needs")
        .update({ enabled })
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
      const ordered = [...needs].sort((a, b) => a.sort_order - b.sort_order);
      const idx = ordered.findIndex((n) => n.id === needId);
      const swapWith = ordered[idx + direction];
      if (idx < 0 || !swapWith) return;
      const a = ordered[idx];
      const aOrder = a.sort_order;
      const bOrder = swapWith.sort_order;
      const updates = [
        supabase.from("needs").update({ sort_order: bOrder }).eq("id", a.id),
        supabase
          .from("needs")
          .update({ sort_order: aOrder })
          .eq("id", swapWith.id),
      ];
      const results = await Promise.all(updates);
      const firstErr = results.find((r) => r.error)?.error;
      if (firstErr) {
        setError(firstErr.message);
        return;
      }
      await refreshNeeds();
    },
    [needs, refreshNeeds]
  );

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    navigate("/login", { replace: true });
  }, [navigate]);

  const sortedNeeds = [...needs].sort((a, b) => a.sort_order - b.sort_order);

  return (
    <div className="flex h-[100dvh] w-full flex-col bg-bg">
      <header className="flex items-center gap-3 px-5 pt-[max(1rem,env(safe-area-inset-top))] pb-3">
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="Back"
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
        <h1 className="text-xl font-semibold tracking-tight">Settings</h1>
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
            Patient
          </h2>
          <div className="flex flex-col gap-2 rounded-2xl bg-surface p-4 ring-1 ring-line/30">
            <label className="flex flex-col gap-2 text-sm">
              <span className="text-ink-mute">Name</span>
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
              {savingName ? "Saving…" : "Save"}
            </button>
          </div>
        </section>

        <section className="mb-6">
          <h2 className="mb-2 text-sm uppercase tracking-wider text-ink-mute">
            Needs
          </h2>
          <ul className="flex flex-col gap-2">
            {sortedNeeds.map((need, i) => (
              <li
                key={need.id}
                className="flex items-center gap-3 rounded-2xl bg-surface px-3 py-2 ring-1 ring-line/30"
              >
                <Drawing slug={need.slug} className="h-9 w-9 text-ink" />
                <span className="flex-1 truncate font-semibold">
                  {need.label}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => moveNeed(need.id, -1)}
                    disabled={i === 0}
                    aria-label="Move up"
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-hi text-ink-mute disabled:opacity-30"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => moveNeed(need.id, 1)}
                    disabled={i === sortedNeeds.length - 1}
                    aria-label="Move down"
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-hi text-ink-mute disabled:opacity-30"
                  >
                    ↓
                  </button>
                  <label className="ml-1 flex h-8 cursor-pointer items-center">
                    <input
                      type="checkbox"
                      checked={need.enabled}
                      onChange={(e) => toggleNeed(need.id, e.target.checked)}
                      className="peer sr-only"
                    />
                    <span className="relative h-6 w-11 rounded-full bg-surface-hi transition-colors peer-checked:bg-accent">
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
            Account
          </h2>
          <div className="flex flex-col gap-2 rounded-2xl bg-surface p-4 ring-1 ring-line/30">
            <p className="truncate text-sm text-ink-mute">
              Signed in as {user?.email ?? "—"}
            </p>
            <button
              type="button"
              onClick={signOut}
              className="self-start rounded-xl bg-no px-4 py-2 text-sm font-semibold text-white active:bg-no-hi"
            >
              Sign out
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
