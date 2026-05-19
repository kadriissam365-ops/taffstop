"use client";

import { Flame } from "lucide-react";

export function Header({ subtitle }: { subtitle?: string }) {
  return (
    <header className="px-5 pt-[max(env(safe-area-inset-top),1.25rem)] pb-2">
      <div className="flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-brand text-white">
          <Flame className="h-5 w-5" />
        </div>
        <div>
          <div className="text-lg font-bold tracking-tight">taffstop</div>
          {subtitle && <div className="text-[11px] text-fg-muted -mt-0.5">{subtitle}</div>}
        </div>
      </div>
    </header>
  );
}
