"use client";

import { motion } from "framer-motion";
import { Loader2, ShoppingBag } from "lucide-react";

export default function LoadingPage() {
  return (
    <div className="flex min-h-[70vh] w-full flex-col items-center justify-center bg-white dark:bg-black px-4 py-20">
      <div className="flex flex-col items-center text-center">
        {/* Animated Brand Logo / Icon Box */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-900 text-white shadow-lg dark:bg-white dark:text-gray-950"
        >
          <ShoppingBag size={28} />
        </motion.div>

        {/* Loading Spinner and Text */}
        <div className="mt-6 flex items-center gap-3">
          <Loader2 className="h-5 w-5 animate-spin text-gray-900 dark:text-white" />
          <h2 className="text-lg font-semibold tracking-tight text-gray-900 dark:text-white">
            Loading, please wait...
          </h2>
        </div>

        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          We are getting everything ready for you.
        </p>

        {/* Minimal Progress Bar Animation */}
        <div className="mt-6 h-1 w-36 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{
              repeat: Infinity,
              duration: 1.2,
              ease: "easeInOut",
            }}
            className="h-full w-full bg-gray-900 dark:bg-white"
          />
        </div>
      </div>
    </div>
  );
}