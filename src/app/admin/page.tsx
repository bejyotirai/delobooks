'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, XAxis, YAxis, Legend, Pie, PieChart, Cell } from 'recharts';
import { Loader2 } from 'lucide-react';

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

async function fetchAnalytics(): Promise<AnalyticsData> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const response = await fetch(`${baseUrl}/api/admin/analytics`);
  if (!response.ok) {
    throw new Error('Failed to fetch analytics');
  }
  const data = await response.json();
  return data;
}

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadAnalytics() {
      try {
        const data = await fetchAnalytics();
        setAnalytics(data);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    }
    loadAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!analytics) {
    return <div className="text-center">Error loading analytics</div>;
  }

  const userGrowthData = analytics.users.userGrowth.length > 0 ? analytics.users.userGrowth : [{ date: '2025-09', count: 0 }];
  const statusDistributionData = analytics.orders.statusDistribution.length > 0 ? analytics.orders.statusDistribution : [{ status: 'Unknown', count: 0 }];
  const categoryDistributionData = analytics.ebooks.categoryDistribution.length > 0 ? analytics.ebooks.categoryDistribution : [{ category: 'Unknown', count: 0 }];

  return (
    <div className="container mx-auto p-6 space-y-12">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">Admin Dashboard</h1>


      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader>
            <CardTitle className="text-2xl">Total Users</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">Registered users in the platform</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-5xl font-bold text-blue-600 dark:text-blue-400">{analytics.users.totalUsers}</p>
          </CardContent>
        </Card>
        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader>
            <CardTitle className="text-2xl">Total Orders</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">Completed and pending orders</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-5xl font-bold text-green-600 dark:text-green-400">{analytics.orders.totalOrders}</p>
          </CardContent>
        </Card>
        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader>
            <CardTitle className="text-2xl">Total Revenue</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">Total revenue from orders</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-5xl font-bold text-purple-600 dark:text-purple-400">₹{analytics.orders.totalRevenue}</p>
          </CardContent>
        </Card>
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader>
            <CardTitle className="text-2xl">User Growth Over Time</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">New user registrations by month</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                count: {
                  label: 'Users',
                  color: 'hsl(var(--chart-1))', // Blue
                },
              }}
            >
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={userGrowthData}>
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="hsl(var(--chart-1))"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader>
            <CardTitle className="text-2xl">Order Status Distribution</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">Breakdown of order statuses</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                count: {
                  label: 'Orders',
                  color: 'hsl(var(--chart-2))', // Green
                },
              }}
            >
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={statusDistributionData}>
                  <XAxis dataKey="status" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Bar
                    dataKey="count"
                    fill="hsl(var(--chart-2))"
                    radius={[4, 4, 0, 0]}
                    barSize={20}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>


        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader>
            <CardTitle className="text-2xl">Ebook Category Distribution</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">Distribution of ebooks by category</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={categoryDistributionData.reduce(
                (acc, item, index) => ({
                  ...acc,
                  [item.category]: {
                    label: item.category,
                    color: `hsl(var(--chart-${(index % 5) + 1}))`,
                  },
                }),
                {} as Record<string, { label: string; color: string }>
              )}
            >
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryDistributionData}
                    dataKey="count"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    innerRadius={40}
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    paddingAngle={2}
                  >
                    {categoryDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={`hsl(var(--chart-${(index % 5) + 1}))`} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}