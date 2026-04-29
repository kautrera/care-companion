import type { Strings } from "../i18n/translations";

export function formatRelative(
  iso: string,
  t: Strings,
  now: Date = new Date(),
  locale = "en-US"
): string {
  const then = new Date(iso);
  const diffMs = now.getTime() - then.getTime();
  const seconds = Math.round(diffMs / 1000);
  if (seconds < 30) return t.time.justNow;
  const minutes = Math.round(seconds / 60);
  if (minutes < 1) return t.time.justNow;
  if (minutes < 60) return t.time.minAgo(minutes);
  const hours = Math.round(minutes / 60);
  if (hours < 24) return t.time.hrAgo(hours);
  const days = Math.round(hours / 24);
  if (days < 7) return t.time.dAgo(days);
  return then.toLocaleDateString(locale);
}

export function formatAbsolute(iso: string, locale = "en-US"): string {
  const then = new Date(iso);
  return then.toLocaleString(locale, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function formatDayHeader(
  iso: string,
  t: Strings,
  now: Date = new Date(),
  locale = "en-US"
): string {
  const then = new Date(iso);
  const isToday = then.toDateString() === now.toDateString();
  if (isToday) return t.history.dayToday;
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (then.toDateString() === yesterday.toDateString())
    return t.history.dayYesterday;
  return then.toLocaleDateString(locale, {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
}
