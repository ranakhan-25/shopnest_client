"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Heart, Trash2, ShoppingCart } from "lucide-react";
import { toast } from 'react-toastify';

import { apiFetch } from "@/lib/apiClient";
import type { Product } from "@/types/product";

interface WishlistItem {
  _id: string;
  email: string;
  product: Product;
  createdAt?: string;
  updatedAt?: string;
}

const Wishlist = () => {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [addedToCart, setAddedToCart] = useState(false);

  // GET WISHLIST
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        setLoading(true);

        const res = await apiFetch("/api/wishlist");

        const result = await res.json();

        if (!res.ok) {
          throw new Error(
            result.message || "Failed to fetch wishlist"
          );
        }

        setWishlist(result?.data || []);
      } catch (error) {
        console.error("Fetch wishlist error:", error);
        setWishlist([]);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);


  const handleAddToCart = async (item: Product) => {
    try {
      const res = await apiFetch(`/api/cart/add`, {
        method: "POST",
        body: JSON.stringify({
          ...item,
          quantity: 1,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Failed to add to cart");
      }


      // Success
      toast(result.message);

      setAddedToCart(true);

      await handleDelete(item._id);
      // Current route reload
      window.location.reload();
    } catch (error) {
      console.error("Add to cart error:", error);

      alert(error instanceof Error ? error.message : "Something went wrong");
    }
  };

  // DELETE WISHLIST
  const handleDelete = async (productId: string) => {
    try {
      setDeletingId(productId);

      const res = await apiFetch(
        `/api/wishlist/${productId}`,
        {
          method: "DELETE",
        }
      );

      const result = await res.json();

      if (!res.ok) {
        throw new Error(
          result.message || "Failed to remove wishlist"
        );
      }

      // Remove from UI
      setWishlist((prev) =>
        prev.filter(
          (item) => item.product._id !== productId
        )
      );

      toast(result.message);
    } catch (error) {
      console.error("Delete wishlist error:", error);

      toast(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    } finally {
      setDeletingId(null);
    }
  };


  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <p className="text-muted-foreground">
          Loading wishlist...
        </p>
      </div>
    );
  }


  if (wishlist.length === 0) {
    return (
      <div className="flex min-h-[350px] items-center justify-center">
        <div className="text-center">
          <Heart className="mx-auto mb-4 h-14 w-14 text-muted-foreground" />

          <h2 className="text-2xl font-semibold text-foreground">
            Wishlist is Empty
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            You haven&apos;t added any products to your wishlist yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <section className="w-full space-y-8 mx-auto max-w-7xl">
  {/* =========================
      WISHLIST BANNER
  ========================== */}

  <div className="relative overflow-hidden  border border-border bg-gradient-to-br from-rose-500/10 via-background to-pink-500/10 px-6 py-10 sm:px-10 lg:py-14">
    {/* Decorative circles */}

    <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-rose-500/10 blur-2xl" />

    <div className="absolute -bottom-20 left-1/3 h-48 w-48 rounded-full bg-pink-500/10 blur-2xl" />

    <div className="relative z-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
      <div className="max-w-2xl">
        {/* Badge */}

        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-rose-500/20 bg-rose-500/10 px-3 py-1.5 text-sm font-medium text-rose-500">
          <Heart
            size={15}
            fill="currentColor"
          />

          Your Favorites
        </div>

        {/* Title */}

        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
          My Wishlist
        </h1>

        <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
          Save the products you love and keep them
          close. Your favorite products are waiting
          for you.
        </p>
      </div>

      {/* Wishlist Counter */}

      <div className="flex h-28 w-28 shrink-0 flex-col items-center justify-center rounded-2xl border border-border bg-background/80 shadow-sm backdrop-blur">
        <Heart
          size={28}
          className="text-rose-500"
          fill="currentColor"
        />

        <span className="mt-1 text-2xl font-bold text-foreground">
          {wishlist.length}
        </span>

        <span className="text-xs text-muted-foreground">
          {wishlist.length === 1
            ? "Product"
            : "Products"}
        </span>
      </div>
    </div>
  </div>

  {/* =========================
      SECTION HEADER
  ========================== */}

  <div className="flex items-center justify-between px-5 md:px-10">
    <div>
      <h2 className="text-xl font-semibold text-foreground sm:text-2xl">
        Saved Products
      </h2>

      <p className="mt-1 text-sm text-muted-foreground">
        Products you&apos;ve added to your wishlist
      </p>
    </div>

    <div className="hidden items-center gap-2 rounded-full border border-border bg-muted/40 px-4 py-2 text-sm text-muted-foreground sm:flex">
      <Heart
        size={15}
        className="text-rose-500"
        fill="currentColor"
      />

      {wishlist.length} saved
    </div>
  </div>

  {/* =========================
      PRODUCTS
  ========================== */}

  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 px-5 md:px-10 mb-10">
    {wishlist.map((wishlistItem) => {
      const product = wishlistItem.product;

      return (
        <article
          key={wishlistItem._id}
          className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
        >
          {/* =====================
              IMAGE
          ====================== */}

          <div className="relative h-64 overflow-hidden bg-muted">
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />

            {/* Image overlay */}

            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            {/* Category */}

            <span className="absolute left-3 top-3 rounded-full bg-background/90 px-3 py-1.5 text-xs font-medium text-foreground shadow-sm backdrop-blur">
              {product.category}
            </span>

            {/* Wishlist button */}

            <button
              type="button"
              onClick={() =>
                handleDelete(product._id)
              }
              disabled={
                deletingId === product._id
              }
              aria-label="Remove from wishlist"
              className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-background/90 text-rose-500 shadow-md backdrop-blur transition-all duration-200 hover:scale-110 hover:bg-rose-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Heart
                size={18}
                fill="currentColor"
              />
            </button>
          </div>

          {/* =====================
              CONTENT
          ====================== */}

          <div className="p-5">
            {/* Product Name */}

            <h3 className="line-clamp-1 text-lg font-semibold text-foreground">
              {product.name}
            </h3>

            {/* Description */}

            <p className="mt-2 line-clamp-2 min-h-[40px] text-sm leading-5 text-muted-foreground">
              {product.description}
            </p>

            {/* Price + Stock */}

            <div className="mt-4 flex items-end justify-between">
              <div>
                <p className="text-xs text-muted-foreground">
                  Price
                </p>

                <p className="mt-0.5 text-xl font-bold text-foreground">
                  ${product.price.toFixed(2)}
                </p>
              </div>

              <span
                className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                  product.stock > 0
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    : "bg-red-500/10 text-red-500"
                }`}
              >
                {product.stock > 0
                  ? `${product.stock} left`
                  : "Out of stock"}
              </span>
            </div>

            {/* Divider */}

            <div className="my-4 h-px bg-border" />

            {/* Buttons */}

            <div className="flex gap-2">
              {/* Add to Cart */}

              <button
                type="button"
                onClick={()=>handleAddToCart(product)}
                disabled={product.stock <= 0}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-3 py-2.5 text-sm font-semibold cursor-pointer
                 text-primary-foreground transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 hover:underline"
              >
                <ShoppingCart size={16} />

                {product.stock > 0
                  ? "Add to Cart"
                  : "Out of Stock"}
              </button>

              {/* Delete */}

              <button
                type="button"
                onClick={() =>
                  handleDelete(product._id)
                }
                disabled={
                  deletingId === product._id
                }
                className="flex items-center justify-center rounded-xl border border-border px-3 py-2.5 text-muted-foreground transition-all hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Delete wishlist item"
              >
                <Trash2 size={17} />
              </button>
            </div>
          </div>
        </article>
      );
    })}
  </div>
</section>
  );
};

export default Wishlist;