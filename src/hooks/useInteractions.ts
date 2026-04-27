import { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import type {
  Interaction,
  InteractionKind,
  InteractionResponse,
  NeedSlug,
} from "../lib/types";

interface UseInteractionsResult {
  interactions: Interaction[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  log: (
    kind: InteractionKind,
    needSlug: NeedSlug,
    response?: InteractionResponse
  ) => Promise<Interaction | null>;
}

export function useInteractions(
  patientId: string | null | undefined
): UseInteractionsResult {
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!patientId) {
      setInteractions([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    const { data, error: err } = await supabase
      .from("interactions")
      .select("*")
      .eq("patient_id", patientId)
      .order("created_at", { ascending: false })
      .limit(500);
    if (err) {
      setError(err.message);
      setInteractions([]);
    } else {
      setInteractions(data ?? []);
    }
    setLoading(false);
  }, [patientId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  // Realtime subscription so the caretaker view updates instantly when the
  // patient logs a need (and vice versa for multi-device setups).
  useEffect(() => {
    if (!patientId) return;
    const channel = supabase
      .channel(`interactions:${patientId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "interactions",
          filter: `patient_id=eq.${patientId}`,
        },
        (payload) => {
          const row = payload.new as Interaction;
          setInteractions((prev) =>
            prev.some((i) => i.id === row.id) ? prev : [row, ...prev]
          );
        }
      )
      .subscribe();
    return () => {
      void supabase.removeChannel(channel);
    };
  }, [patientId]);

  const log = useCallback(
    async (
      kind: InteractionKind,
      needSlug: NeedSlug,
      response: InteractionResponse = null
    ) => {
      if (!patientId) return null;
      const { data, error: err } = await supabase
        .from("interactions")
        .insert({
          patient_id: patientId,
          kind,
          need_slug: needSlug,
          response,
        })
        .select("*")
        .single();
      if (err) {
        setError(err.message);
        return null;
      }
      setInteractions((prev) =>
        data && !prev.some((i) => i.id === data.id) ? [data, ...prev] : prev
      );
      return data;
    },
    [patientId]
  );

  return { interactions, loading, error, refresh, log };
}
