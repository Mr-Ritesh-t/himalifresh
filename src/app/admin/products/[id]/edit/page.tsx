'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Upload, AlertCircle, X, Plus } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminEditProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
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
          if (Array.isArray(p.images)) {
            setGalleryImages(p.images.map((img: any) => img.imageUrl));
          }
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
      toast.success('Cover image updated');
    } catch (err) {
      toast.error('Network error during image upload');
    } finally {
      setUploading(false);
    }
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingGallery(true);
    const uploadedUrls: string[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append('file', file);

        const res = await fetch('/api/admin/uploads', {
          method: 'POST',
          body: formData,
        });
        const data = await res.json();

        if (res.ok && data.success && data.url) {
          uploadedUrls.push(data.url);
        } else {
          toast.error(data.error || `Failed to upload ${file.name}`);
        }
      }

      if (uploadedUrls.length > 0) {
        setGalleryImages((prev) => [...prev, ...uploadedUrls]);
        toast.success(`Added ${uploadedUrls.length} gallery photo(s)`);
      }
    } catch (err) {
      toast.error('Network error during gallery upload');
    } finally {
      setUploadingGallery(false);
      e.target.value = '';
    }
  };

  const removeGalleryImage = (indexToRemove: number) => {
    setGalleryImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const payload = {
        ...form,
        price: parseFloat(form.price),
        galleryImages,
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

          {/* Primary Cover Image */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Primary Cover Photo *
            </label>
            <p className="text-xs text-slate-500 mb-2">
              Main photo shown on catalog cards and hero display.
            </p>
            <div className="flex items-center gap-4">
              {form.mainImageUrl && (
                <div className="relative h-20 w-20 rounded-xl overflow-hidden border border-slate-300 bg-slate-50 shrink-0">
                  <Image
                    src={form.mainImageUrl}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <label className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 cursor-pointer hover:bg-slate-50 transition-colors shadow-sm">
                <Upload className="h-4 w-4 text-himali-primary" />
                <span>{uploading ? 'Uploading Cover...' : form.mainImageUrl ? 'Change Cover Photo' : 'Upload Cover Photo'}</span>
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
            </div>
          </div>

          {/* Additional Gallery Photos */}
          <div className="border-t border-slate-100 pt-4">
            <div className="flex items-center justify-between mb-2">
              <div>
                <label className="block font-semibold text-slate-700">
                  Additional Gallery Photos
                </label>
                <p className="text-xs text-slate-500">
                  Upload multiple angles, packaging views, or ingredient close-ups.
                </p>
              </div>
              <label className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 cursor-pointer hover:bg-slate-100 transition-colors">
                <Plus className="h-3.5 w-3.5 text-himali-primary" />
                <span>{uploadingGallery ? 'Uploading...' : 'Add Photos'}</span>
                <input
                  type="file"
                  multiple
                  accept="image/png, image/jpeg, image/webp"
                  onChange={handleGalleryUpload}
                  className="hidden"
                  disabled={uploadingGallery}
                />
              </label>
            </div>

            {galleryImages.length > 0 ? (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 pt-2">
                {galleryImages.map((imgUrl, idx) => (
                  <div
                    key={`${imgUrl}-${idx}`}
                    className="group relative aspect-square rounded-xl overflow-hidden border border-slate-200 bg-slate-50 shadow-sm"
                  >
                    <Image
                      src={imgUrl}
                      alt={`Gallery ${idx + 1}`}
                      fill
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeGalleryImage(idx)}
                      className="absolute top-1 right-1 h-5 w-5 rounded-full bg-red-600/90 text-white flex items-center justify-center opacity-90 hover:opacity-100 transition-opacity shadow"
                      title="Remove image"
                    >
                      <X className="h-3 w-3" />
                    </button>
                    <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded font-mono">
                      #{idx + 1}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-4 text-center text-xs text-slate-400">
                No additional gallery photos added yet. Click &quot;Add Photos&quot; to upload multiple images.
              </div>
            )}
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
