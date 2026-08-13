"use client";

import { motion } from "framer-motion";
import { MessageSquareQuote, Star } from "lucide-react";
import Image from "next/image";

const testimonials = [
  {
    id: 1,
    name: "Sarah Jenkins",
    role: "Verified Buyer",
    content:
      "ShopNest offers an incredible shopping experience! The delivery was lightning-fast and the product quality exceeded my expectations.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
    rating: 5,
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Tech Enthusiast",
    content:
      "I bought the MacBook Air M3 through a flash deal. The process was smooth, and customer support was extremely helpful when I had a query.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
    rating: 5,
  },
  {
    id: 3,
    name: "Jessica Taylor",
    role: "Fashion Blogger",
    content:
      "The collection is super modern and premium. Finding trendy accessories and clothes has never been this easy. Highly recommended!",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb",
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <section className="py-20 bg-white dark:bg-black">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-100 px-4 py-1.5 text-xs font-semibold text-gray-800 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200">
            <MessageSquareQuote size={14} />
            Customer Reviews
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            What Our Customers Say
          </h2>
          <p className="mt-3 text-sm text-gray-600 dark:text-gray-400 sm:text-base">
            Read trusted feedback from real shoppers who love our products and services.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {testimonials.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -6 }}
              className="flex flex-col justify-between rounded-2xl border border-gray-200 bg-gray-50 p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-8"
            >
              <div>
                {/* Rating Stars */}
                <div className="flex items-center gap-1 text-gray-900 dark:text-white">
                  {Array.from({ length: item.rating }).map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" />
                  ))}
                </div>

                {/* Content */}
                <p className="mt-4 text-sm leading-6 text-gray-600 dark:text-gray-300">
                  &ldquo;{item.content}&rdquo;
                </p>
              </div>

              {/* User Info */}
              <div className="mt-6 flex items-center gap-4 border-t border-gray-200 pt-4 dark:border-gray-800">
                <div className="relative h-12 w-12 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
                  <Image
                    src={item.avatar}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {item.name}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {item.role}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}