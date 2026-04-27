import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { usePatient } from "../../hooks/usePatient";
import { useNeeds } from "../../hooks/useNeeds";
import { NeedTile } from "../../components/NeedTile";
import { PatientCloseButton } from "../../components/PatientCloseButton";
import { useAppStore } from "../../store/useAppStore";
import type { NeedSlug } from "../../lib/types";

export function PatientHome() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { patient } = usePatient(user?.id);
  const { needs, loading } = useNeeds(patient?.id);
  const armedQuestion = useAppStore((s) => s.armedQuestion);

  useEffect(() => {
    if (armedQuestion) {
      navigate(`/patient/question/${armedQuestion}`, { replace: true });
    }
  }, [armedQuestion, navigate]);

  function onSelect(slug: NeedSlug) {
    navigate(`/patient/need/${slug}`);
  }

  const enabledNeeds = needs.filter((n) => n.enabled);

  return (
    <div className="relative flex h-[100dvh] w-full flex-col bg-bg">
      <PatientCloseButton />
      <div className="flex flex-1 flex-col items-center justify-center px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-[max(3rem,env(safe-area-inset-top))]">
        <h1 className="mb-4 text-center text-xl font-semibold tracking-tight text-ink-mute">
          Tap what you need
        </h1>
        {loading && (
          <p className="text-ink-mute">Loading…</p>
        )}
        {!loading && (
          <div className="grid w-full max-w-md grid-cols-2 gap-3">
            {enabledNeeds.map((need) => (
              <NeedTile
                key={need.id}
                slug={need.slug}
                label={need.label}
                onSelect={onSelect}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
