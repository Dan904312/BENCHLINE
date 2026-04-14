'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Zap, Target, ChevronRight, Flame, Award, BarChart2 } from 'lucide-react';
import Link from 'next/link';

// ── types ────────────────────────────────────────────────────────────────────
interface Goal {
  id: string;
  title: string;
  sport: string;
  target: string;
  current: number;   // 0-100 progress
  daysLeft: number;
  streak: number;
  tokens: number;
}

// ── mock data (replace with your Zustand store / API) ────────────────────────
const MOCK_GOALS: Goal[] = [
  { id: '1', title: 'Beep Test Level 10', sport: 'Fitness', target: 'Level 10.0', current: 64, daysLeft: 18, streak: 7, tokens: 420 },
  { id: '2', title: '5km Under 22 Min',   sport: 'Running', target: '22:00',      current: 41, daysLeft: 30, streak: 3, tokens: 180 },
];

const STATS = [
  { label: 'Total Sessions', value: '24',  icon: BarChart2, color: 'text-lime-400' },
  { label: 'Day Streak',     value: '7',   icon: Flame,     color: 'text-orange-400' },
  { label: 'Tokens Earned',  value: '600', icon: Zap,       color: 'text-lime-400' },
  { label: 'Goals Active',   value: '2',   icon: Target,    color: 'text-blue-400' },
];

// ── ring component ────────────────────────────────────────────────────────────
function ProgressRing({ pct, size = 120, stroke = 10, color = '#C8FF00' }: {
  pct: number; size?: number; stroke?: number; color?: string;
}) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#1A1A1A" strokeWidth={stroke} />
      <motion.circle
        cx={size/2} cy={size/2} r={r}
        fill="none" stroke={color} strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circ}
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
      />
    </svg>
  );
}

// ── goal card ─────────────────────────────────────────────────────────────────
function GoalCard({ goal, index }: { goal: Goal; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 * index, duration: 0.45 }}
      className="bg-surface-50 border border-white/5 rounded-2xl p-6 flex gap-6 items-center hover:border-lime-400/30 transition-colors"
    >
      {/* Ring */}
      <div className="relative flex-shrink-0">
        <ProgressRing pct={goal.current} />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-2xl text-lime-400">{goal.current}%</span>
          <span className="text-[10px] text-white/40 font-body uppercase tracking-wider">done</span>
        </div>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[11px] font-body font-semibold text-lime-400/70 uppercase tracking-widest">{goal.sport}</span>
        </div>
        <h3 className="font-display text-xl text-white leading-tight mb-1">{goal.title}</h3>
        <p className="text-sm text-white/50 font-body mb-3">Target: <span className="text-white/80">{goal.target}</span></p>

        <div className="flex items-center gap-4 text-xs font-body">
          <span className="flex items-center gap-1 text-orange-400">
            <Flame size={12} /> {goal.streak}d streak
          </span>
          <span className="text-white/40">{goal.daysLeft} days left</span>
          <span className="flex items-center gap-1 text-lime-400/70">
            <Zap size={12} /> {goal.tokens} tokens
          </span>
        </div>
      </div>

      {/* CTA */}
      <Link
        href="/plan"
        className="flex-shrink-0 flex items-center gap-1 text-xs font-body font-semibold text-lime-400 hover:text-white transition-colors"
      >
        Train <ChevronRight size={14} />
      </Link>
    </motion.div>
  );
}

// ── page ──────────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const [goals] = useState<Goal[]>(MOCK_GOALS);

  return (
    <div className="min-h-screen bg-surface-200 text-white">
      <div className="max-w-2xl mx-auto px-4 pt-10 pb-32">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <p className="font-body text-sm text-white/40 uppercase tracking-widest mb-1">Good morning</p>
          <h1 className="font-display text-5xl text-white leading-none">YOUR <span className="text-lime-400">BENCHLINE</span></h1>
        </motion.div>

        {/* Stats row */}
        <div className="grid grid-cols-4 gap-3 mb-8">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.05 * i, duration: 0.35 }}
              className="bg-surface-50 border border-white/5 rounded-xl p-3 flex flex-col items-center text-center"
            >
              <s.icon size={16} className={`${s.color} mb-1`} />
              <span className={`font-display text-2xl ${s.color}`}>{s.value}</span>
              <span className="text-[9px] font-body text-white/30 uppercase tracking-wider leading-tight">{s.label}</span>
            </motion.div>
          ))}
        </div>

        {/* Active goals */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-display text-2xl text-white">ACTIVE GOALS</h2>
          <Link href="/goals/new" className="text-xs font-body font-semibold text-lime-400 hover:text-white transition-colors flex items-center gap-1">
            + New goal
          </Link>
        </div>

        {goals.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-surface-50 border border-dashed border-white/10 rounded-2xl p-10 text-center"
          >
            <Target size={36} className="text-white/20 mx-auto mb-3" />
            <p className="font-body text-white/40 mb-4">No active goals yet.</p>
            <Link
              href="/goals/new"
              className="inline-block bg-lime-400 text-black font-body font-bold text-sm px-6 py-2.5 rounded-full hover:bg-lime-500 transition-colors"
            >
              Set your first goal
            </Link>
          </motion.div>
        ) : (
          <div className="flex flex-col gap-4">
            {goals.map((g, i) => <GoalCard key={g.id} goal={g} index={i} />)}
          </div>
        )}

        {/* Weekly summary teaser */}
        {goals.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-6 bg-gradient-to-br from-lime-400/10 to-transparent border border-lime-400/20 rounded-2xl p-5 flex items-center gap-4"
          >
            <div className="w-10 h-10 rounded-full bg-lime-400/20 flex items-center justify-center flex-shrink-0">
              <TrendingUp size={18} className="text-lime-400" />
            </div>
            <div className="flex-1">
              <p className="font-body text-sm font-semibold text-white">You're ahead of schedule 🔥</p>
              <p className="font-body text-xs text-white/40">Your beep test progress is 8% above target pace.</p>
            </div>
            <Link href="/plan" className="flex-shrink-0">
              <ChevronRight size={18} className="text-lime-400" />
            </Link>
          </motion.div>
        )}

        {/* Achievements teaser */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-4 flex items-center gap-3 p-4 bg-surface-50 border border-white/5 rounded-2xl"
        >
          <Award size={20} className="text-yellow-400 flex-shrink-0" />
          <p className="font-body text-sm text-white/60 flex-1">
            <span className="text-white font-semibold">3 new achievements</span> unlocked this week
          </p>
          <Link href="/store" className="text-xs text-lime-400 font-body font-semibold hover:text-white transition-colors">
            Redeem →
          </Link>
        </motion.div>

      </div>
    </div>
  );
}
