"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Cigarette, Wind, Trash2 } from "lucide-react";
import { Header } from "@/components/Header";
import { BigLogButton } from "@/components/BigLogButton";
import { ConsequenceToast } from "@/components/ConsequenceToast";
import { Button } from "@/components/Button";
import { TRIGGERS, findTrigger } from "@/lib/contexts";
import {
  loadProfile,
  loadLogs,
  addLog,
  deleteLog,
} from "@/lib/storage";
import {
  type Profile,
  type LogEntry,
  pricePerCig,
} from "@/lib/calculations";

export default function LogPage() {
  const params = useSearchParams();
  const isRelapse = params?.get("relapse") === "1";

  const [profile, setProfile] = useState<Profile | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [trigger, setTrigger] = useState<string | null>(null);
  const [toastTrigger, setToastTrigger] = useState(0);

  useEffect(() => {
    setProfile(loadProfile());
    setLogs(loadLogs());
  }, []);

  if (!profile) return null;
  const ppc = pricePerCig(profile);

  const handleLog = (type: "cigarette" | "puff") => {
    addLog(type, 1, { trigger });
    setLogs(loadLogs());
    setToastTrigger((t) => t + 1);
    setTrigger(null);
    if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate(30);
  };

  const handleDelete = (id: string) => {
    deleteLog(id);
    setLogs(loadLogs());
  };

  const recent = [...logs]
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
    .slice(0, 30);

  return (
    <>
      <ConsequenceToast pricePerCig={ppc} trigger={toastTrigger} />
      <Header subtitle={isRelapse ? "Rechute — pas grave, on continue" : "Logger une conso"} />

      <div className="flex flex-col gap-5 px-5 pb-8 pt-2">
        <div className="flex gap-3">
          <BigLogButton variant="cigarette" onClick={() => handleLog("cigarette")} />
          <BigLogButton variant="puff" onClick={() => handleLog("puff")} />
        </div>

        <div>
          <div className="mb-2 text-xs uppercase tracking-wider text-fg-muted">
            Déclencheur (optionnel)
          </div>
          <div className="flex flex-wrap gap-2">
            {TRIGGERS.map((t) => {
              const active = trigger === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setTrigger(active ? null : t.id)}
                  className={`flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs transition ${
                    active
                      ? "border-brand bg-brand-soft text-brand"
                      : "border-border bg-bg-card text-fg-muted hover:bg-bg-elevated"
                  }`}
                >
                  <span>{t.emoji}</span>
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <div className="mb-2 text-xs uppercase tracking-wider text-fg-muted">
            Historique récent
          </div>
          {recent.length === 0 ? (
            <div className="rounded-2xl border border-border bg-bg-card p-6 text-center text-sm text-fg-muted">
              Rien encore. Logge ta première conso (ou pas, c'est bien aussi).
            </div>
          ) : (
            <ul className="flex flex-col gap-2">
              {recent.map((l) => {
                const trig = findTrigger(l.trigger);
                const d = new Date(l.created_at);
                return (
                  <motion.li
                    key={l.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-3 rounded-2xl border border-border bg-bg-card p-3"
                  >
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-full ${
                        l.type === "cigarette"
                          ? "bg-brand-soft text-brand"
                          : "bg-warn-soft text-warn"
                      }`}
                    >
                      {l.type === "cigarette" ? (
                        <Cigarette className="h-4 w-4" />
                      ) : (
                        <Wind className="h-4 w-4" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">
                        {l.type === "cigarette" ? "Cigarette" : "Taffe"}
                        {trig && <span className="ml-1.5 text-fg-muted">· {trig.emoji} {trig.label}</span>}
                      </div>
                      <div className="text-[11px] text-fg-faded">
                        {d.toLocaleString("fr-FR", {
                          weekday: "short",
                          day: "2-digit",
                          month: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(l.id)}
                      className="rounded-full p-2 text-fg-faded hover:bg-bg-elevated hover:text-brand"
                      aria-label="Supprimer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </motion.li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}
