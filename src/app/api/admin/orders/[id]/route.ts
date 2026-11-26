import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { sendOrderStatusUpdateEmail } from '@/lib/brevo';

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
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: true,
        statusHistory: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, order });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: 'Failed to fetch order details' }, { status: 500 });
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
    const { status, notes } = await request.json();

    const currentOrder = await prisma.order.findUnique({
      where: { id },
    });

    if (!currentOrder) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    const previousStatus = currentOrder.status;

    // 1. Update order status without relations (avoids Prisma implicit transactions unsupported in Neon HTTP)
    await prisma.order.update({
      where: { id },
      data: { status },
    });

    // 2. Record status change in status history
    await prisma.orderStatusHistory.create({
      data: {
        orderId: id,
        previousStatus,
        newStatus: status,
        changedBy: session.name || session.email || 'Admin',
        notes: notes || `Status changed from ${previousStatus} to ${status}`,
      },
    });

    // 3. Query full updated order with relations for Brevo email and response
    const updatedOrder = await prisma.order.findUnique({
      where: { id },
      include: { items: true, statusHistory: true, user: true },
    });

    if (!updatedOrder) {
      return NextResponse.json({ success: false, error: 'Order not found after update' }, { status: 404 });
    }

    // Send Brevo email notification to customer if status changed
    if (status !== previousStatus) {
      let customerEmail = updatedOrder.user?.email || null;
      if (!customerEmail && updatedOrder.instructions) {
        const match = updatedOrder.instructions.match(/\[Email:\s*([^\]]+)\]/);
        if (match) customerEmail = match[1].trim();
      }

      if (customerEmail) {
        sendOrderStatusUpdateEmail({
          orderNumber: updatedOrder.orderNumber,
          customerName: updatedOrder.customerName,
          customerEmail,
          newStatus: status,
          notes,
        }).catch((err) => console.error('[Brevo Status Update Error]', err));
      }
    }

    return NextResponse.json({ success: true, order: updatedOrder });
  } catch (error: any) {
    console.error('[Admin Order Update Error]:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to update order status' },
      { status: 500 }
    );
  }
}
