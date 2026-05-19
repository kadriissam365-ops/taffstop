"use client";

import { Cigarette, Wind } from "lucide-react";

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
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`group relative flex flex-1 flex-col items-center justify-center gap-2 rounded-3xl border p-6 transition-all active:scale-[0.97] disabled:opacity-50 ${
        isCig
          ? "border-brand/30 bg-brand-soft text-brand hover:bg-brand-soft/80"
          : "border-warn/30 bg-warn-soft text-warn hover:bg-warn-soft/80"
      }`}
    >
      <Icon className="h-10 w-10" />
      <div className="text-base font-semibold">
        {isCig ? "+1 cigarette" : "+1 taffe"}
      </div>
      <div className="text-[11px] uppercase tracking-wider opacity-70">
        {isCig ? "Compteur jour" : "≈ 1/12 cig"}
      </div>
    </button>
  );
}
