"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Target, Trophy } from "lucide-react";
import Image from "next/image";

export default function OurStory() {
  const highlights = [
    "Premium quality products tested for durability",
    "Customer-first approach with 24/7 support",
    "Fast and secure global shipping network",
  ];

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-950">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          {/* Left Column: Images Collage / Showcase */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative grid grid-cols-2 gap-4"
          >
            <div className="relative h-64 sm:h-80 w-full overflow-hidden rounded-2xl shadow-md">
              <Image
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8"
                alt="Store experience"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative mt-8 h-64 sm:h-80 w-full overflow-hidden rounded-2xl shadow-md">
              <Image
                src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9"
                alt="Products display"
                fill
                className="object-cover"
              />
            </div>
          </motion.div>

          {/* Right Column: Text Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-1.5 text-xs font-semibold text-gray-900 shadow-sm dark:border-gray-800 dark:bg-gray-900 dark:text-gray-100">
              <Target size={14} />
              Our Story & Mission
            </div>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Built on Trust, Quality, and Innovation
            </h2>

            <p className="mt-4 text-sm leading-6 text-gray-600 dark:text-gray-400 sm:text-base">
              Founded with a simple vision to bridge the gap between premium merchandise and everyday consumers, ShopNest has evolved into a trusted platform for lifestyle products. We believe that shopping should not just be a transaction, but an experience defined by confidence and satisfaction.
            </p>

            {/* Highlights List */}
            <div className="mt-6 space-y-3">
              {highlights.map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle2 size={18} className="text-gray-900 dark:text-white flex-shrink-0" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}