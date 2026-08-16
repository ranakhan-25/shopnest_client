"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Package,
  ShoppingBag,
  Clock3,
  Truck,
  CheckCircle2,
  XCircle,
  Eye,
  RefreshCw,
} from "lucide-react";

import { apiFetch } from "@/lib/apiClient";

interface OrderItem {
  _id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

interface Order {
  _id: string;
  email: string;
  items: OrderItem[];
  totalAmount: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
}

interface OrderResponse {
  success: boolean;
  message: string;
  data: Order[];
}

const statusConfig = {
  pending: {
    label: "Pending",
    className:
      "bg-orange-500/10 text-orange-600 dark:text-orange-400",
    icon: Clock3,
  },
  processing: {
    label: "Processing",
    className:
      "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    icon: RefreshCw,
  },
  shipped: {
    label: "Shipped",
    className:
      "bg-purple-500/10 text-purple-600 dark:text-purple-400",
    icon: Truck,
  },
  delivered: {
    label: "Delivered",
    className:
      "bg-green-500/10 text-green-600 dark:text-green-400",
    icon: CheckCircle2,
  },
  cancelled: {
    label: "Cancelled",
    className:
      "bg-red-500/10 text-red-600 dark:text-red-400",
    icon: XCircle,
  },
};

export default function MyOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await apiFetch("/api/orders/my-orders");

      const result: OrderResponse = await res.json();

      if (!res.ok) {
        throw new Error(
          result.message || "Failed to fetch orders"
        );
      }

      setOrders(Array.isArray(result.data) ? result.data : []);
    } catch (error) {
      console.error("Fetch orders error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchOrders();
    }
    fetchData()
  }, []);

  /* =========================
     Loading
  ========================= */

  if (loading) {
    return (
      <section className="space-y-6">
        <div className="h-8 w-40 animate-pulse rounded-lg bg-muted" />

        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="h-40 animate-pulse rounded-2xl bg-muted"
            />
          ))}
        </div>
      </section>
    );
  }

  /* =========================
     Error
  ========================= */

  if (error) {
    return (
      <section className="flex min-h-[500px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10">
            <Package className="h-8 w-8 text-red-500" />
          </div>

          <h2 className="mt-5 text-xl font-bold text-foreground">
            Unable to load orders
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            {error}
          </p>

          <button
            onClick={fetchOrders}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground"
          >
            <RefreshCw size={17} />
            Try Again
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      {/* =========================
          Header
      ========================= */}

      <div>
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl ">
            <ShoppingBag className="h-5 w-5 " />
          </div>

          <div>
            <h1 className="text-2xl font-bold ">
              My Orders
            </h1>

            <p className="mt-1 text-sm ">
              View and manage your orders
            </p>
          </div>
        </div>
      </div>

      {/* =========================
          Empty
      ========================= */}

      {orders.length === 0 ? (
        <div className="flex min-h-[450px] items-center justify-center rounded-xl border border-dashed border-border bg-card">
          <div className="max-w-sm px-6 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-muted">
              <ShoppingBag className="h-9 w-9 text-muted-foreground" />
            </div>

            <h2 className="mt-6 text-xl font-bold text-foreground">
              No Orders Yet
            </h2>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              You haven&apos;t placed any orders yet. Start shopping
              and your orders will appear here.
            </p>

            <Link
              href="/products"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
            >
              <ShoppingBag size={17} />
              Start Shopping
            </Link>
          </div>
        </div>
      ) : (
        /* =========================
           Orders
        ========================= */

        <div className="space-y-4">
          {orders.map((order) => {
            const status =
              statusConfig[order.status] ||
              statusConfig.pending;

            const StatusIcon = status.icon;

            return (
              <div
                key={order._id}
                className="
                  overflow-hidden
                  rounded
                  border border-border
                  bg-card
                  shadow-sm
                  transition
                  hover:shadow-md
                "
              >
                {/* Order Header */}

                <div className="flex flex-col gap-3 border-b border-border p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Order ID
                    </p>

                    <p className="mt-1 font-semibold ">
                      #{order._id}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`
                        inline-flex
                        items-center
                        gap-1.5
                        rounded-full
                        px-3
                        py-1.5
                        text-xs
                        font-semibold
                        ${status.className}
                      `}
                    >
                      <StatusIcon className="h-3.5 w-3.5" />

                      {status.label}
                    </span>

                    <Link
                      href={`/dashboard/user/orders/${order._id}`}
                      className="
                        inline-flex
                        items-center
                        gap-1.5
                        rounded-lg
                        border
                        border-border
                        px-3
                        py-1.5
                        text-xs
                        font-medium
                        transition
                        hover:bg-muted
                      "
                    >
                      <Eye className="h-3.5 w-3.5" />
                      Details
                    </Link>
                  </div>
                </div>

                {/* Order Items */}

                <div className="divide-y divide-border">
                  {order.items.map((item) => (
                    <div
                      key={item._id}
                      className="flex items-center gap-4 p-4 sm:p-5"
                    >
                      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-muted">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="truncate font-semibold ">
                          {item.name}
                        </h3>

                        <p className="mt-1 text-xs text-muted-foreground">
                          Quantity: {item.quantity}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="font-semibold text-foreground">
                          $
                          {(
                            item.price * item.quantity
                          ).toFixed(2)}
                        </p>

                        <p className="mt-1 text-xs text-muted-foreground">
                          ${item.price.toFixed(2)} each
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Footer */}

                <div className="flex flex-col gap-3 border-t border-border bg-muted/30 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Ordered on
                    </p>

                    <p className="mt-1 text-sm font-medium text-foreground">
                      {new Date(
                        order.createdAt
                      ).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>

                  <div className="text-left sm:text-right">
                    <p className="text-xs text-muted-foreground">
                      Total Amount
                    </p>

                    <p className="mt-1 text-xl font-bold text-foreground">
                      ${order.totalAmount.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}