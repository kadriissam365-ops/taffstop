"use client";

import type { LogEntry, Profile } from "./calculations";

const STORAGE_KEYS = {
  PROFILE: "taffstop:profile",
  LOGS: "taffstop:logs",
};

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
  localStorage.removeItem(STORAGE_KEYS.PROFILE);
  localStorage.removeItem(STORAGE_KEYS.LOGS);
}
