"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Cigarette,
  Wind,
  Coins,
  Timer,
  Flame,
  TrendingDown,
  Heart,
  AlertCircle,
  Target,
  PartyPopper,
} from "lucide-react";
import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { StatCard } from "@/components/StatCard";
import { BigLogButton } from "@/components/BigLogButton";
import { ConsequenceToast } from "@/components/ConsequenceToast";
import { QuitTimer } from "@/components/QuitTimer";
import {
  loadProfile,
  loadLogs,
  addLog,
} from "@/lib/storage";
import {
  type Profile,
  type LogEntry,
  totalCigsToday,
  totalCigsThisWeek,
  moneyBurnt,
  moneySaved,
  minutesLost,
  lifeSavedMinutes,
  pricePerCig,
  formatMinutes,
} from "@/lib/calculations";

export default function Home() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [toastTrigger, setToastTrigger] = useState(0);

  useEffect(() => {
    setProfile(loadProfile());
    setLogs(loadLogs());
  }, []);

  if (!profile) {
    return null;
  }

  const cigsToday = totalCigsToday(logs);
  const cigsWeek = totalCigsThisWeek(logs);
  const burnt = moneyBurnt(logs, profile);
  const saved = moneySaved(logs, profile);
  const lostMin = minutesLost(logs);
  const savedMin = lifeSavedMinutes(logs, profile);
  const ppc = pricePerCig(profile);

  const handleLog = (type: "cigarette" | "puff") => {
    addLog(type, 1);
    setLogs(loadLogs());
    setToastTrigger((t) => t + 1);
    if (navigator.vibrate) navigator.vibrate(30);
  };

  const isQuit = profile.goal === "quit";

  return (
    <>
      <ConsequenceToast pricePerCig={ppc} trigger={toastTrigger} />
      <Header subtitle={`Salut ${profile.name || ""} · ${greetingFor(profile)}`} />

      <div className="flex flex-col gap-5 px-5 pb-8 pt-2">
        {/* Hero - dépend du mode */}
        {isQuit ? (
          <QuitTimer logs={logs} quitDate={profile.quit_date} />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl border border-border bg-gradient-to-br from-bg-card to-bg-elevated p-6 text-center"
          >
            <div className="text-xs uppercase tracking-wider text-fg-muted">
              Aujourd'hui
            </div>
            <div className="mt-1 flex items-baseline justify-center gap-1.5">
              <span className="text-6xl font-bold tabular-nums">
                {cigsToday.toFixed(cigsToday < 10 ? 1 : 0)}
              </span>
              <span className="text-sm text-fg-muted">cig équiv.</span>
            </div>
            <div className="mt-2 text-xs text-fg-faded">
              {cigsToday > profile.baseline_per_day
                ? `+${(cigsToday - profile.baseline_per_day).toFixed(1)} vs ta baseline (${profile.baseline_per_day}/j)`
                : cigsToday < profile.baseline_per_day
                  ? `−${(profile.baseline_per_day - cigsToday).toFixed(1)} vs ta baseline 💪`
                  : "Tu es sur ta baseline."}
            </div>
          </motion.div>
        )}

        {/* Boutons de log */}
        {!isQuit && (
          <div className="flex gap-3">
            <BigLogButton variant="cigarette" onClick={() => handleLog("cigarette")} />
            <BigLogButton variant="puff" onClick={() => handleLog("puff")} />
          </div>
        )}

        {isQuit && (
          <Link
            href="/log?relapse=1"
            className="rounded-2xl border border-warn/30 bg-warn-soft p-4 text-center text-sm text-warn"
          >
            <AlertCircle className="mx-auto mb-1 h-5 w-5" />
            J'ai craqué — déclarer une rechute (sans culpabiliser, on continue)
          </Link>
        )}

        {/* Stats principales */}
        <div className="grid grid-cols-2 gap-3">
          {isQuit ? (
            <>
              <StatCard
                icon={Coins}
                tone="success"
                label="Économisé"
                value={`${saved.toFixed(2)} €`}
                sublabel={`vs ${profile.baseline_per_day} cig/j`}
              />
              <StatCard
                icon={Heart}
                tone="success"
                label="Vie regagnée"
                value={formatMinutes(savedMin)}
                sublabel="grâce à l'arrêt"
              />
              <StatCard
                icon={Flame}
                tone="neutral"
                label="Cig évitées"
                value={String(Math.round(saved / Math.max(ppc, 0.01)))}
                sublabel="depuis le départ"
              />
              <StatCard
                icon={TrendingDown}
                tone="brand"
                label="Sem. dernière"
                value={cigsWeek.toFixed(1)}
                sublabel="rechutes éventuelles"
              />
            </>
          ) : (
            <>
              <StatCard
                icon={Coins}
                tone="warn"
                label="Brûlés (total)"
                value={`${burnt.toFixed(2)} €`}
                sublabel={`≈ ${(burnt / Math.max(ppc, 0.01)).toFixed(0)} cig`}
              />
              <StatCard
                icon={Timer}
                tone="brand"
                label="Vie perdue"
                value={formatMinutes(lostMin)}
                sublabel="estim. OMS"
              />
              <StatCard
                icon={Cigarette}
                tone="neutral"
                label="Cette semaine"
                value={cigsWeek.toFixed(1)}
                sublabel="cig équiv."
              />
              <StatCard
                icon={Wind}
                tone="info"
                label="Économies possibles"
                value={`${saved.toFixed(2)} €`}
                sublabel="si tu suis baseline"
              />
            </>
          )}
        </div>

        {/* Objectif d'épargne (mode quit uniquement) */}
        {isQuit && profile.savings_goal && profile.savings_goal.amount > 0 && (
          <SavingsGoalCard
            label={profile.savings_goal.label || "Mon objectif"}
            target={profile.savings_goal.amount}
            saved={saved}
          />
        )}

        {/* CTA rapides */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <Link
            href="/stats"
            className="rounded-2xl border border-border bg-bg-card p-4 text-center hover:bg-bg-elevated"
          >
            <div className="text-2xl">📊</div>
            <div className="mt-1 font-medium">Voir mes stats</div>
          </Link>
          <Link
            href="/milestones"
            className="rounded-2xl border border-border bg-bg-card p-4 text-center hover:bg-bg-elevated"
          >
            <div className="text-2xl">🏆</div>
            <div className="mt-1 font-medium">Mes étapes santé</div>
          </Link>
        </div>

        {/* Pied — citation motivante */}
        <p className="text-center text-xs italic text-fg-faded">
          {quoteOf(profile.goal)}
        </p>
      </div>
    </>
  );
}

function greetingFor(profile: Profile) {
  const hour = new Date().getHours();
  if (hour < 6) return "Encore debout ?";
  if (hour < 11) return "Bon matin";
  if (hour < 14) return "Bon midi";
  if (hour < 18) return "Bon après-midi";
  if (hour < 22) return "Bonne soirée";
  return "Bonne nuit";
  void profile;
}

function quoteOf(goal: Profile["goal"]) {
  const q = {
    quit:
      "« Le plus dur, c'était hier. Aujourd'hui, c'est déjà mieux. »",
    reduce:
      "« Une de moins, c'est déjà une victoire. »",
    observe:
      "« Tu ne peux pas changer ce que tu ne mesures pas. »",
  };
  return q[goal];
}
