import { prisma } from "./prisma";

interface UserAnalytics {
    totalUsers: number;
    userGrowth: { date: string; count: number }[];
}

interface OrderAnalytics {
    totalOrders: number;
    totalRevenue: number;
    statusDistribution: { status: string; count: number }[];
}

interface EbookAnalytics {
    totalEbooks: number;
    categoryDistribution: { category: string; count: number }[];
}

interface AnalyticsData {
    users: UserAnalytics;
    orders: OrderAnalytics;
    ebooks: EbookAnalytics;
}

export async function getAnalytics(): Promise<AnalyticsData> {
    try {
        const [
            totalUsers,
            userGrowth,
            totalOrders,
            totalRevenue,
            statusDistribution,
            totalEbooks,
            categoryDistribution,
        ] = await Promise.all([

            prisma.user.count(),


            prisma.user
                .groupBy({
                    by: ['createdAt'],
                    _count: { id: true },
                    orderBy: { createdAt: 'asc' },
                })
                .then((data: { createdAt: Date; _count: { id: number } }[]) =>
                    data.map((item) => ({
                        date: item.createdAt.toISOString().slice(0, 7), // YYYY-MM
                        count: item._count.id,
                    }))
                ),


            prisma.order.count(),


            prisma.order
                .aggregate({
                    _sum: { totalAmount: true },
                })
                .then((result: { _sum: { totalAmount: number | null } }) => result._sum.totalAmount || 0),


            prisma.order
                .groupBy({
                    by: ['status'],
                    _count: { id: true },
                })
                .then((data: { status: string; _count: { id: number } }[]) =>
                    data.map((item) => ({
                        status: item.status,
                        count: item._count.id,
                    }))
                ),


            prisma.ebook.count(),


            prisma.ebook
                .groupBy({
                    by: ['category'],
                    _count: { id: true },
                })
                .then((data: { category: string; _count: { id: number } }[]) =>
                    data.map((item) => ({
                        category: item.category,
                        count: item._count.id,
                    }))
                ),
        ]);

        return {
            users: { totalUsers, userGrowth },
            orders: { totalOrders, totalRevenue, statusDistribution },
            ebooks: { totalEbooks, categoryDistribution },
        };
    } catch (error) {
        console.error('Analytics fetch error:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}