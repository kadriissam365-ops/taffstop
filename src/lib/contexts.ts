// Déclencheurs / contextes — pour qualifier chaque cigarette

export type Trigger = {
  id: string;
  label: string;
  emoji: string;
};

export const TRIGGERS: Trigger[] = [
  { id: "stress", label: "Stress", emoji: "😤" },
  { id: "cafe", label: "Café", emoji: "☕" },
  { id: "repas", label: "Après le repas", emoji: "🍽️" },
  { id: "alcool", label: "Alcool", emoji: "🍺" },
  { id: "pause", label: "Pause au boulot", emoji: "💼" },
  { id: "ennui", label: "Ennui", emoji: "😴" },
  { id: "social", label: "Social", emoji: "🗣️" },
  { id: "voiture", label: "Voiture", emoji: "🚗" },
  { id: "telephone", label: "Téléphone", emoji: "📱" },
  { id: "reveil", label: "Réveil", emoji: "🌅" },
  { id: "coucher", label: "Avant de dormir", emoji: "🌙" },
  { id: "envie", label: "Envie pure", emoji: "🔥" },
  { id: "autre", label: "Autre", emoji: "❓" },
];

export function findTrigger(id: string | undefined | null): Trigger | undefined {
  if (!id) return undefined;
  return TRIGGERS.find((t) => t.id === id);
}
