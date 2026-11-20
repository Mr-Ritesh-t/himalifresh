import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const [
      totalProducts,
      activeProducts,
      outOfStockProducts,
      totalCategories,
      newOrders,
      confirmedOrders,
      completedOrders,
      recentOrders,
      recentProducts,
    ] = await Promise.all([
      prisma.product.count(),
      prisma.product.count({ where: { isActive: true } }),
      prisma.product.count({ where: { isAvailable: false, isActive: true } }),
      prisma.category.count({ where: { isActive: true } }),
      prisma.order.count({ where: { status: 'NEW' } }),
      prisma.order.count({ where: { status: 'CONFIRMED' } }),
      prisma.order.count({ where: { status: 'COMPLETED' } }),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          items: true,
        },
      }),
      prisma.product.findMany({
        take: 5,
        orderBy: { updatedAt: 'desc' },
        include: {
          category: { select: { name: true } },
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      stats: {
        totalProducts,
        activeProducts,
        outOfStockProducts,
        totalCategories,
        newOrders,
        confirmedOrders,
        completedOrders,
      },
      recentOrders,
      recentProducts,
    });
  } catch (error: any) {
    console.error('Error fetching admin dashboard data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch dashboard metrics' },
      { status: 500 }
    );
  }
}
