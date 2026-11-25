import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { productSchema } from '@/lib/validations';
import { slugify } from '@/lib/utils';

export async function GET(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q') || '';
    const categoryId = searchParams.get('categoryId') || '';

    const where: any = { isActive: true };
    if (q) {
      where.OR = [
        { name: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
      ];
    }
    if (categoryId) {
      where.categoryId = categoryId;
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        category: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, products });
  } catch (error: any) {
    console.error('Error listing products for admin:', error);
    return NextResponse.json({ success: false, error: 'Failed to list products' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const result = productSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', issues: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const data = result.data;

    // Automatically generate unique slug based on product name and number
    const baseSlug = slugify(data.slug || data.name || 'product');
    let finalSlug = baseSlug;
    let counter = 1;

    while (true) {
      const existing = await prisma.product.findUnique({
        where: { slug: finalSlug },
        select: { id: true },
      });

      if (!existing) break;

      finalSlug = `${baseSlug}-${counter}`;
      counter++;
    }

    const { galleryImages, ...productFields } = data;

    const product = await prisma.product.create({
      data: {
        name: productFields.name,
        slug: finalSlug,
        description: productFields.description,
        price: productFields.price,
        weight: productFields.weight,
        mainImageUrl: productFields.mainImageUrl,
        categoryId: productFields.categoryId,
        isAvailable: productFields.isAvailable,
        isFeatured: productFields.isFeatured,
        isActive: productFields.isActive,
        images: galleryImages && galleryImages.length > 0
          ? {
              create: galleryImages.map((url, idx) => ({
                imageUrl: url,
                displayOrder: idx,
              })),
            }
          : undefined,
      },
      include: {
        category: true,
        images: { orderBy: { displayOrder: 'asc' } },
      },
    });

    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    console.error('Error creating product:', error);
    return NextResponse.json({ success: false, error: 'Failed to create product' }, { status: 500 });
  }
}
