'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Upload, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminEditProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: '',
    slug: '',
    description: '',
    price: '',
    weight: '',
    categoryId: '',
    mainImageUrl: '',
    isAvailable: true,
    isFeatured: false,
    isActive: true,
  });

  useEffect(() => {
    async function loadData() {
      try {
        const [prodRes, catRes] = await Promise.all([
          fetch(`/api/admin/products/${id}`),
          fetch('/api/admin/categories'),
        ]);

        const prodJson = await prodRes.json();
        const catJson = await catRes.json();

        if (catJson.success) setCategories(catJson.categories);

        if (prodJson.success) {
          const p = prodJson.product;
          setForm({
            name: p.name,
            slug: p.slug,
            description: p.description,
            price: String(p.price),
            weight: p.weight,
            categoryId: p.categoryId,
            mainImageUrl: p.mainImageUrl,
            isAvailable: p.isAvailable,
            isFeatured: p.isFeatured,
            isActive: p.isActive,
          });
        }
      } catch (e) {
        console.error(e);
        toast.error('Failed to load product');
      } finally {
        setInitialLoading(false);
      }
    }

    if (id) loadData();
  }, [id]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/admin/uploads', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        toast.error(data.error || 'Failed to upload image');
        setUploading(false);
        return;
      }

      setForm((prev) => ({ ...prev, mainImageUrl: data.url }));
      toast.success('Product image uploaded successfully');
    } catch (err) {
      toast.error('Network error during image upload');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const payload = {
        ...form,
        price: parseFloat(form.price),
      };

      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || 'Failed to update product');
        toast.error(data.error || 'Failed to update product');
        setLoading(false);
        return;
      }

      toast.success('Product updated successfully');
      router.push('/admin/products');
    } catch (err) {
      setError('A network error occurred');
      toast.error('Network error');
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="py-20 text-center text-xs text-slate-500">
        Loading product details...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-2">
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Products</span>
        </Link>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
        <h1 className="font-serif text-2xl font-bold text-slate-900 mb-6">
          Edit Product: {form.name}
        </h1>

        {error && (
          <div className="mb-6 rounded-xl bg-red-50 border border-red-200 p-3 text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 text-xs sm:text-sm">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Product Name *
            </label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-xl border border-slate-300 p-2.5 text-xs sm:text-sm focus:border-himali-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              URL Slug *
            </label>
            <input
              type="text"
              required
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              className="w-full rounded-xl border border-slate-300 p-2.5 text-xs sm:text-sm font-mono text-slate-600 focus:border-himali-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Category *
            </label>
            <select
              required
              value={form.categoryId}
              onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
              className="w-full rounded-xl border border-slate-300 p-2.5 text-xs sm:text-sm focus:border-himali-primary focus:outline-none"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Price (INR ₹) *
              </label>
              <input
                type="number"
                step="0.01"
                min="1"
                required
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="w-full rounded-xl border border-slate-300 p-2.5 text-xs sm:text-sm focus:border-himali-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Weight / Unit *
              </label>
              <input
                type="text"
                required
                value={form.weight}
                onChange={(e) => setForm({ ...form, weight: e.target.value })}
                className="w-full rounded-xl border border-slate-300 p-2.5 text-xs sm:text-sm focus:border-himali-primary focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Detailed Description *
            </label>
            <textarea
              required
              rows={4}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full rounded-xl border border-slate-300 p-2.5 text-xs sm:text-sm focus:border-himali-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Product Image
            </label>
            <div className="flex items-center gap-4">
              {form.mainImageUrl && (
                <div className="relative h-16 w-16 rounded-xl overflow-hidden border border-slate-300 bg-slate-50">
                  <Image
                    src={form.mainImageUrl}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <label className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 cursor-pointer hover:bg-slate-50 transition-colors">
                <Upload className="h-4 w-4" />
                <span>{uploading ? 'Uploading...' : 'Replace Image'}</span>
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs sm:text-sm">
              <input
                type="checkbox"
                checked={form.isAvailable}
                onChange={(e) => setForm({ ...form, isAvailable: e.target.checked })}
                className="rounded border-slate-300 text-himali-primary focus:ring-himali-primary"
              />
              <span>In Stock & Available</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs sm:text-sm">
              <input
                type="checkbox"
                checked={form.isFeatured}
                onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                className="rounded border-slate-300 text-himali-primary focus:ring-himali-primary"
              />
              <span>Feature on Homepage</span>
            </label>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <Link
              href="/admin/products"
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl bg-himali-primary px-6 py-2.5 text-xs font-semibold text-white shadow hover:bg-himali-dark transition-colors disabled:opacity-60"
            >
              {loading ? 'Saving Changes...' : 'Save Updates'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
