"use client";

import Link from "next/link";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";

const banners = [
  {
    image:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2000",
    title: "Discover Products",
    highlight: "You'll Love",
  },
  {
    image:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=2000",
    title: "Shop Smart",
    highlight: "Live Better",
  },
  {
    image:
      "https://images.unsplash.com/photo-1472851294608-062f824d29cc?q=80&w=2000",
    title: "Everything You Need",
    highlight: "In One Place",
  },
];

export default function Hero() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative h-[600px] overflow-hidden sm:h-[90vh]">
      <div
        className="flex h-full transition-transform duration-1000 ease-in-out"
        style={{
          transform: `translateX(-${current * 100}%)`,
        }}
      >
        {banners.map((banner, index) => (
          <div
            key={index}
            className="relative h-full w-full shrink-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${banner.image})`,
            }}
          >
            <div className="absolute inset-0 dark:hidden" />
            <div className="absolute inset-0 hidden bg-black/65 dark:block" />
            <div className="absolute inset-0 bg-gradient-to-r from-white/60 via-white/20 to-transparent dark:hidden" />
            <div className="absolute inset-0 hidden bg-gradient-to-r from-black/80 via-black/45 to-transparent dark:block" />

            {/* Content */}
            <div className="relative z-10 mx-auto flex h-full max-w-7xl items-center px-4 sm:px-6 lg:px-8">
              <div className="max-w-2xl">
                {/* Badge */}
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-gray-900/20 bg-white/70 px-4 py-2 text-sm text-gray-900 shadow-sm backdrop-blur-md dark:border-white/20 dark:bg-white/10 dark:text-white dark:shadow-none">
                  <ShoppingBag size={16} />

                  <span>Welcome to ShopNest</span>
                </div>

                {/* Title */}
                <h1 className="text-4xl font-bold leading-tight text-gray-950 sm:text-5xl lg:text-7xl dark:text-white">
                  {banner.title}

                  <span className="block text-blue-600 dark:text-blue-400">
                    {banner.highlight}
                  </span>
                </h1>

                {/* Description */}
                <p className="mt-6 max-w-xl text-base leading-7 text-gray-800 sm:text-lg dark:text-gray-200">
                  Explore our collection of quality products at amazing prices.
                  Find everything you need in one place and enjoy a simple
                  shopping experience.
                </p>

                {/* Buttons */}
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  {/* Primary */}
                  <Link
                    href="/collections"
                    className="group inline-flex items-center justify-center gap-2 rounded-lg bg-white px-6 py-3 font-semibold text-black shadow-lg transition hover:bg-gray-200"
                  >
                    Shop Now
                    <ArrowRight
                      size={18}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </Link>

                  {/* Secondary */}
                  <Link
                    href="/collections"
                    className="inline-flex items-center justify-center rounded-lg border border-gray-900/20 bg-white/70 px-6 py-3 font-semibold text-gray-900 backdrop-blur-md transition hover:bg-white/90 dark:border-white/30 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
                  >
                    Explore Products
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Indicators */}
      <div className="absolute bottom-7 left-1/2 z-20 flex -translate-x-1/2 gap-2">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              current === index
                ? "w-8 bg-blue-600 dark:bg-white"
                : "w-2 bg-gray-700/50 dark:bg-white/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
