"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Lock, LogIn, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Unauthorized() {
  const router = useRouter();

  return (
    <section className="flex min-h-[80vh] w-full items-center justify-center bg-white dark:bg-black px-4 py-20">
      <div className="mx-auto max-w-md text-center">
        {/* Animated Icon Container */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl border border-gray-200 bg-gray-50 text-gray-900 shadow-sm dark:border-gray-800 dark:bg-gray-900 dark:text-white"
        >
          <Lock size={36} />
        </motion.div>

        {/* Badge */}
        <div className="mt-6 inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-3.5 py-1 text-xs font-semibold text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
          <ShieldAlert size={14} />
          Access Denied
        </div>

        {/* Heading */}
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
          Unauthorized Access
        </h1>

        {/* Description */}
        <p className="mt-3 text-sm text-gray-600 dark:text-gray-400 sm:text-base">
          You do not have permission to view this page. Please log in with the appropriate account or return to safety.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          {/* Login Button */}
          <Link
            href="/auth/signin"
            className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-gray-950 px-6 py-3.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-gray-800 dark:bg-white dark:text-gray-950 dark:hover:bg-gray-200"
          >
            <LogIn size={16} /> Login to Account
          </Link>

          {/* Go Back / Home Button */}
          <button
            onClick={() => router.back()}
            className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-gray-200 bg-transparent px-6 py-3.5 text-sm font-semibold text-gray-900 transition-all hover:bg-gray-50 dark:border-gray-800 dark:text-white dark:hover:bg-gray-900"
          >
            <ArrowLeft size={16} /> Go Back
          </button>
        </div>
      </div>
    </section>
  );
}