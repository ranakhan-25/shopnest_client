"use client";

import { motion } from "framer-motion";
import { ArrowRight, ShoppingBag } from "lucide-react";
import Link from "next/link";

export default function AboutCTA() {
  return (
    <section className="py-20 bg-white dark:bg-black">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl border border-gray-200 bg-gray-50 px-6 py-16 text-center dark:border-gray-800 dark:bg-gray-900 sm:px-12 sm:py-20"
        >
          <div className="mx-auto max-w-2xl">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-900 text-white dark:bg-white dark:text-gray-950">
              <ShoppingBag size={24} />
            </div>

            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Ready to Explore Our Collection?
            </h2>

            <p className="mt-4 text-sm text-gray-600 dark:text-gray-400 sm:text-base">
              Discover why thousands of shoppers trust ShopNest for their daily lifestyle and tech gear. Browse our latest arrivals today.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/collections"
                className="group inline-flex items-center gap-2 rounded-xl bg-gray-950 px-6 py-3.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-gray-800 dark:bg-white dark:text-gray-950 dark:hover:bg-gray-200"
              >
                Start Shopping Now
                <ArrowRight
                  size={17}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}