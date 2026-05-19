import { HEALTH_CONSTANTS, HEALTH_MILESTONES, type Milestone } from "./constants";

export type SavingsGoal = {
  label: string;
  amount: number;
};

export type Profile = {
  name?: string;
  brand: string;
  pack_price: number;
  cigs_per_pack: number;
  baseline_per_day: number;
  goal: "reduce" | "quit" | "observe";
  start_date: string;
  quit_date: string | null;
  savings_goal?: SavingsGoal | null;
};

export type LogEntry = {
  id: string;
  type: "cigarette" | "puff";
  count: number;
  created_at: string;
  trigger?: string | null;
  note?: string | null;
};

export function pricePerCig(profile: Pick<Profile, "pack_price" | "cigs_per_pack">) {
  if (!profile.pack_price || !profile.cigs_per_pack) return 0;
  return profile.pack_price / profile.cigs_per_pack;
}

export function logsByDay(logs: LogEntry[]) {
  const map = new Map<string, { cigs: number; puffs: number }>();
  for (const log of logs) {
    const day = log.created_at.slice(0, 10);
    const cur = map.get(day) ?? { cigs: 0, puffs: 0 };
    if (log.type === "cigarette") cur.cigs += log.count;
    else cur.puffs += log.count;
    map.set(day, cur);
  }
  return map;
}

// Convertit puffs en équivalent cigarettes
export function cigEquivalent(logs: LogEntry[]) {
  let cigs = 0;
  let puffs = 0;
  for (const log of logs) {
    if (log.type === "cigarette") cigs += log.count;
    else puffs += log.count;
  }
  return cigs + puffs / HEALTH_CONSTANTS.PUFFS_PER_CIG;
}

export function totalCigsToday(logs: LogEntry[]) {
  const today = new Date().toISOString().slice(0, 10);
  return cigEquivalent(logs.filter((l) => l.created_at.startsWith(today)));
}

export function totalCigsThisWeek(logs: LogEntry[]) {
  const now = new Date();
  const start = new Date(now);
  start.setDate(now.getDate() - 7);
  return cigEquivalent(logs.filter((l) => new Date(l.created_at) >= start));
}

export function totalCigsThisMonth(logs: LogEntry[]) {
  const now = new Date();
  const start = new Date(now);
  start.setMonth(now.getMonth() - 1);
  return cigEquivalent(logs.filter((l) => new Date(l.created_at) >= start));
}

export function totalCigsAllTime(logs: LogEntry[]) {
  return cigEquivalent(logs);
}

// Conséquences cumulées
export function moneyBurnt(logs: LogEntry[], profile: Profile) {
  return cigEquivalent(logs) * pricePerCig(profile);
}

export function minutesLost(logs: LogEntry[]) {
  return cigEquivalent(logs) * HEALTH_CONSTANTS.MINUTES_LOST_PER_CIG;
}

export function tarInhaledMg(logs: LogEntry[]) {
  return cigEquivalent(logs) * HEALTH_CONSTANTS.TAR_MG_PER_CIG;
}

export function nicotineConsumedMg(logs: LogEntry[]) {
  return cigEquivalent(logs) * HEALTH_CONSTANTS.NICOTINE_MG_PER_CIG;
}

export function coEmittedMg(logs: LogEntry[]) {
  return cigEquivalent(logs) * HEALTH_CONSTANTS.CO_MG_PER_CIG;
}

// Économies réalisées vs baseline
export function moneySaved(logs: LogEntry[], profile: Profile) {
  if (!profile.start_date) return 0;
  const daysSinceStart =
    (Date.now() - new Date(profile.start_date).getTime()) / (1000 * 60 * 60 * 24);
  const expectedCigs = daysSinceStart * profile.baseline_per_day;
  const actualCigs = cigEquivalent(logs);
  const saved = (expectedCigs - actualCigs) * pricePerCig(profile);
  return Math.max(0, saved);
}

export function lifeSavedMinutes(logs: LogEntry[], profile: Profile) {
  if (!profile.start_date) return 0;
  const daysSinceStart =
    (Date.now() - new Date(profile.start_date).getTime()) / (1000 * 60 * 60 * 24);
  const expectedCigs = daysSinceStart * profile.baseline_per_day;
  const actualCigs = cigEquivalent(logs);
  const saved = (expectedCigs - actualCigs) * HEALTH_CONSTANTS.MINUTES_LOST_PER_CIG;
  return Math.max(0, saved);
}

// Mode arrêt : secondes depuis la dernière cigarette
export function secondsSinceLastCig(logs: LogEntry[], quitDate: string | null) {
  if (logs.length === 0 && quitDate) {
    return Math.floor((Date.now() - new Date(quitDate).getTime()) / 1000);
  }
  if (logs.length === 0) return 0;
  const lastCig = logs
    .filter((l) => l.type === "cigarette")
    .sort((a, b) => b.created_at.localeCompare(a.created_at))[0];
  if (!lastCig) return 0;
  return Math.floor((Date.now() - new Date(lastCig.created_at).getTime()) / 1000);
}

export function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ${minutes % 60}min`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}j ${hours % 24}h`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mois ${days % 30}j`;
  const years = Math.floor(months / 12);
  return `${years}an${years > 1 ? "s" : ""} ${months % 12}mois`;
}

export function formatMinutes(minutes: number): string {
  if (minutes < 60) return `${Math.round(minutes)}min`;
  const hours = minutes / 60;
  if (hours < 24) return `${hours.toFixed(1)}h`;
  const days = hours / 24;
  if (days < 365) return `${days.toFixed(1)} jours`;
  return `${(days / 365).toFixed(1)} ans`;
}
