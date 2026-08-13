"use client";

import { motion } from "framer-motion";
import { Mail, Sparkles } from "lucide-react";
import { FormEvent, useState } from "react";
import NewsLetterForm from "./NewsLetterForm";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email.trim()) return;

    setSubscribed(true);
    setEmail("");
  };

  return (
    <section className="relative overflow-hidden bg-white py-16 dark:bg-gray-950 sm:py-20">
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
        className="absolute -left-32 -top-32 h-72 w-72 rounded-full bg-gray-500/10 blur-3xl dark:bg-white/5"
      />

      <motion.div
        animate={{
          x: [0, -40, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-gray-500/10 blur-3xl dark:bg-white/5"
      />

      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl border border-gray-200 bg-gradient-to-br from-gray-50 via-white to-gray-100 px-5 py-12 text-center shadow-sm dark:border-gray-800 dark:from-gray-900 dark:via-gray-900 dark:to-gray-950 sm:px-10 sm:py-16"
        >
          {/* Decorative Circles */}
          <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full border border-gray-300/50 dark:border-gray-700/30" />
          <div className="absolute -bottom-20 -left-16 h-48 w-48 rounded-full border border-gray-300/50 dark:border-gray-700/30" />

          {/* Icon */}
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="relative mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-900 text-white shadow-lg shadow-gray-900/20 dark:bg-white dark:text-gray-950"
          >
            <Mail size={25} />

            <motion.span
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.5, 0, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
              className="absolute inset-0 rounded-2xl border-2 border-gray-900 dark:border-white"
            />
          </motion.div>

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white/70 px-4 py-2 text-xs font-semibold text-gray-800 backdrop-blur dark:border-gray-800 dark:bg-gray-900/70 dark:text-gray-200"
          >
            <Sparkles size={14} />
            Stay in the Loop
          </motion.div>

          {/* Heading */}
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.25 }}
            className="relative mt-5 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl"
          >
            Get the Latest{" "}
            <span className="text-gray-900 dark:text-white underline decoration-gray-400 dark:decoration-gray-600 underline-offset-8">
              Deals & Updates
            </span>
          </motion.h2>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="relative mx-auto mt-4 max-w-2xl text-sm leading-6 text-gray-600 dark:text-gray-400 sm:text-base"
          >
            Subscribe to our newsletter and be the first to know about new
            products, exclusive offers, discounts and special deals.
          </motion.p>

          {/* Form / Success */}
          <NewsLetterForm
            subscribed={subscribed}
            handleSubmit={handleSubmit}
            email={email}
            setEmail={setEmail}
          />

          {/* Small Text */}
          <p className="relative mt-4 text-xs text-gray-500 dark:text-gray-500">
            No spam. Unsubscribe anytime.
          </p>
        </motion.div>
      </div>
    </section>
  );
}