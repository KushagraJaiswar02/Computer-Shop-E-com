import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, User, Phone, ArrowRight } from 'lucide-react';
import { KeycapButton } from '../components/common/KeycapButton';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
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
              Create Customer Profile
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Demonstration Registration
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Jordan Hayes"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-surface-800 border border-slate-300 dark:border-surface-700 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                placeholder="jordan@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-surface-800 border border-slate-300 dark:border-surface-700 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                required
                placeholder="+1 (555) 000-0000"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-surface-800 border border-slate-300 dark:border-surface-700 text-slate-900 dark:text-white font-mono"
              />
            </div>

            <div className="pt-2">
              <KeycapButton type="submit" variant="primary" size="md" className="w-full font-bold">
                <span>Complete Demonstration Registration</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </KeycapButton>
            </div>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-surface-750 text-center text-xs text-slate-500">
            <span>Already registered? </span>
            <Link to="/auth/login" className="text-brand-600 dark:text-brand-400 font-semibold hover:underline">
              Log in to demo
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
