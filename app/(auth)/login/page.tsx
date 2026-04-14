'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Zap } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    // TODO: replace with your real auth logic
    setTimeout(() => {
      if (email && password) {
        router.push('/dashboard');
      } else {
        setError('Please enter your email and password.');
        setLoading(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-surface-200 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 mb-2">
            <Zap size={22} className="text-lime-400" />
            <span className="font-display text-4xl text-white tracking-wide">BENCHLINE</span>
          </div>
          <p className="font-body text-sm text-white/30">Your outcome engine</p>
        </motion.div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleLogin}
          className="space-y-4"
        >
          <div>
            <label className="block font-body text-xs text-white/40 uppercase tracking-widest mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-3 rounded-xl bg-surface-50 border border-white/10 text-white font-body text-sm placeholder-white/20 focus:outline-none focus:border-lime-400/50 transition-colors"
              autoComplete="email"
            />
          </div>

          <div>
            <label className="block font-body text-xs text-white/40 uppercase tracking-widest mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl bg-surface-50 border border-white/10 text-white font-body text-sm placeholder-white/20 focus:outline-none focus:border-lime-400/50 transition-colors pr-12"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPass(s => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors"
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="font-body text-xs text-red-400 text-center"
            >
              {error}
            </motion.p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-lime-400 text-black font-body font-bold text-sm hover:bg-lime-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </motion.form>

        {/* Footer links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-6 text-center space-y-3"
        >
          <a href="/forgot-password" className="block font-body text-xs text-white/30 hover:text-white/60 transition-colors">
            Forgot password?
          </a>
          <p className="font-body text-xs text-white/20">
            No account?{' '}
            <a href="/signup" className="text-lime-400 hover:text-lime-300 transition-colors font-semibold">
              Sign up free
            </a>
          </p>
        </motion.div>

      </div>
    </div>
  );
}
