import type { LogEntry, Profile } from "./calculations";
import { cigEquivalent, pricePerCig } from "./calculations";

export type DailyPoint = {
  date: string;
  label: string;
  cigs: number;
  saved: number;
  cumulativeSaved: number;
};

function dayKey(d: Date) {
  return d.toISOString().slice(0, 10);
}

function shortLabel(d: Date) {
  return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" });
}

/**
 * Construit une série journalière pour les `days` derniers jours,
 * remplit les trous, calcule les économies cumulées vs baseline.
 */
export function buildDailySeries(logs: LogEntry[], profile: Profile, days = 30): DailyPoint[] {
  const ppc = pricePerCig(profile);
  const baseline = profile.baseline_per_day || 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const byDay = new Map<string, LogEntry[]>();
  for (const l of logs) {
    const key = l.created_at.slice(0, 10);
    const arr = byDay.get(key) ?? [];
    arr.push(l);
    byDay.set(key, arr);
  }

  const points: DailyPoint[] = [];
  let cumulativeSaved = 0;

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = dayKey(d);
    const dayLogs = byDay.get(key) ?? [];
    const cigs = cigEquivalent(dayLogs);
    const dailySaved = Math.max(0, (baseline - cigs) * ppc);
    cumulativeSaved += dailySaved;
    points.push({
      date: key,
      label: shortLabel(d),
      cigs: Math.round(cigs * 10) / 10,
      saved: Math.round(dailySaved * 100) / 100,
      cumulativeSaved: Math.round(cumulativeSaved * 100) / 100,
    });
  }
  return points;
}
