"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ShoppingBag, Trash2, CreditCard, Package } from "lucide-react";

import type { Cart, CartItem } from "@/types/product";
import { getCart } from "@/lib/cartService";
import { apiFetch } from "@/lib/apiClient";
import { toast } from "react-toastify";

const Cart = () => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const data = await getCart();
        setCart(data);
      } catch (error) {
        console.error("Failed to fetch cart:", error);
        setCart(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  // Loading
  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-gray-600 dark:text-gray-300">Loading cart...</p>
      </div>
    );
  }

  // Empty cart
  if (!cart || cart.items.length === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center px-4">
        <div className="text-center">
          <ShoppingBag className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-500" />

          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Cart Not Found
          </h2>

          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Your cart is currently empty.
          </p>
        </div>
      </div>
    );
  }

  // Total products
  const totalProducts = cart.items.length;

  // Total quantity
  const totalQuantity = cart.items.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  // Total price
  const totalPrice = cart.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const handleDelete = async (productId: string) => {
    try {
      const res = await apiFetch(`/api/cart/delete/${productId}`, {
        method: "DELETE",
      });
      
      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Failed to delete product");
      }

      setCart(result.data);

      // Success message
      toast(result.message || "Product removed successfully");
    } catch (error) {
      console.error("Delete cart error:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to remove product from cart",
      );
    }
  };

  const handleBuyAll = () => {
    console.log("Buy all:", cart.items);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white md:text-3xl">
          My Cart
        </h1>

        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          {totalProducts} {totalProducts === 1 ? "product" : "products"} in your
          cart
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
        {/* ================= CART ITEMS ================= */}
        <div className="space-y-4">
          {cart.items.map((item) => {
            const itemTotal = item.price * item.quantity;

            return (
              <div
                key={item._id}
                className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-colors dark:border-gray-700 dark:bg-gray-900"
              >
                <div className="flex flex-col gap-4 sm:flex-row">
                  {/* Product Image */}
                  <div className="relative h-32 w-full shrink-0 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800 sm:h-32 sm:w-32">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex flex-1 flex-col">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {item.name}
                      </h3>

                      <p className="mt-1 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
                        {item.description}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm">
                        <span className="text-gray-600 dark:text-gray-400">
                          Price:{" "}
                          <strong className="text-gray-900 dark:text-white">
                            ${item.price.toFixed(2)}
                          </strong>
                        </span>

                        <span className="text-gray-600 dark:text-gray-400">
                          Quantity:{" "}
                          <strong className="text-gray-900 dark:text-white">
                            {item.quantity}
                          </strong>
                        </span>

                        <span className="text-gray-600 dark:text-gray-400">
                          Total:{" "}
                          <strong className="text-gray-900 dark:text-white">
                            ${itemTotal.toFixed(2)}
                          </strong>
                        </span>
                      </div>
                    </div>

                    {/* Buttons */}
                    <div className="mt-4 flex gap-2">
                      {/* Delete */}
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="flex items-center justify-center gap-2 rounded-lg border border-red-500 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 dark:border-red-400 dark:text-red-400 dark:hover:bg-red-950/40"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ================= ORDER SUMMARY ================= */}
        <div className="lg:sticky lg:top-24 lg:h-fit">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Order Summary
            </h2>

            <div className="my-5 h-px bg-gray-200 dark:bg-gray-700" />

            {/* Products */}
            <div className="flex items-center justify-between py-2 text-sm">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Package size={18} />
                <span>Products</span>
              </div>

              <span className="font-medium text-gray-900 dark:text-white">
                {totalProducts}
              </span>
            </div>

            {/* Quantity */}
            <div className="flex items-center justify-between py-2 text-sm">
              <span className="text-gray-600 dark:text-gray-400">
                Total Quantity
              </span>

              <span className="font-medium text-gray-900 dark:text-white">
                {totalQuantity}
              </span>
            </div>

            {/* Subtotal */}
            <div className="flex items-center justify-between py-2 text-sm">
              <span className="text-gray-600 dark:text-gray-400">Subtotal</span>

              <span className="font-medium text-gray-900 dark:text-white">
                ${totalPrice.toFixed(2)}
              </span>
            </div>

            {/* Shipping */}
            <div className="flex items-center justify-between py-2 text-sm">
              <span className="text-gray-600 dark:text-gray-400">Shipping</span>

              <span className="font-medium text-green-600 dark:text-green-400">
                Free
              </span>
            </div>

            <div className="my-4 h-px bg-gray-200 dark:bg-gray-700" />

            {/* Total */}
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                Total
              </span>

              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                ${totalPrice.toFixed(2)}
              </span>
            </div>

            {/* Buy All */}
            <button
              onClick={handleBuyAll}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 px-5 py-3 font-semibold text-white transition hover:bg-gray-700 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
            >
              <CreditCard size={18} />
              Buy All Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
