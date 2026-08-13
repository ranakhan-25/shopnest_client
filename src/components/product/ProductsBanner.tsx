"use client";

import Link from "next/link";
import { ArrowRight, ShoppingBag, Sparkles } from "lucide-react";

const ProductsBanner = () => {
  return (
    <section className="relative overflow-hidden border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900">
      {/* Decorative background */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-slate-200/70 blur-3xl dark:bg-slate-700/30" />

      <div className="pointer-events-none absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-slate-200/70 blur-3xl dark:bg-slate-700/30" />

      <div className="relative grid min-h-[320px] items-center gap-8 px-6 py-12 sm:px-10 lg:grid-cols-2 lg:px-14">
        
        {/* Content */}
        <div>
          {/* Badge */}
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
            <Sparkles className="h-3.5 w-3.5" />
            Discover Our Collection
          </div>

          {/* Heading */}
          <h1 className="max-w-xl text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl dark:text-white">
            Find Everything You Need in One Place
          </h1>

          {/* Description */}
          <p className="mt-4 max-w-lg text-sm leading-6 text-slate-600 sm:text-base dark:text-slate-400">
            Explore our latest products, discover great deals, and find
            everything you need for your everyday lifestyle.
          </p>

          {/* Actions */}
          <div className="mt-7 flex flex-wrap items-center gap-3">

            <Link
              href="/"
              className="
                inline-flex items-center
                rounded-xl
                border border-slate-200
                bg-white
                px-5 py-3
                text-sm font-medium
                text-slate-700
                transition
                hover:border-slate-300
                hover:bg-slate-100
                dark:border-slate-700
                dark:bg-slate-800
                dark:text-slate-300
                dark:hover:bg-slate-700
              "
            >
              Back to Home
            </Link>
          </div>
        </div>

        {/* Right Visual */}
        <div className="relative hidden lg:flex items-center justify-center">
          <div className="relative flex h-56 w-56 items-center justify-center rounded-full border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-800">
            
            <div className="flex h-36 w-36 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700">
              <ShoppingBag className="h-16 w-16 text-slate-800 dark:text-white" />
            </div>

            {/* Floating cards */}
            <div className="absolute -left-8 top-8 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-lg dark:border-slate-700 dark:bg-slate-900">
              <p className="text-[10px] text-slate-400">
                Products
              </p>
              <p className="text-lg font-bold text-slate-950 dark:text-white">
                100+
              </p>
            </div>

            <div className="absolute -bottom-3 -right-8 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-lg dark:border-slate-700 dark:bg-slate-900">
              <p className="text-[10px] text-slate-400">
                Quality
              </p>
              <p className="text-sm font-semibold text-slate-950 dark:text-white">
                Premium
              </p>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductsBanner;