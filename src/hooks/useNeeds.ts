import { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import type { Need } from "../lib/types";

interface UseNeedsResult {
  needs: Need[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useNeeds(patientId: string | null | undefined): UseNeedsResult {
  const [needs, setNeeds] = useState<Need[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!patientId) {
      setNeeds([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    const { data, error: err } = await supabase
      .from("needs")
      .select("*")
      .eq("patient_id", patientId)
      .order("sort_order", { ascending: true });
    if (err) {
      setError(err.message);
      setNeeds([]);
    } else {
      setNeeds(data ?? []);
    }
    setLoading(false);
  }, [patientId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { needs, loading, error, refresh };
}
