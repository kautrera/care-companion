import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { usePatient } from "../../hooks/usePatient";
import { useInteractions } from "../../hooks/useInteractions";
import { useNeeds } from "../../hooks/useNeeds";
import { Drawing } from "../../drawings";
import {
  formatAbsolute,
  formatDayHeader,
  formatRelative,
} from "../../lib/time";
import {
  NEED_LABELS,
  type Interaction,
  type NeedSlug,
} from "../../lib/types";

type DateRange = "today" | "7d" | "30d" | "all";

const RANGE_LABELS: Record<DateRange, string> = {
  today: "Today",
  "7d": "7 days",
  "30d": "30 days",
  all: "All",
};

function withinRange(iso: string, range: DateRange): boolean {
  if (range === "all") return true;
  const created = new Date(iso).getTime();
  const now = Date.now();
  if (range === "today") {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    return created >= start.getTime();
  }
  if (range === "7d") return now - created < 7 * 24 * 60 * 60 * 1000;
  if (range === "30d") return now - created < 30 * 24 * 60 * 60 * 1000;
  return true;
}

interface DayGroup {
  key: string;
  iso: string;
  rows: Interaction[];
}

function groupByDay(rows: Interaction[]): DayGroup[] {
  const map = new Map<string, DayGroup>();
  for (const row of rows) {
    const d = new Date(row.created_at);
    const key = d.toDateString();
    let group = map.get(key);
    if (!group) {
      group = { key, iso: row.created_at, rows: [] };
      map.set(key, group);
    }
    group.rows.push(row);
  }
  return Array.from(map.values());
}

export function History() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { patient } = usePatient(user?.id);
  const { interactions, loading } = useInteractions(patient?.id);
  const { needs } = useNeeds(patient?.id);

  const [query, setQuery] = useState("");
  const [range, setRange] = useState<DateRange>("7d");
  const [needFilter, setNeedFilter] = useState<NeedSlug | "all">("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return interactions.filter((row) => {
      if (!withinRange(row.created_at, range)) return false;
      if (needFilter !== "all" && row.need_slug !== needFilter) return false;
      if (q) {
        const label = NEED_LABELS[row.need_slug] ?? row.need_slug;
        const haystack = `${label} ${row.need_slug} ${row.kind} ${row.response ?? ""}`
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [interactions, query, range, needFilter]);

  const groups = useMemo(() => groupByDay(filtered), [filtered]);

  const summary = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const row of filtered) {
      counts[row.need_slug] = (counts[row.need_slug] ?? 0) + 1;
    }
    return counts;
  }, [filtered]);

  return (
    <div className="flex h-[100dvh] w-full flex-col bg-bg">
      <header className="flex items-center gap-3 px-5 pt-[max(1rem,env(safe-area-inset-top))] pb-3">
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="Back"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-surface text-ink-mute active:bg-surface-hi"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>
        <h1 className="text-xl font-semibold tracking-tight">History</h1>
      </header>

      <div className="flex flex-col gap-2 px-5 pb-3">
        <label className="flex items-center gap-3 rounded-2xl bg-surface px-4 py-3 ring-1 ring-line/30 focus-within:ring-2 focus-within:ring-accent">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5 text-ink-mute"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="search"
            placeholder="Search history…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-base text-ink placeholder:text-ink-mute/70 outline-none"
          />
        </label>

        <div className="flex gap-2 overflow-x-auto">
          {(Object.keys(RANGE_LABELS) as DateRange[]).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRange(r)}
              className={[
                "shrink-0 rounded-full px-3 py-1.5 text-sm",
                range === r
                  ? "bg-accent text-bg"
                  : "bg-surface text-ink-mute",
              ].join(" ")}
            >
              {RANGE_LABELS[r]}
            </button>
          ))}
        </div>

        <div className="flex gap-2 overflow-x-auto">
          <button
            type="button"
            onClick={() => setNeedFilter("all")}
            className={[
              "shrink-0 rounded-full px-3 py-1.5 text-sm",
              needFilter === "all"
                ? "bg-ink text-bg"
                : "bg-surface text-ink-mute",
            ].join(" ")}
          >
            All needs
          </button>
          {needs.map((n) => (
            <button
              key={n.id}
              type="button"
              onClick={() => setNeedFilter(n.slug)}
              className={[
                "flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-sm",
                needFilter === n.slug
                  ? "bg-ink text-bg"
                  : "bg-surface text-ink-mute",
              ].join(" ")}
            >
              <Drawing slug={n.slug} className="h-4 w-4" />
              {n.label}
              {summary[n.slug] ? (
                <span className="ml-1 opacity-70">{summary[n.slug]}</span>
              ) : null}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto px-5 pb-[max(1rem,env(safe-area-inset-bottom))]">
        {loading && <p className="py-8 text-center text-ink-mute">Loading…</p>}
        {!loading && filtered.length === 0 && (
          <p className="py-12 text-center text-ink-mute">
            No interactions yet for this filter.
          </p>
        )}
        {groups.map((group) => (
          <section key={group.key} className="mb-5">
            <h2 className="mb-2 text-sm uppercase tracking-wider text-ink-mute">
              {formatDayHeader(group.iso)}
            </h2>
            <ul className="flex flex-col gap-2">
              {group.rows.map((row) => (
                <li
                  key={row.id}
                  className="flex items-center gap-3 rounded-2xl bg-surface px-3 py-3 ring-1 ring-line/30"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-surface-hi text-ink">
                    <Drawing slug={row.need_slug} className="h-9 w-9" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-base font-semibold">
                      {NEED_LABELS[row.need_slug] ?? row.need_slug}
                    </p>
                    <p className="text-xs text-ink-mute">
                      {formatRelative(row.created_at)} ·{" "}
                      {formatAbsolute(row.created_at)}
                    </p>
                  </div>
                  <OutcomeChip row={row} />
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}

function OutcomeChip({ row }: { row: Interaction }) {
  if (row.kind === "patient_request") {
    return (
      <span className="rounded-full bg-warn/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-warn">
        Asked
      </span>
    );
  }
  if (row.response === "yes") {
    return (
      <span className="rounded-full bg-yes/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-yes-hi">
        Yes
      </span>
    );
  }
  if (row.response === "no") {
    return (
      <span className="rounded-full bg-no/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-no-hi">
        No
      </span>
    );
  }
  return null;
}
