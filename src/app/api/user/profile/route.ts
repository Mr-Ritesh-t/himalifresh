import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserSession } from '@/lib/auth';

export async function PUT(request: NextRequest) {
  try {
    const session = await getUserSession();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, phone, address, city, pincode } = body;

    const updated = await prisma.user.update({
      where: { id: session.id },
      data: {
        name: name ? name.trim() : undefined,
        phone: phone !== undefined ? phone?.trim() : undefined,
        address: address !== undefined ? address?.trim() : undefined,
        city: city !== undefined ? city?.trim() : undefined,
        pincode: pincode !== undefined ? pincode?.trim() : undefined,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        city: true,
        pincode: true,
      },
    });

    return NextResponse.json({ success: true, user: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update profile' }, { status: 500 });
  }
}
