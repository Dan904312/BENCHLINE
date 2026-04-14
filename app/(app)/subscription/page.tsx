'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Zap, Star, ChevronDown, X, Tag } from 'lucide-react';

// ── promo config (set env var NEXT_PUBLIC_PROMO_CODE on Vercel) ───────────────
// The actual code is compared server-side in production; this client-side check
// is for the dev/testing bypass only.
const VALID_PROMO_CODES: Record<string, { discount: number; label: string }> = {
  DEV100FREE100: { discount: 100, label: '100% off — Dev Access' },
};

// ── plan data ─────────────────────────────────────────────────────────────────
const FEATURES_FREE = [
  '1 active goal',
  'Basic 4-week plan',
  'Session logging',
  'Token rewards',
  'Friend leaderboard',
];

const FEATURES_PRO = [
  'Unlimited goals',
  'AI-generated adaptive plans',
  'Real-time gap analysis',
  'Priority coaching feedback',
  'All profile frames',
  'Early access to new features',
  'Cancel anytime',
];

const MONTHLY_PRICE = 9;
const YEARLY_PRICE  = 86;
const YEARLY_FULL   = 108;

// ── faq data ──────────────────────────────────────────────────────────────────
const FAQS = [
  { q: 'Can I cancel anytime?',           a: 'Yes — cancel anytime from your account settings. No fees, no questions.' },
  { q: 'What payment methods are accepted?', a: 'All major cards, Apple Pay and Google Pay are supported.' },
  { q: 'Will my plan data be saved if I downgrade?', a: 'Yes. All your logged sessions and progress are always saved.' },
  { q: 'Is there a free trial?',           a: 'The free plan gives you full access to one goal forever. Upgrade when you\'re ready for more.' },
];

