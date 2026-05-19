"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Download, RefreshCcw, Target } from "lucide-react";
import { Header } from "@/components/Header";
import { Button } from "@/components/Button";
import { BRANDS, findBrand } from "@/lib/brands";
import {
  loadProfile,
  saveProfile,
  loadLogs,
  clearAll,
} from "@/lib/storage";
import type { Profile } from "@/lib/calculations";

export default function SettingsPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    setProfile(loadProfile());
  }, []);

  if (!profile) return null;

  const update = (patch: Partial<Profile>) => {
    const next = { ...profile, ...patch };
    saveProfile(next);
    setProfile(next);
  };

  const onBrandChange = (id: string) => {
    const b = findBrand(id);
    if (!b) return update({ brand: id });
    update({ brand: id, pack_price: b.pack_price, cigs_per_pack: b.cigs_per_pack });
  };

  const exportJson = () => {
    const blob = new Blob(
      [JSON.stringify({ profile, logs: loadLogs() }, null, 2)],
      { type: "application/json" }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `taffstop-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const reset = () => {
    if (typeof window === "undefined") return;
    if (!confirm("Tu vas perdre ton profil et toute ton historique. Sûr ?")) return;
    clearAll();
    router.replace("/onboarding");
  };

  return (
    <>
      <Header subtitle="Tes paramètres" />
      <div className="flex flex-col gap-5 px-5 pb-8 pt-2">
        <section className="rounded-2xl border border-border bg-bg-card p-4">
          <div className="mb-3 text-xs uppercase tracking-wide text-fg-muted">Profil</div>
          <label className="block text-xs">
            <span className="mb-1 block text-fg-muted">Prénom</span>
            <input
              value={profile.name ?? ""}
              onChange={(e) => update({ name: e.target.value })}
              className="w-full rounded-xl border border-border bg-bg-elevated px-3 py-2 text-sm"
            />
          </label>
        </section>

        <section className="rounded-2xl border border-border bg-bg-card p-4">
          <div className="mb-3 text-xs uppercase tracking-wide text-fg-muted">Conso</div>
          <label className="mb-3 block text-xs">
            <span className="mb-1 block text-fg-muted">Marque</span>
            <select
              value={profile.brand}
              onChange={(e) => onBrandChange(e.target.value)}
              className="w-full rounded-xl border border-border bg-bg-elevated px-3 py-2 text-sm"
            >
              {BRANDS.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block text-xs">
              <span className="mb-1 block text-fg-muted">Prix paquet (€)</span>
              <input
                type="number"
                step="0.1"
                value={profile.pack_price}
                onChange={(e) => update({ pack_price: parseFloat(e.target.value) || 0 })}
                className="w-full rounded-xl border border-border bg-bg-elevated px-3 py-2 text-sm"
              />
            </label>
            <label className="block text-xs">
              <span className="mb-1 block text-fg-muted">Cig / paquet</span>
              <input
                type="number"
                value={profile.cigs_per_pack}
                onChange={(e) => update({ cigs_per_pack: parseInt(e.target.value) || 20 })}
                className="w-full rounded-xl border border-border bg-bg-elevated px-3 py-2 text-sm"
              />
            </label>
          </div>
          <label className="mt-3 block text-xs">
            <span className="mb-1 block text-fg-muted">Baseline (cig/jour)</span>
            <input
              type="number"
              value={profile.baseline_per_day}
              onChange={(e) =>
                update({ baseline_per_day: parseInt(e.target.value) || 0 })
              }
              className="w-full rounded-xl border border-border bg-bg-elevated px-3 py-2 text-sm"
            />
          </label>
        </section>

        <section className="rounded-2xl border border-border bg-bg-card p-4">
          <div className="mb-3 text-xs uppercase tracking-wide text-fg-muted">Objectif</div>
          <div className="grid grid-cols-3 gap-2">
            {(["reduce", "quit", "observe"] as const).map((g) => (
              <button
                key={g}
                onClick={() => {
                  if (g === "quit" && profile.goal !== "quit") {
                    update({ goal: g, quit_date: new Date().toISOString() });
                  } else {
                    update({ goal: g });
                  }
                }}
                className={`rounded-xl border px-3 py-2 text-xs transition ${
                  profile.goal === g
                    ? "border-brand bg-brand-soft text-brand"
                    : "border-border bg-bg-elevated text-fg-muted"
                }`}
              >
                {g === "quit" ? "Arrêter" : g === "reduce" ? "Réduire" : "Observer"}
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-bg-card p-4">
          <div className="mb-3 flex items-center gap-2 text-xs uppercase tracking-wide text-fg-muted">
            <Target className="h-3.5 w-3.5" />
            Objectif d'épargne
          </div>
          <p className="mb-3 text-[11px] text-fg-faded">
            Vise un truc concret avec l'argent économisé. Ça muscle la motivation.
          </p>
          <div className="grid grid-cols-[1fr,90px] gap-2">
            <label className="block text-xs">
              <span className="mb-1 block text-fg-muted">Pour quoi ?</span>
              <input
                placeholder="ex : un week-end à Lisbonne"
                value={profile.savings_goal?.label ?? ""}
                onChange={(e) =>
                  update({
                    savings_goal: {
                      label: e.target.value,
                      amount: profile.savings_goal?.amount ?? 0,
                    },
                  })
                }
                className="w-full rounded-xl border border-border bg-bg-elevated px-3 py-2 text-sm"
              />
            </label>
            <label className="block text-xs">
              <span className="mb-1 block text-fg-muted">Montant (€)</span>
              <input
                type="number"
                step="10"
                min="0"
                value={profile.savings_goal?.amount ?? ""}
                onChange={(e) =>
                  update({
                    savings_goal: {
                      label: profile.savings_goal?.label ?? "",
                      amount: parseFloat(e.target.value) || 0,
                    },
                  })
                }
                className="w-full rounded-xl border border-border bg-bg-elevated px-3 py-2 text-sm"
              />
            </label>
          </div>
          {profile.savings_goal && (profile.savings_goal.label || profile.savings_goal.amount > 0) && (
            <button
              onClick={() => update({ savings_goal: null })}
              className="mt-3 text-[11px] text-fg-faded underline"
            >
              Supprimer l'objectif
            </button>
          )}
        </section>

        <section className="rounded-2xl border border-border bg-bg-card p-4">
          <div className="mb-3 text-xs uppercase tracking-wide text-fg-muted">Données</div>
          <div className="flex flex-col gap-2">
            <Button variant="ghost" onClick={exportJson}>
              <Download className="h-4 w-4" /> Exporter en JSON
            </Button>
            <Button variant="danger" onClick={reset}>
              <RefreshCcw className="h-4 w-4" /> Effacer tout & recommencer
            </Button>
          </div>
        </section>

        <p className="flex items-start gap-2 px-2 text-[11px] text-fg-faded">
          <AlertTriangle className="mt-0.5 h-3 w-3" />
          <span>
            Tes données restent sur ton téléphone (localStorage). Si tu changes
            d'appareil ou vides ton navigateur, elles disparaissent. Sync cloud bientôt.
          </span>
        </p>
      </div>
    </>
  );
}
