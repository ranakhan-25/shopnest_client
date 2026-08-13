"use client";

import { useEffect, useState } from "react";
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
  ArrowUpRight,
  Loader2,
} from "lucide-react";

import { apiFetch } from "@/lib/apiClient";

// =====================================================
// TYPES
// =====================================================

interface UserGrowth {
  month: string;
  users: number;
  sellers: number;
}

interface RoleBreakdown {
  role: string;
  count: number;
}

interface RecentSignup {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

interface PlatformStats {
  totalUsers: number;
  totalSellers: number;
  totalProducts: number;
  totalRevenue: number;

  userGrowth: UserGrowth[];

  roleBreakdown: RoleBreakdown[];

  recentSignups: RecentSignup[];
}

// =====================================================
// DEFAULT DATA
// =====================================================

const DEFAULT_DATA: PlatformStats = {
  totalUsers: 0,
  totalSellers: 0,
  totalProducts: 0,
  totalRevenue: 0,

  userGrowth: [],

  roleBreakdown: [],

  recentSignups: [],
};

// =====================================================
// ROLE COLORS
// =====================================================

const ROLE_COLORS: Record<string, string> = {
  user: "#64748B",
  seller: "#3B82F6",
  admin: "#EF4444",
};

// =====================================================
// MONTH LABELS
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

const formatMonth = (ym: string) => {
  if (!ym) return "";

  const [, month] = ym.split("-");

  const index = Number(month) - 1;

  return MONTH_LABELS[index] || ym;
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);
};

// =====================================================
// NORMALIZE API DATA
// =====================================================

const normalizeDashboardData = (
  apiData: Partial<PlatformStats> | null | undefined,
): PlatformStats => {
  return {
    totalUsers: Number(apiData?.totalUsers) || 0,

    totalSellers: Number(apiData?.totalSellers) || 0,

    totalProducts: Number(apiData?.totalProducts) || 0,

    totalRevenue: Number(apiData?.totalRevenue) || 0,

    userGrowth: Array.isArray(apiData?.userGrowth)
      ? apiData.userGrowth.map((item) => ({
          month: item?.month || "",
          users: Number(item?.users) || 0,
          sellers: Number(item?.sellers) || 0,
        }))
      : [],

    roleBreakdown: Array.isArray(apiData?.roleBreakdown)
      ? apiData.roleBreakdown.map((item) => ({
          role: item?.role || "user",
          count: Number(item?.count) || 0,
        }))
      : [],

    recentSignups: Array.isArray(apiData?.recentSignups)
      ? apiData.recentSignups.map((item) => ({
          _id: item?._id || "",
          name: item?.name || "Unknown User",
          email: item?.email || "",
          role: item?.role || "user",
          createdAt: item?.createdAt || "",
        }))
      : [],
  };
};

// =====================================================
// COMPONENT
// =====================================================

