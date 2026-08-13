"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export default function AboutHero() {
  return (
    <section className="relative overflow-hidden py-24 bg-white dark:bg-black">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-4 py-1.5 text-xs font-semibold text-gray-900 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-100"
          >
            <Sparkles size={14} />
            About ShopNest
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="mt-6 text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl lg:text-6xl"
          >
            Redefining Your Modern Shopping Experience
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mt-6 text-base leading-7 text-gray-600 dark:text-gray-400 sm:text-lg"
          >
            We curate top-tier products ranging from cutting-edge electronics to everyday essentials, designed to elevate your lifestyle with uncompromising quality and seamless service.
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-4"
          >
            <Link
              href="/collections"
              className="group inline-flex items-center gap-2 rounded-xl bg-gray-950 px-6 py-3.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-gray-800 dark:bg-white dark:text-gray-950 dark:hover:bg-gray-200"
            >
              Explore Collections
              <ArrowRight
                size={17}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>

            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-transparent px-6 py-3.5 text-sm font-semibold text-gray-900 transition-all hover:bg-gray-50 dark:border-gray-800 dark:text-white dark:hover:bg-gray-900"
            >
              Get in Touch
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}