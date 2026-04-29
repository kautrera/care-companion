import { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import {
  DEFAULT_ENABLED_CARETAKER,
  DEFAULT_ENABLED_PATIENT,
  DEFAULT_NEEDS,
  NEED_LABELS,
  type Need,
  type NeedSlug,
} from "../lib/types";

interface UseNeedsResult {
  needs: Need[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

async function fetchNeeds(patientId: string): Promise<Need[]> {
  const { data, error } = await supabase
    .from("needs")
    .select("*")
    .eq("patient_id", patientId)
    .order("sort_order", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as Need[];
}

/**
 * Inserts rows for any DEFAULT_NEEDS slugs the patient is missing. Runs
 * once per patient lifetime — subsequent loads find every default present.
 */
async function backfillMissingNeeds(
  patientId: string,
  existing: Need[]
): Promise<boolean> {
  const have = new Set(existing.map((n) => n.slug));
  const missing = DEFAULT_NEEDS.filter((slug) => !have.has(slug));
  if (missing.length === 0) return false;

  // sort_order defaults to 0 for every row. Render-time sorting is by
  // localized label alphabetically when sort_order ties; once the caretaker
  // reorders in Settings, all rows get explicit sort_order values.
  const rows = missing.map((slug) => ({
    patient_id: patientId,
    slug,
    label: NEED_LABELS[slug],
    enabled_patient: DEFAULT_ENABLED_PATIENT.includes(slug),
    enabled_caretaker: DEFAULT_ENABLED_CARETAKER.includes(slug),
    sort_order: 0,
  }));

  const { error } = await supabase.from("needs").insert(rows);
  if (error) {
    console.warn("Failed to backfill missing needs:", error.message);
    return false;
  }
  return true;
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
    try {
      const initial = await fetchNeeds(patientId);
      const inserted = await backfillMissingNeeds(patientId, initial);
      const final = inserted ? await fetchNeeds(patientId) : initial;
      setNeeds(final);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to load needs";
      setError(msg);
      setNeeds([]);
    } finally {
      setLoading(false);
    }
  }, [patientId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { needs, loading, error, refresh };
}

// Re-export so callers can ignore the underlying NeedSlug type when listing.
export type { NeedSlug };

/**
 * Sort needs for display. Primary: explicit `sort_order` (so manual
 * reordering wins). Secondary: localized label alphabetically (so the
 * default state — every row at sort_order 0 — produces an alphabetical
 * grid in the active language).
 */
export function sortNeedsForDisplay(
  list: Need[],
  labels: Record<NeedSlug, string>,
  locale: string
): Need[] {
  return [...list].sort((a, b) => {
    if (a.sort_order !== b.sort_order) return a.sort_order - b.sort_order;
    return labels[a.slug].localeCompare(labels[b.slug], locale, {
      sensitivity: "base",
    });
  });
}
