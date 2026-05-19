"use client";

import { useEffect, useState } from "react";
import type { LogEntry } from "@/lib/calculations";
import { secondsSinceLastCig, formatDuration } from "@/lib/calculations";

export function QuitTimer({
  logs,
  quitDate,
}: {
  logs: LogEntry[];
  quitDate: string | null;
}) {
  const [seconds, setSeconds] = useState(() => secondsSinceLastCig(logs, quitDate));

  useEffect(() => {
    setSeconds(secondsSinceLastCig(logs, quitDate));
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [logs, quitDate]);

  return (
    <div className="rounded-3xl border border-border bg-gradient-to-br from-bg-card to-bg-elevated p-6 text-center">
      <div className="text-xs uppercase tracking-wider text-fg-muted">
        Sans cigarette depuis
      </div>
      <div className="mt-2 text-4xl font-bold tabular-nums text-success">
        {formatDuration(seconds)}
      </div>
      <div className="mt-1 text-xs text-fg-faded">
        Chaque seconde compte. Ton corps te remercie déjà.
      </div>
    </div>
  );
}
