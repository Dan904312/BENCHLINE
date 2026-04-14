"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User, Goal, SessionLog, WeeklyPlan, Friend, StoreItem } from "./types";
import { v4 as uuidv4 } from "uuid";
import { calculateTokensEarned } from "./utils";

interface AppState {
  user: User | null;
  plans: WeeklyPlan[];
  logs: SessionLog[];
  isLoading: boolean;
  promoApplied: boolean;

  // Auth
  login: (name: string, email: string) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;

  // Goals
  addGoal: (goal: Goal) => void;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  removeGoal: (id: string) => void;

  // Plans
  addPlan: (plan: WeeklyPlan) => void;
  getPlanForGoal: (goalId: string) => WeeklyPlan | undefined;

  // Sessions
  logSession: (log: SessionLog) => void;
  completeSession: (goalId: string, weekNum: number, sessionId: string, value: number) => void;

  // Streak
  incrementStreak: () => void;
  useRestDay: () => boolean;

  // Tokens
  addTokens: (amount: number) => void;
  spendTokens: (amount: number) => boolean;

  // Friends
  addFriend: (friend: Friend) => void;
  removeFriend: (id: string) => void;

  // Pro / Subscription
  activatePro: (months?: number) => void;
  applyPromo: (code: string) => { success: boolean; message: string };

  // Store
  purchaseItem: (item: StoreItem) => boolean;

  // Streak guard
  checkAndUpdateStreak: () => void;
}

