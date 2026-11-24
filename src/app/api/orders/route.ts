import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { checkoutSchema } from '@/lib/validations';
import { generateOrderNumber } from '@/lib/utils';
import { buildWhatsAppOrderMessage, generateWhatsAppUrl } from '@/lib/whatsapp';
import { getUserSession } from '@/lib/auth';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const rateCheck = checkRateLimit(`order-create:${ip}`, 10, 10 * 60 * 1000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { success: false, error: 'You are placing orders too quickly. Please wait a few minutes before trying again.' },
        { status: 429 }
      );
    }

    const body = await request.json();

    // 1. Validate request body with Zod
    const validationResult = checkoutSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          issues: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const {
      customerName,
      phone,
      address,
      city,
      pincode,
      landmark,
      instructions,
      items,
    } = validationResult.data;

    // 2. Fetch fresh products from database (NEVER trust client-provided prices or availability)
    const productIds = items.map((i) => i.productId);
    const dbProducts = await prisma.product.findMany({
      where: {
        id: { in: productIds },
        isActive: true,
      },
    });

    const dbProductMap = new Map(dbProducts.map((p) => [p.id, p]));

    // Check all requested products exist and are available
    for (const item of items) {
      const dbProd = dbProductMap.get(item.productId);
      if (!dbProd) {
        return NextResponse.json(
          {
            success: false,
            error: `Product no longer available or found.`,
          },
          { status: 400 }
        );
      }
      if (!dbProd.isAvailable) {
        return NextResponse.json(
          {
            success: false,
            error: `"${dbProd.name}" is currently out of stock. Please adjust your cart.`,
          },
          { status: 400 }
        );
      }
    }

    // 3. Recalculate totals strictly on server
    let calculatedTotal = 0;
    const orderItemsData = items.map((item) => {
      const dbProd = dbProductMap.get(item.productId)!;
      const subtotal = Math.round(dbProd.price * item.quantity * 100) / 100;
      calculatedTotal += subtotal;

      return {
        productId: dbProd.id,
        productNameSnapshot: dbProd.name,
        unitPriceSnapshot: dbProd.price,
        quantity: item.quantity,
        subtotal: subtotal,
        weightSnapshot: dbProd.weight,
      };
    });

    calculatedTotal = Math.round(calculatedTotal * 100) / 100;

    // 4. Generate unique order number
    const orderNumber = generateOrderNumber();

    // 5. Check if user is logged in
    const userSession = await getUserSession();

    // 6. Save order inside a database transaction
    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          userId: userSession?.id || null,
          customerName,
          phone,
          address,
          city,
          pincode,
          landmark,
          instructions,
          totalAmount: calculatedTotal,
          status: 'NEW',
          items: {
            create: orderItemsData,
          },
          statusHistory: {
            create: {
              previousStatus: 'NONE',
              newStatus: 'NEW',
              changedBy: 'System / Customer Checkout',
              notes: 'Order enquiry created via website checkout',
            },
          },
        },
        include: {
          items: true,
        },
      });

      return newOrder;
    });

    // 6. Fetch business settings to get the official WhatsApp number
    const settings = await prisma.businessSettings.findUnique({
      where: { id: 'default-settings' },
    });
    const businessWhatsApp = settings?.whatsappNumber || '919832078728';

    // 7. Format WhatsApp message
    const whatsappPayload = {
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      phone: order.phone,
      address: order.address,
      city: order.city,
      pincode: order.pincode,
      landmark: order.landmark,
      instructions: order.instructions,
      totalAmount: order.totalAmount,
      items: order.items.map((i) => ({
        name: i.productNameSnapshot,
        weight: i.weightSnapshot,
        quantity: i.quantity,
        price: i.unitPriceSnapshot,
        subtotal: i.subtotal,
      })),
    };

    const message = buildWhatsAppOrderMessage(whatsappPayload);
    const whatsappUrl = generateWhatsAppUrl(businessWhatsApp, message);

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        totalAmount: order.totalAmount,
        customerName: order.customerName,
        createdAt: order.createdAt,
      },
      whatsappUrl,
      whatsappNumber: businessWhatsApp,
    });
  } catch (error: any) {
    console.error('Error processing order checkout:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error processing order' },
      { status: 500 }
    );
  }
}
