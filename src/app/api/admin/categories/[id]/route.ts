import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getAdminSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { slugify } from '@/lib/utils';

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

    // Check if category has active products
    const productCount = await prisma.product.count({
      where: { categoryId: id, isActive: true },
    });

    if (productCount > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Cannot delete category because it contains ${productCount} active product(s). Please reassign or delete them first.`,
        },
        { status: 400 }
      );
    }

    await prisma.category.delete({
      where: { id },
    });

    try {
      revalidatePath('/', 'layout');
      revalidatePath('/shop');
      revalidatePath('/shop/[category]', 'page');
      revalidatePath('/admin/categories');
    } catch (e) {
      // Non-blocking
    }

    return NextResponse.json({ success: true, message: 'Category deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: 'Failed to delete category' }, { status: 500 });
  }
}
