import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const rateCheck = checkRateLimit(`order-track:${ip}`, 10, 60 * 1000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { success: false, error: 'Too many lookup requests. Please wait a minute.' },
        { status: 429 }
      );
    }

    const { orderNumber, phone } = await request.json();

    if (!orderNumber?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Please enter your Order Reference Number (e.g. HF-20261124-1001)' },
        { status: 400 }
      );
    }

    const cleanOrderNumber = orderNumber.trim().toUpperCase();

    const order = await prisma.order.findUnique({
      where: { orderNumber: cleanOrderNumber },
      include: {
        items: true,
        statusHistory: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'No order found with this reference number. Please check and try again.' },
        { status: 404 }
      );
    }

    // Optional phone verification for security if phone was entered
    if (phone?.trim()) {
      const cleanPhoneInput = phone.replace(/\D/g, '');
      const cleanOrderPhone = order.phone.replace(/\D/g, '');
      if (cleanPhoneInput && !cleanOrderPhone.endsWith(cleanPhoneInput.slice(-10))) {
        return NextResponse.json(
          { success: false, error: 'Phone number does not match this order.' },
          { status: 401 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      order: {
        orderNumber: order.orderNumber,
        status: order.status,
        customerName: order.customerName,
        city: order.city,
        totalAmount: order.totalAmount,
        createdAt: order.createdAt,
        items: order.items.map((i) => ({
          name: i.productNameSnapshot,
          quantity: i.quantity,
          weight: i.weightSnapshot,
          subtotal: i.subtotal,
        })),
        statusHistory: order.statusHistory.map((h) => ({
          status: h.newStatus,
          notes: h.notes,
          createdAt: h.createdAt,
        })),
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Failed to look up order' },
      { status: 500 }
    );
  }
}
