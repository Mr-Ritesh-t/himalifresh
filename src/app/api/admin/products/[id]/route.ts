import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getAdminSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { productSchema } from '@/lib/validations';
import { slugify } from '@/lib/utils';
import { deleteStoredImage } from '@/lib/tigris';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        images: true,
      },
    });

    if (!product) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: 'Failed to fetch product' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    const body = await request.json();

    const { galleryImages, ...updateData } = body;

    // Automatically manage slug if name is updated or slug provided
    if (updateData.name || updateData.slug) {
      const baseSlug = slugify(updateData.slug || updateData.name);
      let finalSlug = baseSlug;
      let counter = 1;

      while (true) {
        const existing = await prisma.product.findUnique({
          where: { slug: finalSlug },
          select: { id: true },
        });

        if (!existing || existing.id === id) break;

        finalSlug = `${baseSlug}-${counter}`;
        counter++;
      }

      updateData.slug = finalSlug;
    }

    await prisma.product.update({
      where: { id },
      data: updateData,
    });

    if (Array.isArray(galleryImages)) {
      await prisma.productImage.deleteMany({
        where: { productId: id },
      });

      if (galleryImages.length > 0) {
        await Promise.all(
          galleryImages.map((url: string, idx: number) =>
            prisma.productImage.create({
              data: {
                productId: id,
                imageUrl: url,
                displayOrder: idx,
              },
            })
          )
        );
      }
    }

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        images: { orderBy: { displayOrder: 'asc' } },
      },
    });

    try {
      revalidatePath('/', 'layout');
      revalidatePath('/shop');
      revalidatePath('/shop/[category]', 'page');
      revalidatePath('/product/[slug]', 'page');
      revalidatePath('/admin/products');
    } catch (e) {
      // Non-blocking
    }

    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    console.error('Error updating product:', error);
    return NextResponse.json({ success: false, error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await context.params;

    // 1. Fetch product with gallery images to identify files that must be pruned from storage
    const product = await prisma.product.findUnique({
      where: { id },
      include: { images: true },
    });

    if (!product) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }

    // Collect all stored image URLs (main cover + all gallery images)
    const imagesToDelete: string[] = [];
    if (product.mainImageUrl) {
      imagesToDelete.push(product.mainImageUrl);
    }
    if (Array.isArray(product.images)) {
      product.images.forEach((img) => {
        if (img.imageUrl) imagesToDelete.push(img.imageUrl);
      });
    }

    // 2. Delete product record from database (Cascade deletes ProductImage records, SetNull preserves order snapshots)
    await prisma.product.delete({
      where: { id },
    });

    // 3. Prune uploaded media from Tigris / object storage to free up quota
    if (imagesToDelete.length > 0) {
      await Promise.allSettled(imagesToDelete.map((url) => deleteStoredImage(url)));
    }

    try {
      revalidatePath('/', 'layout');
      revalidatePath('/shop');
      revalidatePath('/shop/[category]', 'page');
      revalidatePath('/admin/products');
    } catch (e) {
      // Non-blocking
    }

    return NextResponse.json({ success: true, message: 'Product and associated storage media deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete product' }, { status: 500 });
  }
}
