'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { MobileNav } from '@/components/layout/MobileNav';
import Link from 'next/link';
import { Phone, Mail, MapPin, MessageSquare, Send, CheckCircle2, AlertCircle, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [consent, setConsent] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!consent) {
      setError('Please provide consent for us to respond to your enquiry.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || 'Failed to submit form');
        toast.error(data.error || 'Failed to submit enquiry');
        setLoading(false);
        return;
      }

      setSuccess(true);
      toast.success('Your message has been received!');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      setLoading(false);
    } catch (err) {
      setError('A network error occurred');
      toast.error('Network error');
      setLoading(false);
    }
  };

  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data?.success && data?.settings) {
          setSettings(data.settings);
        }
      })
      .catch(() => {});
  }, []);

  const businessName = settings?.businessName || 'Himali Fresh';
  const phone = settings?.phone || '+91 98320 78728';
  const email = settings?.email || 'riteshtayade68@gmail.com';
  const address = settings?.address || 'Dagapur, Siliguri, West Bengal, India';
  const mapUrl = settings?.mapUrl || 'https://maps.app.goo.gl/ecdT4JyhbpveKzhJ9';
  const whatsappNumber = settings?.whatsappNumber || '919832078728';

  return (
    <div className="min-h-screen flex flex-col bg-himali-cream/30">
      <Header settings={settings || undefined} />

      <main className="flex-1 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-himali-green">
              Get in Touch
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-himali-dark mt-2 mb-2">
              Contact {businessName}
            </h1>
            <div className="mx-auto h-0.5 w-16 bg-[#E9BE54] rounded-full mb-3" />
            <p className="text-xs sm:text-sm text-himali-muted leading-relaxed">
              Have a question about product availability, bulk Himalayan supplies, or want to place a custom order? We would love to assist you.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            {/* Contact Details & Map */}
            <div className="space-y-6">
              <div className="rounded-3xl border border-himali-border bg-white p-6 sm:p-8 shadow-card space-y-6">
                <h2 className="font-serif text-xl font-bold text-himali-dark">
                  Store & Office Information
                </h2>

                <div className="space-y-4 text-sm">
                  <div className="flex items-start gap-3.5">
                    <div className="h-10 w-10 shrink-0 rounded-xl bg-himali-cream flex items-center justify-center text-himali-primary">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-himali-dark">Physical Address</h4>
                      <p className="text-himali-muted mt-0.5">{address}</p>
                      <a
                        href={mapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-himali-green hover:underline mt-1.5"
                      >
                        <ExternalLink className="h-3 w-3" />
                        <span>View on Google Maps &rarr;</span>
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="h-10 w-10 shrink-0 rounded-xl bg-himali-cream flex items-center justify-center text-himali-primary">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-himali-dark">Phone Number</h4>
                      <a href={`tel:${phone.replace(/\s+/g, '')}`} className="text-himali-green font-medium hover:underline">
                        {phone}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="h-10 w-10 shrink-0 rounded-xl bg-himali-cream flex items-center justify-center text-himali-primary">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-himali-dark">Email Address</h4>
                      <a href={`mailto:${email}`} className="text-himali-green font-medium hover:underline">
                        {email}
                      </a>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-himali-border">
                  <a
                    href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Hello Himali Fresh, I would like to connect with your team.')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 rounded-2xl bg-himali-green py-3 px-4 text-sm font-semibold text-white shadow hover:bg-emerald-700 transition-colors"
                  >
                    <MessageSquare className="h-4 w-4" />
                    <span>Direct WhatsApp Chat</span>
                  </a>
                </div>
              </div>

              {/* Embedded Google Map */}
              <div className="overflow-hidden rounded-3xl border border-himali-border bg-white shadow-card h-64 sm:h-80 relative group">
                <iframe
                  title={`${businessName} Location Map`}
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(address)}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                />
                <div className="absolute bottom-3 right-3">
                  <a
                    href={mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md text-xs font-bold text-[#064B32] shadow-md hover:bg-white hover:shadow-lg transition-all border border-slate-200"
                  >
                    <MapPin className="h-3.5 w-3.5 text-red-600" />
                    <span>Get Directions</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Interactive Contact Form */}
            <div className="rounded-3xl border border-himali-border bg-white p-6 sm:p-8 shadow-card">
              <h2 className="font-serif text-xl font-bold text-himali-dark mb-4">
                Send Us a Message
              </h2>

              {success ? (
                <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-6 text-center space-y-3">
                  <CheckCircle2 className="h-12 w-12 text-himali-green mx-auto" />
                  <h3 className="font-serif text-lg font-bold text-himali-dark">
                    Message Sent Successfully!
                  </h3>
                  <p className="text-xs sm:text-sm text-emerald-800 leading-relaxed">
                    Thank you for contacting Himali Fresh. Our team in Siliguri will review your enquiry and respond promptly.
                  </p>
                  <button
                    onClick={() => setSuccess(false)}
                    className="inline-flex rounded-full bg-himali-primary px-5 py-2 text-xs font-semibold text-white shadow hover:bg-himali-dark"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-xs text-red-700 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-himali-dark mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Anand Sharma"
                      className="w-full rounded-xl border border-himali-border p-3 text-sm focus:border-himali-primary focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-himali-dark mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="e.g. anand@example.com"
                        className="w-full rounded-xl border border-himali-border p-3 text-sm focus:border-himali-primary focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-himali-dark mb-1">
                        Phone Number (Optional)
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="e.g. +91 98320..."
                        className="w-full rounded-xl border border-himali-border p-3 text-sm focus:border-himali-primary focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-himali-dark mb-1">
                      Subject *
                    </label>
                    <input
                      type="text"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="e.g. Bulk order enquiry, Product question..."
                      className="w-full rounded-xl border border-himali-border p-3 text-sm focus:border-himali-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-himali-dark mb-1">
                      Your Message *
                    </label>
                    <textarea
                      name="message"
                      required
                      rows={4}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Write your questions or order requirements here..."
                      className="w-full rounded-xl border border-himali-border p-3 text-sm focus:border-himali-primary focus:outline-none"
                    />
                  </div>

                  {/* Consent Checkbox */}
                  <label className="flex items-start gap-2.5 text-xs text-gray-700 cursor-pointer select-none rounded-xl border border-gray-100 bg-gray-50/70 p-3">
                    <input
                      type="checkbox"
                      required
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                      className="mt-0.5 h-4 w-4 shrink-0 rounded border-gray-300 text-himali-primary focus:ring-himali-primary accent-[#064B32]"
                    />
                    <span className="leading-tight">
                      I consent to Himali Fresh contacting me via WhatsApp, phone, or email regarding this enquiry in accordance with the{' '}
                      <Link href="/privacy-policy" target="_blank" className="text-himali-green font-semibold underline">
                        Privacy Policy
                      </Link>
                      .
                    </span>
                  </label>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 rounded-2xl bg-himali-primary py-3.5 px-6 text-sm font-semibold text-white shadow-md hover:bg-himali-dark transition-all disabled:opacity-60"
                  >
                    {loading ? (
                      <span className="animate-pulse">Sending Message...</span>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        <span>Submit Message</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer settings={settings || undefined} />
      <MobileNav />
    </div>
  );
}
