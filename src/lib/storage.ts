"use client";

import type { LogEntry, Profile } from "./calculations";

export type CravingEntry = {
  id: string;
  created_at: string;
  intensity: number;
  trigger_note?: string | null;
};

const STORAGE_KEYS = {
  PROFILE: "taffstop:profile",
  LOGS: "taffstop:logs",
  CRAVINGS: "taffstop_cravings",
};

export const TAFFSTOP_STORAGE_PREFIXES = ["taffstop:", "taffstop_"];

export function loadProfile(): Profile | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(STORAGE_KEYS.PROFILE);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveProfile(profile: Profile) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
}

export function loadLogs(): LogEntry[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(STORAGE_KEYS.LOGS);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveLogs(logs: LogEntry[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(logs));
}

export function addLog(
  type: "cigarette" | "puff",
  count: number = 1,
  extras?: { trigger?: string | null; note?: string | null }
): LogEntry {
  const entry: LogEntry = {
    id: crypto.randomUUID(),
    type,
    count,
    created_at: new Date().toISOString(),
    trigger: extras?.trigger ?? null,
    note: extras?.note ?? null,
  };
  const logs = loadLogs();
  logs.push(entry);
  saveLogs(logs);
  return entry;
}

export function deleteLog(id: string) {
  const logs = loadLogs().filter((l) => l.id !== id);
  saveLogs(logs);
}

export function resetQuit() {
  const profile = loadProfile();
  if (!profile) return;
  saveProfile({
    ...profile,
    quit_date: new Date().toISOString(),
    goal: "quit",
  });
}

export function clearAll() {
  if (typeof window === "undefined") return;
  // Remove all taffstop_* and taffstop:* keys
  const toRemove: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key) continue;
    if (TAFFSTOP_STORAGE_PREFIXES.some((p) => key.startsWith(p))) {
      toRemove.push(key);
    }
  }
  for (const k of toRemove) localStorage.removeItem(k);
}

export function loadCravings(): CravingEntry[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(STORAGE_KEYS.CRAVINGS);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveCravings(cravings: CravingEntry[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.CRAVINGS, JSON.stringify(cravings));
}

export function addCraving(intensity: number, triggerNote?: string | null): CravingEntry {
  const entry: CravingEntry = {
    id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
    intensity,
    trigger_note: triggerNote ?? null,
  };
  const list = loadCravings();
  list.push(entry);
  saveCravings(list);
  return entry;
}

export function exportAllData(): Record<string, unknown> {
  if (typeof window === "undefined") return {};
  const out: Record<string, unknown> = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key) continue;
    if (!TAFFSTOP_STORAGE_PREFIXES.some((p) => key.startsWith(p))) continue;
    const raw = localStorage.getItem(key);
    if (raw == null) continue;
    try {
      out[key] = JSON.parse(raw);
    } catch {
      out[key] = raw;
    }
  }
  return out;
}
