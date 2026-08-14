"use client";

import { motion } from "framer-motion";
import {
  ArrowLeft,
  Heart,
  Minus,
  Plus,
  ShoppingCart,
  Star,
  Check,
  ShieldCheck,
  Truck,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import type { Product } from "@/types/product";
import { apiFetch } from "@/lib/apiClient";
import { useAuthStore } from "@/components/store/authStore";
import { toast } from "react-toastify";

export default function ProductDetails() {
  const params = useParams();
  const id = params?.id;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const router = useRouter();
  const { accessToken, hasHydrated } = useAuthStore();

  useEffect(() => {
    if (!id || !hasHydrated) return;

    if (!accessToken) {
      router.replace("/unauthorized");
      return;
    }

    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await apiFetch(`/api/product/${id}`);

        if (!res.ok) {
          throw new Error("Failed to fetch product details");
        }

        const result = await res.json();

        setProduct(result?.data || result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id, accessToken, hasHydrated, router]);

  const handleQuantityChange = (type: "inc" | "dec") => {
    if (type === "inc") {
      setQuantity((prev) => prev + 1);
    } else if (type === "dec" && quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAddToCart = async (item: Product) => {
    try {
      const res = await apiFetch(`/api/cart/add`, {
        method: "POST",
        body: JSON.stringify({
          ...item,
          quantity: quantity,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Failed to add to cart");
      }

      // Success
      alert(result.message);

      setAddedToCart(true);

      // Current route reload
      window.location.reload();
    } catch (error) {
      console.error("Add to cart error:", error);

      toast(error instanceof Error ? error.message : "Something went wrong");
    }
  };

  const handleWishlistToggle = async (item: Product) => {
    try {
      const res = await apiFetch(
        isWishlisted ? `/api/wishlist/${item._id}` : `/api/wishlist`,
        {
          method: isWishlisted ? "DELETE" : "POST",
          body: isWishlisted
            ? undefined
            : JSON.stringify({
                productId: item._id,
              }),
        },
      );

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Wishlist action failed");
      }

      setIsWishlisted((prev) => !prev);

      toast(result.message);
    } catch (error) {
      console.error("Wishlist error:", error);

      toast(error instanceof Error ? error.message : "Something went wrong");
    }
  };

  if (!hasHydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Checking authentication...</p>
      </div>
    );
  }

  if (!accessToken) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-white dark:bg-black">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-900 border-t-transparent dark:border-white dark:border-t-transparent" />
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Loading product details...
          </p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-white dark:bg-black px-4">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center dark:border-red-900/50 dark:bg-red-950/30 max-w-md w-full">
          <h3 className="text-lg font-semibold text-red-700 dark:text-red-400">
            Product Not Found
          </h3>
          <p className="mt-2 text-sm text-red-600 dark:text-red-400">
            {error || "The requested product does not exist."}
          </p>
          <Link
            href="/collections"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gray-900 px-5 py-2.5 text-xs font-semibold text-white dark:bg-white dark:text-gray-950"
          >
            <ArrowLeft size={15} /> Back to Collections
          </Link>
        </div>
      </div>
    );
  }

  return (
    <section className="py-16 bg-white dark:bg-black min-h-screen">
      <div className="container mx-auto px-4">
        {/* Back Link */}
        <div className="mb-8">
          <Link
            href="/collections"
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          >
            <ArrowLeft size={16} /> Back to Products
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-start">
          {/* Left: Product Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="relative h-[400px] sm:h-[500px] w-full overflow-hidden rounded-3xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900"
          >
            <Image
              src={
                product.image ||
                "https://images.unsplash.com/photo-1505740420928-5e560c06d30e"
              }
              alt={product.name}
              fill
              priority
              className="object-cover"
            />
          </motion.div>

          {/* Right: Product Info & Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col"
          >
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              {product.category}
            </span>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              {product.name}
            </h1>

            {/* Rating & Reviews mock */}
            <div className="mt-3 flex items-center gap-2">
              <div className="flex items-center text-amber-500">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={15} fill="currentColor" />
                ))}
              </div>
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                (4.9 / 128 Reviews)
              </span>
            </div>

            {/* Price */}
            <div className="mt-5 flex items-baseline gap-4">
              <span className="text-3xl font-extrabold text-gray-900 dark:text-white">
                ${product.price}
              </span>
              {product.stock > 0 ? (
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                  In Stock ({product.stock} available)
                </span>
              ) : (
                <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700 dark:bg-red-950/40 dark:text-red-400">
                  Out of Stock
                </span>
              )}
            </div>

            {/* Description */}
            <p className="mt-4 text-sm leading-6 text-gray-600 dark:text-gray-400 sm:text-base">
              {product.description}
            </p>

            <hr className="my-6 border-gray-200 dark:border-gray-800" />

            {/* Quantity Selector */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                Quantity:
              </span>
              <div className="flex items-center rounded-xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
                <button
                  onClick={() => handleQuantityChange("dec")}
                  className="flex h-10 w-10 items-center justify-center text-gray-700 transition hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-800 rounded-l-xl"
                >
                  <Minus size={16} />
                </button>
                <span className="w-12 text-center text-sm font-semibold text-gray-900 dark:text-white">
                  {quantity}
                </span>
                <button
                  onClick={() => handleQuantityChange("inc")}
                  className="flex h-10 w-10 items-center justify-center text-gray-700 transition hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-800 rounded-r-xl"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Action Buttons: Add to Cart & Wishlist */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              {/* Add to Cart Button */}
              <button
                onClick={() => handleAddToCart(product)}
                disabled={product.stock === 0}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-900 bg-white py-4 text-sm font-semibold text-gray-900 shadow-sm transition-all hover:bg-gray-50 disabled:opacity-50 dark:border-gray-100 dark:bg-transparent dark:text-white dark:hover:bg-gray-900"
              >
                {addedToCart ? (
                  <>
                    <Check size={18} className="text-emerald-600" /> Added to
                    Cart
                  </>
                ) : (
                  <>
                    <ShoppingCart size={18} /> Add to Cart
                  </>
                )}
              </button>

              {/* Wishlist Button (Replaced Buy Now) */}
              <button
                onClick={() => handleWishlistToggle(product)}
                className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-4 text-sm font-semibold shadow-md transition-all ${
                  isWishlisted
                    ? "bg-red-500 text-white hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700"
                    : "bg-gray-950 text-white hover:bg-gray-800 dark:bg-white dark:text-gray-950 dark:hover:bg-gray-200"
                }`}
              >
                <Heart size={18} className={isWishlisted ? "fill-white" : ""} />
                {isWishlisted ? "Wishlisted" : "Add to Wishlist"}
              </button>
            </div>

            {/* Trust Badges */}
            <div className="mt-8 grid grid-cols-2 gap-4 rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900/50">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-gray-900 shadow-sm dark:bg-gray-800 dark:text-white">
                  <Truck size={20} />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-gray-900 dark:text-white">
                    Fast Delivery
                  </h4>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">
                    Within 2-3 business days
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-gray-900 shadow-sm dark:bg-gray-800 dark:text-white">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-gray-900 dark:text-white">
                    Secure Warranty
                  </h4>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">
                    100% genuine product
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
