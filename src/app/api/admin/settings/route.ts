import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getAdminSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { businessSettingsSchema } from '@/lib/validations';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const settings = await prisma.businessSettings.findUnique({
      where: { id: 'default-settings' },
    });
    return NextResponse.json({ success: true, settings });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const result = businessSettingsSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', issues: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const updated = await prisma.businessSettings.upsert({
      where: { id: 'default-settings' },
      update: result.data,
      create: {
        id: 'default-settings',
        ...result.data,
      },
    });

    // Revalidate public website layout and pages immediately
    try {
      revalidatePath('/', 'layout');
      revalidatePath('/');
      revalidatePath('/contact');
      revalidatePath('/about');
      revalidatePath('/shop');
    } catch (revalidateErr) {
      console.warn('Revalidation warning:', revalidateErr);
    }

    return NextResponse.json({ success: true, settings: updated });
  } catch (error: any) {
    console.error('Error updating business settings:', error);
    return NextResponse.json({ success: false, error: 'Failed to update settings' }, { status: 500 });
  }
}
