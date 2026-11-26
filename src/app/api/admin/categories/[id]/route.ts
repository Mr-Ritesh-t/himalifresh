import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getAdminSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { slugify } from '@/lib/utils';
import { deleteStoredImage } from '@/lib/tigris';

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

    if (body.name || body.slug) {
      const baseSlug = slugify(body.slug || body.name);
      let finalSlug = baseSlug;
      let counter = 1;

      while (true) {
        const existing = await prisma.category.findUnique({
          where: { slug: finalSlug },
          select: { id: true },
        });

        if (!existing || existing.id === id) break;

        finalSlug = `${baseSlug}-${counter}`;
        counter++;
      }

      body.slug = finalSlug;
    }

    const category = await prisma.category.update({
      where: { id },
      data: body,
    });

    try {
      revalidatePath('/', 'layout');
      revalidatePath('/shop');
      revalidatePath('/shop/[category]', 'page');
      revalidatePath('/admin/categories');
    } catch (e) {
      // Non-blocking
    }

    return NextResponse.json({ success: true, category });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: 'Failed to update category' }, { status: 500 });
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

    // 1. Check if category has any products (both active & inactive) to prevent foreign key errors
    const productCount = await prisma.product.count({
      where: { categoryId: id },
    });

    if (productCount > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Cannot delete category because it contains ${productCount} product(s). Please reassign or delete them first.`,
        },
        { status: 400 }
      );
    }

    // 2. Fetch category to capture its image URL before deleting record
    const category = await prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      return NextResponse.json({ success: false, error: 'Category not found' }, { status: 404 });
    }

    const imageToDelete = category.imageUrl;

    // 3. Delete category from database
    await prisma.category.delete({
      where: { id },
    });

    // 4. Prune category image from Tigris / object storage
    if (imageToDelete) {
      await deleteStoredImage(imageToDelete);
    }

    try {
      revalidatePath('/', 'layout');
      revalidatePath('/shop');
      revalidatePath('/shop/[category]', 'page');
      revalidatePath('/admin/categories');
    } catch (e) {
      // Non-blocking
    }

    return NextResponse.json({ success: true, message: 'Category and associated storage media deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: 'Failed to delete category' }, { status: 500 });
  }
}
