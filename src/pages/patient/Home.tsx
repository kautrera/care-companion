import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { usePatient } from "../../hooks/usePatient";
import { useNeeds } from "../../hooks/useNeeds";
import { Drawing } from "../../drawings";
import { PatientCloseButton } from "../../components/PatientCloseButton";
import { useAppStore } from "../../store/useAppStore";
import { type NeedSlug } from "../../lib/types";
import { useTranslation } from "../../i18n";

export function PatientHome() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { patient } = usePatient(user?.id);
  const { needs, loading } = useNeeds(patient?.id);
  const armedQuestion = useAppStore((s) => s.armedQuestion);
  const { t } = useTranslation();

  useEffect(() => {
    if (armedQuestion) {
      navigate(`/patient/question/${armedQuestion}`, { replace: true });
    }
  }, [armedQuestion, navigate]);

  function onSelect(slug: NeedSlug) {
    navigate(`/patient/need/${slug}`);
  }

  const enabledNeeds = needs.filter((n) => n.enabled_patient);

  return (
    <div className="flex h-[100dvh] w-full flex-col bg-bg">
      <header className="flex items-center justify-between gap-3 px-3 pb-2 pt-[max(0.75rem,env(safe-area-inset-top))]">
        <h1 className="min-w-0 flex-1 truncate text-sm font-medium tracking-wide text-ink-mute">
          {t.patient.homeHint}
        </h1>
        <PatientCloseButton />
      </header>
      <div className="min-h-0 flex-1 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        {loading ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-ink-mute">{t.loading}</p>
          </div>
        ) : (
          <div className="grid h-full w-full auto-rows-fr grid-cols-2 gap-2">
            {enabledNeeds.map((need) => (
              <button
                key={need.id}
                type="button"
                onClick={() => onSelect(need.slug)}
                aria-label={t.needs[need.slug]}
                className="flex h-full w-full items-center justify-center overflow-hidden rounded-3xl bg-surface text-ink shadow-lg shadow-black/20 ring-1 ring-line/30 transition-transform active:scale-[0.97] active:bg-surface-hi"
              >
                <Drawing slug={need.slug} className="h-full w-full" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