interface AdminApiResponse {
  success?: boolean;
  message?: string;
  data?: Partial<PlatformStats>;
}
const AdminDashboard = () => {
  const [data, setData] = useState<PlatformStats>(DEFAULT_DATA);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchDashboard = async () => {
      try {
        setLoading(true);

        const response = await apiFetch("/api/admin/dashboard", {
          method: "GET",
        });

        let result: AdminApiResponse = {};

        try {
          result = (await response.json()) as AdminApiResponse;
        } catch {
          result = {};
        }

        // =============================================
        // API ERROR হলেও dashboard থাকবে
        // =============================================

        if (!response.ok) {
          console.error("Admin dashboard API error:", result?.message);

          if (mounted) {
            setData(DEFAULT_DATA);
          }

          return;
        }

        if (!mounted) return;

        // =============================================
        // API DATA
        // =============================================

        const apiData = result?.data || {};

        setData(normalizeDashboardData(apiData));
      } catch (error) {
        console.error("Admin dashboard error:", error);

        // =============================================
        // API FAIL করলে সব 0
        // =============================================

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

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2
            className="
              h-7 w-7 animate-spin
              text-slate-400
              dark:text-slate-500
            "
          />

          <p
            className="
              text-sm
              text-slate-500
              dark:text-slate-400
            "
          >
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  // =====================================================
  // CHART DATA
  // =====================================================

  const chartData = data.userGrowth.map((item) => ({
    month: formatMonth(item.month),
    users: Number(item.users) || 0,
    sellers: Number(item.sellers) || 0,
  }));

  // =====================================================
  // PIE DATA
  // =====================================================

  const pieData = data.roleBreakdown.map((item) => ({
    name: item.role.charAt(0).toUpperCase() + item.role.slice(1),

    value: Number(item.count) || 0,

    color: ROLE_COLORS[item.role?.toLowerCase()] || "#64748B",
  }));

  // =====================================================
  // DASHBOARD
  // =====================================================

  return (
    <div className="space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      {/* =================================================
          HEADER
      ================================================= */}

      <div>
        <h1
          className="
            text-2xl font-bold
            text-slate-900
            dark:text-white
          "
        >
          Platform Overview
        </h1>

        <p
          className="
            mt-1 text-sm
            text-slate-500
            dark:text-slate-400
          "
        >
          Monitor overall marketplace health and activity.
        </p>
      </div>

      {/* =================================================
          STAT CARDS
      ================================================= */}

      <div
        className="
          grid grid-cols-1 gap-4
          sm:grid-cols-2
          lg:grid-cols-4
        "
      >
        <StatCard
          icon={Users}
          label="Total Users"
          value={data.totalUsers.toLocaleString()}
          href="/admin/users"
        />

        <StatCard
          icon={Store}
          label="Total Sellers"
          value={data.totalSellers.toLocaleString()}
          href="/admin/sellers"
        />

        <StatCard
          icon={Package}
          label="Total Products"
          value={data.totalProducts.toLocaleString()}
          href="/admin/products"
        />

        <StatCard
          icon={DollarSign}
          label="Platform Revenue"
          value={formatCurrency(data.totalRevenue)}
          href="/admin/orders"
        />
      </div>

      {/* =================================================
          CHARTS
      ================================================= */}

      <div
        className="
          grid grid-cols-1 gap-4
          lg:grid-cols-3
        "
      >
        {/* =================================================
            USER GROWTH
        ================================================= */}

        <div
          className="
            rounded-2xl
            border border-slate-200
            bg-white
            p-5
            dark:border-slate-800
            dark:bg-slate-900
            lg:col-span-2
          "
        >
          <div
            className="
              mb-5
              flex flex-col gap-3
              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >
            <div>
              <h2
                className="
                  text-sm font-semibold
                  text-slate-900
                  dark:text-white
                "
              >
                User Growth
              </h2>

              <p
                className="
                  mt-1 text-xs
                  text-slate-500
                  dark:text-slate-400
                "
              >
                Last 6 months
              </p>
            </div>

            {/* LEGEND */}

            <div className="flex items-center gap-4 text-xs">
              <span
                className="
                  flex items-center gap-1.5
                  text-slate-600
                  dark:text-slate-400
                "
              >
                <span
                  className="
                    h-2 w-2 rounded-full
                    bg-slate-900
                    dark:bg-white
                  "
                />
                Users
              </span>

              <span
                className="
                  flex items-center gap-1.5
                  text-slate-600
                  dark:text-slate-400
                "
              >
                <span
                  className="
                    h-2 w-2 rounded-full
                    bg-blue-500
                  "
                />
                Sellers
              </span>
            </div>
          </div>

          {chartData.length === 0 ? (
            <EmptyChart label="No growth data yet" />
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <LineChart
                data={chartData}
                margin={{
                  top: 5,
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
                  width={35}
                />

                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid #E2E8F0",
                    backgroundColor: "#FFFFFF",
                    color: "#0F172A",
                    fontSize: 13,
                  }}
                />

                <Line
                  type="monotone"
                  dataKey="users"
                  stroke="#0F172A"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                />

                <Line
                  type="monotone"
                  dataKey="sellers"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* =================================================
            ROLE BREAKDOWN
        ================================================= */}

        <div
          className="
            rounded-2xl
            border border-slate-200
            bg-white
            p-5
            dark:border-slate-800
            dark:bg-slate-900
          "
        >
          <h2
            className="
              text-sm font-semibold
              text-slate-900
              dark:text-white
            "
          >
            User Roles
          </h2>

          <p
            className="
              mt-1 text-xs
              text-slate-500
              dark:text-slate-400
            "
          >
            Platform role distribution
          </p>

          {pieData.length === 0 ? (
            <EmptyChart label="No role data yet" />
          ) : (
            <>
              <ResponsiveContainer width="100%" height={190}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={48}
                    outerRadius={72}
                    paddingAngle={3}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>

                  <Tooltip
                    contentStyle={{
                      borderRadius: 12,
                      border: "1px solid #E2E8F0",
                      backgroundColor: "#FFFFFF",
                      color: "#0F172A",
                      fontSize: 13,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>

              <div className="mt-3 space-y-3">
                {pieData.map((entry) => (
                  <div
                    key={entry.name}
                    className="
                      flex items-center
                      justify-between
                    "
                  >
                    <span
                      className="
                        flex items-center gap-2
                        text-xs
                        text-slate-600
                        dark:text-slate-400
                      "
                    >
                      <span
                        className="
                          h-2.5 w-2.5
                          rounded-full
                        "
                        style={{
                          backgroundColor: entry.color,
                        }}
                      />

                      {entry.name}
                    </span>

                    <span
                      className="
                        text-sm font-semibold
                        text-slate-900
                        dark:text-white
                      "
                    >
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
          RECENT SIGNUPS
      ================================================= */}

      <div
        className="
          rounded-2xl
          border border-slate-200
          bg-white
          p-5
          dark:border-slate-800
          dark:bg-slate-900
        "
      >
        <div
          className="
            mb-5
            flex items-center
            justify-between
          "
        >
          <div>
            <h2
              className="
                text-sm font-semibold
                text-slate-900
                dark:text-white
              "
            >
              Recent Signups
            </h2>

            <p
              className="
                mt-1 text-xs
                text-slate-500
                dark:text-slate-400
              "
            >
              Recently registered users
            </p>
          </div>

          <Link
            href="/admin/users"
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

        {data.recentSignups.length === 0 ? (
          <div
            className="
              flex flex-col
              items-center
              justify-center
              py-12
              text-center
            "
          >
            <Users
              className="
                mb-3 h-8 w-8
                text-slate-300
                dark:text-slate-700
              "
            />

            <p
              className="
                text-sm
                text-slate-500
                dark:text-slate-400
              "
            >
              No signups yet.
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {data.recentSignups.map((user) => (
              <div
                key={user._id}
                className="
                  flex items-center
                  justify-between
                  rounded-xl
                  px-3 py-3
                  transition
                  hover:bg-slate-50
                  dark:hover:bg-slate-800/60
                "
              >
                {/* USER */}

                <div
                  className="
                    flex min-w-0
                    items-center gap-3
                  "
                >
                  <div
                    className="
                      flex h-9 w-9
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      bg-slate-900
                      text-xs font-semibold
                      text-white
                      dark:bg-white
                      dark:text-slate-900
                    "
                  >
                    {user.name.charAt(0).toUpperCase()}
                  </div>

                  <div className="min-w-0">
                    <p
                      className="
                        truncate
                        text-sm font-medium
                        text-slate-900
                        dark:text-white
                      "
                    >
                      {user.name}
                    </p>

                    <p
                      className="
                        truncate
                        text-xs
                        text-slate-500
                        dark:text-slate-400
                      "
                    >
                      {user.email}
                    </p>
                  </div>
                </div>

                {/* ROLE */}

                <span
                  className="
                    shrink-0
                    rounded-full
                    px-2.5 py-1
                    text-xs font-medium
                    capitalize
                  "
                  style={{
                    backgroundColor: `${
                      ROLE_COLORS[user.role?.toLowerCase()] || "#64748B"
                    }1A`,

                    color: ROLE_COLORS[user.role?.toLowerCase()] || "#64748B",
                  }}
                >
                  {user.role || "user"}
                </span>
              </div>
            ))}
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
        transition-all
        hover:-translate-y-0.5
        hover:border-slate-300
        hover:shadow-sm

        dark:border-slate-800
        dark:bg-slate-900
        dark:hover:border-slate-700
        dark:hover:shadow-none
      "
    >
      <div className="min-w-0">
        <p
          className="
            text-xs font-medium
            text-slate-500
            dark:text-slate-400
          "
        >
          {label}
        </p>

        <p
          className="
            mt-1.5
            truncate
            text-2xl font-bold
            text-slate-900
            dark:text-white
          "
        >
          {value}
        </p>
      </div>

      <div
        className="
          flex h-11 w-11
          shrink-0
          items-center
          justify-center
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

// =====================================================
// EMPTY CHART
// =====================================================

const EmptyChart = ({ label }: { label: string }) => {
  return (
    <div
      className="
        flex h-[200px]
        items-center
        justify-center
      "
    >
      <p
        className="
          text-sm
          text-slate-400
          dark:text-slate-500
        "
      >
        {label}
      </p>
    </div>
  );
};

export default AdminDashboard;
