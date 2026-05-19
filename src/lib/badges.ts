// Badges débloqués selon les jours d'arrêt

export type Badge = {
  id: string;
  emoji: string;
  title: string;
  description: string;
  threshold_days: number;
};

export const BADGES: Badge[] = [
  {
    id: "first-step",
    emoji: "🌱",
    title: "Premier pas",
    description: "Jour 1 sans cigarette.",
    threshold_days: 1,
  },
  {
    id: "72h",
    emoji: "🔥",
    title: "72h propres",
    description: "Trois jours, le pic est passé.",
    threshold_days: 3,
  },
  {
    id: "one-week",
    emoji: "⭐",
    title: "Une semaine",
    description: "7 jours, tu maîtrises.",
    threshold_days: 7,
  },
  {
    id: "fortress",
    emoji: "💎",
    title: "Forteresse",
    description: "Deux semaines de tenue.",
    threshold_days: 14,
  },
  {
    id: "champion",
    emoji: "🏆",
    title: "Champion",
    description: "Un mois entier, énorme.",
    threshold_days: 30,
  },
  {
    id: "king",
    emoji: "👑",
    title: "Roi de l'arrêt",
    description: "Trois mois, tu domines.",
    threshold_days: 90,
  },
  {
    id: "rocket",
    emoji: "🚀",
    title: "Fusée",
    description: "Six mois, en orbite.",
    threshold_days: 180,
  },
  {
    id: "legend",
    emoji: "🦄",
    title: "Légende",
    description: "Un an. Tu es légendaire.",
    threshold_days: 365,
  },
];

export function daysSinceQuit(quitDate: string | null): number {
  if (!quitDate) return 0;
  const ms = Date.now() - new Date(quitDate).getTime();
  if (ms < 0) return 0;
  return Math.floor(ms / (1000 * 60 * 60 * 24));
}

export function isBadgeUnlocked(badge: Badge, quitDate: string | null): boolean {
  return daysSinceQuit(quitDate) >= badge.threshold_days;
}

export function unlockedBadgeCount(quitDate: string | null): number {
  return BADGES.filter((b) => isBadgeUnlocked(b, quitDate)).length;
}
