import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface CatalogProduct {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  weight?: string | null;
  mainImageUrl?: string | null;
  isAvailable: boolean;
  isActive?: boolean;
  categoryId: string;
  category?: {
    id: string;
    name: string;
    displayOrder?: number;
  } | null;
}

export interface CatalogBusinessSettings {
  businessName?: string;
  tagline?: string;
  phone?: string;
  whatsappNumber?: string;
  email?: string;
  address?: string;
  logoUrl?: string;
}

/**
 * Fetches an image URL and converts it to a compact square JPEG data URL
 * via an offscreen canvas so jsPDF supports WebP/PNG/AVIF/JPEG reliably
 * while keeping the generated PDF file size lightweight.
 */
async function loadThumbnailAsJpeg(url: string, sizePx = 120): Promise<string | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const blob = await res.blob();
    const objectUrl = URL.createObjectURL(blob);

    try {
      const img = await new Promise<HTMLImageElement>((resolve, reject) => {
        const el = new Image();
        el.onload = () => resolve(el);
        el.onerror = () => reject(new Error('Image load failed'));
        el.src = objectUrl;
      });

      const canvas = document.createElement('canvas');
      canvas.width = sizePx;
      canvas.height = sizePx;
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;

      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, sizePx, sizePx);

      // Center-crop (object-cover)
      const minSide = Math.min(img.width, img.height);
      const sx = (img.width - minSide) / 2;
      const sy = (img.height - minSide) / 2;
      ctx.drawImage(img, sx, sy, minSide, minSide, 0, 0, sizePx, sizePx);

      return canvas.toDataURL('image/jpeg', 0.82);
    } finally {
      URL.revokeObjectURL(objectUrl);
    }
  } catch {
    return null;
  }
}

async function preloadProductThumbnails(
  products: CatalogProduct[],
  fallbackUrl: string
): Promise<Map<string, string | null>> {
  const cache = new Map<string, string | null>();
  const uniqueUrls = Array.from(
    new Set(products.map((p) => p.mainImageUrl || fallbackUrl).filter(Boolean))
  );

  // Load in batches of 10 to avoid overwhelming browser connections
  const batchSize = 10;
  for (let i = 0; i < uniqueUrls.length; i += batchSize) {
    const batch = uniqueUrls.slice(i, i + batchSize);
    await Promise.all(
      batch.map(async (url) => {
        const dataUrl = await loadThumbnailAsJpeg(url, 120);
        cache.set(url, dataUrl);
      })
    );
  }

  return cache;
}

function formatInrForPdf(amount: number): string {
  return `Rs. ${Math.round(amount).toLocaleString('en-IN')}`;
}

function truncateText(text: string, maxLen: number): string {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length <= maxLen) return clean;
  return `${clean.slice(0, maxLen - 3).trim()}...`;
}

/**
 * Generates and downloads a branded, customer-ready PDF product catalog
 * complete with product thumbnail images.
 */
