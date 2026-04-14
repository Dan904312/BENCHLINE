export type Sport =
  | "running"
  | "basketball"
  | "football"
  | "swimming"
  | "fitness"
  | "cycling"
  | "soccer"
  | "tennis"
  | "other";

export type GoalType =
  | "beep_test"
  | "5km_run"
  | "2_4km_run"
  | "make_team"
  | "custom";

export interface Goal {
  id: string;
  sport: Sport;
  type: GoalType;
  title: string;
  targetValue: number;
  targetUnit: string;
  currentValue: number;
  deadline: string; // ISO date
  createdAt: string;
  status: "active" | "completed" | "paused";
  benchmarkStandard: string;
  quizAnswers?: QuizAnswers;
}

export interface QuizAnswers {
  trainingDaysPerWeek: number;
  currentFitnessLevel: "beginner" | "intermediate" | "advanced";
  availableEquipment: string[];
  injuryHistory: string;
  mainWeakness: string;
}

export interface WeeklyPlan {
  goalId: string;
  weeks: Week[];
  generatedAt: string;
  aiNotes: string;
}

export interface Week {
  weekNumber: number;
  theme: string;
  sessions: Session[];
}

export interface Session {
  id: string;
  day: string;
  title: string;
  description: string;
  targetMetric: string;
  targetValue: number;
  unit: string;
  type: "workout" | "test" | "rest" | "recovery";
  completed: boolean;
  loggedValue?: number;
  loggedAt?: string;
}

export interface SessionLog {
  id: string;
  sessionId: string;
  goalId: string;
  value: number;
  unit: string;
  notes?: string;
  loggedAt: string;
  streakDay: number;
}

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar: string;
  frameId: string;
  tokens: number;
  streakDays: number;
  longestStreak: number;
  isPro: boolean;
  proExpiresAt?: string;
  restDayTokens: number;
  totalSessions: number;
  joinedAt: string;
  goals: Goal[];
  friends: Friend[];
}

export interface Friend {
  id: string;
  name: string;
  username: string;
  avatar: string;
  streakDays: number;
  isPro: boolean;
  currentGoal?: string;
  improvementPercent: number;
  status: "pending" | "accepted";
}

export interface Challenge {
  id: string;
  challengerId: string;
  challengedId: string;
  type: "streak" | "improvement" | "goal_completion";
  title: string;
  endDate: string;
  status: "active" | "completed" | "declined";
  winnerId?: string;
}

export interface StoreItem {
  id: string;
  name: string;
  description: string;
  type: "frame" | "rest_day" | "pro_trial" | "boost";
  cost: number;
  imageUrl: string;
  isPurchased?: boolean;
}

export interface ProgressPoint {
  date: string;
  value: number;
  percentToGoal: number;
}

export interface GapAnalysis {
  currentLevel: string;
  targetLevel: string;
  gaps: Gap[];
  priorityFocus: string;
  estimatedWeeks: number;
}

export interface Gap {
  area: string;
  severity: "critical" | "moderate" | "minor";
  description: string;
  actionItems: string[];
}
