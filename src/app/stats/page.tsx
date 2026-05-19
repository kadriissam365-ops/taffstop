"use client";

import { useEffect, useState, useMemo } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { Header } from "@/components/Header";
import { StatCard } from "@/components/StatCard";
import { Coins, Timer, Cigarette, Wind, Flame, Activity } from "lucide-react";
import { loadProfile, loadLogs } from "@/lib/storage";
import {
  type Profile,
  type LogEntry,
  totalCigsToday,
  totalCigsThisWeek,
  totalCigsThisMonth,
  totalCigsAllTime,
  moneyBurnt,
  moneySaved,
  minutesLost,
  tarInhaledMg,
  nicotineConsumedMg,
  coEmittedMg,
  formatMinutes,
} from "@/lib/calculations";
import { buildDailySeries } from "@/lib/chartData";
import { findTrigger } from "@/lib/contexts";

export default function StatsPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);

  useEffect(() => {
    setProfile(loadProfile());
    setLogs(loadLogs());
  }, []);

  const series = useMemo(
    () => (profile ? buildDailySeries(logs, profile, 14) : []),
    [logs, profile]
  );

  const heatmap = useMemo(() => {
    const hours = new Array(24).fill(0);
    for (const l of logs) {
      const h = new Date(l.created_at).getHours();
      hours[h] += l.type === "cigarette" ? 1 : 1 / 12;
    }
    return hours;
  }, [logs]);

  const topTrigger = useMemo(() => {
    const counts = new Map<string, number>();
    for (const l of logs) {
      if (!l.trigger) continue;
      counts.set(l.trigger, (counts.get(l.trigger) ?? 0) + 1);
    }
    let best: { id: string; n: number } | null = null;
    for (const [id, n] of counts.entries()) {
      if (!best || n > best.n) best = { id, n };
    }
    return best;
  }, [logs]);

  if (!profile) return null;

  const maxHour = Math.max(...heatmap, 0.01);
  const trig = topTrigger ? findTrigger(topTrigger.id) : null;

  return (
    <>
      <Header subtitle="Tes stats sans filtre" />
      <div className="flex flex-col gap-5 px-5 pb-8 pt-2">
        <div className="grid grid-cols-2 gap-3">
          <StatCard
            icon={Cigarette}
            tone="brand"
            label="Aujourd'hui"
            value={totalCigsToday(logs).toFixed(1)}
            sublabel={`vs ${profile.baseline_per_day} base`}
          />
          <StatCard
            icon={Cigarette}
            tone="neutral"
            label="Cette semaine"
            value={totalCigsThisWeek(logs).toFixed(1)}
          />
          <StatCard
            icon={Cigarette}
            tone="neutral"
            label="Ce mois"
            value={totalCigsThisMonth(logs).toFixed(1)}
          />
          <StatCard
            icon={Cigarette}
            tone="neutral"
            label="Total"
            value={totalCigsAllTime(logs).toFixed(0)}
          />
        </div>

        {/* Évolution */}
        <div className="rounded-2xl border border-border bg-bg-card p-4">
          <div className="mb-2 flex items-center justify-between">
            <div className="text-xs uppercase tracking-wide text-fg-muted">
              Évolution (14 jours)
            </div>
            <div className="text-[11px] text-fg-faded">cig équiv./jour</div>
          </div>
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={series} margin={{ top: 6, right: 6, left: -22, bottom: 0 }}>
                <defs>
                  <linearGradient id="gCigs" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--brand)" stopOpacity={0.55} />
                    <stop offset="100%" stopColor="var(--brand)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis
                  dataKey="label"
                  fontSize={10}
                  stroke="var(--fg-faded)"
                  tickLine={false}
                  axisLine={false}
                  interval={1}
                />
                <YAxis
                  fontSize={10}
                  stroke="var(--fg-faded)"
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--bg-card)",
                    border: "1px solid var(--border)",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                  labelStyle={{ color: "var(--fg-muted)" }}
                />
                <Area
                  type="monotone"
                  dataKey="cigs"
                  stroke="var(--brand)"
                  fill="url(#gCigs)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Heatmap horaire */}
        <div className="rounded-2xl border border-border bg-bg-card p-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="text-xs uppercase tracking-wide text-fg-muted">
              Heures les plus à risque
            </div>
            <div className="text-[11px] text-fg-faded">0h → 23h</div>
          </div>
          <div className="grid grid-cols-12 gap-1">
            {heatmap.map((v, i) => {
              const ratio = v / maxHour;
              return (
                <div
                  key={i}
                  className="flex flex-col items-center gap-1"
                  title={`${i}h : ${v.toFixed(1)} cig équiv.`}
                >
                  <div
                    className="h-8 w-full rounded"
                    style={{
                      background:
                        v === 0
                          ? "var(--bg-elevated)"
                          : `color-mix(in srgb, var(--brand) ${Math.round(ratio * 100)}%, var(--bg-elevated))`,
                    }}
                  />
                  <div className="text-[9px] text-fg-faded">{i}</div>
                </div>
              );
            })}
          </div>
          {trig && topTrigger && (
            <div className="mt-3 text-xs text-fg-muted">
              Top déclencheur : <span className="text-fg">{trig.emoji} {trig.label}</span> ({topTrigger.n} fois)
            </div>
          )}
        </div>

        {/* Conséquences */}
        <div className="grid grid-cols-2 gap-3">
          <StatCard
            icon={Coins}
            tone="warn"
            label="Argent brûlé"
            value={`${moneyBurnt(logs, profile).toFixed(2)} €`}
          />
          <StatCard
            icon={Coins}
            tone="success"
            label="Économisé"
            value={`${moneySaved(logs, profile).toFixed(2)} €`}
            sublabel="vs baseline"
          />
          <StatCard
            icon={Timer}
            tone="brand"
            label="Vie perdue"
            value={formatMinutes(minutesLost(logs))}
            sublabel="estim. OMS"
          />
          <StatCard
            icon={Flame}
            tone="info"
            label="Goudron"
            value={`${tarInhaledMg(logs).toFixed(0)} mg`}
          />
          <StatCard
            icon={Activity}
            tone="warn"
            label="Nicotine"
            value={`${nicotineConsumedMg(logs).toFixed(1)} mg`}
          />
          <StatCard
            icon={Wind}
            tone="neutral"
            label="CO émis"
            value={`${coEmittedMg(logs).toFixed(0)} mg`}
          />
        </div>
      </div>
    </>
  );
}
