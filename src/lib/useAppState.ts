"use client";

import { useEffect, useState, useCallback } from "react";
import { loadProfile, loadLogs, saveProfile as persistProfile, addLog as persistLog, deleteLog as persistDeleteLog, saveLogs } from "./storage";
import type { Profile, LogEntry } from "./calculations";

/**
 * Hook central qui expose l'état app (profil + logs) et les mutations.
 * Aujourd'hui : localStorage. Demain : Supabase (basta swap dans storage.ts).
 */
export function useAppState() {
  const [profile, setProfileState] = useState<Profile | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setProfileState(loadProfile());
    setLogs(loadLogs());
    setReady(true);
  }, []);

  const refresh = useCallback(() => {
    setProfileState(loadProfile());
    setLogs(loadLogs());
  }, []);

  const saveProfile = useCallback((next: Profile) => {
    persistProfile(next);
    setProfileState(next);
  }, []);

  const addLog = useCallback(
    (type: "cigarette" | "puff", count = 1, extras?: { trigger?: string | null; note?: string | null }) => {
      const entry = persistLog(type, count, extras);
      setLogs((prev) => [...prev, entry]);
      return entry;
    },
    []
  );

  const removeLog = useCallback((id: string) => {
    persistDeleteLog(id);
    setLogs((prev) => prev.filter((l) => l.id !== id));
  }, []);

  const replaceLogs = useCallback((next: LogEntry[]) => {
    saveLogs(next);
    setLogs(next);
  }, []);

  return { profile, logs, ready, refresh, saveProfile, addLog, removeLog, replaceLogs };
}
