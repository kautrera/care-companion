import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Screen } from "../components/Screen";
import { supabase } from "../lib/supabase";
import {
  DEFAULT_NEEDS,
  NEED_LABELS,
  DEFAULT_ENABLED_PATIENT,
  DEFAULT_ENABLED_CARETAKER,
} from "../lib/types";
import { useAuth } from "../hooks/useAuth";
import { useAppStore } from "../store/useAppStore";
import { useTranslation } from "../i18n";

export function Setup() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const setMode = useAppStore((s) => s.setMode);
  const { t } = useTranslation();

  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = useCallback(async () => {
    if (!user) {
      setError(t.setup.notSignedIn);
      return;
    }
    if (name.trim().length < 1) return;
    setError(null);
    setSubmitting(true);

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
      setError(pErr?.message ?? t.setup.couldNotSavePatient);
      return;
    }

    // sort_order seeds at 0 — render is alphabetical by localized label by
    // default, and Settings reorder rewrites every sort_order if the
    // caretaker chooses a manual order.
    const needRows = DEFAULT_NEEDS.map((slug) => ({
      patient_id: patient.id,
      slug,
      label: NEED_LABELS[slug],
      enabled_patient: DEFAULT_ENABLED_PATIENT.includes(slug),
      enabled_caretaker: DEFAULT_ENABLED_CARETAKER.includes(slug),
      sort_order: 0,
    }));

    const { error: nErr } = await supabase.from("needs").insert(needRows);
    setSubmitting(false);
    if (nErr) {
      setError(nErr.message);
      return;
    }

    setMode("caretaker");
    navigate("/caretaker", { replace: true });
  }, [user, name, navigate, setMode, t]);

  return (
    <Screen title={t.setup.title}>
      <div className="flex flex-1 flex-col gap-6 py-4">
        <p className="text-ink-mute">{t.setup.prompt}</p>
        <input
          type="text"
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t.setup.placeholder}
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
          {submitting ? t.setup.saving : t.setup.continue}
        </button>
      </div>
    </Screen>
  );
}
