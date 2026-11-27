'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, ArrowRight, ArrowLeft, ShieldCheck, RefreshCw, KeyRound, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export default function ForgotPasswordPage() {
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
      setError('Please provide your registered email address.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/otp/forgot-password-request', {
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
      toast.success('If an account exists, a 6-digit code has been sent!');
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
      const res = await fetch('/api/auth/otp/forgot-password-verify', {
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
      toast.success('Code verified. You can now set a new password.');
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
      setError('Reset session expired. Please start again.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/otp/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resetToken,
          newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || 'Failed to reset password.');
        setLoading(false);
        return;
      }

      setStep('success');
      setLoading(false);
      toast.success('Password updated successfully!');
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
    <div className="min-h-screen bg-[#F8F0E4] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Mountain Ambience */}
      <div className="absolute inset-0 z-0 opacity-15 pointer-events-none">
        <Image
          src="/images/herobanner.png"
          alt="Himalayan Background"
          fill
          className="object-cover object-bottom"
        />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        {/* Brand Logo & Title */}
        <div className="text-center">
          <Link href="/" className="inline-block transition-transform hover:scale-105">
            <div className="relative h-16 w-16 mx-auto rounded-full overflow-hidden border-2 border-[#E9BE54] shadow-md bg-white">
              <Image
                src="/images/logo.jpg"
                alt="Himali Fresh"
                fill
                className="object-cover"
                priority
              />
            </div>
          </Link>
          <h2 className="mt-4 font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#064B32]">
            {step === 'request' && 'Forgot Password'}
            {step === 'verify' && 'Verify Your Email'}
            {step === 'reset' && 'Set New Password'}
            {step === 'success' && 'Password Reset Complete'}
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-gray-600">
            {step === 'request' && 'Enter your registered email to receive a secure 6-digit reset code.'}
            {step === 'verify' && `Enter the 6-digit verification code sent to ${email}`}
            {step === 'reset' && 'Choose a strong password with at least 6 characters.'}
            {step === 'success' && 'You can now sign in with your new password.'}
          </p>
        </div>

        {/* Card */}
        <div className="mt-6 bg-white py-8 px-6 sm:px-10 shadow-xl rounded-3xl border border-[#E8DFC8]/70">
          {error && (
            <div className="mb-4 rounded-xl bg-red-50 p-3.5 text-xs text-red-700 border border-red-200">
              {error}
            </div>
          )}

          {step === 'request' && (
            <form className="space-y-4" onSubmit={handleRequestOtp}>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Registered Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/60 py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 focus:border-[#064B32] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#064B32]"
                  />
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
                <label className="block text-center text-xs font-semibold text-gray-700 mb-2">
                  6-Digit Verification Code
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
                    <span>Verify Code</span>
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
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  New Password (min 6 characters)
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/60 py-2.5 pl-10 pr-10 text-sm text-gray-900 placeholder-gray-400 focus:border-[#064B32] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#064B32]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-2.5 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/60 py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 focus:border-[#064B32] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#064B32]"
                  />
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
                    <span>Update Password</span>
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
                <h3 className="text-base font-semibold text-gray-900">Password Updated</h3>
                <p className="text-xs text-gray-600 mt-1">
                  Your password has been changed securely and any active sessions have been signed out.
                </p>
              </div>
              <button
                type="button"
                onClick={() => router.push('/login')}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#064B32] py-3 px-4 text-sm font-semibold text-white shadow-md hover:bg-[#073D2B] transition-all"
              >
                <span>Sign In With New Password</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Divider */}
          <div className="mt-6 pt-6 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-600">
              Remember your password?{' '}
              <Link
                href="/login"
                className="font-semibold text-[#064B32] hover:text-[#E9BE54] transition-colors"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>

        {/* Back to store */}
        <div className="mt-6 text-center text-xs text-gray-500">
          <Link href="/" className="hover:text-[#064B32] transition-colors">
            ← Return to Himali Fresh Store
          </Link>
        </div>
      </div>
    </div>
  );
}
