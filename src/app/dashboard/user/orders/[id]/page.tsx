"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  Package,
  Truck,
  XCircle,
  ShoppingBag,
} from "lucide-react";

import { apiFetch } from "@/lib/apiClient";

interface OrderItem {
  productId: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  createdById: string;
  creatorEmail: string;
  quantity: number;
}

interface Order {
  _id: string;
  email: string;
  items: OrderItem[];
  totalAmount: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
  updatedAt?: string;
}

interface OrderResponse {
  success: boolean;
  message: string;
  data: Order;
}

const statusConfig = {
  pending: {
    label: "Pending",
    icon: Clock3,
    className: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
  },
  processing: {
    label: "Processing",
    icon: Package,
    className: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  },
  shipped: {
    label: "Shipped",
    icon: Truck,
    className: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  },
  delivered: {
    label: "Delivered",
    icon: CheckCircle2,
    className: "bg-green-500/10 text-green-600 dark:text-green-400",
  },
  cancelled: {
    label: "Cancelled",
    icon: XCircle,
    className: "bg-red-500/10 text-red-600 dark:text-red-400",
  },
};

export default function OrderDetailsPage() {
  const params = useParams();
  const orderId = params.orderId as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!orderId) return;

    let cancelled = false;

    const fetchOrder = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await apiFetch(`/api/orders/${orderId}`);

        const result: OrderResponse = await res.json();

        console.log(result)

        if (!res.ok) {
          throw new Error(result.message || "Failed to fetch order");
        }

        if (!cancelled) {
          setOrder(result.data);
        }
      } catch (error) {
        console.error("Fetch order error:", error);

        if (!cancelled) {
          setError(
            error instanceof Error ? error.message : "Something went wrong",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchOrder();

    return () => {
      cancelled = true;
    };
  }, [orderId]);

  /* =========================
     Loading
  ========================= */

  if (loading) {
    return (
      <section className="space-y-6">
        <div className="h-9 w-48 animate-pulse rounded-lg bg-muted" />

        <div className="h-32 animate-pulse rounded-2xl bg-muted" />

        <div className="h-80 animate-pulse rounded-2xl bg-muted" />
      </section>
    );
  }

  /* =========================
     Error
  ========================= */

  if (error || !order) {
    return (
      <section className="flex min-h-[500px] items-center justify-center">
        <div className="max-w-md text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10">
            <Package className="h-8 w-8 text-red-500" />
          </div>

          <h2 className="mt-5 text-xl font-bold text-foreground">
            Order Not Found
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            {error || "We couldn't find this order."}
          </p>

          <Link
            href="/dashboard/user/orders"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground"
          >
            <ArrowLeft size={17} />
            Back to Orders
          </Link>
        </div>
      </section>
    );
  }

  const status = statusConfig[order.status] || statusConfig.pending;

  const StatusIcon = status.icon;

  const subtotal = order.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const totalItems = order.items.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  return (
    <section className="space-y-6">
      {/* =========================
          Header
      ========================= */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            href="/dashboard/user/orders"
            className="mb-3 inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Orders
          </Link>

          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
              <ShoppingBag className="h-5 w-5 text-primary" />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Order Details
              </h1>

              <p className="mt-1 text-sm text-muted-foreground">
                Order #{order._id}
              </p>
            </div>
          </div>
        </div>

        <span
          className={`inline-flex w-fit items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${status.className}`}
        >
          <StatusIcon className="h-4 w-4" />
          {status.label}
        </span>
      </div>

      {/* =========================
          Order Information
      ========================= */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="text-sm text-muted-foreground">Order Date</p>

          <p className="mt-2 font-semibold text-foreground">
            {new Date(order.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="text-sm text-muted-foreground">Total Items</p>

          <p className="mt-2 font-semibold text-foreground">
            {totalItems} {totalItems === 1 ? "item" : "items"}
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="text-sm text-muted-foreground">Customer Email</p>

          <p className="mt-2 truncate font-semibold text-foreground">
            {order.email}
          </p>
        </div>
      </div>

      {/* =========================
          Products
      ========================= */}

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="border-b border-border p-5">
          <h2 className="font-semibold text-foreground">Ordered Products</h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Products included in this order
          </p>
        </div>

        <div className="divide-y divide-border">
          {order.items.map((item) => (
            <div key={item.productId} className="flex gap-4 p-5">
              {/* Image */}

              <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-muted">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-full w-full object-cover"
                />
              </div>

              {/* Product Info */}

              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-foreground">{item.name}</h3>

                {item.category && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    {item.category}
                  </p>
                )}

                <p className="mt-2 text-sm text-muted-foreground">
                  ${item.price.toFixed(2)} × {item.quantity}
                </p>
              </div>

              {/* Product Total */}

              <div className="text-right">
                <p className="font-bold text-foreground">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  {item.quantity} {item.quantity === 1 ? "unit" : "units"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* =========================
          Summary
      ========================= */}

      <div className="flex justify-end">
        <div className="w-full rounded-2xl border border-border bg-card p-5 sm:max-w-md">
          <h2 className="font-semibold text-foreground">Order Summary</h2>

          <div className="mt-5 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Items</span>

              <span className="font-medium text-foreground">{totalItems}</span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>

              <span className="font-medium text-foreground">
                ${subtotal.toFixed(2)}
              </span>
            </div>

            <div className="border-t border-border pt-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-foreground">Total</span>

                <span className="text-xl font-bold text-foreground">
                  ${order.totalAmount.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
