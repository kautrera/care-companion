import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { usePatient } from "../../hooks/usePatient";
import { useInteractions } from "../../hooks/useInteractions";
import { useNeeds } from "../../hooks/useNeeds";
import { Drawing } from "../../drawings";
import { YesNoButtons } from "../../components/YesNoButtons";
import { PatientCloseButton } from "../../components/PatientCloseButton";
import { playConfirmChime, vibrateShort } from "../../lib/audio";
import type { NeedSlug } from "../../lib/types";
import { NEED_LABELS } from "../../lib/types";

export function NeedConfirm() {
  const { slug } = useParams<{ slug: NeedSlug }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { patient } = usePatient(user?.id);
  const { needs } = useNeeds(patient?.id);
  const { log } = useInteractions(patient?.id);
  const [confirming, setConfirming] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const need = useMemo(
    () => needs.find((n) => n.slug === slug),
    [needs, slug]
  );
  const label =
    need?.label ?? (slug ? NEED_LABELS[slug as NeedSlug] : "");

  useEffect(() => {
    if (!slug) navigate("/patient", { replace: true });
  }, [slug, navigate]);

  const onYes = useCallback(async () => {
    if (!slug || !patient || confirming) return;
    setConfirming(true);
    await log("patient_request", slug as NeedSlug);
    playConfirmChime();
    vibrateShort();
    setConfirmed(true);
    window.setTimeout(() => navigate("/patient", { replace: true }), 1800);
  }, [slug, patient, confirming, log, navigate]);

  const onNo = useCallback(() => {
    navigate("/patient", { replace: true });
  }, [navigate]);

  if (!slug) return null;

  return (
    <div className="relative flex h-[100dvh] w-full flex-col bg-bg">
      <PatientCloseButton />
      <div className="flex flex-1 flex-col items-center justify-center px-6 pt-[max(3rem,env(safe-area-inset-top))]">
        <Drawing
          slug={slug as NeedSlug}
          className="h-56 w-56 text-ink"
        />
        <p className="mt-6 text-center text-3xl font-semibold tracking-tight">
          {confirmed
            ? "I'll let them know."
            : `Do you need ${label.toLowerCase()}?`}
        </p>
      </div>
      <div className="px-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        {!confirmed ? (
          <YesNoButtons
            onYes={onYes}
            onNo={onNo}
            yesLabel="Yes, please"
            noLabel="Cancel"
            disabled={confirming}
          />
        ) : (
          <div className="flex h-32 items-center justify-center rounded-3xl bg-yes/15 text-2xl font-semibold text-yes-hi">
            Sent
          </div>
        )}
      </div>
    </div>
  );
}
