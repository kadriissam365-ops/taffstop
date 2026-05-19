"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Wind, Heart, ShieldCheck, AlertCircle } from "lucide-react";
import { Header } from "@/components/Header";
import { Button } from "@/components/Button";
import { addCraving, loadCravings } from "@/lib/storage";

type Phase = "inhale" | "hold" | "exhale" | "rest";

const PHASES: { phase: Phase; label: string; seconds: number }[] = [
  { phase: "inhale", label: "Inspire par le nez", seconds: 4 },
  { phase: "hold", label: "Bloque", seconds: 7 },
  { phase: "exhale", label: "Expire doucement par la bouche", seconds: 8 },
  { phase: "rest", label: "Pause", seconds: 1 },
];

const RESISTED_MESSAGES = [
  "Tu viens de gagner. C'est ça, reprendre le contrôle. 💪",
  "Une envie passée = un pas de plus. Bien joué. 🌱",
  "L'envie dure 3-5 min max. T'as juste à attendre. ⏳",
  "Chaque résistance affaiblit l'addiction. Continue. 🔥",
  "Ton cerveau apprend à se passer de la nicotine. Bravo. 🧠",
];

const CRAVING_TIPS = [
  "Bois un grand verre d'eau froide, lentement.",
  "Brosse-toi les dents — le goût coupe net l'envie.",
  "Sors marcher 5 min, change d'environnement.",
  "Appelle quelqu'un, n'importe qui — l'envie passera.",
  "Mâche un chewing-gum à la menthe.",
  "Mets de la musique forte, danse 2 min.",
  "Respire 4-7-8 trois fois — fenêtre ouverte.",
];

export default function SosPage() {
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(PHASES[0].seconds);
  const [cycles, setCycles] = useState(0);
  const [running, setRunning] = useState(true);
  const [intensity, setIntensity] = useState(5);
  const [resistedMsg, setResistedMsg] = useState<string | null>(null);
  const [tip] = useState(
    () => CRAVING_TIPS[Math.floor(Math.random() * CRAVING_TIPS.length)]
  );
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!running) return;
    intervalRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s > 1) return s - 1;
        setPhaseIdx((idx) => {
          const next = (idx + 1) % PHASES.length;
          if (next === 0) setCycles((c) => c + 1);
          return next;
        });
        return PHASES[(phaseIdx + 1) % PHASES.length].seconds;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running, phaseIdx]);

  const phase = PHASES[phaseIdx];
  const scale =
    phase.phase === "inhale"
      ? 1.35
      : phase.phase === "hold"
        ? 1.35
        : phase.phase === "exhale"
          ? 0.7
          : 1;

  const handleResisted = () => {
    addCraving(intensity, "sos:resisted");
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate([20, 60, 20]);
    }
    const msg =
      RESISTED_MESSAGES[Math.floor(Math.random() * RESISTED_MESSAGES.length)];
    setResistedMsg(msg);
  };

  if (resistedMsg) {
    const total = loadCravings().filter((c) => c.trigger_note === "sos:resisted")
      .length;
    return (
      <>
        <Header subtitle="Tu as tenu bon" />
        <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6 px-6 text-center">
          <motion.div
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 16 }}
            className="flex h-32 w-32 items-center justify-center rounded-full bg-success-soft text-success"
          >
            <ShieldCheck className="h-16 w-16" strokeWidth={1.6} />
          </motion.div>

          <div>
            <div className="text-2xl font-bold">+1 victoire</div>
            <div className="mt-2 text-fg-muted">{resistedMsg}</div>
          </div>

          <div className="rounded-2xl border border-success/30 bg-success-soft/40 px-5 py-3 text-sm text-success">
            🎯 {total} envie{total > 1 ? "s" : ""} vaincue{total > 1 ? "s" : ""}{" "}
            au total
          </div>

          <div className="flex w-full max-w-xs flex-col gap-2">
            <Link href="/" className="block">
              <Button variant="primary" className="w-full">
                Retour à l'accueil
              </Button>
            </Link>
            <button
              onClick={() => {
                setResistedMsg(null);
                setPhaseIdx(0);
                setSecondsLeft(PHASES[0].seconds);
                setCycles(0);
                setRunning(true);
              }}
              className="text-xs text-fg-faded underline"
            >
              Refaire une session
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header subtitle="SOS Craving — respire, ça va passer" />
      <div className="flex flex-col gap-5 px-5 pb-8 pt-2">
        {/* Cercle de respiration animé */}
        <div className="relative flex h-64 items-center justify-center rounded-3xl border border-border bg-gradient-to-br from-bg-card to-bg-elevated">
          <motion.div
            animate={{ scale }}
            transition={{
              duration: phase.seconds,
              ease: phase.phase === "hold" ? "linear" : "easeInOut",
            }}
            className="flex h-32 w-32 items-center justify-center rounded-full bg-brand/15 ring-2 ring-brand/40"
          >
            <div className="text-center">
              <div className="text-3xl font-bold tabular-nums">
                {secondsLeft}
              </div>
            </div>
          </motion.div>
          <AnimatePresence mode="wait">
            <motion.div
              key={phase.phase}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="absolute bottom-5 left-0 right-0 text-center"
            >
              <div className="text-xs uppercase tracking-wider text-fg-muted">
                {phase.phase === "inhale"
                  ? "Inspiration"
                  : phase.phase === "hold"
                    ? "Apnée"
                    : phase.phase === "exhale"
                      ? "Expiration"
                      : "Pause"}
              </div>
              <div className="mt-1 text-sm font-medium">{phase.label}</div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-between rounded-2xl border border-border bg-bg-card px-4 py-3 text-sm">
          <span className="text-fg-muted">
            <Wind className="mr-1.5 inline h-4 w-4" />
            Cycles 4-7-8 complétés
          </span>
          <span className="font-bold tabular-nums">{cycles}</span>
        </div>

        {/* Astuce */}
        <div className="rounded-2xl border border-info/30 bg-info-soft/30 p-4">
          <div className="mb-1 text-xs uppercase tracking-wider text-info">
            💡 Astuce craving
          </div>
          <div className="text-sm">{tip}</div>
        </div>

        {/* Slider intensité */}
        <div className="rounded-2xl border border-border bg-bg-card p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-fg-muted">
              Intensité de l'envie
            </span>
            <span className="text-2xl font-bold tabular-nums">
              {intensity}
              <span className="text-sm text-fg-muted">/10</span>
            </span>
          </div>
          <input
            type="range"
            min={1}
            max={10}
            value={intensity}
            onChange={(e) => setIntensity(Number(e.target.value))}
            className="w-full accent-brand"
            aria-label="Intensité du craving"
          />
          <div className="mt-1 flex justify-between text-[10px] text-fg-faded">
            <span>léger</span>
            <span>brutal</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2">
          <button
            onClick={handleResisted}
            className="flex items-center justify-center gap-2 rounded-2xl bg-success px-4 py-4 font-semibold text-white shadow-lg shadow-success/30 transition active:scale-95"
          >
            <Heart className="h-5 w-5" />
            J'ai tenu bon
          </button>
          <Link
            href="/log?relapse=1"
            className="flex items-center justify-center gap-2 rounded-2xl border border-warn/30 bg-warn-soft px-4 py-3 text-sm text-warn"
          >
            <AlertCircle className="h-4 w-4" />
            J'ai craqué — déclarer la conso
          </Link>
        </div>
      </div>
    </>
  );
}
