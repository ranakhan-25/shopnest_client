"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ArrowRight,
  Heart,
  Loader2,
  MapPin,
  Package,
  ShoppingBag,
  Star,
  UserRound,
} from "lucide-react";

import { apiFetch } from "@/lib/apiClient";
import { useAuthStore } from "@/components/store/authStore";

// =====================================================
// TYPES
// =====================================================

interface MonthlyOrder {
  month: string;
  orders: number;
  spending: number;
}

interface RecentOrder {
  _id: string;
  orderNumber: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  items?: {
    name: string;
    qty: number;
  }[];
}

interface UserDashboardData {
  totalOrders: number;
  pendingOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;

  totalSpent: number;

  wishlistCount: number;
  reviewCount: number;
  addressCount: number;

  monthlyOrders: MonthlyOrder[];

  recentOrders: RecentOrder[];
}

// =====================================================
// DEFAULT DATA
// =====================================================

const DEFAULT_DATA: UserDashboardData = {
  totalOrders: 0,
  pendingOrders: 0,
  deliveredOrders: 0,
  cancelledOrders: 0,

  totalSpent: 0,

  wishlistCount: 0,
  reviewCount: 0,
  addressCount: 0,

  monthlyOrders: [],

  recentOrders: [],
};

// =====================================================
// STATUS COLORS
// =====================================================

const STATUS_STYLES: Record<
  string,
  {
    light: string;
    dark: string;
  }
> = {
  pending: {
    light: "bg-amber-50 text-amber-700 border-amber-200",
    dark: "dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
  },

  processing: {
    light: "bg-blue-50 text-blue-700 border-blue-200",
    dark: "dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20",
  },

  shipped: {
    light: "bg-violet-50 text-violet-700 border-violet-200",
    dark: "dark:bg-violet-500/10 dark:text-violet-400 dark:border-violet-500/20",
  },

  delivered: {
    light: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dark: "dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
  },

  cancelled: {
    light: "bg-red-50 text-red-700 border-red-200",
    dark: "dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20",
  },
};

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

  const monthIndex = Number(month) - 1;

  const months = [
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

  return months[monthIndex] || value;
};

