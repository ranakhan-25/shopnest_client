"use client";

import { motion } from "framer-motion";
import {
  Headphones,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Truck,
  Zap,
} from "lucide-react";

const features = [
  {
    icon: Truck,
    title: "Fast & Reliable Delivery",
    description:
      "Get your orders delivered quickly and safely right to your doorstep.",
    badge: "Fast Delivery",
  },
  {
    icon: ShieldCheck,
    title: "Secure Shopping",
    description:
      "Your personal information and transactions are protected with secure technology.",
    badge: "100% Secure",
  },
  {
    icon: Sparkles,
    title: "Quality Products",
    description:
      "We carefully select quality products to give you the best shopping experience.",
    badge: "Top Quality",
  },
  {
    icon: RotateCcw,
    title: "Easy Returns",
    description:
      "Changed your mind? Enjoy a simple and hassle-free return experience.",
    badge: "Easy Returns",
  },
  {
    icon: Headphones,
    title: "Dedicated Support",
    description:
      "Our support team is always ready to help whenever you need assistance.",
    badge: "24/7 Support",
  },
  {
    icon: Zap,
    title: "Smooth Experience",
    description:
      "Enjoy a fast, modern and seamless shopping experience across every device.",
    badge: "Lightning Fast",
  },
];

export default function WhyChooseShopNest() {
  return (
    <section className="relative overflow-hidden bg-white py-20 dark:bg-gray-950 sm:py-24">
      {/* Background Blur Effects */}
      <motion.div
        animate={{
          x: [0, 50, 0],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -left-32 top-20 h-72 w-72 rounded-full bg-gray-500/10 blur-3xl dark:bg-white/5"
      />

      <motion.div
        animate={{
          x: [0, -40, 0],
          y: [0, 40, 0],
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -right-32 bottom-10 h-80 w-80 rounded-full bg-gray-500/10 blur-3xl dark:bg-white/5"
      />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-14 max-w-3xl text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-100 px-4 py-2 text-sm font-medium text-gray-800 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200">
            <Sparkles size={16} />
            Why ShopNest?
          </div>

          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl lg:text-5xl">
            Shopping Made{" "}
            <span className="text-gray-900 dark:text-white underline decoration-gray-400 dark:decoration-gray-600 underline-offset-8">
              Better
            </span>
          </h2>

          <p className="mt-5 text-sm leading-7 text-gray-600 dark:text-gray-400 sm:text-base">
            We are committed to making every part of your shopping
            journey simple, secure and enjoyable.
          </p>
        </motion.div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.08,
                }}
                whileHover={{ y: -8 }}
                className="group relative overflow-hidden rounded border border-gray-200 bg-white p-6 shadow-sm transition-shadow duration-300 hover:shadow-xl dark:border-gray-800 dark:bg-gray-900"
              >
                {/* Hover Gradient */}
                <div className="absolute inset-0 -z-0 bg-gradient-to-br from-gray-500/[0.04] via-transparent to-gray-500/[0.04] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                {/* Number */}
                <span className="absolute right-5 top-5 text-5xl font-black text-gray-100 dark:text-gray-800">
                  0{index + 1}
                </span>

                {/* Icon */}
                <motion.div
                  whileHover={{
                    rotate: [0, -8, 8, 0],
                    scale: 1.08,
                  }}
                  transition={{ duration: 0.4 }}
                  className="relative z-10 flex h-14 w-14 items-center justify-center rounded bg-gray-100 text-gray-900 transition-colors duration-300 group-hover:bg-gray-900 group-hover:text-white dark:bg-gray-800 dark:text-gray-200 dark:group-hover:bg-white dark:group-hover:text-gray-950"
                >
                  <Icon size={27} />
                </motion.div>

                {/* Content */}
                <div className="relative z-10 mt-6">
                  <span className="inline-flex rounded-full bg-gray-100 px-3 py-1 text-[11px] font-semibold text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                    {feature.badge}
                  </span>

                  <h3 className="mt-4 text-lg font-bold text-gray-900 dark:text-white">
                    {feature.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                </div>

                {/* Bottom Line */}
                <motion.div
                  initial={{ width: 0 }}
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.4 }}
                  className="absolute bottom-0 left-0 h-1 bg-gray-900 dark:bg-white"
                />
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-14 grid grid-cols-2 divide-x divide-gray-200 rounded-2xl border border-gray-200 bg-gray-50 py-6 dark:divide-gray-800 dark:border-gray-800 dark:bg-gray-900 sm:grid-cols-4"
        >
          {[
            ["10K+", "Happy Customers"],
            ["5K+", "Products"],
            ["99%", "Positive Reviews"],
            ["24/7", "Customer Support"],
          ].map(([value, label]) => (
            <div key={label} className="px-4 text-center">
              <motion.p
                whileHover={{ scale: 1.08 }}
                className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl"
              >
                {value}
              </motion.p>

              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
                {label}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}