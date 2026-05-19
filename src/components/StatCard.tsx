import type { LucideIcon } from "lucide-react";

export type Tone = "neutral" | "brand" | "success" | "warn" | "info";

const toneClasses: Record<Tone, { bg: string; text: string; ring: string }> = {
  neutral: { bg: "bg-bg-elevated", text: "text-fg", ring: "ring-border" },
  brand: { bg: "bg-brand-soft", text: "text-brand", ring: "ring-brand/30" },
  success: { bg: "bg-success-soft", text: "text-success", ring: "ring-success/30" },
  warn: { bg: "bg-warn-soft", text: "text-warn", ring: "ring-warn/30" },
  info: { bg: "bg-info-soft", text: "text-info", ring: "ring-info/30" },
};

export function StatCard({
  icon: Icon,
  label,
  value,
  sublabel,
  tone = "neutral",
}: {
  icon?: LucideIcon;
  label: string;
  value: string;
  sublabel?: string;
  tone?: Tone;
}) {
  const t = toneClasses[tone];
  return (
    <div className="rounded-2xl border border-border bg-bg-card p-4 ring-1 ring-border/60">
      <div className="flex items-center gap-2">
        {Icon && (
          <div className={`flex h-8 w-8 items-center justify-center rounded-full ${t.bg}`}>
            <Icon className={`h-4 w-4 ${t.text}`} />
          </div>
        )}
        <div className="text-xs uppercase tracking-wide text-fg-muted">{label}</div>
      </div>
      <div className="mt-2 text-2xl font-semibold tabular-nums">{value}</div>
      {sublabel && <div className="mt-1 text-xs text-fg-faded">{sublabel}</div>}
    </div>
  );
}
