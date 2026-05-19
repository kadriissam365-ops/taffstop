"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Lock, Trophy } from "lucide-react";
import { Header } from "@/components/Header";
import { Button } from "@/components/Button";
import { HEALTH_MILESTONES } from "@/lib/constants";
import { loadProfile, loadLogs, resetQuit } from "@/lib/storage";
import {
  type Profile,
  type LogEntry,
  secondsSinceLastCig,
  formatDuration,
} from "@/lib/calculations";

export default function MilestonesPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const p = loadProfile();
    const l = loadLogs();
    setProfile(p);
    setLogs(l);
    setSeconds(secondsSinceLastCig(l, p?.quit_date ?? null));
    const id = setInterval(() => {
      setSeconds(secondsSinceLastCig(l, p?.quit_date ?? null));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  if (!profile) return null;

  const isQuit = profile.goal === "quit";
  const unlocked = HEALTH_MILESTONES.filter((m) => seconds >= m.threshold_seconds).length;

  const handleResetQuit = () => {
    resetQuit();
    setProfile(loadProfile());
    setSeconds(0);
  };

  return (
    <>
      <Header subtitle="Bénéfices santé à l'arrêt" />
      <div className="flex flex-col gap-5 px-5 pb-8 pt-2">
        <div className="rounded-3xl border border-border bg-gradient-to-br from-bg-card to-bg-elevated p-6 text-center">
          <Trophy className="mx-auto h-7 w-7 text-brand" />
          <div className="mt-1 text-xs uppercase tracking-wider text-fg-muted">
            {isQuit ? "Sans cigarette depuis" : "Démarre un compteur d'arrêt"}
          </div>
          {isQuit ? (
            <>
              <div className="mt-2 text-3xl font-bold tabular-nums">
                {formatDuration(seconds)}
              </div>
              <div className="mt-1 text-xs text-fg-faded">
                {unlocked} / {HEALTH_MILESTONES.length} étapes débloquées
              </div>
              <div className="mt-3">
                <Button variant="ghost" size="sm" onClick={handleResetQuit}>
                  Repartir de zéro (rechute)
                </Button>
              </div>
            </>
          ) : (
            <div className="mt-3">
              <Button variant="primary" onClick={handleResetQuit}>
                Démarrer maintenant
              </Button>
            </div>
          )}
        </div>

        <ul className="flex flex-col gap-2">
          {HEALTH_MILESTONES.map((m, i) => {
            const done = seconds >= m.threshold_seconds;
            return (
              <motion.li
                key={m.title}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.025 }}
                className={`flex items-start gap-3 rounded-2xl border p-4 ${
                  done
                    ? "border-success/40 bg-success-soft/50"
                    : "border-border bg-bg-card"
                }`}
              >
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-2xl text-xl ${
                    done ? "bg-success/20" : "bg-bg-elevated"
                  }`}
                >
                  {m.emoji}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <div className="font-semibold">{m.title}</div>
                    {done ? (
                      <CheckCircle2 className="h-4 w-4 text-success" />
                    ) : (
                      <Lock className="h-4 w-4 text-fg-faded" />
                    )}
                  </div>
                  <div className="mt-1 text-xs text-fg-muted">{m.description}</div>
                </div>
              </motion.li>
            );
          })}
        </ul>
      </div>
    </>
  );
}
