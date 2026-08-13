"use client"
import Link from "next/link";
import { ArrowLeft, Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center dark:text-white dark:bg-:black px-6">
      <div className="w-full max-w-xl text-center">
        <p className="text-8xl font-extrabold tracking-tight text-primary">
          404
        </p>

        <h1 className="mt-6 text-3xl font-bold">Page Not Found</h1>

        <p className="mt-3 text-muted-foreground">
          Sorry, the page you are looking for does not exist or may have been
          moved.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90"
          >
            <Home size={18} />
            Go Home
          </Link>

          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 rounded-lg border px-5 py-3 text-sm font-medium transition hover:bg-muted"
          >
            <ArrowLeft size={18} />
            Go Back
          </button>
        </div>
      </div>
    </main>
  );
}