const DEMO_USER: User = {
  id: "user-1",
  name: "Demo Athlete",
  username: "@benchliner",
  email: "demo@benchline.app",
  avatar: "https://api.dicebear.com/8.x/bottts-neutral/svg?seed=benchline",
  frameId: "none",
  tokens: 340,
  streakDays: 7,
  longestStreak: 14,
  isPro: false,
  restDayTokens: 1,
  totalSessions: 23,
  joinedAt: new Date(Date.now() - 30 * 24 * 3600000).toISOString(),
  goals: [],
  friends: [
    {
      id: "f1",
      name: "Jake Morris",
      username: "@jakefit",
      avatar: "https://api.dicebear.com/8.x/bottts-neutral/svg?seed=jake",
      streakDays: 12,
      isPro: true,
      currentGoal: "Beep Test Level 10",
      improvementPercent: 18,
      status: "accepted",
    },
    {
      id: "f2",
      name: "Mia Chen",
      username: "@miarun",
      avatar: "https://api.dicebear.com/8.x/bottts-neutral/svg?seed=mia",
      streakDays: 5,
      isPro: false,
      currentGoal: "5km under 22 min",
      improvementPercent: 9,
      status: "accepted",
    },
  ],
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      plans: [],
      logs: [],
      isLoading: false,
      promoApplied: false,

      login: (name, email) => {
        const existing = get().user;
        if (!existing) {
          set({
            user: {
              ...DEMO_USER,
              name,
              email,
              id: uuidv4(),
            },
          });
        }
      },

      logout: () => set({ user: null, plans: [], logs: [] }),

      updateUser: (updates) =>
        set((s) => ({ user: s.user ? { ...s.user, ...updates } : s.user })),

      addGoal: (goal) =>
        set((s) => ({
          user: s.user ? { ...s.user, goals: [...s.user.goals, goal] } : s.user,
        })),

      updateGoal: (id, updates) =>
        set((s) => ({
          user: s.user
            ? {
                ...s.user,
                goals: s.user.goals.map((g) =>
                  g.id === id ? { ...g, ...updates } : g
                ),
              }
            : s.user,
        })),

      removeGoal: (id) =>
        set((s) => ({
          user: s.user
            ? { ...s.user, goals: s.user.goals.filter((g) => g.id !== id) }
            : s.user,
        })),

      addPlan: (plan) =>
        set((s) => ({
          plans: [...s.plans.filter((p) => p.goalId !== plan.goalId), plan],
        })),

      getPlanForGoal: (goalId) => get().plans.find((p) => p.goalId === goalId),

      logSession: (log) =>
        set((s) => ({ logs: [...s.logs, log] })),

      completeSession: (goalId, weekNum, sessionId, value) =>
        set((s) => {
          const plans = s.plans.map((plan) => {
            if (plan.goalId !== goalId) return plan;
            return {
              ...plan,
              weeks: plan.weeks.map((week) => {
                if (week.weekNumber !== weekNum) return week;
                return {
                  ...week,
                  sessions: week.sessions.map((session) => {
                    if (session.id !== sessionId) return session;
                    return { ...session, completed: true, loggedValue: value, loggedAt: new Date().toISOString() };
                  }),
                };
              }),
            };
          });
          return { plans };
        }),

      incrementStreak: () =>
        set((s) => {
          if (!s.user) return s;
          const newStreak = s.user.streakDays + 1;
          const tokens = s.user.tokens + calculateTokensEarned(newStreak, 5);
          return {
            user: {
              ...s.user,
              streakDays: newStreak,
              longestStreak: Math.max(s.user.longestStreak, newStreak),
              tokens,
              totalSessions: s.user.totalSessions + 1,
            },
          };
        }),

      useRestDay: () => {
        const { user } = get();
        if (!user || user.restDayTokens <= 0) return false;
        set((s) => ({
          user: s.user
            ? { ...s.user, restDayTokens: s.user.restDayTokens - 1 }
            : s.user,
        }));
        return true;
      },

      addTokens: (amount) =>
        set((s) => ({
          user: s.user ? { ...s.user, tokens: s.user.tokens + amount } : s.user,
        })),

      spendTokens: (amount) => {
        const { user } = get();
        if (!user || user.tokens < amount) return false;
        set((s) => ({
          user: s.user ? { ...s.user, tokens: s.user.tokens - amount } : s.user,
        }));
        return true;
      },

      addFriend: (friend) =>
        set((s) => ({
          user: s.user
            ? { ...s.user, friends: [...s.user.friends, friend] }
            : s.user,
        })),

      removeFriend: (id) =>
        set((s) => ({
          user: s.user
            ? { ...s.user, friends: s.user.friends.filter((f) => f.id !== id) }
            : s.user,
        })),

      activatePro: (months = 1) => {
        const expiry = new Date();
        expiry.setMonth(expiry.getMonth() + months);
        set((s) => ({
          user: s.user
            ? { ...s.user, isPro: true, proExpiresAt: expiry.toISOString() }
            : s.user,
        }));
      },

      applyPromo: (code: string) => {
        const validCode = process.env.NEXT_PUBLIC_PROMO_CODE || "DEV100FREE100";
        if (code.trim().toUpperCase() === validCode.toUpperCase()) {
          get().activatePro(12); // 12 months free
          set({ promoApplied: true });
          return { success: true, message: "✅ DEV promo applied — 12 months PRO unlocked!" };
        }
        return { success: false, message: "❌ Invalid promo code. Please try again." };
      },

      purchaseItem: (item) => {
        const { user, spendTokens } = get();
        if (!user) return false;
        if (item.type === "rest_day") {
          const qty = item.id.includes("bundle") ? 3 : 1;
          if (!spendTokens(item.cost)) return false;
          set((s) => ({
            user: s.user
              ? { ...s.user, restDayTokens: s.user.restDayTokens + qty }
              : s.user,
          }));
          return true;
        }
        if (item.type === "frame") {
          if (!spendTokens(item.cost)) return false;
          set((s) => ({ user: s.user ? { ...s.user, frameId: item.id } : s.user }));
          return true;
        }
        if (item.type === "pro_trial") {
          get().activatePro(0); // handled separately
          return true;
        }
        return false;
      },

      checkAndUpdateStreak: () => {
        const { user } = get();
        if (!user) return;
        const lastLog = get().logs[get().logs.length - 1];
        if (!lastLog) return;
        const lastDate = new Date(lastLog.loggedAt).toDateString();
        const today = new Date().toDateString();
        const yesterday = new Date(Date.now() - 86400000).toDateString();
        if (lastDate !== today && lastDate !== yesterday) {
          if (user.restDayTokens > 0) {
            get().useRestDay();
          } else {
            set((s) => ({
              user: s.user ? { ...s.user, streakDays: 0 } : s.user,
            }));
          }
        }
      },
    }),
    {
      name: "benchline-storage",
      partialize: (state) => ({
        user: state.user,
        plans: state.plans,
        logs: state.logs,
        promoApplied: state.promoApplied,
      }),
    }
  )
);
