"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import {
  Users,
  Store,
  Package,
  DollarSign,
  ShoppingBag,
  Clock,
  Truck,
  CheckCircle,
  XCircle,
  ArrowUpRight,
  Loader2,
} from "lucide-react";

import { apiFetch } from "@/lib/apiClient";

//  TYPES
interface MonthlyRevenue {
  month?: string;
  revenue?: number;
  totalRevenue?: number;
  amount?: number;
}

interface RecentOrder {
  _id: string;
  email?: string;
  totalAmount?: number;
  status?: string;
  paymentStatus?: string;
  createdAt?: string;
}

interface AdminDashboardData {
  totalUsers: number;
  totalSellers: number;
  totalProducts: number;
  totalRevenue: number;

  totalOrders: number;

  pendingOrders: number;
  processingOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;

  monthlyRevenue: MonthlyRevenue[];
  recentOrders: RecentOrder[];
}

interface AdminApiResponse {
  success?: boolean;
  message?: string;
  data?: Partial<AdminDashboardData>;
}

//  DEFAULT DATA
const DEFAULT_DATA: AdminDashboardData = {
  totalUsers: 0,
  totalSellers: 0,
  totalProducts: 0,
  totalRevenue: 0,

  totalOrders: 0,

  pendingOrders: 0,
  processingOrders: 0,
  shippedOrders: 0,
  deliveredOrders: 0,
  cancelledOrders: 0,

  monthlyRevenue: [],
  recentOrders: [],
};

//  COLORS
const STATUS_COLORS: Record<string, string> = {
  pending: "#F59E0B",
  processing: "#3B82F6",
  shipped: "#8B5CF6",
  delivered: "#10B981",
  cancelled: "#EF4444",
};

// HELPERS
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);
};

