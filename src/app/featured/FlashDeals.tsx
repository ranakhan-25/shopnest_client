"use client";

import { motion } from "framer-motion";
import { ArrowRight, Flame, ShoppingBag, Timer } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

// ডেমো ফ্ল্যাশ ডিল প্রডাক্ট ডেটা (প্রয়োজন অনুযায়ী API দিয়ে রিপ্লেস করে নিতে পারেন)
const flashDeals = [
  {
    _id: "fd1",
    name: "MacBook Air M3",
    price: 1099.99,
    originalPrice: 1299.99,
    discount: "15% OFF",
    image: "https://images.unsplash.com/photo-1517336714739-489689fd1ca8",
    category: "Laptops",
  },
  {
    _id: "fd2",
    name: "Sony WH-1000XM5",
    price: 349.99,
    originalPrice: 399.99,
    discount: "12% OFF",
    image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b",
    category: "Electronics",
  },
  {
    _id: "fd3",
    name: "Adidas Ultraboost",
    price: 129.99,
    originalPrice: 169.99,
    discount: "23% OFF",
    image: "https://images.unsplash.com/photo-1552346154-21d32810aba3",
    category: "Shoes",
  },
];

export default function FlashDeals() {
  // কাউন্টডাউন টাইমার স্টেট (উদাহরণস্বরূপ ১০ ঘণ্টা)
  const [timeLeft, setTimeLeft] = useState({
    hours: 10,
    minutes: 45,
    seconds: 30,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-950">
      <div className="container mx-auto px-4">
        {/* Header & Timer */}
        <div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-1.5 text-xs font-semibold text-gray-900 shadow-sm dark:border-gray-800 dark:bg-gray-900 dark:text-gray-100">
              <Flame size={14} className="text-gray-900 dark:text-white" />
              Limited Time Offer
            </div>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Flash Deals
            </h2>
          </div>

          {/* Countdown Timer */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-sm font-medium text-gray-600 dark:text-gray-400">
              <Timer size={18} />
              Ends in:
            </div>
            <div className="flex items-center gap-1.5 font-mono text-sm font-bold text-gray-900 dark:text-white">
              <span className="rounded bg-gray-900 px-2 py-1 text-white dark:bg-white dark:text-gray-950">
                {String(timeLeft.hours).padStart(2, "0")}
              </span>
              :
              <span className="rounded bg-gray-900 px-2 py-1 text-white dark:bg-white dark:text-gray-950">
                {String(timeLeft.minutes).padStart(2, "0")}
              </span>
              :
              <span className="rounded bg-gray-900 px-2 py-1 text-white dark:bg-white dark:text-gray-950">
                {String(timeLeft.seconds).padStart(2, "0")}
              </span>
            </div>
          </div>
        </div>

        {/* Deals Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {flashDeals.map((product) => (
            <motion.div
              key={product._id}
              whileHover={{ y: -6 }}
              className="group relative overflow-hidden rounded border border-gray-200 bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-xl dark:border-gray-800 dark:bg-gray-900"
            >
              {/* Discount Badge */}
              <span className="absolute left-5 top-5 z-10 rounded-full bg-gray-900 px-3 py-1 text-[11px] font-semibold text-white dark:bg-white dark:text-gray-950">
                {product.discount}
              </span>

              {/* Product Image */}
              <div className="relative h-56 w-full overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* Content */}
              <div className="mt-5">
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {product.category}
                </p>
                <h3 className="mt-1 text-lg font-bold text-gray-900 dark:text-white">
                  {product.name}
                </h3>

                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                      ${product.price}
                    </span>
                    <span className="text-sm text-gray-400 line-through">
                      ${product.originalPrice}
                    </span>
                  </div>

                  <Link
                    href={`/collections`}
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-900 transition-colors group-hover:bg-gray-900 group-hover:text-white dark:bg-gray-800 dark:text-gray-200 dark:group-hover:bg-white dark:group-hover:text-gray-950"
                  >
                    <ShoppingBag size={18} />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}