'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Search, Edit, Trash2, Eye, CheckCircle2, XCircle, FileDown, Loader2 } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { toast } from 'sonner';
import { downloadProductCatalogPdf } from '@/lib/catalog-pdf';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('');
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [prodRes, catRes] = await Promise.all([
        fetch('/api/admin/products'),
        fetch('/api/admin/categories'),
      ]);
      const prodJson = await prodRes.json();
      const catJson = await catRes.json();
      if (prodJson.success) setProducts(prodJson.products);
      if (catJson.success) setCategories(catJson.categories);
    } catch (e) {
      console.error(e);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleAvailability = async (id: string, current: boolean) => {
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isAvailable: !current }),
      });
      const data = await res.json();
      if (data.success) {
        setProducts((prev) =>
          prev.map((p) => (p.id === id ? { ...p, isAvailable: !current } : p))
        );
        toast.success(`Product marked as ${!current ? 'In Stock' : 'Out of Stock'}`);
      }
    } catch (e) {
      toast.error('Failed to update status');
    }
  };

  const handleToggleFeatured = async (id: string, current: boolean) => {
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFeatured: !current }),
      });
      const data = await res.json();
      if (data.success) {
        setProducts((prev) =>
          prev.map((p) => (p.id === id ? { ...p, isFeatured: !current } : p))
        );
        toast.success(`Product ${!current ? 'added to' : 'removed from'} featured list`);
      }
    } catch (e) {
      toast.error('Failed to update featured flag');
    }
  };

  const handleDelete = (id: string, name: string) => {
    setDeleteTarget({ id, name });
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      setDeleting(true);
      const res = await fetch(`/api/admin/products/${deleteTarget.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok && data.success) {
        setProducts((prev) => prev.filter((p) => p.id !== deleteTarget.id));
        toast.success('Product deleted successfully');
        setDeleteTarget(null);
      } else {
        toast.error(data.error || 'Failed to delete product');
      }
    } catch (e) {
      toast.error('Failed to delete product');
    } finally {
      setDeleting(false);
    }
  };

  const filtered = products.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.slug.toLowerCase().includes(search.toLowerCase());
    const matchCat = !selectedCat || p.categoryId === selectedCat;
    return matchSearch && matchCat;
  });

  const handleDownloadCatalogPdf = async () => {
    if (filtered.length === 0) {
      toast.error('No products available to export');
      return;
    }

    try {
      setDownloadingPdf(true);
      let settings;
      try {
        const res = await fetch('/api/settings');
        const json = await res.json();
        if (json.success) settings = json.settings;
      } catch {
        // Fallback to defaults inside PDF generator
      }

      const selectedCategoryName = selectedCat
        ? categories.find((c) => c.id === selectedCat)?.name
        : undefined;

      await downloadProductCatalogPdf({
        products: filtered,
        settings,
        filterLabel: selectedCategoryName || (search.trim() ? `Search: "${search.trim()}"` : undefined),
      });
      toast.success('Product catalog PDF downloaded');
    } catch (e) {
      console.error('Failed to generate catalog PDF:', e);
      toast.error('Failed to generate PDF catalog');
    } finally {
      setDownloadingPdf(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Title & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
            Product Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Manage catalogue items, pricing, inventory stock, and featured badges
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleDownloadCatalogPdf}
            disabled={loading || downloadingPdf || filtered.length === 0}
            className="inline-flex items-center gap-1.5 rounded-xl border border-himali-primary bg-white px-4 py-2 text-xs font-semibold text-himali-primary shadow-sm hover:bg-himali-cream/40 transition-colors disabled:opacity-50"
          >
            {downloadingPdf ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <FileDown className="h-4 w-4" />
            )}
            <span>{downloadingPdf ? 'Generating PDF...' : 'Download Catalog PDF'}</span>
          </button>

          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-1.5 rounded-xl bg-himali-primary px-4 py-2 text-xs font-semibold text-white shadow hover:bg-himali-dark transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Create New Product</span>
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative flex-1 w-full">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by product name..."
            className="w-full rounded-xl border border-slate-300 py-2 pl-9 pr-4 text-xs focus:border-himali-primary focus:outline-none"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
        </div>

        <select
          value={selectedCat}
          onChange={(e) => setSelectedCat(e.target.value)}
          className="w-full sm:w-56 rounded-xl border border-slate-300 py-2 px-3 text-xs focus:border-himali-primary focus:outline-none"
        >
          <option value="">All Categories ({categories.length})</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Products Table / Cards */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-xs text-slate-500">
            Loading products catalogue...
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-xs text-slate-500">
            No products match the filter.
          </div>
        ) : (
          <>
            {/* Mobile View: Responsive Cards (No horizontal scroll) */}
            <div className="block md:hidden divide-y divide-slate-100">
              {filtered.map((prod) => (
                <div key={prod.id} className="p-4 space-y-3 hover:bg-slate-50/60 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="relative h-16 w-16 shrink-0 rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                      <Image
                        src={prod.mainImageUrl || '/images/hero-banner.jpg'}
                        alt={prod.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-slate-900 text-sm leading-snug line-clamp-2">
                          {prod.name}
                        </h3>
                        <span className="font-bold text-himali-primary text-sm shrink-0">
                          {formatPrice(prod.price)}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {prod.category?.name || 'Uncategorized'} • {prod.weight}
                      </p>
                      <p className="text-[11px] text-slate-400 font-mono truncate">
                        /{prod.slug}
                      </p>
                    </div>
                  </div>

                  {/* Mobile Status Toggles & Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1.5 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleAvailability(prod.id, prod.isAvailable)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          prod.isAvailable
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {prod.isAvailable ? (
                          <>
                            <CheckCircle2 className="h-3 w-3" />
                            <span>In Stock</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="h-3 w-3" />
                            <span>Out of Stock</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => handleToggleFeatured(prod.id, prod.isFeatured)}
                        className={`px-2 py-1 rounded-full text-[10px] font-semibold transition-colors ${
                          prod.isFeatured
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {prod.isFeatured ? '★ Featured' : 'Standard'}
                      </button>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Link
                        href={`/product/${prod.slug}`}
                        target="_blank"
                        className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
                        title="View on site"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      <Link
                        href={`/admin/products/${prod.id}/edit`}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-semibold text-xs transition-colors"
                        title="Edit Product"
                      >
                        <Edit className="h-3.5 w-3.5" />
                        <span>Edit</span>
                      </Link>
                      <button
                        onClick={() => handleDelete(prod.id, prod.name)}
                        className="p-1.5 text-red-500 hover:text-red-700 rounded-lg hover:bg-red-50"
                        title="Delete Product"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table: Hidden on Mobile */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 uppercase font-semibold">
                    <th className="py-3 px-4">Product</th>
                    <th className="py-3 px-3">Category</th>
                    <th className="py-3 px-3">Price</th>
                    <th className="py-3 px-3">Weight</th>
                    <th className="py-3 px-3 text-center">Availability</th>
                    <th className="py-3 px-3 text-center">Featured</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((prod) => (
                    <tr key={prod.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative h-12 w-12 shrink-0 rounded-lg overflow-hidden border border-slate-200 bg-slate-100">
                            <Image
                              src={prod.mainImageUrl || '/images/hero-banner.jpg'}
                              alt={prod.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900">{prod.name}</p>
                            <p className="text-[11px] text-slate-400">/{prod.slug}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-3 text-slate-600 font-medium">
                        {prod.category?.name || '—'}
                      </td>

                      <td className="py-3 px-3 font-bold text-himali-primary">
                        {formatPrice(prod.price)}
                      </td>

                      <td className="py-3 px-3 text-slate-600">
                        {prod.weight}
                      </td>

                      <td className="py-3 px-3 text-center">
                        <button
                          onClick={() => handleToggleAvailability(prod.id, prod.isAvailable)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            prod.isAvailable
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              : 'bg-red-100 text-red-800 hover:bg-red-200'
                          }`}
                        >
                          {prod.isAvailable ? (
                            <>
                              <CheckCircle2 className="h-3 w-3" />
                              <span>In Stock</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="h-3 w-3" />
                              <span>Out of Stock</span>
                            </>
                          )}
                        </button>
                      </td>

                      <td className="py-3 px-3 text-center">
                        <button
                          onClick={() => handleToggleFeatured(prod.id, prod.isFeatured)}
                          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold transition-colors ${
                            prod.isFeatured
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                          }`}
                        >
                          {prod.isFeatured ? '★ Featured' : 'Standard'}
                        </button>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/product/${prod.slug}`}
                            target="_blank"
                            className="p-1 text-slate-400 hover:text-slate-700"
                            title="View on site"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                          <Link
                            href={`/admin/products/${prod.id}/edit`}
                            className="p-1 text-emerald-600 hover:text-emerald-800"
                            title="Edit Product"
                          >
                            <Edit className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(prod.id, prod.name)}
                            className="p-1 text-red-500 hover:text-red-700"
                            title="Delete Product"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs"
          onClick={() => !deleting && setDeleteTarget(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
                <Trash2 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-slate-900">
                  Delete Product
                </h3>
                <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                  Are you sure you want to delete{' '}
                  <span className="font-semibold text-slate-900">&ldquo;{deleteTarget.name}&rdquo;</span>?
                  This will remove it from your store catalogue.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                disabled={deleting}
                onClick={() => setDeleteTarget(null)}
                className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={confirmDelete}
                className="inline-flex items-center gap-1.5 rounded-xl bg-red-600 px-4 py-2 text-xs font-semibold text-white shadow hover:bg-red-700 disabled:opacity-60"
              >
                {deleting ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Delete Product</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
