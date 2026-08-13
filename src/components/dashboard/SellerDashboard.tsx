"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  ArrowRight,
  ArrowUpRight,
  DollarSign,
  Eye,
  Loader2,
  Package,
  ShoppingBag,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";

import { apiFetch } from "@/lib/apiClient";
import { useAuthStore } from "../store/authStore";

// =====================================================
// TYPES
// =====================================================

interface SellerOrderItem {
  _id?: string;
  name: string;
  qty: number;
}

interface RecentSellerOrder {
  _id: string;
  orderNumber: string;
  customerName?: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  items: SellerOrderItem[];
}

interface MonthlyRevenue {
  month: string;
  revenue: number;
}

interface OrderStatus {
  status: string;
  count: number;
}

interface SellerDashboardData {
  totalProducts: number;
  activeProducts: number;
  outOfStockProducts: number;

  totalOrders: number;
  pendingOrders: number;
  processingOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;

  totalRevenue: number;
  monthlyRevenue: MonthlyRevenue[];

  totalCustomers: number;
  totalViews: number;

  totalReviews: number;
  averageRating: number;

  orderStatus: OrderStatus[];

  recentOrders: RecentSellerOrder[];
}

// =====================================================
// DEFAULT DATA
// =====================================================

const DEFAULT_DATA: SellerDashboardData = {
  totalProducts: 0,
  activeProducts: 0,
  outOfStockProducts: 0,

  totalOrders: 0,
  pendingOrders: 0,
  processingOrders: 0,
  shippedOrders: 0,
  deliveredOrders: 0,
  cancelledOrders: 0,

  totalRevenue: 0,
  monthlyRevenue: [],

  totalCustomers: 0,
  totalViews: 0,

  totalReviews: 0,
  averageRating: 0,

  orderStatus: [],

  recentOrders: [],
};

// =====================================================
// STATUS COLORS
// =====================================================

const STATUS_COLORS: Record<string, string> = {
  pending: "#9CA3AF",
  processing: "#3B82F6",
  shipped: "#F59E0B",
  delivered: "#10B981",
  cancelled: "#EF4444",
};

// =====================================================
// MONTHS
// =====================================================

const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

// =====================================================
// HELPERS
// =====================================================

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value || 0);
};

const formatMonth = (value: string) => {
  if (!value) return "";

  const [, month] = value.split("-");

  const index = Number(month) - 1;

  return MONTH_LABELS[index] || value;
};

const formatDate = (date: string) => {
  if (!date) return "-";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "-";
  }

  return parsed.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

// =====================================================
// MAIN COMPONENT
// =====================================================

