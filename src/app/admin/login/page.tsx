'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, Mail, Eye, EyeOff, ShieldCheck, AlertCircle, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || 'Invalid administrator credentials');
        toast.error(data.error || 'Authentication failed');
        setLoading(false);
        return;
      }

      toast.success('Welcome back, Administrator!');
      router.push('/admin');
      router.refresh();
    } catch (err) {
      setError('A network error occurred. Please try again.');
      toast.error('Network error');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 sm:p-6 overflow-hidden bg-[#073D2B]">
      {/* Background panoramic landscape with deep green overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/herobanner.png"
          alt="Himalayan Mountains"
          fill
          priority
          className="object-cover object-center opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#073D2B] via-[#064B32]/90 to-[#073D2B]/95" />
      </div>

      {/* Decorative ambient lights */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#E9BE54]/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-[#0B6B43]/20 blur-3xl pointer-events-none" />

      {/* Main Login Card */}
      <div className="relative z-10 w-full max-w-md">
        {/* Back to store link */}
        <div className="mb-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-100 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Return to Himali Fresh Store</span>
          </Link>
        </div>

        {/* Solid White Card for 100% Crisp Contrast */}
        <div className="rounded-3xl bg-white p-7 sm:p-9 shadow-2xl border border-gray-100 text-gray-900">
          {/* Header Branding */}
          <div className="text-center mb-7">
            <div className="relative mx-auto mb-3 h-20 w-20 rounded-full overflow-hidden border-2 border-[#E9BE54] shadow-md transition-transform hover:scale-105">
              <Image
                src="/images/logo.jpg"
                alt="Himali Fresh Logo"
                fill
                className="object-cover"
              />
            </div>
            <h1 className="font-serif text-2xl font-bold tracking-tight text-[#064B32]">
              Himali Fresh
            </h1>
            <p className="text-[11px] font-bold tracking-widest text-[#E9BE54] uppercase mt-0.5">
              The Spirit of Himalayas
            </p>
            <div className="inline-flex items-center gap-1.5 mt-2.5 px-3 py-1 rounded-full bg-[#EBF5EF] text-[11px] font-semibold text-[#064B32]">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Owner &amp; Admin Portal</span>
            </div>
          </div>

          {/* Error notice */}
          {error && (
            <div className="mb-5 rounded-xl bg-red-50 border border-red-200 p-3 text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-800 mb-1.5">
                Admin Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@himalifresh.com"
                  className="w-full rounded-xl border border-gray-300 bg-white p-3.5 pl-10 text-sm text-gray-900 placeholder-gray-400 focus:border-[#064B32] focus:outline-none focus:ring-2 focus:ring-[#064B32]/20 transition-all shadow-sm"
                />
                <Mail className="absolute left-3.5 top-4 h-4 w-4 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-800 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full rounded-xl border border-gray-300 bg-white p-3.5 pl-10 pr-10 text-sm text-gray-900 placeholder-gray-400 focus:border-[#064B32] focus:outline-none focus:ring-2 focus:ring-[#064B32]/20 transition-all shadow-sm"
                />
                <Lock className="absolute left-3.5 top-4 h-4 w-4 text-gray-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-4 text-gray-400 hover:text-gray-700 transition-colors"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 flex items-center justify-center gap-2 rounded-xl bg-[#064B32] py-3.5 px-6 text-sm font-semibold text-white shadow-lg hover:bg-[#073D2B] transition-all disabled:opacity-60 active:scale-[0.99]"
            >
              {loading ? (
                <span className="animate-pulse flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Authenticating...
                </span>
              ) : (
                <>
                  <ShieldCheck className="h-4 w-4 text-[#E9BE54]" />
                  <span>Sign In to Dashboard</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer info */}
        <p className="text-center text-[11px] text-emerald-100/70 mt-5">
          Himali Fresh • Siliguri, West Bengal • Secure Staff Access Only
        </p>
      </div>
    </div>
  );
}
