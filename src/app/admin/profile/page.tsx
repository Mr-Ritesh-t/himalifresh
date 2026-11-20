'use client';

import React, { useEffect, useState } from 'react';
import { User, Lock, CheckCircle2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [changing, setChanging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch('/api/admin/auth/me');
        const data = await res.json();
        if (data.success) {
          setUser(data.user);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, []);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError('New passwords do not match');
      toast.error('Passwords do not match');
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      setError('New password must be at least 8 characters');
      toast.error('Password too short');
      return;
    }

    setChanging(true);

    try {
      const res = await fetch('/api/admin/profile/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(passwordForm),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || 'Failed to update password');
        toast.error(data.error || 'Failed to update password');
        setChanging(false);
        return;
      }

      toast.success('Password updated successfully');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setError('Network error');
      toast.error('Network error');
    } finally {
      setChanging(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-xs text-slate-500">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
          Admin Profile & Security
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          View account credentials and update master password
        </p>
      </div>

      {/* Account Details Box */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-3">
        <h2 className="font-serif text-base font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
          <User className="h-4 w-4 text-himali-green" />
          <span>Account Information</span>
        </h2>

        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-slate-400 font-semibold uppercase text-[10px]">Name</span>
            <p className="font-bold text-slate-800 text-sm mt-0.5">{user?.name || 'Administrator'}</p>
          </div>

          <div>
            <span className="text-slate-400 font-semibold uppercase text-[10px]">Email</span>
            <p className="font-mono text-slate-800 text-sm mt-0.5">{user?.email || 'admin@himalifresh.com'}</p>
          </div>

          <div>
            <span className="text-slate-400 font-semibold uppercase text-[10px]">Role</span>
            <p className="font-semibold text-emerald-700 mt-0.5">{user?.role || 'SUPER_ADMIN'}</p>
          </div>

          <div>
            <span className="text-slate-400 font-semibold uppercase text-[10px]">Active Session</span>
            <p className="text-slate-600 mt-0.5">Secure JWT Cookie</p>
          </div>
        </div>
      </div>

      {/* Change Password Box */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <h2 className="font-serif text-base font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
          <Lock className="h-4 w-4 text-himali-green" />
          <span>Change Password</span>
        </h2>

        {error && (
          <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handlePasswordSubmit} className="space-y-4 text-xs sm:text-sm">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Current Password *
            </label>
            <input
              type="password"
              required
              value={passwordForm.currentPassword}
              onChange={(e) =>
                setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
              }
              className="w-full rounded-xl border border-slate-300 p-2.5 text-xs focus:border-himali-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              New Password (min 8 characters) *
            </label>
            <input
              type="password"
              required
              value={passwordForm.newPassword}
              onChange={(e) =>
                setPasswordForm({ ...passwordForm, newPassword: e.target.value })
              }
              className="w-full rounded-xl border border-slate-300 p-2.5 text-xs focus:border-himali-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Confirm New Password *
            </label>
            <input
              type="password"
              required
              value={passwordForm.confirmPassword}
              onChange={(e) =>
                setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
              }
              className="w-full rounded-xl border border-slate-300 p-2.5 text-xs focus:border-himali-primary focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={changing}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-himali-primary py-2.5 text-xs font-semibold text-white shadow hover:bg-himali-dark disabled:opacity-60"
          >
            {changing ? 'Updating Password...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
}