const SellerDashboard = () => {
  const { user } = useAuthStore();

  const [data, setData] = useState<SellerDashboardData>(DEFAULT_DATA);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ===================================================
  // FETCH DASHBOARD
  // ===================================================

  useEffect(() => {
    let mounted = true;

    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await apiFetch("/api/seller/dashboard", {
          method: "GET",
        });

        const json = await response.json();

        if (!response.ok) {
          throw new Error(json?.message || "Failed to load seller dashboard");
        }

        if (!mounted) return;

        const apiData = json?.data || {};

        setData({
          ...DEFAULT_DATA,
          ...apiData,

          monthlyRevenue: Array.isArray(apiData.monthlyRevenue)
            ? apiData.monthlyRevenue
            : [],

          orderStatus: Array.isArray(apiData.orderStatus)
            ? apiData.orderStatus
            : [],

          recentOrders: Array.isArray(apiData.recentOrders)
            ? apiData.recentOrders
            : [],
        });
      } catch (error) {
        console.error("Seller dashboard error:", error);

        if (!mounted) return;

        setData(DEFAULT_DATA);

        setError(
          error instanceof Error
            ? error.message
            : "Unable to load seller dashboard",
        );
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

  // ===================================================
  // REVENUE CHART
  // ===================================================

  const revenueChartData = useMemo(() => {
    return data.monthlyRevenue.map((item) => ({
      month: formatMonth(item.month),
      revenue: Number(item.revenue) || 0,
    }));
  }, [data.monthlyRevenue]);

  // ===================================================
  // ORDER STATUS
  // ===================================================

  const orderStatusData = useMemo(() => {
    return data.orderStatus.map((item) => ({
      name: item.status.charAt(0).toUpperCase() + item.status.slice(1),

      value: Number(item.count) || 0,

      color: STATUS_COLORS[item.status.toLowerCase()] || "#9CA3AF",
    }));
  }, [data.orderStatus]);

  // ===================================================
  // LOADING
  // ===================================================

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-7 w-7 animate-spin text-zinc-400" />

          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Loading seller dashboard...
          </p>
        </div>
      </div>
    );
  }

  // ===================================================
  // DASHBOARD
  // ===================================================

  return (
    <div className="space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      {/* =================================================
          HEADER
      ================================================= */}

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          Welcome back, {user?.name?.split(" ")[0] || "Seller"} 👋
        </h1>

        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Here&apos;s an overview of your store performance.
        </p>
      </div>

      {/* =================================================
          ERROR
      ================================================= */}

      {error && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 dark:border-amber-900/50 dark:bg-amber-950/20">
          <p className="text-xs text-amber-700 dark:text-amber-400">
            Dashboard data could not be loaded. Showing default values.
          </p>
        </div>
      )}

      {/* =================================================
          MAIN STATS
      ================================================= */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={Package}
          label="Total Products"
          value={data.totalProducts}
          href="/seller/products"
        />

        <StatCard
          icon={ShoppingBag}
          label="Total Orders"
          value={data.totalOrders}
          href="/seller/orders"
        />

        <StatCard
          icon={DollarSign}
          label="Total Revenue"
          value={formatCurrency(data.totalRevenue)}
          href="/seller/earnings"
        />

        <StatCard
          icon={Users}
          label="Customers"
          value={data.totalCustomers}
          href="/seller/orders"
        />
      </div>

      {/* =================================================
          STORE OVERVIEW
      ================================================= */}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <MiniStat
          icon={TrendingUp}
          label="Active Products"
          value={data.activeProducts}
        />

        <MiniStat
          icon={Package}
          label="Out of Stock"
          value={data.outOfStockProducts}
        />

        <MiniStat icon={Eye} label="Product Views" value={data.totalViews} />

        <MiniStat icon={Star} label="Reviews" value={data.totalReviews} />
      </div>

      {/* =================================================
          REVENUE + ORDER STATUS
      ================================================= */}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* REVENUE */}

        <div
          className="
            rounded-2xl
            border border-zinc-200
            bg-white p-5
            shadow-sm
            dark:border-zinc-800
            dark:bg-zinc-950
            lg:col-span-2
          "
        >
          <div className="mb-5 flex items-start justify-between">
            <div>
              <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Revenue Overview
              </h2>

              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                Your store revenue for the last 6 months
              </p>
            </div>

            <Link
              href="/seller/earnings"
              className="
                flex items-center gap-1
                text-xs font-medium
                text-zinc-500
                transition
                hover:text-zinc-900
                dark:text-zinc-400
                dark:hover:text-white
              "
            >
              Earnings
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {revenueChartData.length === 0 ? (
            <EmptyChart icon={DollarSign} label="No revenue data yet" />
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart
                data={revenueChartData}
                margin={{
                  top: 10,
                  right: 10,
                  left: -15,
                  bottom: 0,
                }}
              >
                <defs>
                  <linearGradient
                    id="revenueGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#6366f1" stopOpacity={0.25} />

                    <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#e5e7eb"
                />

                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontSize: 12,
                    fill: "#9CA3AF",
                  }}
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontSize: 12,
                    fill: "#9CA3AF",
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
                    border: "1px solid #e5e7eb",
                    backgroundColor: "white",
                    fontSize: 13,
                  }}
                />

                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#6366f1"
                  strokeWidth={2}
                  fill="url(#revenueGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* ORDER STATUS */}

        <div
          className="
            rounded-2xl
            border border-zinc-200
            bg-white p-5
            shadow-sm
            dark:border-zinc-800
            dark:bg-zinc-950
          "
        >
          <div className="mb-5">
            <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Order Status
            </h2>

            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              Current order distribution
            </p>
          </div>

          {orderStatusData.length === 0 ? (
            <EmptyChart icon={ShoppingBag} label="No orders yet" />
          ) : (
            <>
              <ResponsiveContainer width="100%" height={190}>
                <PieChart>
                  <Pie
                    data={orderStatusData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={52}
                    outerRadius={75}
                    paddingAngle={3}
                  >
                    {orderStatusData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>

                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>

              <div className="space-y-2">
                {orderStatusData.map((entry) => (
                  <div
                    key={entry.name}
                    className="flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{
                          backgroundColor: entry.color,
                        }}
                      />

                      <span className="text-zinc-600 dark:text-zinc-400">
                        {entry.name}
                      </span>
                    </div>

                    <span className="font-semibold text-zinc-900 dark:text-zinc-100">
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
          ORDER OVERVIEW
      ================================================= */}

      <div>
        <h2 className="mb-3 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          Order Overview
        </h2>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
          <MiniOrderStat label="Pending" value={data.pendingOrders} />

          <MiniOrderStat label="Processing" value={data.processingOrders} />

          <MiniOrderStat label="Shipped" value={data.shippedOrders} />

          <MiniOrderStat label="Delivered" value={data.deliveredOrders} />

          <MiniOrderStat label="Cancelled" value={data.cancelledOrders} />
        </div>
      </div>

      {/* =================================================
          QUICK ACTIONS
      ================================================= */}

      <div>
        <h2 className="mb-3 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          Quick Actions
        </h2>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <QuickAction
            href="/seller/products"
            icon={Package}
            title="Manage Products"
            description="Add, edit and manage products"
          />

          <QuickAction
            href="/seller/orders"
            icon={ShoppingBag}
            title="Manage Orders"
            description={`${data.pendingOrders} orders need attention`}
          />

          <QuickAction
            href="/seller/earnings"
            icon={DollarSign}
            title="View Earnings"
            description="Check your store revenue"
          />
        </div>
      </div>

      {/* =================================================
          RECENT ORDERS
      ================================================= */}

      <div
        className="
          rounded-2xl
          border border-zinc-200
          bg-white p-5
          shadow-sm
          dark:border-zinc-800
          dark:bg-zinc-950
        "
      >
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Recent Orders
            </h2>

            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              Latest orders from your store
            </p>
          </div>

          <Link
            href="/seller/orders"
            className="
              flex items-center gap-1
              text-xs font-medium
              text-zinc-500
              hover:text-zinc-900
              dark:text-zinc-400
              dark:hover:text-white
            "
          >
            View all
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {data.recentOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div
              className="
                mb-3 flex h-12 w-12
                items-center justify-center
                rounded-full
                bg-zinc-100
                dark:bg-zinc-900
              "
            >
              <ShoppingBag className="h-5 w-5 text-zinc-400" />
            </div>

            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
              No orders yet
            </p>

            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              Orders will appear here when customers buy your products.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {data.recentOrders.map((order) => {
              const statusColor =
                STATUS_COLORS[order.status?.toLowerCase()] || "#9CA3AF";

              return (
                <Link
                  key={order._id}
                  href={`/seller/orders/${order._id}`}
                  className="
                      flex flex-col gap-3
                      rounded-xl px-3 py-3
                      transition
                      hover:bg-zinc-50
                      sm:flex-row
                      sm:items-center
                      sm:justify-between
                      dark:hover:bg-zinc-900
                    "
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
                      #{order.orderNumber}
                    </p>

                    <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                      {order.customerName || "Customer"}
                      {" · "}
                      {formatDate(order.createdAt)}
                      {" · "}
                      {order.items?.length || 0}{" "}
                      {order.items?.length === 1 ? "item" : "items"}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className="rounded-full px-2.5 py-1 text-xs font-medium capitalize"
                      style={{
                        backgroundColor: `${statusColor}1A`,
                        color: statusColor,
                      }}
                    >
                      {order.status || "pending"}
                    </span>

                    <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                      {formatCurrency(order.totalAmount)}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* =================================================
          STORE HEALTH
      ================================================= */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <HealthCard
          icon={Package}
          title="Products"
          value={data.totalProducts}
          description={`${data.activeProducts} active`}
          href="/seller/products"
        />

        <HealthCard
          icon={Star}
          title="Store Rating"
          value={data.averageRating.toFixed(1)}
          description={`${data.totalReviews} reviews`}
          href="/seller/reviews"
        />

        <HealthCard
          icon={Eye}
          title="Product Views"
          value={data.totalViews}
          description="Total product views"
          href="/seller/products"
        />
      </div>
    </div>
  );
};

// =====================================================
// STAT CARD
// =====================================================

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  href: string;
}

const StatCard = ({ icon: Icon, label, value, href }: StatCardProps) => {
  return (
    <Link
      href={href}
      className="
        group flex items-center justify-between
        rounded-2xl
        border border-zinc-200
        bg-white p-5
        shadow-sm
        transition
        hover:border-zinc-300
        hover:shadow-md
        dark:border-zinc-800
        dark:bg-zinc-950
        dark:hover:border-zinc-700
      "
    >
      <div>
        <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
          {label}
        </p>

        <p className="mt-1.5 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          {value}
        </p>
      </div>

      <div
        className="
          flex h-11 w-11
          items-center justify-center
          rounded-xl
          bg-zinc-100
          text-zinc-700
          transition
          group-hover:bg-zinc-900
          group-hover:text-white
          dark:bg-zinc-900
          dark:text-zinc-300
          dark:group-hover:bg-white
          dark:group-hover:text-zinc-900
        "
      >
        <Icon className="h-5 w-5" />
      </div>
    </Link>
  );
};

// =====================================================
// MINI STAT
// =====================================================

interface MiniStatProps {
  icon: React.ElementType;
  label: string;
  value: number;
}

const MiniStat = ({ icon: Icon, label, value }: MiniStatProps) => {
  return (
    <div
      className="
        rounded-xl
        border border-zinc-200
        bg-white p-4
        shadow-sm
        dark:border-zinc-800
        dark:bg-zinc-950
      "
    >
      <div className="flex items-center gap-3">
        <div
          className="
            flex h-9 w-9
            items-center justify-center
            rounded-lg
            bg-zinc-100
            dark:bg-zinc-900
          "
        >
          <Icon className="h-4 w-4 text-zinc-700 dark:text-zinc-300" />
        </div>

        <div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">{label}</p>

          <p className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
};

// =====================================================
// MINI ORDER STAT
// =====================================================

const MiniOrderStat = ({ label, value }: { label: string; value: number }) => {
  return (
    <div
      className="
        rounded-xl
        border border-zinc-200
        bg-white p-4
        shadow-sm
        dark:border-zinc-800
        dark:bg-zinc-950
      "
    >
      <p className="text-xs text-zinc-500 dark:text-zinc-400">{label}</p>

      <p className="mt-1 text-xl font-bold text-zinc-900 dark:text-zinc-100">
        {value}
      </p>
    </div>
  );
};

// =====================================================
// QUICK ACTION
// =====================================================

interface QuickActionProps {
  href: string;
  icon: React.ElementType;
  title: string;
  description: string;
}

const QuickAction = ({
  href,
  icon: Icon,
  title,
  description,
}: QuickActionProps) => {
  return (
    <Link
      href={href}
      className="
        group rounded-2xl
        border border-zinc-200
        bg-white p-4
        shadow-sm
        transition
        hover:border-zinc-300
        hover:shadow-md
        dark:border-zinc-800
        dark:bg-zinc-950
        dark:hover:border-zinc-700
      "
    >
      <div className="flex items-center gap-3">
        <div
          className="
            flex h-10 w-10
            items-center justify-center
            rounded-xl
            bg-zinc-100
            dark:bg-zinc-900
          "
        >
          <Icon className="h-4 w-4 text-zinc-700 dark:text-zinc-300" />
        </div>

        <div className="min-w-0">
          <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            {title}
          </p>

          <p className="mt-0.5 truncate text-xs text-zinc-500 dark:text-zinc-400">
            {description}
          </p>
        </div>
      </div>
    </Link>
  );
};

// =====================================================
// HEALTH CARD
// =====================================================

interface HealthCardProps {
  icon: React.ElementType;
  title: string;
  value: string | number;
  description: string;
  href: string;
}

const HealthCard = ({
  icon: Icon,
  title,
  value,
  description,
  href,
}: HealthCardProps) => {
  return (
    <Link
      href={href}
      className="
        flex items-center justify-between
        rounded-2xl
        border border-zinc-200
        bg-white p-5
        shadow-sm
        transition
        hover:border-zinc-300
        hover:shadow-md
        dark:border-zinc-800
        dark:bg-zinc-950
        dark:hover:border-zinc-700
      "
    >
      <div className="flex items-center gap-3">
        <div
          className="
            flex h-10 w-10
            items-center justify-center
            rounded-xl
            bg-zinc-100
            dark:bg-zinc-900
          "
        >
          <Icon className="h-5 w-5 text-zinc-700 dark:text-zinc-300" />
        </div>

        <div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">{title}</p>

          <p className="mt-0.5 text-xl font-bold text-zinc-900 dark:text-zinc-100">
            {value}
          </p>

          <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
            {description}
          </p>
        </div>
      </div>

      <ArrowRight className="h-4 w-4 text-zinc-400 dark:text-zinc-600" />
    </Link>
  );
};

// =====================================================
// EMPTY CHART
// =====================================================

interface EmptyChartProps {
  icon: React.ElementType;
  label: string;
}

const EmptyChart = ({ icon: Icon, label }: EmptyChartProps) => {
  return (
    <div className="flex h-[240px] flex-col items-center justify-center text-center">
      <div
        className="
          mb-3 flex h-12 w-12
          items-center justify-center
          rounded-full
          bg-zinc-100
          dark:bg-zinc-900
        "
      >
        <Icon className="h-5 w-5 text-zinc-400 dark:text-zinc-600" />
      </div>

      <p className="text-sm text-zinc-500 dark:text-zinc-400">{label}</p>

      <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-600">
        Data will appear here when available.
      </p>
    </div>
  );
};

export default SellerDashboard;
