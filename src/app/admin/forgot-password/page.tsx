'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, ArrowRight, ArrowLeft, ShieldCheck, RefreshCw, KeyRound, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<'request' | 'verify' | 'reset' | 'success'>('request');
  const [email, setEmail] = useState('');
  const [challengeId, setChallengeId] = useState<string | null>(null);
  const [otp, setOtp] = useState('');
  const [resetToken, setResetToken] = useState<string | null>(null);

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError('Please provide your administrator email address.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/admin/auth/otp/forgot-password-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Unable to request password reset code.');
        setLoading(false);
        return;
      }

      setChallengeId(data.challengeId || null);
      setCooldown(data.cooldownSeconds || 60);
      setStep('verify');
      setLoading(false);
      toast.success('If an admin account exists, a 6-digit code has been sent!');
    } catch (err) {
      setError('Connection error. Please try again.');
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!challengeId || otp.trim().length !== 6) {
      setError('Please enter the 6-digit verification code.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/admin/auth/otp/forgot-password-verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          challengeId,
          otp: otp.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || 'Invalid verification code.');
        setLoading(false);
        return;
      }

      setResetToken(data.resetToken);
      setStep('reset');
      setLoading(false);
      toast.success('Admin code verified. Please set your new password.');
    } catch (err) {
      setError('Connection error. Please try again.');
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!newPassword || newPassword.length < 6) {
      setError('New password must be at least 6 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!resetToken) {
      setError('Admin reset session expired. Please start again.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/admin/auth/otp/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resetToken,
          newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || 'Failed to reset admin password.');
        setLoading(false);
        return;
      }

      setStep('success');
      setLoading(false);
      toast.success('Admin password reset successfully!');
    } catch (err) {
      setError('Connection error. Please try again.');
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (cooldown > 0 || !challengeId || resending) return;
    setError(null);
    setResending(true);

    try {
      const res = await fetch('/api/auth/otp/resend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ challengeId }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || 'Failed to resend code.');
        setResending(false);
        return;
      }

      setCooldown(data.cooldownSeconds || 60);
      setOtp('');
      toast.success('A new 6-digit code has been sent!');
    } catch (err) {
      setError('Failed to resend code. Please try again.');
    } finally {
      setResending(false);
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

      {/* Main Card */}
      <div className="relative z-10 w-full max-w-md">
        {/* Back link */}
        <div className="mb-4">
          <Link
            href="/admin/login"
            className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-100 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Return to Admin Login</span>
          </Link>
        </div>

        {/* Solid White Card */}
        <div className="rounded-3xl bg-white p-7 sm:p-9 shadow-2xl border border-gray-100 text-gray-900">
          {/* Header Branding */}
          <div className="text-center mb-6">
            <div className="relative mx-auto mb-3 h-16 w-16 rounded-full overflow-hidden border-2 border-[#E9BE54] shadow-md">
              <Image
                src="/images/logo.jpg"
                alt="Himali Fresh Logo"
                fill
                className="object-cover"
              />
            </div>
            <h1 className="font-serif text-2xl font-bold tracking-tight text-[#064B32]">
              {step === 'request' && 'Admin Password Reset'}
              {step === 'verify' && 'Verify Admin Code'}
              {step === 'reset' && 'Set Admin Password'}
              {step === 'success' && 'Reset Complete'}
            </h1>
            <div className="inline-flex items-center gap-1.5 mt-2 px-3 py-0.5 rounded-full bg-[#EBF5EF] text-[11px] font-semibold text-[#064B32]">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Owner &amp; Admin Security</span>
            </div>
          </div>

          {error && (
            <div className="mb-4 rounded-xl bg-red-50 p-3.5 text-xs text-red-700 border border-red-200">
              {error}
            </div>
          )}

          {step === 'request' && (
            <form className="space-y-4" onSubmit={handleRequestOtp}>
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
                    className="w-full rounded-xl border border-gray-300 bg-white p-3 pl-10 text-sm text-gray-900 placeholder-gray-400 focus:border-[#064B32] focus:outline-none focus:ring-2 focus:ring-[#064B32]/20 transition-all shadow-sm"
                  />
                  <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#064B32] py-3 px-4 text-sm font-semibold text-white shadow-md hover:bg-[#073D2B] transition-all disabled:opacity-50 mt-2"
              >
                {loading ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <>
                    <span>Send Verification Code</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {step === 'verify' && (
            <form className="space-y-4" onSubmit={handleVerifyOtp}>
              <div>
                <label className="block text-center text-xs font-semibold text-gray-800 mb-2">
                  6-Digit Admin Verification Code
                </label>
                <div className="relative">
                  <input
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="123456"
                    className="w-full text-center tracking-[0.5em] text-2xl font-mono font-bold rounded-xl border border-gray-300 bg-gray-50/70 py-3 text-gray-900 placeholder-gray-300 focus:border-[#064B32] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#064B32]/20 transition-all"
                  />
                </div>
                <p className="text-center text-[11px] text-gray-500 mt-1.5">
                  Code expires in 5 minutes
                </p>
              </div>

              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#064B32] py-3 px-4 text-sm font-semibold text-white shadow-md hover:bg-[#073D2B] transition-all disabled:opacity-50"
              >
                {loading ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <>
                    <KeyRound className="h-4 w-4" />
                    <span>Verify Admin Code</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setStep('request');
                    setError(null);
                  }}
                  className="inline-flex items-center gap-1 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Change Email</span>
                </button>

                <button
                  type="button"
                  disabled={cooldown > 0 || resending}
                  onClick={handleResendOtp}
                  className="inline-flex items-center gap-1 font-semibold text-[#064B32] hover:text-[#0B6B43] disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${resending ? 'animate-spin' : ''}`} />
                  <span>{cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend Code'}</span>
                </button>
              </div>
            </form>
          )}

          {step === 'reset' && (
            <form className="space-y-4" onSubmit={handleResetPassword}>
              <div>
                <label className="block text-xs font-semibold text-gray-800 mb-1.5">
                  New Admin Password (min 6 characters)
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full rounded-xl border border-gray-300 bg-white p-3 pl-10 pr-10 text-sm text-gray-900 placeholder-gray-400 focus:border-[#064B32] focus:outline-none focus:ring-2 focus:ring-[#064B32]/20 transition-all shadow-sm"
                  />
                  <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-gray-400 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-800 mb-1.5">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full rounded-xl border border-gray-300 bg-white p-3 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 focus:border-[#064B32] focus:outline-none focus:ring-2 focus:ring-[#064B32]/20 transition-all shadow-sm"
                  />
                  <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#064B32] py-3 px-4 text-sm font-semibold text-white shadow-md hover:bg-[#073D2B] transition-all disabled:opacity-50 mt-2"
              >
                {loading ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <>
                    <KeyRound className="h-4 w-4" />
                    <span>Update Admin Password</span>
                  </>
                )}
              </button>
            </form>
          )}

          {step === 'success' && (
            <div className="text-center py-4 space-y-4">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-emerald-50 text-emerald-600">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-900">Admin Password Updated</h3>
                <p className="text-xs text-gray-600 mt-1">
                  Your administrator password has been updated. All previous admin sessions have been invalidated for security.
                </p>
              </div>
              <button
                type="button"
                onClick={() => router.push('/admin/login')}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#064B32] py-3 px-4 text-sm font-semibold text-white shadow-md hover:bg-[#073D2B] transition-all"
              >
                <span>Return to Admin Login</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Return link */}
          <div className="mt-6 pt-6 border-t border-gray-100 text-center">
            <Link
              href="/admin/login"
              className="text-xs font-semibold text-[#064B32] hover:underline"
            >
              Back to Admin Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
