'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Trophy, Zap, Flame, Plus, X, Search, Swords, ChevronRight } from 'lucide-react';
import Image from 'next/image';

// ── types ─────────────────────────────────────────────────────────────────────
interface Friend {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  streak: number;
  tokens: number;
  improvement: number; // % this week
  goal: string;
  rank: number;
}

interface Challenge {
  id: string;
  from: string;
  type: string;
  description: string;
  endsIn: string;
  accepted: boolean;
}

// ── mock data ─────────────────────────────────────────────────────────────────
const LEADERBOARD: Friend[] = [
  { id: '1', name: 'You',        handle: 'you',    avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=you',    streak: 7,  tokens: 620,  improvement: 12, goal: 'Beep Test Lvl 10', rank: 1 },
  { id: '2', name: 'Jake M.',    handle: 'jakem',  avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=jake',   streak: 5,  tokens: 540,  improvement: 9,  goal: '5km Under 22min',  rank: 2 },
  { id: '3', name: 'Mia K.',     handle: 'miak',   avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=mia',    streak: 12, tokens: 480,  improvement: 7,  goal: 'Make School Team', rank: 3 },
  { id: '4', name: 'Tom R.',     handle: 'tomr',   avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=tom',    streak: 2,  tokens: 310,  improvement: 4,  goal: 'Swim 50m Under 35s',rank: 4 },
  { id: '5', name: 'Priya S.',   handle: 'priya',  avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=priya',  streak: 8,  tokens: 290,  improvement: 3,  goal: 'Beep Test Lvl 8',  rank: 5 },
];

const CHALLENGES: Challenge[] = [
  { id: 'c1', from: 'Jake M.',  type: '7-Day Streak',     description: 'Both log every day for 7 days. First to miss loses.', endsIn: '5 days',  accepted: true },
  { id: 'c2', from: 'Mia K.',   type: 'Most Improved',    description: 'Highest % improvement this week wins 100 bonus tokens.', endsIn: '2 days', accepted: false },
];

const RANK_COLORS = ['text-yellow-400', 'text-gray-300', 'text-orange-400'];
const RANK_BG     = ['bg-yellow-400/10', 'bg-gray-300/10', 'bg-orange-400/10'];

// ── add friend modal ──────────────────────────────────────────────────────────
function AddFriendModal({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState('');
  const [sent, setSent] = useState(false);

  return (
    <motion.div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-end justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-surface-100 border border-white/10 rounded-2xl p-6 w-full max-w-md"
        initial={{ y: 60 }}
        animate={{ y: 0 }}
        exit={{ y: 60 }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-display text-2xl text-white">ADD FRIEND</h3>
          <button onClick={onClose} className="text-white/30 hover:text-white transition-colors"><X size={20} /></button>
        </div>
        {sent ? (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-6">
            <div className="w-14 h-14 rounded-full bg-lime-400/20 flex items-center justify-center mx-auto mb-3">
              <Users size={24} className="text-lime-400" />
            </div>
            <p className="font-body font-semibold text-white mb-1">Request sent!</p>
            <p className="font-body text-sm text-white/40">They'll appear on your leaderboard once they accept.</p>
          </motion.div>
        ) : (
          <>
            <div className="flex items-center gap-3 bg-surface-50 border border-white/10 rounded-xl px-4 py-3 mb-4">
              <Search size={16} className="text-white/30" />
              <input
                type="text"
                placeholder="Search by username or name…"
                value={query}
                onChange={e => setQuery(e.target.value)}
                className="flex-1 bg-transparent font-body text-sm text-white placeholder-white/30 focus:outline-none"
                autoFocus
              />
            </div>
            <button
              onClick={() => query.trim() && setSent(true)}
              disabled={!query.trim()}
              className="w-full py-3.5 rounded-xl bg-lime-400 text-black font-body font-bold text-sm disabled:opacity-30 hover:bg-lime-500 transition-colors"
            >
              Send Friend Request
            </button>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}

// ── challenge card ────────────────────────────────────────────────────────────
function ChallengeCard({ challenge, onAccept }: { challenge: Challenge; onAccept: (id: string) => void }) {
  return (
    <div className="bg-surface-50 border border-white/10 rounded-2xl p-4">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div>
          <p className="font-body text-xs text-white/40 mb-0.5">{challenge.from}</p>
          <p className="font-display text-lg text-white">{challenge.type.toUpperCase()}</p>
        </div>
        <span className="text-xs font-body text-white/30 flex-shrink-0">{challenge.endsIn} left</span>
      </div>
      <p className="font-body text-sm text-white/50 mb-3">{challenge.description}</p>
      {challenge.accepted ? (
        <span className="inline-flex items-center gap-1.5 text-xs font-body font-semibold text-lime-400">
          <Swords size={12} /> In Progress
        </span>
      ) : (
        <button
          onClick={() => onAccept(challenge.id)}
          className="bg-lime-400 text-black font-body font-bold text-xs px-4 py-2 rounded-full hover:bg-lime-500 transition-colors"
        >
          Accept Challenge
        </button>
      )}
    </div>
  );
}

// ── page ──────────────────────────────────────────────────────────────────────
export default function FriendsPage() {
  const [tab, setTab] = useState<'leaderboard' | 'challenges'>('leaderboard');
  const [showAdd, setShowAdd] = useState(false);
  const [challenges, setChallenges] = useState<Challenge[]>(CHALLENGES);

  const acceptChallenge = (id: string) =>
    setChallenges(prev => prev.map(c => c.id === id ? { ...c, accepted: true } : c));

  return (
    <div className="min-h-screen bg-surface-200 text-white">
      <div className="max-w-lg mx-auto px-4 pt-10 pb-32">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8">
          <div>
            <p className="font-body text-xs text-white/40 uppercase tracking-widest mb-1">Squad</p>
            <h1 className="font-display text-5xl text-white">FRIENDS</h1>
          </div>
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 bg-lime-400 text-black font-body font-bold text-sm px-4 py-2.5 rounded-full hover:bg-lime-500 transition-colors"
          >
            <Plus size={16} /> Add Friend
          </button>
        </motion.div>

        {/* Tabs */}
        <div className="flex bg-surface-50 border border-white/5 rounded-xl p-1 mb-6">
          {(['leaderboard', 'challenges'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2.5 rounded-lg font-body text-sm font-semibold transition-all capitalize ${
                tab === t ? 'bg-lime-400 text-black' : 'text-white/40 hover:text-white'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {tab === 'leaderboard' ? (
            <motion.div key="lb" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              {/* Weekly reset note */}
              <p className="font-body text-xs text-white/30 text-center mb-4">Ranked by % improvement · resets Sunday</p>

              <div className="flex flex-col gap-2">
                {LEADERBOARD.map((f, i) => (
                  <motion.div
                    key={f.id}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.06 * i }}
                    className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${
                      f.handle === 'you'
                        ? 'bg-lime-400/10 border-lime-400/30'
                        : 'bg-surface-50 border-white/5 hover:border-white/15'
                    }`}
                  >
                    {/* Rank */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      i < 3 ? RANK_BG[i] : 'bg-surface-200'
                    }`}>
                      {i < 3
                        ? <Trophy size={14} className={RANK_COLORS[i]} />
                        : <span className="font-display text-sm text-white/30">{f.rank}</span>
                      }
                    </div>

                    {/* Avatar */}
                    <div className="w-9 h-9 rounded-full overflow-hidden bg-surface-200 flex-shrink-0">
                      <Image src={f.avatar} alt={f.name} width={36} height={36} />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`font-body text-sm font-bold ${f.handle === 'you' ? 'text-lime-400' : 'text-white'}`}>
                          {f.name}
                        </span>
                        {f.handle === 'you' && <span className="text-[10px] bg-lime-400/20 text-lime-400 font-body font-semibold px-1.5 py-0.5 rounded">YOU</span>}
                      </div>
                      <p className="font-body text-xs text-white/30 truncate">{f.goal}</p>
                    </div>

                    {/* Stats */}
                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      <span className="font-display text-base text-lime-400">+{f.improvement}%</span>
                      <div className="flex items-center gap-2 text-xs font-body text-white/30">
                        <span className="flex items-center gap-0.5"><Flame size={10} className="text-orange-400" />{f.streak}d</span>
                        <span className="flex items-center gap-0.5"><Zap size={10} className="text-lime-400/60" />{f.tokens}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Challenge someone CTA */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-6 bg-surface-50 border border-white/5 rounded-2xl p-4 flex items-center gap-4"
              >
                <Swords size={20} className="text-lime-400 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-body text-sm font-semibold text-white">Challenge a friend</p>
                  <p className="font-body text-xs text-white/40">Compete on streaks or improvement %</p>
                </div>
                <button onClick={() => setTab('challenges')} className="text-lime-400 hover:text-white transition-colors">
                  <ChevronRight size={18} />
                </button>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div key="ch" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="flex flex-col gap-3">
                {challenges.map((c, i) => (
                  <motion.div key={c.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 * i }}>
                    <ChallengeCard challenge={c} onAccept={acceptChallenge} />
                  </motion.div>
                ))}
              </div>

              {/* Create challenge */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mt-4">
                <button className="w-full py-3.5 border border-dashed border-white/15 rounded-2xl font-body text-sm text-white/40 hover:border-lime-400/30 hover:text-lime-400 transition-all flex items-center justify-center gap-2">
                  <Swords size={16} /> Create New Challenge
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* Add friend modal */}
      <AnimatePresence>
        {showAdd && <AddFriendModal onClose={() => setShowAdd(false)} />}
      </AnimatePresence>
    </div>
  );
}
