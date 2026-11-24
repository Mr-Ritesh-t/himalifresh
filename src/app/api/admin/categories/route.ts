import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { categorySchema } from '@/lib/validations';
import { slugify } from '@/lib/utils';

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: { displayOrder: 'asc' },
    });

    return NextResponse.json({ success: true, categories });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const result = categorySchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', issues: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const data = result.data;

    // Automatically generate unique slug based on category name and number
    const baseSlug = slugify(data.slug || data.name || 'category');
    let finalSlug = baseSlug;
    let counter = 1;

    while (true) {
      const existing = await prisma.category.findUnique({
        where: { slug: finalSlug },
        select: { id: true },
      });

      if (!existing) break;

      finalSlug = `${baseSlug}-${counter}`;
      counter++;
    }

    const category = await prisma.category.create({
      data: {
        name: data.name,
        slug: finalSlug,
        description: data.description,
        imageUrl: data.imageUrl,
        displayOrder: data.displayOrder,
        isActive: data.isActive,
      },
    });

    return NextResponse.json({ success: true, category });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: 'Failed to create category' }, { status: 500 });
  }
}
