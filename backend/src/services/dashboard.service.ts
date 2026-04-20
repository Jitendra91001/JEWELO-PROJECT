import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getDashboardStats = async () => {
  try {
    const totalUsers = await prisma.user.count();

    const totalOrders = await prisma.order.count();

    const totalProducts = await prisma.product.count();

    const totalCategories = await prisma.category.count();

    const totalRevenue = await prisma.order.aggregate({
      _sum: {
        total: true,
      },
      where: {
        paymentStatus: 'COMPLETED',
      },
    });

    const recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

    const paidOrders = await prisma.order.findMany({
      where: {
        paymentStatus: 'COMPLETED',
        createdAt: {
          gte: twelveMonthsAgo,
        },
      },
      select: {
        createdAt: true,
        total: true,
      },
    });

    // Group by month
    const monthlyRevenueMap = new Map();
    paidOrders.forEach(order => {
      const monthKey = `${order.createdAt.getFullYear()}-${String(order.createdAt.getMonth() + 1).padStart(2, '0')}`;
      if (!monthlyRevenueMap.has(monthKey)) {
        monthlyRevenueMap.set(monthKey, { month: monthKey, revenue: 0 });
      }
      monthlyRevenueMap.get(monthKey).revenue += order.total;
    });

    const monthlyRevenue = Array.from(monthlyRevenueMap.values())
      .sort((a, b) => b.month.localeCompare(a.month))
      .slice(0, 12);

    const orderStatusStats = await prisma.order.groupBy({
      by: ['status'],
      _count: {
        status: true,
      },
    });

    const productStatusStats = await prisma.product.groupBy({
      by: ['isActive'],
      _count: {
        isActive: true,
      },
    });

    return {
      totalUsers,
      totalOrders,
      totalProducts,
      totalCategories,
      totalRevenue: totalRevenue._sum?.total || 0,
      recentOrders,
      monthlyRevenue,
      orderStatusStats,
      productStatusStats,
    };
  } catch (error) {
    throw new Error('Failed to fetch dashboard stats');
  }
};