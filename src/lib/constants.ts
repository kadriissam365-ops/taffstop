// Constantes santé tabac (sources: OMS, Inserm, Tabac Info Service)

export const HEALTH_CONSTANTS = {
  // Minutes de vie perdues par cigarette (OMS)
  MINUTES_LOST_PER_CIG: 11,
  // mg de goudron par cigarette (moyenne)
  TAR_MG_PER_CIG: 10,
  // mg de monoxyde de carbone par cigarette
  CO_MG_PER_CIG: 12,
  // mg de nicotine par cigarette
  NICOTINE_MG_PER_CIG: 1.2,
  // Nombre de taffs moyens par cigarette
  PUFFS_PER_CIG: 12,
  // Prix moyen paquet France 2026 (€)
  AVG_PACK_PRICE_FR: 12.0,
  // Nombre de cigarettes par paquet
  CIGS_PER_PACK: 20,
};

export type Milestone = {
  threshold_seconds: number;
  emoji: string;
  title: string;
  description: string;
};

// Bénéfices santé à l'arrêt (Tabac Info Service / OMS)
export const HEALTH_MILESTONES: Milestone[] = [
  {
    threshold_seconds: 20 * 60,
    emoji: "💓",
    title: "20 minutes",
    description: "Ta tension et ton rythme cardiaque reviennent à la normale.",
  },
  {
    threshold_seconds: 8 * 60 * 60,
    emoji: "🩸",
    title: "8 heures",
    description: "Le taux de nicotine dans ton sang a baissé de 50%. L'oxygène remonte.",
  },
  {
    threshold_seconds: 24 * 60 * 60,
    emoji: "🌬️",
    title: "24 heures",
    description: "Le monoxyde de carbone a été éliminé de ton corps.",
  },
  {
    threshold_seconds: 48 * 60 * 60,
    emoji: "👅",
    title: "48 heures",
    description: "Ton goût et ton odorat reviennent. La nicotine est éliminée.",
  },
  {
    threshold_seconds: 72 * 60 * 60,
    emoji: "🫁",
    title: "72 heures",
    description: "Respirer devient plus facile, tes bronches se détendent.",
  },
  {
    threshold_seconds: 7 * 24 * 60 * 60,
    emoji: "✨",
    title: "1 semaine",
    description: "Le risque de crise cardiaque commence à diminuer.",
  },
  {
    threshold_seconds: 14 * 24 * 60 * 60,
    emoji: "🚴",
    title: "2 semaines",
    description: "Ta circulation s'améliore, marcher devient plus facile.",
  },
  {
    threshold_seconds: 30 * 24 * 60 * 60,
    emoji: "💪",
    title: "1 mois",
    description: "Toux et essoufflement diminuent fortement.",
  },
  {
    threshold_seconds: 90 * 24 * 60 * 60,
    emoji: "🌟",
    title: "3 mois",
    description: "Ta capacité pulmonaire s'améliore de jusqu'à 30%.",
  },
  {
    threshold_seconds: 180 * 24 * 60 * 60,
    emoji: "🛡️",
    title: "6 mois",
    description: "Toux, sinus, fatigue : tous diminuent significativement.",
  },
  {
    threshold_seconds: 365 * 24 * 60 * 60,
    emoji: "❤️",
    title: "1 an",
    description: "Ton risque d'infarctus est divisé par 2.",
  },
  {
    threshold_seconds: 5 * 365 * 24 * 60 * 60,
    emoji: "🧠",
    title: "5 ans",
    description: "Risque d'AVC redescendu au niveau d'un non-fumeur.",
  },
  {
    threshold_seconds: 10 * 365 * 24 * 60 * 60,
    emoji: "🎯",
    title: "10 ans",
    description: "Risque de cancer du poumon divisé par 2.",
  },
  {
    threshold_seconds: 15 * 365 * 24 * 60 * 60,
    emoji: "🏆",
    title: "15 ans",
    description: "Tu es désormais au même niveau de risque qu'un non-fumeur.",
  },
];
