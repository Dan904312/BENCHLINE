import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function getProgressPercent(
  current: number,
  target: number,
  lowerIsBetter = false
): number {
  if (lowerIsBetter) {
    // For times: lower is better (e.g. run faster)
    // If current is already at or below target, 100%
    if (current <= target) return 100;
    // Assume starting point is 150% of target as "0%"
    const worst = target * 1.5;
    return Math.min(100, Math.max(0, ((worst - current) / (worst - target)) * 100));
  }
  return Math.min(100, Math.max(0, (current / target) * 100));
}

export function getStreakBonus(streak: number): number {
  if (streak >= 30) return 50;
  if (streak >= 14) return 25;
  if (streak >= 7) return 10;
  if (streak >= 3) return 5;
  return 1;
}

export function calculateTokensEarned(
  streak: number,
  improvementPercent: number
): number {
  const base = 10;
  const streakBonus = getStreakBonus(streak);
  const improvementBonus = Math.floor(improvementPercent * 2);
  return base + streakBonus + improvementBonus;
}

export const GOALS_CONFIG = {
  beep_test: {
    label: "Beep Test",
    unit: "level",
    lowerIsBetter: false,
    benchmarks: {
      poor: 5,
      average: 8,
      good: 10,
      excellent: 13,
      elite: 16,
    },
    icon: "🔊",
  },
  "5km_run": {
    label: "5km Run",
    unit: "min",
    lowerIsBetter: true,
    benchmarks: {
      poor: 35,
      average: 28,
      good: 25,
      excellent: 22,
      elite: 18,
    },
    icon: "🏃",
  },
  "2_4km_run": {
    label: "2.4km Run",
    unit: "min",
    lowerIsBetter: true,
    benchmarks: {
      poor: 16,
      average: 13,
      good: 11,
      excellent: 10,
      elite: 8.5,
    },
    icon: "⚡",
  },
  make_team: {
    label: "Make the Team",
    unit: "score",
    lowerIsBetter: false,
    benchmarks: {
      poor: 20,
      average: 40,
      good: 60,
      excellent: 80,
      elite: 95,
    },
    icon: "🏅",
  },
  custom: {
    label: "Custom Goal",
    unit: "reps",
    lowerIsBetter: false,
    benchmarks: {
      poor: 0,
      average: 25,
      good: 50,
      excellent: 75,
      elite: 100,
    },
    icon: "🎯",
  },
};

export const STORE_ITEMS = [
  {
    id: "rest-day-1",
    name: "Rest Day Pass",
    description: "Protect your streak for 1 day without logging",
    type: "rest_day" as const,
    cost: 50,
    imageUrl: "/store/rest.png",
  },
  {
    id: "rest-day-3",
    name: "Rest Day Bundle (3x)",
    description: "3 rest day passes — stock up for the week",
    type: "rest_day" as const,
    cost: 130,
    imageUrl: "/store/rest-bundle.png",
  },
  {
    id: "frame-fire",
    name: "🔥 Fire Frame",
    description: "Show your intensity with the flame profile frame",
    type: "frame" as const,
    cost: 200,
    imageUrl: "/store/frame-fire.png",
  },
  {
    id: "frame-gold",
    name: "👑 Gold Frame",
    description: "Elite status — reserved for top performers",
    type: "frame" as const,
    cost: 500,
    imageUrl: "/store/frame-gold.png",
  },
  {
    id: "frame-cyber",
    name: "⚡ Cyber Frame",
    description: "Neon glitch aesthetic for the grinders",
    type: "frame" as const,
    cost: 350,
    imageUrl: "/store/frame-cyber.png",
  },
  {
    id: "pro-trial",
    name: "PRO Trial (7 days)",
    description: "Try Benchline PRO — AI plans, unlimited goals, analytics",
    type: "pro_trial" as const,
    cost: 0,
    imageUrl: "/store/pro.png",
  },
];
