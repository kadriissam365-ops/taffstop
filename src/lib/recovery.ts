// Récupération santé — chronologie des bénéfices à l'arrêt
// Sources : OMS, Tabac Info Service

export type RecoveryStep = {
  label: string;
  description: string;
  start_seconds: number;
  end_seconds?: number; // si défini, étape avec fourchette (progression)
};

const MIN = 60;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;
const WEEK = 7 * DAY;
const MONTH = 30 * DAY;
const YEAR = 365 * DAY;

export const RECOVERY_STEPS: RecoveryStep[] = [
  {
    label: "20 min",
    description: "Tension artérielle se normalise",
    start_seconds: 20 * MIN,
  },
  {
    label: "12 h",
    description: "Niveau de monoxyde de carbone redevient normal",
    start_seconds: 12 * HOUR,
  },
  {
    label: "24 h",
    description: "Risque de crise cardiaque commence à baisser",
    start_seconds: 24 * HOUR,
  },
  {
    label: "48 h",
    description: "Goût et odorat reviennent",
    start_seconds: 48 * HOUR,
  },
  {
    label: "72 h",
    description: "Respiration plus facile",
    start_seconds: 72 * HOUR,
  },
  {
    label: "2-12 semaines",
    description: "Circulation sanguine améliorée",
    start_seconds: 2 * WEEK,
    end_seconds: 12 * WEEK,
  },
  {
    label: "1-9 mois",
    description: "Poumons se régénèrent, moins de toux",
    start_seconds: 1 * MONTH,
    end_seconds: 9 * MONTH,
  },
  {
    label: "1 an",
    description: "Risque de maladie cardiaque divisé par 2",
    start_seconds: 1 * YEAR,
  },
  {
    label: "5 ans",
    description: "Risque d'AVC = non-fumeur",
    start_seconds: 5 * YEAR,
  },
  {
    label: "10 ans",
    description: "Risque de cancer du poumon divisé par 2",
    start_seconds: 10 * YEAR,
  },
];

export type RecoveryStatus =
  | { state: "done" }
  | { state: "in-progress"; ratio: number }
  | { state: "todo" };

export function recoveryStatus(step: RecoveryStep, seconds: number): RecoveryStatus {
  if (step.end_seconds) {
    if (seconds >= step.end_seconds) return { state: "done" };
    if (seconds >= step.start_seconds) {
      const ratio =
        (seconds - step.start_seconds) /
        (step.end_seconds - step.start_seconds);
      return { state: "in-progress", ratio: Math.min(Math.max(ratio, 0), 1) };
    }
    return { state: "todo" };
  }
  if (seconds >= step.start_seconds) return { state: "done" };
  return { state: "todo" };
}