export async function downloadProductCatalogPdf(options: {
  products: CatalogProduct[];
  settings?: CatalogBusinessSettings;
  filterLabel?: string;
}): Promise<void> {
  const { products, settings, filterLabel } = options;

  const businessName = settings?.businessName || 'Himali Fresh';
  const tagline = settings?.tagline || 'The Spirit of Himalayas';
  const phone = settings?.phone || '+91 98320 78728';
  const whatsapp = (settings?.whatsappNumber || '919832078728').replace(/[^\d]/g, '');
  const email = settings?.email || 'riteshtayade68@gmail.com';
  const address = settings?.address || 'Dagapur, Siliguri, West Bengal, India';
  const logoUrl = settings?.logoUrl || '/images/logo.jpg';
  const fallbackImgUrl = '/images/hero-banner.jpg';

  const activeProducts = products.filter((p) => p.isActive !== false);

  // Preload logo + all unique product thumbnails concurrently
  const [logoDataUrl, thumbCache] = await Promise.all([
    loadThumbnailAsJpeg(logoUrl, 160),
    preloadProductThumbnails(activeProducts, fallbackImgUrl),
  ]);

  // Group products by category
  const grouped = new Map<
    string,
    { categoryName: string; displayOrder: number; items: CatalogProduct[] }
  >();

  for (const prod of activeProducts) {
    const catId = prod.category?.id || prod.categoryId || 'uncategorized';
    const catName = prod.category?.name || 'Other Products';
    const displayOrder = prod.category?.displayOrder ?? 999;

    if (!grouped.has(catId)) {
      grouped.set(catId, { categoryName: catName, displayOrder, items: [] });
    }
    grouped.get(catId)!.items.push(prod);
  }

  const sortedCategories = Array.from(grouped.values()).sort((a, b) => {
    if (a.displayOrder !== b.displayOrder) return a.displayOrder - b.displayOrder;
    return a.categoryName.localeCompare(b.categoryName);
  });

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;

  // Brand colors
  const darkGreen: [number, number, number] = [6, 75, 50];
  const midGreen: [number, number, number] = [11, 107, 67];
  const gold: [number, number, number] = [212, 165, 55];
  const cream: [number, number, number] = [247, 240, 227];
  const slateText: [number, number, number] = [51, 65, 85];

  // Top Header Banner
  doc.setFillColor(...darkGreen);
  doc.rect(0, 0, pageWidth, 38, 'F');
  doc.setFillColor(...gold);
  doc.rect(0, 38, pageWidth, 1.5, 'F');

  let textStartX = margin;
  if (logoDataUrl) {
    try {
      doc.addImage(logoDataUrl, 'JPEG', margin, 6, 24, 24);
      textStartX = margin + 29;
    } catch {
      // Continue without logo if unsupported
    }
  }

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text(businessName, textStartX, 16);

  doc.setTextColor(...gold);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text(tagline.toUpperCase(), textStartX, 22);

  doc.setTextColor(220, 245, 232);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text(`WhatsApp / Call: ${phone}  |  Email: ${email}`, textStartX, 28);
  doc.text(address, textStartX, 33);

  // Catalog Summary Strip
  const generatedDate = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  doc.setFillColor(...cream);
  doc.roundedRect(margin, 44, pageWidth - margin * 2, 14, 2, 2, 'F');

  doc.setTextColor(...darkGreen);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text(
    filterLabel ? `Product Catalog — ${filterLabel}` : 'Official Product Catalog',
    margin + 4,
    50
  );

  doc.setTextColor(...slateText);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text(
    `${activeProducts.length} Products across ${sortedCategories.length} Categories  •  Updated: ${generatedDate}`,
    margin + 4,
    55
  );

  let currentY = 64;

  if (sortedCategories.length === 0) {
    doc.setTextColor(...slateText);
    doc.setFontSize(11);
    doc.text('No active products found for this selection.', margin, currentY + 10);
  } else {
    for (const group of sortedCategories) {
      if (currentY > pageHeight - 44) {
        doc.addPage();
        currentY = 18;
      }

      // Category Section Header
      doc.setFillColor(...midGreen);
      doc.roundedRect(margin, currentY, pageWidth - margin * 2, 8, 1.5, 1.5, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text(`${group.categoryName} (${group.items.length})`, margin + 3.5, currentY + 5.5);

      const rowImages = group.items.map((item) => {
        const key = item.mainImageUrl || fallbackImgUrl;
        return thumbCache.get(key) || null;
      });

      const rows = group.items.map((item, idx) => [
        String(idx + 1),
        '', // Image rendered via didDrawCell
        item.description
          ? `${item.name}\n${truncateText(item.description, 80)}`
          : item.name,
        item.weight || '-',
        formatInrForPdf(item.price),
        item.isAvailable ? 'In Stock' : 'Out of Stock',
      ]);

      autoTable(doc, {
        startY: currentY + 9.5,
        margin: { left: margin, right: margin, bottom: 20 },
        head: [['#', 'Photo', 'Product & Description', 'Pack', 'Price', 'Status']],
        body: rows,
        theme: 'grid',
        headStyles: {
          fillColor: [241, 245, 249],
          textColor: darkGreen,
          fontStyle: 'bold',
          fontSize: 8.5,
          lineColor: [226, 232, 240],
          lineWidth: 0.2,
        },
        bodyStyles: {
          fontSize: 8.5,
          textColor: [30, 41, 59],
          cellPadding: 2.2,
          minCellHeight: 17,
          lineColor: [226, 232, 240],
          lineWidth: 0.2,
          valign: 'middle',
        },
        alternateRowStyles: {
          fillColor: [252, 252, 250],
        },
        columnStyles: {
          0: { cellWidth: 8, halign: 'center' },
          1: { cellWidth: 18, halign: 'center' },
          2: { cellWidth: 'auto' },
          3: { cellWidth: 20, halign: 'center' },
          4: { cellWidth: 22, halign: 'right', fontStyle: 'bold', textColor: darkGreen },
          5: { cellWidth: 22, halign: 'center' },
        },
        didParseCell: (data) => {
          if (data.section === 'body' && data.column.index === 5) {
            const val = String(data.cell.raw);
            data.cell.styles.textColor =
              val === 'In Stock' ? [5, 150, 105] : [220, 38, 38];
            data.cell.styles.fontStyle = 'bold';
          }
        },
        didDrawCell: (data) => {
          if (data.section === 'body' && data.column.index === 1) {
            const imgData = rowImages[data.row.index];
            if (imgData) {
              const imgSize = 13;
              const x = data.cell.x + (data.cell.width - imgSize) / 2;
              const y = data.cell.y + (data.cell.height - imgSize) / 2;
              try {
                doc.addImage(imgData, 'JPEG', x, y, imgSize, imgSize);
              } catch {
                // Skip invalid image
              }
            }
          }
        },
      });

      currentY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 7;
    }
  }

  // Order CTA Box at the end
  if (currentY > pageHeight - 34) {
    doc.addPage();
    currentY = 20;
  }
  doc.setFillColor(...cream);
  doc.setDrawColor(...gold);
  doc.roundedRect(margin, currentY, pageWidth - margin * 2, 16, 2, 2, 'FD');
  doc.setTextColor(...darkGreen);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.text('How to Order:', margin + 4, currentY + 6);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...slateText);
  doc.text(
    `Send your selected product names & quantities on WhatsApp (${phone} / wa.me/${whatsapp}) or shop online.`,
    margin + 4,
    currentY + 11.5
  );

  // Add page numbers & footer to every page
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, pageHeight - 13, pageWidth - margin, pageHeight - 13);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text(
      `${businessName}  •  ${phone}  •  Zero upfront payment — WhatsApp order confirmation`,
      margin,
      pageHeight - 8
    );
    doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin, pageHeight - 8, {
      align: 'right',
    });
  }

  const dateSlug = new Date().toISOString().slice(0, 10);
  doc.save(`Himali_Fresh_Catalog_${dateSlug}.pdf`);
}
