'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { User, Mail, Phone, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, ArrowLeft, RefreshCw, KeyRound } from 'lucide-react';
import { toast } from 'sonner';

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState<'form' | 'otp'>('form');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [agreeTerms, setAgreeTerms] = useState(false);

  // OTP state
  const [challengeId, setChallengeId] = useState<string | null>(null);
  const [otp, setOtp] = useState('');
  const [cooldown, setCooldown] = useState(0);
  const [resending, setResending] = useState(false);

  // Countdown timer for resend
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name.trim() || !formData.email.trim() || !formData.password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!agreeTerms) {
      setError('Please confirm that you are 18+ and agree to our Terms of Service and Privacy Policy.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/otp/register-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim() || undefined,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || 'Failed to initiate verification.');
        setLoading(false);
        return;
      }

      setChallengeId(data.challengeId);
      setCooldown(data.cooldownSeconds || 60);
      setStep('otp');
      setLoading(false);
      toast.success('Verification code sent to your email!');
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
      const res = await fetch('/api/auth/otp/register-verify', {
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

      toast.success('Email verified! Welcome to Himali Fresh family 🌿');
      router.push('/account');
      router.refresh();
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
      toast.success('A new 6-digit verification code has been sent!');
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
            {step === 'form' ? 'Create an Account' : 'Verify Your Email'}
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-gray-600">
            {step === 'form'
              ? 'Join Himali Fresh for easier ordering, address auto-fill, and live order tracking'
              : `We sent a 6-digit code to ${formData.email}`}
          </p>
        </div>

        {/* Card */}
        <div className="mt-6 bg-white py-8 px-6 sm:px-10 shadow-xl rounded-3xl border border-[#E8DFC8]/70">
          {error && (
            <div className="mb-4 rounded-xl bg-red-50 p-3.5 text-xs text-red-700 border border-red-200">
              {error}
            </div>
          )}

          {step === 'form' ? (
            <form className="space-y-3.5" onSubmit={handleRequestOtp}>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Tenzing Sherpa"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/60 py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 focus:border-[#064B32] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#064B32]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@example.com"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/60 py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 focus:border-[#064B32] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#064B32]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  WhatsApp / Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 98320 00000"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/60 py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 focus:border-[#064B32] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#064B32]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Password (min 6 characters) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
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
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/60 py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 focus:border-[#064B32] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#064B32]"
                  />
                </div>
              </div>

              {/* Age & Legal Terms Consent */}
              <label className="flex items-start gap-2.5 text-xs text-gray-700 cursor-pointer select-none rounded-xl border border-gray-100 bg-gray-50/70 p-3">
                <input
                  type="checkbox"
                  required
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-0.5 h-4 w-4 shrink-0 rounded border-gray-300 text-[#064B32] focus:ring-[#064B32] accent-[#064B32]"
                />
                <span className="leading-tight">
                  I confirm I am <strong>18 years or older</strong>, and agree to Himali Fresh&apos;s{' '}
                  <Link href="/terms" target="_blank" className="text-[#064B32] font-semibold underline">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy-policy" target="_blank" className="text-[#064B32] font-semibold underline">
                    Privacy Policy
                  </Link>
                  .
                </span>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#064B32] py-3 px-4 text-sm font-semibold text-white shadow-md hover:bg-[#073D2B] transition-all disabled:opacity-50 mt-3"
              >
                {loading ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <>
                    <span>Continue &amp; Verify Email</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            /* Step 2: OTP Verification Screen */
            <form className="space-y-4" onSubmit={handleVerifyOtp}>
              <div className="text-center py-2">
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-[#EBF5EF] text-[#064B32] mb-2">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <p className="text-xs text-gray-600">
                  Enter the 6-digit verification code sent to:
                </p>
                <p className="text-sm font-semibold text-gray-900 mt-0.5">
                  {formData.email}
                </p>
              </div>

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
                    <span>Verify &amp; Create Account</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setStep('form');
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
                  <span>{cooldown > 0 ? `Resend code in ${cooldown}s` : 'Resend Code'}</span>
                </button>
              </div>
            </form>
          )}

          {/* Divider */}
          <div className="mt-6 pt-6 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-600">
              Already have an account?{' '}
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
