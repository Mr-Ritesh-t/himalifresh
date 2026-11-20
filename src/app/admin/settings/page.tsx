'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Upload, Save, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingHero, setUploadingHero] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    businessName: '',
    tagline: '',
    phone: '',
    whatsappNumber: '',
    email: '',
    address: '',
    mapUrl: '',
    logoUrl: '',
    heroImageUrl: '',
    announcement: '',
    homepageHeading: '',
    homepageDescription: '',
    socialLinks: '{}',
    aboutStory: '',
  });

  useEffect(() => {
    async function loadSettings() {
      try {
        setLoading(true);
        const res = await fetch('/api/admin/settings');
        const data = await res.json();
        if (data.success && data.settings) {
          const s = data.settings;
          setForm({
            businessName: s.businessName,
            tagline: s.tagline,
            phone: s.phone,
            whatsappNumber: s.whatsappNumber,
            email: s.email,
            address: s.address,
            mapUrl: s.mapUrl,
            logoUrl: s.logoUrl,
            heroImageUrl: s.heroImageUrl,
            announcement: s.announcement,
            homepageHeading: s.homepageHeading,
            homepageDescription: s.homepageDescription,
            socialLinks: s.socialLinks,
            aboutStory: s.aboutStory,
          });
        }
      } catch (e) {
        toast.error('Failed to load settings');
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: 'logoUrl' | 'heroImageUrl'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (field === 'logoUrl') setUploadingLogo(true);
    if (field === 'heroImageUrl') setUploadingHero(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/admin/uploads', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setForm((prev) => ({ ...prev, [field]: data.url }));
        toast.success('Image uploaded successfully');
      } else {
        toast.error(data.error || 'Upload failed');
      }
    } catch (err) {
      toast.error('Upload failed');
    } finally {
      if (field === 'logoUrl') setUploadingLogo(false);
      if (field === 'heroImageUrl') setUploadingHero(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || 'Failed to save settings');
        toast.error(data.error || 'Failed to save settings');
        setSaving(false);
        return;
      }

      toast.success('Business settings updated successfully! Public website updated.');
    } catch (err) {
      toast.error('Network error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-xs text-slate-500">
        Loading business settings...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
          Business Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Configure live store details, WhatsApp numbers, top announcement banner, and homepage texts
        </p>
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-xs text-red-700 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Contact & Brand Identity */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <h2 className="font-serif text-base font-bold text-slate-900 pb-2 border-b border-slate-100">
            Brand Identity & Contact
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Business Name *</label>
              <input
                type="text"
                required
                value={form.businessName}
                onChange={(e) => setForm({ ...form, businessName: e.target.value })}
                className="w-full rounded-xl border border-slate-300 p-2.5 text-xs focus:border-himali-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Tagline *</label>
              <input
                type="text"
                required
                value={form.tagline}
                onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                className="w-full rounded-xl border border-slate-300 p-2.5 text-xs focus:border-himali-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Phone Number *</label>
              <input
                type="text"
                required
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full rounded-xl border border-slate-300 p-2.5 text-xs focus:border-himali-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">WhatsApp Number (Digits only with country code) *</label>
              <input
                type="text"
                required
                value={form.whatsappNumber}
                onChange={(e) => setForm({ ...form, whatsappNumber: e.target.value })}
                placeholder="e.g. 919832078728"
                className="w-full rounded-xl border border-slate-300 p-2.5 text-xs font-mono focus:border-himali-primary focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Support Email *</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full rounded-xl border border-slate-300 p-2.5 text-xs focus:border-himali-primary focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Physical Store Address *</label>
              <input
                type="text"
                required
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full rounded-xl border border-slate-300 p-2.5 text-xs focus:border-himali-primary focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Google Maps URL *</label>
              <input
                type="url"
                required
                value={form.mapUrl}
                onChange={(e) => setForm({ ...form, mapUrl: e.target.value })}
                className="w-full rounded-xl border border-slate-300 p-2.5 text-xs focus:border-himali-primary focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Homepage & Announcement Banner */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <h2 className="font-serif text-base font-bold text-slate-900 pb-2 border-b border-slate-100">
            Homepage & Announcements
          </h2>

          <div className="space-y-4 text-xs sm:text-sm">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Top Announcement Bar Text *
              </label>
              <input
                type="text"
                required
                value={form.announcement}
                onChange={(e) => setForm({ ...form, announcement: e.target.value })}
                className="w-full rounded-xl border border-slate-300 p-2.5 text-xs focus:border-himali-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Hero Banner Heading *
              </label>
              <input
                type="text"
                required
                value={form.homepageHeading}
                onChange={(e) => setForm({ ...form, homepageHeading: e.target.value })}
                className="w-full rounded-xl border border-slate-300 p-2.5 text-xs focus:border-himali-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Hero Supporting Subtitle *
              </label>
              <textarea
                required
                rows={2}
                value={form.homepageDescription}
                onChange={(e) => setForm({ ...form, homepageDescription: e.target.value })}
                className="w-full rounded-xl border border-slate-300 p-2.5 text-xs focus:border-himali-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                About Heritage Story
              </label>
              <textarea
                required
                rows={4}
                value={form.aboutStory}
                onChange={(e) => setForm({ ...form, aboutStory: e.target.value })}
                className="w-full rounded-xl border border-slate-300 p-2.5 text-xs focus:border-himali-primary focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-himali-primary px-8 py-3 text-xs sm:text-sm font-semibold text-white shadow hover:bg-himali-dark transition-colors disabled:opacity-60"
          >
            <Save className="h-4 w-4" />
            <span>{saving ? 'Saving Settings...' : 'Save All Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
