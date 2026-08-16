"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Heart,
  Package,
  RefreshCw,
  ShoppingBag,
  Star,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { apiFetch } from "@/lib/apiClient";


interface ChartData {
  month: string;
  orders: number;
  spending: number;
}

interface DashboardData {
  totalOrders: number;
  pendingOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  wishlistCount: number;
  reviewCount: number;
  totalSpent: number;
  chartData: ChartData[];
}

interface DashboardResponse {
  success: boolean;
  message: string;
  data: DashboardData;
}

const EmptyChart = () => {
  return (
    <div className="flex h-[300px] flex-col items-center justify-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-black/5 dark:bg-white/10">
        <ShoppingBag className="h-6 w-6 text-black/40 dark:text-white/40" />
      </div>

      <p className="mt-4 text-sm font-medium text-black/60 dark:text-white/60">
        No shopping activity yet
      </p>

      <p className="mt-1 text-xs text-black/40 dark:text-white/40">
        Your order activity will appear here.
      </p>
    </div>
  );
};

interface OrderStatusProps {
  label: string;
  value: number;
  type: "pending" | "delivered" | "cancelled";
}

const OrderStatus = ({ label, value, type }: OrderStatusProps) => {
  const styles = {
    pending: {
      bg: "bg-orange-500/10",
      text: "text-orange-600 dark:text-orange-400",
      bar: "bg-orange-500",
    },

    delivered: {
      bg: "bg-green-500/10",
      text: "text-green-600 dark:text-green-400",
      bar: "bg-green-500",
    },

    cancelled: {
      bg: "bg-red-500/10",
      text: "text-red-600 dark:text-red-400",
      bar: "bg-red-500",
    },
  };

  const style = styles[type];

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`h-2.5 w-2.5 rounded-full ${style.bar}`} />

          <span className="text-sm font-medium text-black/70 dark:text-white/70">
            {label}
          </span>
        </div>

        <span
          className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${style.bg} ${style.text}`}
        >
          {value}
        </span>
      </div>

      <div className="mt-3 h-2 overflow-hidden rounded-full bg-black/5 dark:bg-white/10">
        <div
          className={`h-full rounded-full ${style.bar}`}
          style={{
            width: value > 0 ? "100%" : "0%",
          }}
        />
      </div>
    </div>
  );
};

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: number;
  iconClassName: string;
}

const UserDashboard = () => {
  const [data, setData] = useState<DashboardData | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  
  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await apiFetch("/api/user/dashboard");

      const result: DashboardResponse = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Failed to fetch dashboard");
      }

      setData(result.data);
    } catch (error) {
      console.error("Dashboard error:", error);

      setError(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchDashboard();
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <section className="space-y-6">
        <div className="h-8 w-48 animate-pulse rounded-lg bg-black/5 dark:bg-white/10" />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-28 animate-pulse rounded-2xl bg-black/5 dark:bg-white/10"
            />
          ))}
        </div>

        <div className="h-[380px] animate-pulse rounded-2xl bg-black/5 dark:bg-white/10" />
      </section>
    );
  }
  
  if (error || !data) {
    return (
      <section className="flex min-h-[500px] items-center justify-center">
        <div className="max-w-md text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10">
            <Package className="h-8 w-8 text-red-500" />
          </div>

          <h2 className="mt-5 text-xl font-bold text-black dark:text-white">
            Unable to load dashboard
          </h2>

          <p className="mt-2 text-sm text-black/50 dark:text-white/50">
            {error || "Dashboard data not available"}
          </p>

          <button
            type="button"
            onClick={fetchDashboard}
            className="
              mt-5
              inline-flex
              items-center
              gap-2
              rounded-xl
              bg-black
              px-5
              py-2.5
              text-sm
              font-medium
              text-white
              transition
              hover:opacity-80
              dark:bg-white
              dark:text-black
            "
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </button>
        </div>
      </section>
    );
  }

  const chartData = data.chartData ?? [];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    }).format(value);
  };

  return (
    <section className="space-y-6">
   
      <div>
        <h1 className="text-2xl font-bold text-black dark:text-white">
          My Dashboard
        </h1>

        <p className="mt-1 text-sm text-black/50 dark:text-white/50">
          Track your orders, wishlist and shopping activity.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Orders */}
        <div className="rounded border border-black/10 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-white/10 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-black/60 dark:text-white/60">
                Total Orders
              </p>

              <p className="mt-2 text-2xl font-bold text-black dark:text-white">
                {data.totalOrders}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10">
              <ShoppingBag className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        {/* Pending Orders */}
        <div className="rounded border border-black/10 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-white/10 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-black/60 dark:text-white/60">
                Pending Orders
              </p>

              <p className="mt-2 text-2xl font-bold text-black dark:text-white">
                {data.pendingOrders}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500/10">
              <Package className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </div>

        {/* Wishlist */}
        <div className="rounded border border-black/10 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-white/10 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-black/60 dark:text-white/60">
                Wishlist
              </p>

              <p className="mt-2 text-2xl font-bold text-black dark:text-white">
                {data.wishlistCount}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-pink-500/10">
              <Heart className="h-5 w-5 text-pink-600 dark:text-pink-400" />
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div className="rounded border border-black/10 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-white/10 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-black/60 dark:text-white/60">
                Reviews
              </p>

              <p className="mt-2 text-2xl font-bold text-black dark:text-white">
                {data.reviewCount}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-yellow-500/10">
              <Star className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
       
        <div
          className="
            rounded-2xl
            border border-black/10
            bg-white
            p-5
            shadow-sm
            dark:border-white/10
            dark:bg-slate-900
            dark:shadow-none
            lg:col-span-2
          "
        >
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-sm font-semibold text-black dark:text-white">
                Orders & Spending
              </h2>

              <p className="mt-1 text-xs text-black/50 dark:text-white/50">
                Your shopping activity over the last months
              </p>
            </div>

            <div className="text-right">
              <p className="text-xs text-black/50 dark:text-white/50">
                Total Spent
              </p>

              <p className="mt-1 text-lg font-bold text-black dark:text-white">
                {formatCurrency(data.totalSpent)}
              </p>
            </div>
          </div>

          {chartData.length === 0 ? (
            <EmptyChart />
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart
                data={chartData}
                margin={{
                  top: 10,
                  right: 10,
                  left: 0,
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
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.25} />

                    <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  className="stroke-black/10 dark:stroke-white/10"
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
                />

                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid rgba(148,163,184,0.25)",
                    background: "white",
                    color: "#0f172a",
                    fontSize: 13,
                  }}
                  formatter={(value, name) => {
                    if (name === "spending") {
                      return [formatCurrency(Number(value)), "Spending"];
                    }

                    return [Number(value), "Orders"];
                  }}
                />

                {/* Orders */}
                <Area
                  type="monotone"
                  dataKey="orders"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fill="none"
                  dot={{
                    r: 4,
                  }}
                  activeDot={{
                    r: 6,
                  }}
                />

                {/* Spending */}
                <Area
                  type="monotone"
                  dataKey="spending"
                  stroke="#22c55e"
                  strokeWidth={2}
                  fill="url(#spendingGradient)"
                  dot={{
                    r: 4,
                  }}
                  activeDot={{
                    r: 6,
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}

          {/* Chart legend */}

          {chartData.length > 0 && (
            <div className="mt-4 flex items-center gap-5">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />

                <span className="text-xs text-black/50 dark:text-white/50">
                  Orders
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-green-500" />

                <span className="text-xs text-black/50 dark:text-white/50">
                  Spending
                </span>
              </div>
            </div>
          )}
        </div>

        <div
          className="
            rounded-2xl
            border border-black/10
            bg-white
            p-5
            shadow-sm
            dark:border-white/10
            dark:bg-slate-900
            dark:shadow-none
          "
        >
          <h2 className="text-sm font-semibold text-black dark:text-white">
            Order Summary
          </h2>

          <p className="mt-1 text-xs text-black/50 dark:text-white/50">
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
            href="/dashboard/user/orders"
            className="
              mt-6
              flex
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-black
              px-4
              py-2.5
              text-xs
              font-medium
              text-white
              transition
              hover:bg-black/80
              dark:bg-white
              dark:text-black
              dark:hover:bg-white/90
            "
          >
            View all orders
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Delivered */}

        <div
          className="
            rounded-2xl
            border border-black/10
            bg-white
            p-5
            dark:border-white/10
            dark:bg-slate-900
          "
        >
          <p className="text-sm text-black/50 dark:text-white/50">
            Delivered Orders
          </p>

          <p className="mt-2 text-2xl font-bold text-green-600 dark:text-green-400">
            {data.deliveredOrders}
          </p>
        </div>

        {/* Cancelled */}

        <div
          className="
            rounded-2xl
            border border-black/10
            bg-white
            p-5
            dark:border-white/10
            dark:bg-slate-900
          "
        >
          <p className="text-sm text-black/50 dark:text-white/50">
            Cancelled Orders
          </p>

          <p className="mt-2 text-2xl font-bold text-red-600 dark:text-red-400">
            {data.cancelledOrders}
          </p>
        </div>

        {/* Total Spent */}

        <div
          className="
            rounded-2xl
            border border-black/10
            bg-white
            p-5
            dark:border-white/10
            dark:bg-slate-900
          "
        >
          <p className="text-sm text-black/50 dark:text-white/50">
            Total Spent
          </p>

          <p className="mt-2 text-2xl font-bold text-black dark:text-white">
            {formatCurrency(data.totalSpent)}
          </p>
        </div>
      </div>
    </section>
  );
};

export default UserDashboard;
