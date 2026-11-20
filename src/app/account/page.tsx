'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { MobileNav } from '@/components/layout/MobileNav';
import {
  User,
  Package,
  MapPin,
  Phone,
  Mail,
  LogOut,
  ShoppingBag,
  Clock,
  CheckCircle,
  Truck,
  MessageSquare,
  ArrowRight,
  Save,
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { toast } from 'sonner';

interface UserData {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  city: string | null;
  pincode: string | null;
  createdAt: string;
  orders: Array<{
    id: string;
    orderNumber: string;
    totalAmount: number;
    status: string;
    createdAt: string;
    items: Array<{
      id: string;
      productNameSnapshot: string;
      unitPriceSnapshot: number;
      quantity: number;
      subtotal: number;
      weightSnapshot: string | null;
    }>;
  }>;
}

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'orders' | 'profile'>('orders');

  // Profile form state
  const [profileData, setProfileData] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
  });
  const [savingProfile, setSavingProfile] = useState(false);

  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch('/api/auth/me');
        const data = await res.json();
        if (data.success && data.user) {
          setUser(data.user);
          setProfileData({
            name: data.user.name || '',
            phone: data.user.phone || '',
            address: data.user.address || '',
            city: data.user.city || '',
            pincode: data.user.pincode || '',
          });
        } else {
          router.push('/login');
        }
      } catch (err) {
        router.push('/login');
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, [router]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);

    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast.success('Profile & address updated successfully!');
        setUser((prev) => (prev ? { ...prev, ...data.user } : null));
      } else {
        toast.error(data.error || 'Failed to update profile');
      }
    } catch {
      toast.error('Network error');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      toast.success('Signed out successfully');
      router.push('/');
      router.refresh();
    } catch {
      router.push('/');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F0E4]">
        <div className="h-8 w-8 animate-spin rounded-full border-3 border-[#064B32] border-t-transparent" />
      </div>
    );
  }

  if (!user) return null;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 border border-blue-200">
            <CheckCircle className="h-3 w-3" /> Confirmed
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
            <CheckCircle className="h-3 w-3" /> Delivered
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700 border border-red-200">
            Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 border border-amber-200">
            <Clock className="h-3 w-3" /> Enquiry Placed
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F0E4]/60">
      <Header />

      <main className="flex-1 py-6 sm:py-10 pb-24 sm:pb-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          {/* Top Banner Profile Summary */}
          <div className="rounded-3xl bg-white p-5 sm:p-7 shadow-sm border border-[#E8DFC8]/70 mb-6">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-[#064B32] text-[#E9BE54] flex items-center justify-center font-serif text-xl sm:text-2xl font-bold shadow-md shrink-0">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#E9BE54]">
                    Customer Account
                  </span>
                  <h1 className="font-serif text-xl sm:text-2xl font-bold text-gray-900 truncate">
                    Hello, {user.name}
                  </h1>
                  <div className="text-xs text-gray-500 mt-1 flex flex-col sm:flex-row sm:items-center sm:gap-2">
                    <span className="text-gray-600 truncate">{user.email}</span>
                    {user.phone && (
                      <span className="text-gray-400 flex items-center gap-1.5">
                        <span className="hidden sm:inline text-gray-300">•</span>
                        <span className="text-gray-500 font-medium">{user.phone}</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-semibold text-gray-600 hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition-colors shrink-0"
                title="Sign Out"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-gray-200 pb-3 mb-6 overflow-x-auto no-scrollbar scrollbar-none">
            <button
              onClick={() => setActiveTab('orders')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all shrink-0 ${
                activeTab === 'orders'
                  ? 'bg-[#064B32] text-white shadow-sm'
                  : 'bg-white text-gray-600 hover:text-gray-900 border border-gray-200'
              }`}
            >
              <Package className="h-4 w-4" />
              <span>My Orders ({user.orders.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all shrink-0 ${
                activeTab === 'profile'
                  ? 'bg-[#064B32] text-white shadow-sm'
                  : 'bg-white text-gray-600 hover:text-gray-900 border border-gray-200'
              }`}
            >
              <MapPin className="h-4 w-4" />
              <span>Delivery Details & Profile</span>
            </button>
          </div>

          {/* TAB 1: ORDERS */}
          {activeTab === 'orders' && (
            <div>
              {user.orders.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-[#E8DFC8] bg-white p-12 text-center shadow-xs">
                  <div className="h-16 w-16 mx-auto mb-4 rounded-full bg-[#FAF5EB] flex items-center justify-center text-[#064B32]">
                    <ShoppingBag className="h-8 w-8" />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-gray-900 mb-1">
                    No orders placed yet
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto mb-6">
                    Explore our authentic Himalayan pickles, mountain teas, Timur, and organic hill specialities.
                  </p>
                  <Link
                    href="/shop"
                    className="inline-flex items-center gap-2 rounded-full bg-[#064B32] px-6 py-2.5 text-xs font-semibold text-white shadow hover:bg-[#073D2B] transition-transform hover:scale-105"
                  >
                    <span>Browse Catalogue</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {user.orders.map((ord) => (
                    <div
                      key={ord.id}
                      className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs transition-shadow hover:shadow-md"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-gray-100">
                        <div>
                          <span className="text-xs text-gray-400">Order Reference</span>
                          <h4 className="font-mono text-sm font-bold text-gray-900">
                            {ord.orderNumber}
                          </h4>
                          <span className="text-[11px] text-gray-500">
                            {new Date(ord.createdAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          {getStatusBadge(ord.status)}
                          <span className="font-serif text-base font-bold text-[#064B32]">
                            {formatPrice(ord.totalAmount)}
                          </span>
                        </div>
                      </div>

                      {/* Items list */}
                      <div className="py-3 divide-y divide-gray-50">
                        {ord.items.map((item) => (
                          <div
                            key={item.id}
                            className="py-2 first:pt-1 last:pb-0 flex items-center justify-between text-xs"
                          >
                            <span className="font-medium text-gray-800">
                              {item.quantity} × {item.productNameSnapshot}
                              {item.weightSnapshot && (
                                <span className="text-gray-400 ml-1">({item.weightSnapshot})</span>
                              )}
                            </span>
                            <span className="font-semibold text-gray-700">
                              {formatPrice(item.subtotal)}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* WhatsApp Enquiry Link */}
                      <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                        <span className="text-[11px] text-gray-400">
                          Need an update on this order?
                        </span>
                        <a
                          href={`https://wa.me/919832078728?text=${encodeURIComponent(
                            `Hi Himali Fresh, I would like an update regarding my Order #${ord.orderNumber}.`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800 hover:bg-emerald-100 transition-colors"
                        >
                          <MessageSquare className="h-3 w-3 text-emerald-600" />
                          <span>Track via WhatsApp</span>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: PROFILE & ADDRESS */}
          {activeTab === 'profile' && (
            <div className="rounded-3xl border border-gray-200 bg-white p-6 sm:p-8 shadow-xs">
              <h3 className="font-serif text-lg font-bold text-gray-900 mb-1">
                Saved Delivery Information
              </h3>
              <p className="text-xs text-gray-500 mb-6">
                Your saved details will be automatically pre-filled whenever you checkout.
              </p>

              <form onSubmit={handleSaveProfile} className="space-y-4 max-w-xl">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Your Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/70 py-2.5 px-3.5 text-sm text-gray-900 focus:border-[#064B32] focus:bg-white focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Email Address (Permanent)
                    </label>
                    <input
                      type="email"
                      disabled
                      value={user.email}
                      className="w-full rounded-xl border border-gray-200 bg-gray-100 py-2.5 px-3.5 text-sm text-gray-500 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Phone / WhatsApp Number
                    </label>
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      placeholder="+91 98320 00000"
                      className="w-full rounded-xl border border-gray-200 bg-gray-50/70 py-2.5 px-3.5 text-sm text-gray-900 focus:border-[#064B32] focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Street Address
                  </label>
                  <input
                    type="text"
                    value={profileData.address}
                    onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                    placeholder="House/Flat No., Street, Area"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/70 py-2.5 px-3.5 text-sm text-gray-900 focus:border-[#064B32] focus:bg-white focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      City / District
                    </label>
                    <input
                      type="text"
                      value={profileData.city}
                      onChange={(e) => setProfileData({ ...profileData, city: e.target.value })}
                      placeholder="e.g. Siliguri"
                      className="w-full rounded-xl border border-gray-200 bg-gray-50/70 py-2.5 px-3.5 text-sm text-gray-900 focus:border-[#064B32] focus:bg-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Postal PIN Code
                    </label>
                    <input
                      type="text"
                      value={profileData.pincode}
                      onChange={(e) => setProfileData({ ...profileData, pincode: e.target.value })}
                      placeholder="734001"
                      className="w-full rounded-xl border border-gray-200 bg-gray-50/70 py-2.5 px-3.5 text-sm text-gray-900 focus:border-[#064B32] focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={savingProfile}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#064B32] py-2.5 px-5 text-xs font-semibold text-white shadow-sm hover:bg-[#073D2B] transition-all disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  <span>{savingProfile ? 'Saving...' : 'Save Delivery Details'}</span>
                </button>
              </form>
            </div>
          )}
        </div>
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}
