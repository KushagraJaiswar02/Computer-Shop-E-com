import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, ArrowRight, ShieldAlert, Sparkles } from 'lucide-react';
import { KeycapButton } from '../components/common/KeycapButton';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('rahul.sharma@example.com');
  const [password, setPassword] = useState('••••••••••••');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Demonstration auth success
    navigate('/account');
  };

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-900 flex items-center justify-center p-4 transition-colors">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-surface-850 rounded-2xl border border-slate-200 dark:border-surface-750 p-6 sm:p-8 shadow-soft-card">
          <div className="text-center mb-6">
            <Link to="/" className="inline-flex items-center gap-2 mb-3">
              <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white font-mono font-bold text-lg shadow-keycap">
                <span>CS</span>
              </div>
            </Link>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              Customer Account Access
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Demonstration Portal Preview
            </p>
          </div>

          <div className="mb-6 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 text-xs">
            <strong>Demonstration Notice:</strong> This authentication interface is a visual prototype for shop review. Any demo credentials can be used.
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-50 dark:bg-surface-800 border border-slate-300 dark:border-surface-700 text-slate-900 dark:text-white"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-50 dark:bg-surface-800 border border-slate-300 dark:border-surface-700 text-slate-900 dark:text-white"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="pt-2">
              <KeycapButton type="submit" variant="primary" size="md" className="w-full font-bold">
                <span>Enter Demonstration Account</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </KeycapButton>
            </div>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-surface-750 text-center text-xs text-slate-500">
            <span>Don't have an account yet? </span>
            <Link to="/auth/register" className="text-brand-600 dark:text-brand-400 font-semibold hover:underline">
              Create demo profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