const formatDate = (date?: string) => {
  if (!date) return "-";

  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatMonth = (month?: string) => {
  if (!month) return "";

  if (/^\d{4}-\d{2}$/.test(month)) {
    const [year, monthNumber] = month.split("-");

    return new Date(
      Number(year),
      Number(monthNumber) - 1,
      1,
    ).toLocaleDateString("en-US", {
      month: "short",
    });
  }
  return month;
};

// NORMALIZE DATA
const normalizeDashboardData = (
  apiData: Partial<AdminDashboardData> | undefined,
): AdminDashboardData => {
  return {
    totalUsers: Number(apiData?.totalUsers) || 0,

    totalSellers: Number(apiData?.totalSellers) || 0,

    totalProducts: Number(apiData?.totalProducts) || 0,

    totalRevenue: Number(apiData?.totalRevenue) || 0,

    totalOrders: Number(apiData?.totalOrders) || 0,

    pendingOrders: Number(apiData?.pendingOrders) || 0,

    processingOrders: Number(apiData?.processingOrders) || 0,

    shippedOrders: Number(apiData?.shippedOrders) || 0,

    deliveredOrders: Number(apiData?.deliveredOrders) || 0,

    cancelledOrders: Number(apiData?.cancelledOrders) || 0,

    monthlyRevenue: Array.isArray(apiData?.monthlyRevenue)
      ? apiData.monthlyRevenue.map((item) => ({
          month: item?.month || "",
          revenue:
            Number(item?.revenue) ||
            Number(item?.totalRevenue) ||
            Number(item?.amount) ||
            0,
        }))
      : [],

    recentOrders: Array.isArray(apiData?.recentOrders)
      ? apiData.recentOrders
      : [],
  };
};

// COMPONENT
const AdminDashboard = () => {
  const [data, setData] = useState<AdminDashboardData>(DEFAULT_DATA);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchDashboard = async () => {
      try {
        setLoading(true);

        const response = await apiFetch("/api/dashboard/admin", {
          method: "GET",
        });

        const result: AdminApiResponse = await response.json();

        console.log("Admin dashboard:", result);

        if (!response.ok) {
          throw new Error(result.message || "Failed to fetch admin dashboard");
        }

        if (!mounted) return;

        setData(normalizeDashboardData(result.data));
      } catch (error) {
        console.error("Admin dashboard error:", error);

        if (mounted) {
          setData(DEFAULT_DATA);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };
    fetchDashboard();

    return () => {
      mounted = false;
    };
  }, []);

  const revenueChartData = useMemo(() => {
    return data.monthlyRevenue.map((item) => ({
      month: formatMonth(item.month),
      revenue:
        Number(item.revenue) ||
        Number(item.totalRevenue) ||
        Number(item.amount) ||
        0,
    }));
  }, [data.monthlyRevenue]);

  const orderStatusData = useMemo(() => {
    return [
      {
        name: "Pending",
        value: data.pendingOrders,
        color: STATUS_COLORS.pending,
      },
      {
        name: "Processing",
        value: data.processingOrders,
        color: STATUS_COLORS.processing,
      },
      {
        name: "Shipped",
        value: data.shippedOrders,
        color: STATUS_COLORS.shipped,
      },
      {
        name: "Delivered",
        value: data.deliveredOrders,
        color: STATUS_COLORS.delivered,
      },
      {
        name: "Cancelled",
        value: data.cancelledOrders,
        color: STATUS_COLORS.cancelled,
      },
    ].filter((item) => item.value > 0);
  }, [
    data.pendingOrders,
    data.processingOrders,
    data.shippedOrders,
    data.deliveredOrders,
    data.cancelledOrders,
  ]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-7 w-7 animate-spin text-slate-400" />

          <p className="text-sm text-slate-500 dark:text-slate-400">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Platform Overview
        </h1>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Monitor overall marketplace health and activity.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Users */}
        <div className="rounded border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Total Users
              </p>

              <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                {data.totalUsers.toLocaleString()}
              </p>

              <a
                href="/admin/users"
                className="mt-2 inline-block text-xs font-medium text-slate-600 hover:underline dark:text-slate-300"
              >
                View users →
              </a>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10">
              <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        {/* Total Sellers */}
        <div className="rounded border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Total Sellers
              </p>

              <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                {data.totalSellers.toLocaleString()}
              </p>

              <a
                href="/admin/sellers"
                className="mt-2 inline-block text-xs font-medium text-slate-600 hover:underline dark:text-slate-300"
              >
                View sellers →
              </a>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-500/10">
              <Store className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

        {/* Total Products */}
        <div className="rounded border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Total Products
              </p>

              <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                {data.totalProducts.toLocaleString()}
              </p>

              <a
                href="/admin/products"
                className="mt-2 inline-block text-xs font-medium text-slate-600 hover:underline dark:text-slate-300"
              >
                View products →
              </a>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-500/10">
              <Package className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        {/* Platform Revenue */}
        <div className="rounded border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Platform Revenue
              </p>

              <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                {formatCurrency(data.totalRevenue)}
              </p>

              <a
                href="/admin/orders"
                className="mt-2 inline-block text-xs font-medium text-slate-600 hover:underline dark:text-slate-300"
              >
                View orders →
              </a>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/10">
              <DollarSign className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {/* Total Orders */}
        <div className="rounded border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Total Orders
              </p>

              <p className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
                {data.totalOrders}
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
              <ShoppingBag className="h-5 w-5" />
            </div>
          </div>
        </div>

        {/* Pending */}
        <div className="rounded border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Pending
              </p>

              <p className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
                {data.pendingOrders}
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400">
              <Clock className="h-5 w-5" />
            </div>
          </div>
        </div>

        {/* Shipped */}
        <div className="rounded border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Shipped
              </p>

              <p className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
                {data.shippedOrders}
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <Truck className="h-5 w-5" />
            </div>
          </div>
        </div>

        {/* Delivered */}
        <div className="rounded border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Delivered
              </p>

              <p className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
                {data.deliveredOrders}
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/10 text-green-600 dark:text-green-400">
              <CheckCircle className="h-5 w-5" />
            </div>
          </div>
        </div>

        {/* Cancelled */}
        <div className="rounded border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Cancelled
              </p>

              <p className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
                {data.cancelledOrders}
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 text-red-600 dark:text-red-400">
              <XCircle className="h-5 w-5" />
            </div>
          </div>
        </div>
      </div>



      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
   
        <div
          className="
            rounded
            border border-slate-200
            bg-white
            p-5
            shadow-sm
            dark:border-slate-800
            dark:bg-slate-900
            lg:col-span-2
          "
        >
          <div className="mb-5 flex items-start justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                Revenue Overview
              </h2>

              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Monthly platform revenue
              </p>
            </div>

            <div className="text-right">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Total Revenue
              </p>

              <p className="mt-1 text-lg font-bold text-slate-900 dark:text-white">
                {formatCurrency(data.totalRevenue)}
              </p>
            </div>
          </div>

          {revenueChartData.length === 0 ? (
            <EmptyChart label="No revenue data yet" />
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <LineChart
                data={revenueChartData}
                margin={{
                  top: 10,
                  right: 10,
                  left: -10,
                  bottom: 0,
                }}
              >
                <CartesianGrid
                  vertical={false}
                  stroke="#E2E8F0"
                  className="dark:opacity-20"
                />

                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontSize: 12,
                    fill: "#94A3B8",
                  }}
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontSize: 12,
                    fill: "#94A3B8",
                  }}
                  tickFormatter={(value) => `$${value}`}
                />

                <Tooltip
                  formatter={(value) => [
                    formatCurrency(Number(value)),
                    "Revenue",
                  ]}
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid #E2E8F0",
                    backgroundColor: "#FFFFFF",
                    fontSize: 13,
                  }}
                />

                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#0F172A"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* =================================================
            ORDER STATUS
        ================================================= */}

        <div
          className="
            rounded-2xl
            border border-slate-200
            bg-white
            p-5
            shadow-sm
            dark:border-slate-800
            dark:bg-slate-900
          "
        >
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
            Order Status
          </h2>

          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Current order distribution
          </p>

          {orderStatusData.length === 0 ? (
            <EmptyChart label="No order data yet" />
          ) : (
            <>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={orderStatusData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                  >
                    {orderStatusData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>

                  <Tooltip
                    contentStyle={{
                      borderRadius: 12,
                      border: "1px solid #E2E8F0",
                      backgroundColor: "#FFFFFF",
                      fontSize: 13,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>

              <div className="mt-3 space-y-3">
                {orderStatusData.map((entry) => (
                  <div
                    key={entry.name}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{
                          backgroundColor: entry.color,
                        }}
                      />

                      <span className="text-xs text-slate-600 dark:text-slate-400">
                        {entry.name}
                      </span>
                    </div>

                    <span className="text-sm font-semibold text-slate-900 dark:text-white">
                      {entry.value}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* =================================================
          RECENT ORDERS
      ================================================= */}

      <div
        className="
          rounded-2xl
          border border-slate-200
          bg-white
          p-5
          shadow-sm
          dark:border-slate-800
          dark:bg-slate-900
        "
      >
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
              Recent Orders
            </h2>

            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Latest customer orders
            </p>
          </div>

          <Link
            href="/admin/orders"
            className="
              flex items-center gap-1
              text-xs font-medium
              text-slate-500
              transition
              hover:text-slate-900
              dark:text-slate-400
              dark:hover:text-white
            "
          >
            View all
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {data.recentOrders.length === 0 ? (
          <div className="flex min-h-[180px] items-center justify-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              No recent orders.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800">
                  <th className="px-3 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400">
                    Order
                  </th>

                  <th className="px-3 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400">
                    Customer
                  </th>

                  <th className="px-3 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400">
                    Amount
                  </th>

                  <th className="px-3 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400">
                    Status
                  </th>

                  <th className="px-3 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400">
                    Date
                  </th>
                </tr>
              </thead>

              <tbody>
                {data.recentOrders.map((order) => {
                  const status = order.status?.toLowerCase() || "pending";

                  const statusColor = STATUS_COLORS[status] || "#64748B";

                  return (
                    <tr
                      key={order._id}
                      className="
                          border-b
                          border-slate-100
                          transition
                          hover:bg-slate-50
                          dark:border-slate-800
                          dark:hover:bg-slate-800/50
                        "
                    >
                      <td className="px-3 py-4">
                        <span className="font-mono text-xs text-slate-700 dark:text-slate-300">
                          #{order._id.slice(-8)}
                        </span>
                      </td>

                      <td className="px-3 py-4">
                        <span className="text-sm text-slate-700 dark:text-slate-300">
                          {order.email || "Unknown"}
                        </span>
                      </td>

                      <td className="px-3 py-4">
                        <span className="text-sm font-semibold text-slate-900 dark:text-white">
                          {formatCurrency(Number(order.totalAmount) || 0)}
                        </span>
                      </td>

                      <td className="px-3 py-4">
                        <span
                          className="rounded-full px-2.5 py-1 text-xs font-medium capitalize"
                          style={{
                            backgroundColor: `${statusColor}1A`,
                            color: statusColor,
                          }}
                        >
                          {status}
                        </span>
                      </td>

                      <td className="px-3 py-4">
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {formatDate(order.createdAt)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

/* =====================================================
   STAT CARD
===================================================== */

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string;
  href: string;
}

const StatCard = ({ icon: Icon, label, value, href }: StatCardProps) => {
  return (
    <Link
      href={href}
      className="
        group
        flex items-center
        justify-between
        rounded-2xl
        border border-slate-200
        bg-white
        p-5
        shadow-sm
        transition-all
        hover:-translate-y-0.5
        hover:border-slate-300
        hover:shadow-md

        dark:border-slate-800
        dark:bg-slate-900
        dark:hover:border-slate-700
        dark:hover:shadow-none
      "
    >
      <div className="min-w-0">
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
          {label}
        </p>

        <p className="mt-1.5 truncate text-2xl font-bold text-slate-900 dark:text-white">
          {value}
        </p>
      </div>

      <div
        className="
          flex h-11 w-11 shrink-0
          items-center justify-center
          rounded-xl

          bg-slate-100
          text-slate-700

          transition-all
          group-hover:bg-slate-900
          group-hover:text-white

          dark:bg-slate-800
          dark:text-slate-200
          dark:group-hover:bg-white
          dark:group-hover:text-slate-900
        "
      >
        <Icon className="h-5 w-5" />
      </div>
    </Link>
  );
};

//  MINI STAT
interface MiniStatProps {
  icon: React.ElementType;
  label: string;
  value: number;
  iconClass: string;
}

const MiniStat = ({ icon: Icon, label, value, iconClass }: MiniStatProps) => {
  return (
    <div
      className="
        rounded-2xl
        border border-slate-200
        bg-white
        p-4
        shadow-sm
        dark:border-slate-800
        dark:bg-slate-900
      "
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
            {label}
          </p>

          <p className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
            {value}
          </p>
        </div>

        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconClass}`}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
};

//  EMPTY CHART

const EmptyChart = ({ label }: { label: string }) => {
  return (
    <div className="flex h-[200px] items-center justify-center">
      <p className="text-sm text-slate-400 dark:text-slate-500">{label}</p>
    </div>
  );
};

export default AdminDashboard;