// ── faq row ───────────────────────────────────────────────────────────────────
function FAQRow({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-white/5 last:border-0">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between py-4 text-left"
      >
        <span className="font-body text-sm font-semibold text-white/80">{q}</span>
        <ChevronDown size={16} className={`text-white/30 transition-transform flex-shrink-0 ml-4 ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <p className="font-body text-sm text-white/40 pb-4">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── promo modal ───────────────────────────────────────────────────────────────
function PromoModal({ onClose, onApply }: {
  onClose: () => void;
  onApply: (code: string, discount: number, label: string) => void;
}) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const apply = () => {
    setError('');
    setLoading(true);
    setTimeout(() => {
      const upper = code.trim().toUpperCase();
      const promo = VALID_PROMO_CODES[upper];
      if (promo) {
        onApply(upper, promo.discount, promo.label);
        onClose();
      } else {
        setError('Invalid promo code. Please check and try again.');
      }
      setLoading(false);
    }, 600);
  };

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
          <h3 className="font-display text-2xl text-white">PROMO CODE</h3>
          <button onClick={onClose} className="text-white/30 hover:text-white"><X size={20} /></button>
        </div>

        <div className="flex items-center gap-2 bg-surface-50 border border-white/10 rounded-xl px-4 py-3 mb-2">
          <Tag size={14} className="text-white/30" />
          <input
            type="text"
            value={code}
            onChange={e => { setCode(e.target.value); setError(''); }}
            placeholder="Enter your code…"
            className="flex-1 bg-transparent font-body text-sm text-white placeholder-white/30 focus:outline-none uppercase tracking-widest"
            onKeyDown={e => e.key === 'Enter' && apply()}
            autoFocus
          />
        </div>

        {error && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-body text-xs text-red-400 mb-3 px-1">
            {error}
          </motion.p>
        )}

        <button
          onClick={apply}
          disabled={!code.trim() || loading}
          className="w-full py-3.5 rounded-xl bg-lime-400 text-black font-body font-bold text-sm disabled:opacity-30 hover:bg-lime-500 transition-colors mt-2"
        >
          {loading ? 'Checking…' : 'Apply Code'}
        </button>
      </motion.div>
    </motion.div>
  );
}

// ── page ──────────────────────────────────────────────────────────────────────
export default function SubscriptionPage() {
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('yearly');
  const [showPromo, setShowPromo] = useState(false);
  const [promo, setPromo] = useState<{ code: string; discount: number; label: string } | null>(null);
  const [subscribed, setSubscribed] = useState(false);

  const basePrice  = billing === 'monthly' ? MONTHLY_PRICE : YEARLY_PRICE;
  const finalPrice = promo ? basePrice * (1 - promo.discount / 100) : basePrice;
  const isFree     = finalPrice === 0;

  const handleApplyPromo = (code: string, discount: number, label: string) => {
    setPromo({ code, discount, label });
  };

  const handleSubscribe = () => {
    // In production: send to Stripe / payment processor
    // If 100% off promo, bypass payment
    if (isFree) {
      setSubscribed(true);
      return;
    }
    // TODO: redirect to Stripe checkout
    alert('Stripe checkout would open here. Add NEXT_PUBLIC_STRIPE_KEY to your env.');
  };

  if (subscribed) {
    return (
      <div className="min-h-screen bg-surface-200 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-sm"
        >
          <div className="w-20 h-20 rounded-full bg-lime-400/20 flex items-center justify-center mx-auto mb-6">
            <Star size={36} className="text-lime-400" />
          </div>
          <h1 className="font-display text-5xl text-lime-400 mb-3">PRO UNLOCKED</h1>
          <p className="font-body text-white/60 mb-6">Welcome to Benchline Pro. All features are now active.</p>
          <a href="/dashboard" className="inline-block bg-lime-400 text-black font-body font-bold text-sm px-8 py-3.5 rounded-full hover:bg-lime-500 transition-colors">
            Back to Dashboard
          </a>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-200 text-white">
      <div className="max-w-lg mx-auto px-4 pt-10 pb-32">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-lime-400/10 border border-lime-400/30 rounded-full px-4 py-1.5 mb-4">
            <Star size={13} className="text-lime-400" />
            <span className="font-body text-xs font-semibold text-lime-400 uppercase tracking-widest">Benchline Pro</span>
          </div>
          <h1 className="font-display text-5xl text-white mb-2">UNLOCK YOUR <span className="text-lime-400">FULL</span> POTENTIAL</h1>
          <p className="font-body text-sm text-white/40">AI coaching that adapts to you. Cancel anytime.</p>
        </motion.div>

        {/* Billing toggle */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex bg-surface-50 border border-white/5 rounded-xl p-1 mb-6"
        >
          {(['monthly', 'yearly'] as const).map(b => (
            <button
              key={b}
              onClick={() => setBilling(b)}
              className={`flex-1 py-2.5 rounded-lg font-body text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                billing === b ? 'bg-lime-400 text-black' : 'text-white/40 hover:text-white'
              }`}
            >
              {b === 'monthly' ? 'Monthly' : (
                <>Yearly <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${billing === 'yearly' ? 'bg-black/20 text-black' : 'bg-lime-400/20 text-lime-400'}`}>SAVE 20%</span></>
              )}
            </button>
          ))}
        </motion.div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 gap-4 mb-6">

          {/* Free plan */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-surface-50 border border-white/10 rounded-2xl p-5"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="font-display text-xl text-white">FREE</p>
                <p className="font-body text-xs text-white/30">Get started, no card needed</p>
              </div>
              <div className="text-right">
                <p className="font-display text-3xl text-white">$0</p>
                <p className="font-body text-xs text-white/30">forever</p>
              </div>
            </div>
            <ul className="space-y-2 mb-4">
              {FEATURES_FREE.map(f => (
                <li key={f} className="flex items-center gap-2.5 font-body text-sm text-white/60">
                  <Check size={14} className="text-white/30 flex-shrink-0" /> {f}
                </li>
              ))}
            </ul>
            <a href="/dashboard" className="block text-center w-full py-2.5 rounded-xl border border-white/10 font-body text-sm font-semibold text-white/40 hover:border-white/20 hover:text-white/60 transition-all">
              Current Plan
            </a>
          </motion.div>

          {/* Pro plan */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-lime-400/10 via-surface-50 to-surface-50 border border-lime-400/40 rounded-2xl p-5 relative overflow-hidden"
          >
            {/* Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-lime-400/10 rounded-full blur-3xl -translate-y-8 translate-x-8 pointer-events-none" />

            <div className="flex items-start justify-between mb-4 relative">
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="font-display text-xl text-lime-400">PRO</p>
                  <Star size={14} className="text-lime-400" />
                </div>
                <p className="font-body text-xs text-white/40">Everything, unlocked</p>
              </div>
              <div className="text-right">
                {promo && (
                  <p className="font-body text-xs text-white/30 line-through">${basePrice}/{billing === 'monthly' ? 'mo' : 'yr'}</p>
                )}
                {!promo && billing === 'yearly' && (
                  <p className="font-body text-xs text-white/30 line-through">${YEARLY_FULL}/yr</p>
                )}
                <p className="font-display text-3xl text-lime-400">
                  {isFree ? 'FREE' : `$${finalPrice}`}
                </p>
                <p className="font-body text-xs text-white/30">
                  {isFree ? 'promo applied' : `/${billing === 'monthly' ? 'mo' : 'yr'}`}
                </p>
              </div>
            </div>

            {/* Promo badge */}
            {promo && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2 bg-lime-400/15 border border-lime-400/30 rounded-lg px-3 py-2 mb-4"
              >
                <Tag size={13} className="text-lime-400" />
                <div className="flex-1">
                  <p className="font-body text-xs font-bold text-lime-400">{promo.label}</p>
                  <p className="font-body text-[10px] text-white/40">Code: {promo.code}</p>
                </div>
                <button onClick={() => setPromo(null)} className="text-white/30 hover:text-white"><X size={14} /></button>
              </motion.div>
            )}

            <ul className="space-y-2 mb-5 relative">
              {FEATURES_PRO.map(f => (
                <li key={f} className="flex items-center gap-2.5 font-body text-sm text-white/80">
                  <Check size={14} className="text-lime-400 flex-shrink-0" /> {f}
                </li>
              ))}
            </ul>

            <button
              onClick={handleSubscribe}
              className="w-full py-3.5 rounded-xl bg-lime-400 text-black font-body font-bold text-sm hover:bg-lime-500 transition-colors flex items-center justify-center gap-2 relative"
            >
              <Zap size={16} />
              {isFree ? 'Activate Pro — Free' : `Start Pro · $${finalPrice}/${billing === 'monthly' ? 'mo' : 'yr'}`}
            </button>
          </motion.div>
        </div>

        {/* Promo code button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center mb-8"
        >
          <button
            onClick={() => setShowPromo(true)}
            className="inline-flex items-center gap-1.5 text-white/30 hover:text-lime-400 font-body text-sm transition-colors"
          >
            <Tag size={14} /> Have a promo code?
          </button>
        </motion.div>

        {/* FAQ */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="bg-surface-50 border border-white/5 rounded-2xl px-5 divide-y divide-white/5"
        >
          {FAQS.map(f => <FAQRow key={f.q} q={f.q} a={f.a} />)}
        </motion.div>

        {/* Trust line */}
        <p className="font-body text-xs text-white/20 text-center mt-6">
          Secured by Stripe · SSL encrypted · Cancel anytime
        </p>

      </div>

      {/* Promo modal */}
      <AnimatePresence>
        {showPromo && (
          <PromoModal onClose={() => setShowPromo(false)} onApply={handleApplyPromo} />
        )}
      </AnimatePresence>
    </div>
  );
}
