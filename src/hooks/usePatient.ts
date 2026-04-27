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

  const refresh = useCallback(async () => {
    if (!userId) {
      setPatient(null);
      setLoading(false);
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
  }, [userId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { patient, loading, error, refresh };
}
