import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Screen } from "../components/Screen";
import { supabase } from "../lib/supabase";
import { DEFAULT_NEEDS, NEED_LABELS, DEFAULT_ENABLED } from "../lib/types";
import { useAuth } from "../hooks/useAuth";
import { useAppStore } from "../store/useAppStore";

export function Setup() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const setMode = useAppStore((s) => s.setMode);

  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = useCallback(async () => {
    if (!user) {
      setError("You're not signed in.");
      return;
    }
    if (name.trim().length < 1) return;
    setError(null);
    setSubmitting(true);

    // pin_hash / pin_salt remain in the schema as NOT NULL but unused. We
    // store empty strings so existing rows continue to work.
    const { data: patient, error: pErr } = await supabase
      .from("patients")
      .insert({
        caretaker_user_id: user.id,
        name: name.trim(),
        pin_hash: "",
        pin_salt: "",
      })
      .select("*")
      .single();

    if (pErr || !patient) {
      setSubmitting(false);
      setError(pErr?.message ?? "Could not save patient");
      return;
    }

    const needRows = DEFAULT_NEEDS.map((slug, idx) => ({
      patient_id: patient.id,
      slug,
      label: NEED_LABELS[slug],
      enabled: DEFAULT_ENABLED.includes(slug),
      sort_order: idx,
    }));

    const { error: nErr } = await supabase.from("needs").insert(needRows);
    setSubmitting(false);
    if (nErr) {
      setError(nErr.message);
      return;
    }

    setMode("caretaker");
    navigate("/caretaker", { replace: true });
  }, [user, name, navigate, setMode]);

  return (
    <Screen title="Set up">
      <div className="flex flex-1 flex-col gap-6 py-4">
        <p className="text-ink-mute">
          What is the patient's name? This appears at the top of the
          caretaker view.
        </p>
        <input
          type="text"
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Grandma Rose"
          className="rounded-2xl bg-surface px-4 py-4 text-lg outline-none focus:ring-2 focus:ring-accent"
        />
        {error && (
          <p className="rounded-xl bg-no/15 px-4 py-3 text-sm text-no-hi">
            {error}
          </p>
        )}
        <button
          type="button"
          disabled={submitting || name.trim().length < 1}
          onClick={onSubmit}
          className="mt-auto rounded-2xl bg-accent px-4 py-4 text-lg font-semibold text-bg disabled:opacity-50"
        >
          {submitting ? "Saving…" : "Continue"}
        </button>
      </div>
    </Screen>
  );
}