const formatDate = (value: string) => {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

// =====================================================
// COMPONENT
// =====================================================

const UserDashboard = () => {
  const { user } = useAuthStore();

  const [data, setData] =
    useState<UserDashboardData>(DEFAULT_DATA);

  const [loading, setLoading] = useState(true);

  // ===================================================
  // API
  // ===================================================

  useEffect(() => {
    let mounted = true;

    const fetchDashboard = async () => {
      try {
        setLoading(true);

        const response = await apiFetch(
          "/api/user/dashboard",
          {
            method: "GET",
          }
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result?.message ||
              "Failed to load dashboard"
          );
        }

        if (!mounted) return;

        const dashboard = result?.data || {};

        setData({
          ...DEFAULT_DATA,
          ...dashboard,

          monthlyOrders: Array.isArray(
            dashboard.monthlyOrders
          )
            ? dashboard.monthlyOrders
            : [],

          recentOrders: Array.isArray(
            dashboard.recentOrders
          )
            ? dashboard.recentOrders
            : [],
        });
      } catch (error) {
        console.error(
          "User dashboard error:",
          error
        );

        if (!mounted) return;

        setData(DEFAULT_DATA);
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
  // CHART DATA
  // ===================================================

  const chartData = useMemo(() => {
    return data.monthlyOrders.map((item) => ({
      month: formatMonth(item.month),
      orders: Number(item.orders) || 0,
      spending: Number(item.spending) || 0,
    }));
  }, [data.monthlyOrders]);

  // ===================================================
  // LOADING
  // ===================================================

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-7 w-7 animate-spin text-slate-500 dark:text-slate-400" />

          <p className="text-sm text-slate-500 dark:text-slate-400">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  // ===================================================
  // DASHBOARD
  // ===================================================

  return (
    <div className="min-h-full space-y-6 bg-slate-50 px-4 py-6 sm:px-6 lg:px-8 text-slate-900 dark:bg-slate-950 dark:text-slate-100">

      {/* =================================================
          HEADER
      ================================================= */}

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Welcome back,{" "}
          {user?.name?.split(" ")[0] || "User"} 👋
        </h1>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Manage your orders, wishlist and account.
        </p>
      </div>

      {/* =================================================
          MAIN STATS
      ================================================= */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

        <StatCard
          icon={ShoppingBag}
          label="Total Orders"
          value={data.totalOrders}
          href="/dashboard/orders"
        />

        <StatCard
          icon={Package}
          label="Pending Orders"
          value={data.pendingOrders}
          href="/dashboard/orders"
        />

        <StatCard
          icon={Heart}
          label="Wishlist"
          value={data.wishlistCount}
          href="/dashboard/wishlist"
        />

        <StatCard
          icon={Star}
          label="Reviews"
          value={data.reviewCount}
          href="/dashboard/reviews"
        />

      </div>

      {/* =================================================
          SPENDING + ORDER SUMMARY
      ================================================= */}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">

        {/* =================================================
            CHART
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
            dark:shadow-none
            lg:col-span-2
          "
        >

          <div className="mb-5 flex items-start justify-between gap-4">

            <div>
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                Orders & Spending
              </h2>

              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Your shopping activity over the last months
              </p>
            </div>

            <div className="text-right">

              <p className="text-xs text-slate-500 dark:text-slate-400">
                Total Spent
              </p>

              <p className="mt-1 text-lg font-bold text-slate-900 dark:text-white">
                {formatCurrency(data.totalSpent)}
              </p>

            </div>

          </div>

          {chartData.length === 0 ? (
            <EmptyChart />
          ) : (
            <ResponsiveContainer
              width="100%"
              height={300}
            >
              <AreaChart
                data={chartData}
                margin={{
                  top: 10,
                  right: 10,
                  left: -15,
                  bottom: 0,
                }}
              >

                <defs>

                  <linearGradient
                    id="spendingGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >

                    <stop
                      offset="0%"
                      stopColor="currentColor"
                      stopOpacity={0.15}
                    />

                    <stop
                      offset="100%"
                      stopColor="currentColor"
                      stopOpacity={0}
                    />

                  </linearGradient>

                </defs>

                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="currentColor"
                  className="text-slate-200 dark:text-slate-800"
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
                  tickFormatter={(value) =>
                    `$${value}`
                  }
                />

                <Tooltip
                  cursor={{
                    stroke: "#94A3B8",
                    strokeDasharray: "4 4",
                  }}
                  formatter={(value, name) => {
                    if (name === "spending") {
                      return [
                        formatCurrency(
                          Number(value)
                        ),
                        "Spending",
                      ];
                    }

                    return [
                      Number(value),
                      "Orders",
                    ];
                  }}
                  contentStyle={{
                    borderRadius: 12,
                    border:
                      "1px solid rgba(148,163,184,0.25)",
                    backgroundColor:
                      "var(--tooltip-bg)",
                    fontSize: 13,
                  }}
                />

                <Area
                  type="monotone"
                  dataKey="spending"
                  stroke="#64748B"
                  strokeWidth={2}
                  fill="url(#spendingGradient)"
                />

              </AreaChart>
            </ResponsiveContainer>
          )}

        </div>

        {/* =================================================
            ORDER SUMMARY
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
            dark:shadow-none
          "
        >

          <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
            Order Summary
          </h2>

          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Your current order status
          </p>

          <div className="mt-6 space-y-5">

            <OrderStatus
              label="Pending"
              value={data.pendingOrders}
              type="pending"
            />

            <OrderStatus
              label="Delivered"
              value={data.deliveredOrders}
              type="delivered"
            />

            <OrderStatus
              label="Cancelled"
              value={data.cancelledOrders}
              type="cancelled"
            />

          </div>

          <Link
            href="/dashboard/orders"
            className="
              mt-6
              flex
              items-center
              justify-center
              gap-2
              rounded-xl
              border
              border-slate-900
              bg-slate-900
              px-4
              py-2.5
              text-xs
              font-medium
              text-white
              transition
              hover:bg-slate-800
              dark:border-slate-200
              dark:bg-slate-100
              dark:text-slate-900
              dark:hover:bg-white
            "
          >
            View all orders

            <ArrowRight className="h-3.5 w-3.5" />
          </Link>

        </div>

      </div>

      {/* =================================================
          QUICK ACCESS
      ================================================= */}

      <div>

        <h2 className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">
          Quick Access
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

          <QuickCard
            href="/dashboard/profile"
            icon={UserRound}
            title="My Profile"
            description="Manage your personal information"
          />

          <QuickCard
            href="/dashboard/addresses"
            icon={MapPin}
            title="My Addresses"
            description={`${data.addressCount} saved addresses`}
          />

          <QuickCard
            href="/dashboard/wishlist"
            icon={Heart}
            title="My Wishlist"
            description={`${data.wishlistCount} saved products`}
          />

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
          dark:shadow-none
        "
      >

        <div className="mb-5 flex items-center justify-between gap-4">

          <div>
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
              Recent Orders
            </h2>

            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Your latest purchases
            </p>
          </div>

          <Link
            href="/dashboard/orders"
            className="
              flex
              items-center
              gap-1
              text-xs
              font-medium
              text-slate-500
              transition
              hover:text-slate-900
              dark:text-slate-400
              dark:hover:text-white
            "
          >
            View all

            <ArrowRight className="h-3.5 w-3.5" />
          </Link>

        </div>

        {data.recentOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">

            <div
              className="
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-full
                bg-slate-100
                dark:bg-slate-800
              "
            >
              <ShoppingBag className="h-5 w-5 text-slate-400 dark:text-slate-500" />
            </div>

            <p className="mt-3 text-sm font-medium text-slate-700 dark:text-slate-300">
              No orders yet
            </p>

            <p className="mt-1 text-xs text-slate-500 dark:text-slate-500">
              Your recent orders will appear here.
            </p>

          </div>
        ) : (
          <div className="space-y-1">

            {data.recentOrders.map(
              (order) => {

                const status =
                  order.status?.toLowerCase() ||
                  "pending";

                const statusStyle =
                  STATUS_STYLES[status] ||
                  STATUS_STYLES.pending;

                return (
                  <Link
                    key={order._id}
                    href={`/dashboard/orders/${order._id}`}
                    className="
                      group
                      flex
                      flex-col
                      gap-3
                      rounded-xl
                      border
                      border-transparent
                      px-3
                      py-3
                      transition
                      hover:border-slate-200
                      hover:bg-slate-50
                      sm:flex-row
                      sm:items-center
                      sm:justify-between
                      dark:hover:border-slate-800
                      dark:hover:bg-slate-800/50
                    "
                  >

                    <div className="min-w-0">

                      <p className="truncate text-sm font-medium text-slate-900 dark:text-white">
                        #{order.orderNumber}
                      </p>

                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        {formatDate(
                          order.createdAt
                        )}

                        {" · "}

                        {order.items?.length || 0}{" "}
                        {order.items?.length === 1
                          ? "item"
                          : "items"}
                      </p>

                    </div>

                    <div className="flex items-center gap-3">

                      <span
                        className={`
                          rounded-full
                          border
                          px-2.5
                          py-1
                          text-xs
                          font-medium
                          capitalize
                          ${statusStyle.light}
                          ${statusStyle.dark}
                        `}
                      >
                        {order.status ||
                          "pending"}
                      </span>

                      <span className="text-sm font-semibold text-slate-900 dark:text-white">
                        {formatCurrency(
                          order.totalAmount
                        )}
                      </span>

                    </div>

                  </Link>
                );
              }
            )}

          </div>
        )}

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

const StatCard = ({
  icon: Icon,
  label,
  value,
  href,
}: StatCardProps) => {
  return (
    <Link
      href={href}
      className="
        group
        rounded-2xl
        border
        border-slate-200
        bg-white
        p-5
        shadow-sm
        transition
        hover:-translate-y-0.5
        hover:border-slate-300
        hover:shadow-md
        dark:border-slate-800
        dark:bg-slate-900
        dark:shadow-none
        dark:hover:border-slate-700
        dark:hover:bg-slate-900
      "
    >

      <div className="flex items-center justify-between">

        <div>

          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
            {label}
          </p>

          <p className="mt-1.5 text-2xl font-bold text-slate-900 dark:text-white">
            {value}
          </p>

        </div>

        <div
          className="
            flex
            h-11
            w-11
            items-center
            justify-center
            rounded-xl
            bg-slate-100
            text-slate-700
            transition
            group-hover:bg-slate-900
            group-hover:text-white
            dark:bg-slate-800
            dark:text-slate-300
            dark:group-hover:bg-slate-100
            dark:group-hover:text-slate-900
          "
        >
          <Icon className="h-5 w-5" />
        </div>

      </div>

    </Link>
  );
};

// =====================================================
// ORDER STATUS
// =====================================================

const OrderStatus = ({
  label,
  value,
  type,
}: {
  label: string;
  value: number;
  type: "pending" | "delivered" | "cancelled";
}) => {

  const dotStyles = {
    pending:
      "bg-amber-500 dark:bg-amber-400",

    delivered:
      "bg-emerald-500 dark:bg-emerald-400",

    cancelled:
      "bg-red-500 dark:bg-red-400",
  };

  return (
    <div className="flex items-center justify-between">

      <div className="flex items-center gap-3">

        <span
          className={`
            h-2.5
            w-2.5
            rounded-full
            ${dotStyles[type]}
          `}
        />

        <span className="text-sm text-slate-600 dark:text-slate-400">
          {label}
        </span>

      </div>

      <span className="text-sm font-semibold text-slate-900 dark:text-white">
        {value}
      </span>

    </div>
  );
};

// =====================================================
// QUICK CARD
// =====================================================

interface QuickCardProps {
  href: string;
  icon: React.ElementType;
  title: string;
  description: string;
}

const QuickCard = ({
  href,
  icon: Icon,
  title,
  description,
}: QuickCardProps) => {
  return (
    <Link
      href={href}
      className="
        group
        rounded-2xl
        border
        border-slate-200
        bg-white
        p-5
        shadow-sm
        transition
        hover:-translate-y-0.5
        hover:border-slate-300
        hover:shadow-md
        dark:border-slate-800
        dark:bg-slate-900
        dark:shadow-none
        dark:hover:border-slate-700
      "
    >

      <div className="flex items-center gap-3">

        <div
          className="
            flex
            h-10
            w-10
            shrink-0
            items-center
            justify-center
            rounded-xl
            bg-slate-100
            dark:bg-slate-800
          "
        >

          <Icon className="h-5 w-5 text-slate-700 dark:text-slate-300" />

        </div>

        <div className="min-w-0">

          <p className="text-sm font-semibold text-slate-900 dark:text-white">
            {title}
          </p>

          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {description}
          </p>

        </div>

      </div>

    </Link>
  );
};

// =====================================================
// EMPTY CHART
// =====================================================

const EmptyChart = () => {
  return (
    <div className="flex h-[300px] flex-col items-center justify-center text-center">

      <div
        className="
          flex
          h-12
          w-12
          items-center
          justify-center
          rounded-full
          bg-slate-100
          dark:bg-slate-800
        "
      >
        <ShoppingBag className="h-5 w-5 text-slate-400 dark:text-slate-500" />
      </div>

      <p className="mt-3 text-sm font-medium text-slate-600 dark:text-slate-300">
        No shopping data yet
      </p>

      <p className="mt-1 text-xs text-slate-500 dark:text-slate-500">
        Your orders and spending will appear here.
      </p>

    </div>
  );
};

export default UserDashboard;