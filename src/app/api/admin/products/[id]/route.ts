import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { productSchema } from '@/lib/validations';
import { slugify } from '@/lib/utils';

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

    const product = await prisma.$transaction(async (tx) => {
      await tx.product.update({
        where: { id },
        data: updateData,
      });

      if (Array.isArray(galleryImages)) {
        await tx.productImage.deleteMany({
          where: { productId: id },
        });

        if (galleryImages.length > 0) {
          await tx.productImage.createMany({
            data: galleryImages.map((url: string, idx: number) => ({
              productId: id,
              imageUrl: url,
              displayOrder: idx,
            })),
          });
        }
      }

      return tx.product.findUnique({
        where: { id },
        include: {
          category: true,
          images: { orderBy: { displayOrder: 'asc' } },
        },
      });
    });

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

    // Soft delete by setting isActive: false or safe delete
    await prisma.product.update({
      where: { id },
      data: { isActive: false, isAvailable: false },
    });

    return NextResponse.json({ success: true, message: 'Product archived successfully' });
  } catch (error: any) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete product' }, { status: 500 });
  }
}
