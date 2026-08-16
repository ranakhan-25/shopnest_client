"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  CheckCircle2,
  Package,
  ShoppingBag,
  ArrowRight,
  Loader2,
  AlertCircle,
} from "lucide-react";

import Image from "next/image";
import { apiFetch } from "@/lib/apiClient";

interface OrderItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

interface Order {
  _id: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
}

export default function OrderSuccessPage() {
  const params = useParams();
  const router = useRouter();

  const orderId = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
  if (!orderId) return;

  let cancelled = false;

  const fetchOrder = async () => {
    try {
      if (!cancelled) {
        setLoading(true);
        setError("");
      }

      const res = await apiFetch(`/api/orders/${orderId}`);

      const result = await res.json();

      if (!res.ok) {
        throw new Error(
          result.message || "Failed to fetch order"
        );
      }

      if (!cancelled) {
        setOrder(result.data);
      }
    } catch (error) {
      console.error("Fetch order error:", error);

      if (!cancelled) {
        setError(
          error instanceof Error
            ? error.message
            : "Something went wrong"
        );
      }
    } finally {
      if (!cancelled) {
        setLoading(false);
      }
    }
  };

  const timer = setTimeout(() => {
    fetchOrder();
  }, 0);

  return () => {
    clearTimeout(timer);
    cancelled = true;
  };
}, [orderId]);

  /* =========================
     LOADING
  ========================= */

  if (loading) {
    return (
      <main className="min-h-screen bg-white px-4 py-12 text-black dark:bg-black dark:text-white">
        <div className="mx-auto max-w-4xl">
          <div className="flex min-h-[500px] items-center justify-center">
            <div className="text-center">
              <Loader2 className="mx-auto h-10 w-10 animate-spin text-black dark:text-white" />

              <p className="mt-4 text-sm text-black/60 dark:text-white/60">
                Loading your order...
              </p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  /* =========================
     ERROR
  ========================= */

  if (error || !order) {
    return (
      <main className="min-h-screen bg-white px-4 py-12 text-black dark:bg-black dark:text-white">
        <div className="mx-auto flex min-h-[500px] max-w-lg items-center justify-center">
          <div className="w-full rounded-3xl border border-black/10 bg-black/[0.02] p-8 text-center dark:border-white/10 dark:bg-white/[0.03]">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10">
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>

            <h1 className="mt-5 text-2xl font-bold">
              Order Not Found
            </h1>

            <p className="mt-2 text-sm leading-6 text-black/60 dark:text-white/60">
              {error ||
                "We couldn't find this order."}
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button
                type="button"
                onClick={() => router.back()}
                className="
                  rounded-xl
                  border border-black/10
                  px-5 py-2.5
                  text-sm font-medium
                  transition
                  hover:bg-black/5
                  dark:border-white/10
                  dark:hover:bg-white/10
                "
              >
                Go Back
              </button>

              <Link
                href="/"
                className="
                  rounded-xl
                  bg-black
                  px-5 py-2.5
                  text-sm font-semibold
                  text-white
                  transition
                  hover:bg-black/80
                  dark:bg-white
                  dark:text-black
                  dark:hover:bg-white/80
                "
              >
                Go Home
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const totalItems = order.items.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  };

  return (
    <main className="min-h-screen bg-white px-4 py-10 text-black dark:bg-black dark:text-white">
      <div className="mx-auto max-w-4xl">
        {/* =========================
            SUCCESS HEADER
        ========================= */}

        <div className="text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10">
            <CheckCircle2 className="h-11 w-11 text-green-500" />
          </div>

          <h1 className="mt-6 text-3xl font-bold sm:text-4xl">
            Order Confirmed!
          </h1>

          <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-black/60 dark:text-white/60">
            Thank you for your purchase. Your order has
            been successfully placed.
          </p>

          <p className="mt-3 text-sm">
            Order ID:{" "}
            <span className="font-semibold">
              #{order._id}
            </span>
          </p>
        </div>

        {/* =========================
            ORDER SUMMARY
        ========================= */}

        <div className="mt-10 rounded-3xl border border-black/10 bg-black/[0.02] p-5 dark:border-white/10 dark:bg-white/[0.03] sm:p-7">
          <div className="flex flex-col gap-4 border-b border-black/10 pb-5 dark:border-white/10 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-bold">
                Order Summary
              </h2>

              <p className="mt-1 text-sm text-black/50 dark:text-white/50">
                {new Date(
                  order.createdAt
                ).toLocaleDateString()}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span
                className="
                  rounded-full
                  bg-green-500/10
                  px-3 py-1.5
                  text-xs font-semibold
                  capitalize
                  text-green-600
                  dark:text-green-400
                "
              >
                {order.status}
              </span>

              <span
                className="
                  rounded-full
                  bg-blue-500/10
                  px-3 py-1.5
                  text-xs font-semibold
                  capitalize
                  text-blue-600
                  dark:text-blue-400
                "
              >
                {order.paymentStatus}
              </span>
            </div>
          </div>

          {/* =========================
              PRODUCTS
          ========================= */}

          <div className="divide-y divide-black/10 dark:divide-white/10">
            {order.items.map((item) => (
              <div
                key={item.productId}
                className="flex gap-4 py-5"
              >
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-black/5 dark:bg-white/10">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-semibold">
                    {item.name}
                  </h3>

                  <p className="mt-1 text-sm text-black/50 dark:text-white/50">
                    Quantity: {item.quantity}
                  </p>

                  <p className="mt-2 text-sm font-medium">
                    {formatCurrency(item.price)}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-sm font-bold">
                    {formatCurrency(
                      item.price * item.quantity
                    )}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* =========================
              TOTAL
          ========================= */}

          <div className="border-t border-black/10 pt-5 dark:border-white/10">
            <div className="flex items-center justify-between text-sm">
              <span className="text-black/60 dark:text-white/60">
                Total Items
              </span>

              <span className="font-medium">
                {totalItems}
              </span>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <span className="text-base font-semibold">
                Total Amount
              </span>

              <span className="text-2xl font-bold">
                {formatCurrency(
                  order.totalAmount
                )}
              </span>
            </div>
          </div>
        </div>

        {/* =========================
            ACTIONS
        ========================= */}

        <div className="mt-7 grid gap-3 sm:grid-cols-2">
          <Link
            href="/dashboard/user/orders"
            className="
              flex items-center justify-center
              gap-2 rounded-xl
              border border-black/10
              px-5 py-3
              text-sm font-semibold
              transition
              hover:bg-black/5
              dark:border-white/10
              dark:hover:bg-white/10
            "
          >
            <Package className="h-4 w-4" />
            View My Orders
          </Link>

          <Link
            href="/products"
            className="
              flex items-center justify-center
              gap-2 rounded-xl
              bg-black px-5 py-3
              text-sm font-semibold
              text-white
              transition
              hover:bg-black/80
              dark:bg-white
              dark:text-black
              dark:hover:bg-white/80
            "
          >
            <ShoppingBag className="h-4 w-4" />
            Continue Shopping
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </main>
  );
}