'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Shield, Frame, Star, Check, Lock, ShoppingBag, X } from 'lucide-react';

// ── types ─────────────────────────────────────────────────────────────────────
interface StoreItem {
  id: string;
  name: string;
  description: string;
  cost: number;
  category: 'protection' | 'cosmetic' | 'boost' | 'pro';
  icon: React.ElementType;
  color: string;
  owned?: boolean;
  equipped?: boolean;
  requiresPro?: boolean;
}

// ── store items ───────────────────────────────────────────────────────────────
const ITEMS: StoreItem[] = [
  // Protection
  { id: 'rest1',  name: 'Rest Day Pass',    description: 'Skip one day without losing your streak. Good for one use.',         cost: 100, category: 'protection', icon: Shield, color: 'text-blue-400',   owned: false },
  { id: 'rest3',  name: '3-Day Shield',     description: 'Protect your streak for up to 3 missed days. Great for holidays.',  cost: 250, category: 'protection', icon: Shield, color: 'text-blue-400',   owned: false },
  { id: 'rest7',  name: 'Week Guard',       description: 'Full week streak protection. Peace of mind when life gets busy.',    cost: 500, category: 'protection', icon: Shield, color: 'text-purple-400', owned: false },

  // Cosmetic frames
  { id: 'frame1', name: 'Flame Frame',      description: 'Orange flame border for your profile picture.',                     cost: 200, category: 'cosmetic',   icon: Frame,  color: 'text-orange-400', owned: true,  equipped: true  },
  { id: 'frame2', name: 'Lime Elite',       description: 'Benchline green electric frame. Rare.',                             cost: 400, category: 'cosmetic',   icon: Frame,  color: 'text-lime-400',   owned: false },
  { id: 'frame3', name: 'Diamond Cut',      description: 'Exclusive for top 1% performers. Ultra rare.',                     cost: 800, category: 'cosmetic',   icon: Frame,  color: 'text-cyan-400',   requiresPro: true },

  // Boosts
  { id: 'boost1', name: 'Double Tokens',    description: 'Earn 2× tokens on your next session.',                             cost: 150, category: 'boost',      icon: Zap,    color: 'text-lime-400',   owned: false },
  { id: 'boost2', name: 'XP Surge',         description: '48-hour window where all sessions earn 1.5× tokens.',             cost: 350, category: 'boost',      icon: Zap,    color: 'text-yellow-400', owned: false },

  // Pro
  { id: 'pro',    name: 'Benchline Pro',    description: 'Unlock AI coaching, unlimited goals, and all premium frames.',     cost: 0,   category: 'pro',        icon: Star,   color: 'text-lime-400',   owned: false },
];

const CATEGORIES = [
  { key: 'all',        label: 'All' },
  { key: 'protection', label: 'Protection' },
  { key: 'cosmetic',   label: 'Frames' },
  { key: 'boost',      label: 'Boosts' },
];

// ── confirm modal ──────────────────────────────────────────────────────────────
function PurchaseModal({ item, balance, onConfirm, onClose }: {
  item: StoreItem;
  balance: number;
  onConfirm: () => void;
  onClose: () => void;
}) {
  const canAfford = balance >= item.cost;
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
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-2xl text-white">{item.name.toUpperCase()}</h3>
          <button onClick={onClose} className="text-white/30 hover:text-white"><X size={20} /></button>
        </div>

        <div className={`w-14 h-14 rounded-2xl bg-surface-50 border border-white/10 flex items-center justify-center mb-4`}>
          <item.icon size={26} className={item.color} />
        </div>

        <p className="font-body text-sm text-white/60 mb-5">{item.description}</p>

        <div className="flex items-center justify-between mb-5 py-3 border-y border-white/10">
          <span className="font-body text-sm text-white/40">Your balance</span>
          <span className={`font-display text-xl ${canAfford ? 'text-lime-400' : 'text-red-400'}`}>
            <Zap size={14} className="inline mr-1" />{balance}
          </span>
        </div>

        {!canAfford && (
          <p className="font-body text-xs text-red-400/80 mb-3 text-center">
            You need {item.cost - balance} more tokens. Keep logging sessions to earn more!
          </p>
        )}

        <button
          onClick={() => { onConfirm(); onClose(); }}
          disabled={!canAfford}
          className="w-full py-3.5 rounded-xl font-body font-bold text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed bg-lime-400 text-black hover:bg-lime-500"
        >
          <Zap size={16} /> Spend {item.cost} tokens
        </button>
      </motion.div>
    </motion.div>
  );
}

