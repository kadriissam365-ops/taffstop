"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { Cigarette, Flame } from "lucide-react";
import { BRANDS, findBrand } from "@/lib/brands";
import { saveProfile } from "@/lib/storage";
import { Button } from "@/components/Button";
import { HEALTH_CONSTANTS } from "@/lib/constants";
import type { Profile } from "@/lib/calculations";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("marlboro-red");
  const [packPrice, setPackPrice] = useState<number>(12.5);
  const [cigsPerPack, setCigsPerPack] = useState<number>(20);
  const [baseline, setBaseline] = useState<number>(10);
  const [goal, setGoal] = useState<Profile["goal"]>("reduce");

  const onBrandChange = (id: string) => {
    setBrand(id);
    const b = findBrand(id);
    if (b) {
      setPackPrice(b.pack_price);
      setCigsPerPack(b.cigs_per_pack);
    }
  };

  const finish = () => {
    const now = new Date().toISOString();
    const profile: Profile = {
      name: name.trim() || undefined,
      brand,
      pack_price: packPrice || HEALTH_CONSTANTS.AVG_PACK_PRICE_FR,
      cigs_per_pack: cigsPerPack || HEALTH_CONSTANTS.CIGS_PER_PACK,
      baseline_per_day: baseline || 10,
      goal,
      start_date: now,
      quit_date: goal === "quit" ? now : null,
    };
    saveProfile(profile);
    router.replace("/");
  };

  const next = () => setStep((s) => Math.min(s + 1, 4));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  return (
    <div className="flex min-h-screen flex-col px-6 pt-[max(env(safe-area-inset-top),2rem)] pb-8">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col">
        <div className="mb-6 flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand text-white">
            <Flame className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xl font-bold tracking-tight">taffstop</div>
            <div className="text-xs text-fg-muted">chaque taff a une conséquence</div>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-6 flex gap-1.5">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-colors ${
                i <= step ? "bg-brand" : "bg-bg-elevated"
              }`}
            />
          ))}
        </div>

        <motion.div
          key={step}
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.25 }}
          className="flex-1"
        >
          {step === 0 && (
            <div className="flex flex-col gap-4">
              <h1 className="text-3xl font-bold leading-tight">
                Salut.<br /> On va te suivre, sans jugement.
              </h1>
              <p className="text-sm text-fg-muted">
                Tu peux mettre ton prénom (ou un pseudo). On ne stocke rien ailleurs que sur
                ton téléphone pour l'instant.
              </p>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ton prénom (optionnel)"
                className="mt-2 rounded-2xl border border-border bg-bg-card px-4 py-3 text-base"
              />
            </div>
          )}

          {step === 1 && (
            <div className="flex flex-col gap-4">
              <h1 className="text-2xl font-bold">Quelle marque tu fumes ?</h1>
              <p className="text-sm text-fg-muted">
                Sert juste à estimer le prix par cigarette. Modifiable plus tard.
              </p>
              <select
                value={brand}
                onChange={(e) => onBrandChange(e.target.value)}
                className="rounded-2xl border border-border bg-bg-card px-4 py-3 text-base"
              >
                {BRANDS.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} — {b.pack_price.toFixed(2)} €
                  </option>
                ))}
              </select>

              <div className="grid grid-cols-2 gap-3">
                <label className="text-xs">
                  <span className="mb-1 block text-fg-muted">Prix paquet (€)</span>
                  <input
                    type="number"
                    step="0.1"
                    value={packPrice}
                    onChange={(e) => setPackPrice(parseFloat(e.target.value) || 0)}
                    className="w-full rounded-xl border border-border bg-bg-card px-3 py-2"
                  />
                </label>
                <label className="text-xs">
                  <span className="mb-1 block text-fg-muted">Cig par paquet</span>
                  <input
                    type="number"
                    value={cigsPerPack}
                    onChange={(e) => setCigsPerPack(parseInt(e.target.value) || 0)}
                    className="w-full rounded-xl border border-border bg-bg-card px-3 py-2"
                  />
                </label>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col gap-4">
              <h1 className="text-2xl font-bold">
                Combien de cigarettes par jour, en moyenne ?
              </h1>
              <p className="text-sm text-fg-muted">
                Sois honnête — c'est juste ta baseline. Personne ne juge.
              </p>
              <div className="flex items-baseline justify-center gap-2 py-4">
                <span className="text-7xl font-bold tabular-nums">{baseline}</span>
                <span className="text-sm text-fg-muted">cig/jour</span>
              </div>
              <input
                type="range"
                min={1}
                max={60}
                value={baseline}
                onChange={(e) => setBaseline(parseInt(e.target.value))}
                className="accent-brand"
              />
              <div className="flex justify-between text-[11px] text-fg-faded">
                <span>1</span>
                <span>30</span>
                <span>60+</span>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="flex flex-col gap-4">
              <h1 className="text-2xl font-bold">Ton objectif ?</h1>
              <p className="text-sm text-fg-muted">Modifiable à tout moment.</p>
              <div className="grid gap-3">
                {[
                  {
                    id: "reduce",
                    title: "Réduire",
                    desc: "Je veux fumer moins, progressivement.",
                    emoji: "📉",
                  },
                  {
                    id: "quit",
                    title: "Arrêter",
                    desc: "Je veux arrêter maintenant. Compteur depuis 0.",
                    emoji: "🛑",
                  },
                  {
                    id: "observe",
                    title: "Juste observer",
                    desc: "Pour l'instant je veux prendre conscience.",
                    emoji: "👀",
                  },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setGoal(opt.id as Profile["goal"])}
                    className={`flex items-start gap-3 rounded-2xl border p-4 text-left transition ${
                      goal === opt.id
                        ? "border-brand bg-brand-soft"
                        : "border-border bg-bg-card"
                    }`}
                  >
                    <span className="text-2xl">{opt.emoji}</span>
                    <div>
                      <div className="font-semibold">{opt.title}</div>
                      <div className="text-xs text-fg-muted">{opt.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="flex flex-col gap-4 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-brand text-white">
                <Cigarette className="h-8 w-8" />
              </div>
              <h1 className="text-2xl font-bold">On y est.</h1>
              <p className="text-sm text-fg-muted">
                Chaque fois que tu cliques sur le gros bouton, tu vois les conséquences. C'est
                tout. Pas de culpabilité, juste la réalité.
              </p>
              <div className="rounded-2xl border border-border bg-bg-card p-4 text-left text-sm">
                <div className="text-xs uppercase tracking-wide text-fg-muted">Récap</div>
                <ul className="mt-2 space-y-1">
                  {name && <li>· Toi : <strong>{name}</strong></li>}
                  <li>· Marque : <strong>{findBrand(brand)?.name ?? brand}</strong> ({packPrice.toFixed(2)} €/paquet de {cigsPerPack})</li>
                  <li>· Baseline : <strong>{baseline}</strong> cig/jour</li>
                  <li>· Objectif : <strong>{goal === "quit" ? "Arrêter" : goal === "reduce" ? "Réduire" : "Observer"}</strong></li>
                </ul>
              </div>
            </div>
          )}
        </motion.div>

        <div className="mt-6 flex gap-3">
          {step > 0 && (
            <Button variant="ghost" onClick={back} fullWidth>
              Retour
            </Button>
          )}
          {step < 4 ? (
            <Button variant="primary" onClick={next} fullWidth>
              Continuer
            </Button>
          ) : (
            <Button variant="primary" onClick={finish} fullWidth>
              C'est parti
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
