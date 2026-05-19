"use client";

import { Cigarette, Wind } from "lucide-react";
import { motion } from "framer-motion";

export function BigLogButton({
  variant,
  onClick,
  disabled,
}: {
  variant: "cigarette" | "puff";
  onClick: () => void;
  disabled?: boolean;
}) {
  const isCig = variant === "cigarette";
  const Icon = isCig ? Cigarette : Wind;
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      whileTap={{ scale: 0.94 }}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 420, damping: 22 }}
      className={`group relative flex flex-1 flex-col items-center justify-center gap-2 overflow-hidden rounded-3xl border p-6 transition-colors disabled:opacity-50 ${
        isCig
          ? "border-brand/30 bg-brand-soft text-brand hover:bg-brand-soft/80"
          : "border-warn/30 bg-warn-soft text-warn hover:bg-warn-soft/80"
      }`}
    >
      <motion.span
        aria-hidden
        initial={false}
        whileTap={{ scale: 2.4, opacity: 0 }}
        transition={{ duration: 0.45 }}
        className={`pointer-events-none absolute inset-0 m-auto h-16 w-16 rounded-full ${
          isCig ? "bg-brand/20" : "bg-warn/20"
        }`}
      />
      <Icon className="relative h-10 w-10" />
      <div className="relative text-base font-semibold">
        {isCig ? "+1 cigarette" : "+1 taffe"}
      </div>
      <div className="relative text-[11px] uppercase tracking-wider opacity-70">
        {isCig ? "Compteur jour" : "≈ 1/12 cig"}
      </div>
    </motion.button>
  );
}