// ── item card ─────────────────────────────────────────────────────────────────
function ItemCard({ item, onBuy }: { item: StoreItem; onBuy: (item: StoreItem) => void }) {
  if (item.category === 'pro') {
    return (
      <motion.div
        whileHover={{ y: -2 }}
        className="col-span-2 bg-gradient-to-br from-lime-400/15 to-transparent border border-lime-400/30 rounded-2xl p-5 flex items-center gap-4"
      >
        <div className="w-12 h-12 rounded-xl bg-lime-400/20 flex items-center justify-center flex-shrink-0">
          <Star size={22} className="text-lime-400" />
        </div>
        <div className="flex-1">
          <p className="font-display text-lg text-lime-400">BENCHLINE PRO</p>
          <p className="font-body text-xs text-white/50">AI coaching · unlimited goals · all frames</p>
        </div>
        <a
          href="/subscription"
          className="flex-shrink-0 bg-lime-400 text-black font-body font-bold text-xs px-4 py-2 rounded-full hover:bg-lime-500 transition-colors"
        >
          View Plans
        </a>
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={`bg-surface-50 border rounded-2xl p-4 flex flex-col gap-3 transition-all ${
        item.equipped ? 'border-lime-400/40' : item.owned ? 'border-white/15' : 'border-white/5'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className={`w-10 h-10 rounded-xl bg-surface-200 flex items-center justify-center`}>
          <item.icon size={18} className={item.owned || item.equipped ? item.color : 'text-white/30'} />
        </div>
        {item.requiresPro && (
          <span className="flex items-center gap-1 text-[10px] font-body text-lime-400 bg-lime-400/10 px-2 py-0.5 rounded-full">
            <Star size={9} /> PRO
          </span>
        )}
        {item.equipped && (
          <span className="text-[10px] font-body text-lime-400 bg-lime-400/10 px-2 py-0.5 rounded-full">Equipped</span>
        )}
        {item.owned && !item.equipped && (
          <span className="text-[10px] font-body text-white/30 bg-white/5 px-2 py-0.5 rounded-full">Owned</span>
        )}
      </div>

      <div>
        <p className={`font-body text-sm font-bold ${item.owned ? 'text-white' : 'text-white/70'}`}>{item.name}</p>
        <p className="font-body text-xs text-white/30 leading-tight mt-0.5">{item.description}</p>
      </div>

      <div className="mt-auto">
        {item.owned ? (
          <button
            className={`w-full py-2 rounded-lg font-body text-xs font-bold transition-colors ${
              item.equipped
                ? 'bg-lime-400/10 text-lime-400 cursor-default'
                : 'bg-white/5 text-white/50 hover:bg-white/10'
            }`}
          >
            {item.equipped ? <><Check size={12} className="inline mr-1" />Equipped</> : 'Equip'}
          </button>
        ) : item.requiresPro ? (
          <button className="w-full py-2 rounded-lg bg-surface-200 text-white/20 font-body text-xs font-bold flex items-center justify-center gap-1 cursor-not-allowed">
            <Lock size={12} /> Pro Only
          </button>
        ) : (
          <button
            onClick={() => onBuy(item)}
            className="w-full py-2 rounded-lg bg-surface-200 border border-white/10 text-white/70 font-body text-xs font-bold flex items-center justify-center gap-1.5 hover:border-lime-400/30 hover:text-lime-400 transition-all"
          >
            <Zap size={12} /> {item.cost} tokens
          </button>
        )}
      </div>
    </motion.div>
  );
}

// ── page ──────────────────────────────────────────────────────────────────────
export default function StorePage() {
  const [balance, setBalance] = useState(620);
  const [items, setItems] = useState<StoreItem[]>(ITEMS);
  const [category, setCategory] = useState('all');
  const [buyTarget, setBuyTarget] = useState<StoreItem | null>(null);

  const filtered = items.filter(i => category === 'all' || i.category === category);

  const handlePurchase = (item: StoreItem) => {
    setBalance(b => b - item.cost);
    setItems(prev => prev.map(i => i.id === item.id ? { ...i, owned: true } : i));
  };

  return (
    <div className="min-h-screen bg-surface-200 text-white">
      <div className="max-w-lg mx-auto px-4 pt-10 pb-32">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="flex items-start justify-between mb-8">
          <div>
            <p className="font-body text-xs text-white/40 uppercase tracking-widest mb-1">Token Shop</p>
            <h1 className="font-display text-5xl text-white">STORE</h1>
          </div>
          <div className="bg-surface-50 border border-white/10 rounded-xl px-4 py-2.5 flex items-center gap-2">
            <Zap size={16} className="text-lime-400" />
            <span className="font-display text-xl text-lime-400">{balance}</span>
            <span className="font-body text-xs text-white/30">tokens</span>
          </div>
        </motion.div>

        {/* How to earn tokens */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-surface-50 border border-white/5 rounded-2xl px-4 py-3 mb-5 flex items-center gap-3"
        >
          <ShoppingBag size={16} className="text-white/30 flex-shrink-0" />
          <p className="font-body text-xs text-white/40">
            Earn tokens by <span className="text-white/70">logging sessions</span>, <span className="text-white/70">daily streaks</span>, and <span className="text-white/70">improving your %</span>
          </p>
        </motion.div>

        {/* Category tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map(c => (
            <button
              key={c.key}
              onClick={() => setCategory(c.key)}
              className={`flex-shrink-0 px-4 py-2 rounded-full font-body text-sm font-semibold border transition-all ${
                category === c.key
                  ? 'bg-lime-400 text-black border-lime-400'
                  : 'bg-surface-50 text-white/40 border-white/10 hover:border-white/20 hover:text-white/70'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Items grid */}
        <div className="grid grid-cols-2 gap-3">
          {filtered.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i }}
              className={item.category === 'pro' ? 'col-span-2' : ''}
            >
              <ItemCard item={item} onBuy={setBuyTarget} />
            </motion.div>
          ))}
        </div>

      </div>

      {/* Purchase modal */}
      <AnimatePresence>
        {buyTarget && (
          <PurchaseModal
            item={buyTarget}
            balance={balance}
            onConfirm={() => handlePurchase(buyTarget)}
            onClose={() => setBuyTarget(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
