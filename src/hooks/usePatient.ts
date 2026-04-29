import { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import type { Patient } from "../lib/types";

interface UsePatientResult {
  patient: Patient | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function usePatient(userId: string | null | undefined): UsePatientResult {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Tracks the userId the current `patient` value was fetched for. Used to
  // mark the hook as "loading" whenever the active userId doesn't match —
  // otherwise the brief render between auth resolving and the new fetch
  // starting would redirect to /setup with a stale `patient: null`.
  const [fetchedFor, setFetchedFor] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!userId) {
      setPatient(null);
      setLoading(false);
      setFetchedFor(null);
      return;
    }
    setLoading(true);
    setError(null);
    const { data, error: err } = await supabase
      .from("patients")
      .select("*")
      .eq("caretaker_user_id", userId)
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();
    if (err) {
      setError(err.message);
      setPatient(null);
    } else {
      setPatient(data ?? null);
    }
    setLoading(false);
    setFetchedFor(userId);
  }, [userId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  // Stay "loading" while a userId is set but the most recent successful
  // fetch was for a different (or no) userId.
  const effectiveLoading = loading || (!!userId && fetchedFor !== userId);

  return { patient, loading: effectiveLoading, error, refresh };
}
