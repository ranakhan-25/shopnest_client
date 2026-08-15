"use client";

import Link from "next/link";
import { ArrowLeft, Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import { FormEvent, useState } from "react";
import { FaFacebook } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/components/store/authStore";

const SignInPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { user } = useAuthStore();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const form = new FormData(e.currentTarget);

      const email = form.get("email");
      const password = form.get("password");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/signin`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ email, password }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Sign in failed");
      }

      useAuthStore.getState().setAuth(data.user, data.accessToken);

      alert("Sign in success:");
      router.push(`/dashboard`);
    } catch (error) {
      console.error("Sign in error:", error);
      setError(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    console.log("Google Sign In");
  };

  const handleFacebookSignIn = () => {
    console.log("Facebook Sign In");
  };

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-white px-4 py-10 text-black transition-colors dark:bg-black dark:text-white sm:py-16">
      <div className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-md items-center justify-center">
        <div className="w-full">
          {/* Top */}
          <div className="mb-8 flex items-center justify-between">
            <Link
              href="/"
              className="
                inline-flex items-center gap-2
                rounded-lg px-3 py-2
                text-sm font-medium
                text-black/70
                transition
                hover:bg-black/5
                hover:text-black
                dark:text-white/70
                dark:hover:bg-white/10
                dark:hover:text-white
              "
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>
          </div>

          {/* Heading */}
          <div className="mb-8 text-center">
            <div
              className="
                mx-auto mb-5
                flex h-14 w-14 items-center justify-center
                rounded-2xl
                border
                border-black/10
                bg-black text-white
                shadow-sm
                dark:border-white/10
                dark:bg-white
                dark:text-black
              "
            >
              <LockKeyhole className="h-6 w-6" />
            </div>

            <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>

            <p className="mt-2 text-sm text-black/55 dark:text-white/55">
              Sign in to continue to your ShopNest account.
            </p>
          </div>

          {/* Card */}
          <div
            className="
              rounded-2xl
              border
              border-black/10
              bg-white
              p-5
              shadow-sm
              dark:border-white/10
              dark:bg-white/[0.03]
              sm:p-7
            "
          >
            {/* Social Login */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="
                  flex h-11 items-center justify-center gap-2
                  rounded-xl
                  border
                  border-black/10
                  bg-white
                  text-sm font-medium
                  text-black
                  transition
                  hover:bg-black/[0.03]
                  dark:border-white/10
                  dark:bg-white/[0.05]
                  dark:text-white
                  dark:hover:bg-white/10
                "
              >
                <span className="text-base font-bold">G</span>
                Google
              </button>

              <button
                type="button"
                onClick={handleFacebookSignIn}
                className="
                  flex h-11 items-center justify-center gap-2
                  rounded-xl
                  border
                  border-black/10
                  bg-white
                  text-sm font-medium
                  text-black
                  transition
                  hover:bg-black/[0.03]
                  dark:border-white/10
                  dark:bg-white/[0.05]
                  dark:text-white
                  dark:hover:bg-white/10
                "
              >
                <FaFacebook className="h-4 w-4 fill-current" />
                Facebook
              </button>
            </div>

            {/* Divider */}
            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-black/10 dark:bg-white/10" />

              <span className="text-xs text-black/40 dark:text-white/40">
                OR
              </span>

              <div className="h-px flex-1 bg-black/10 dark:bg-white/10" />
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium"
                >
                  Email address
                </label>

                <div
                  className="
                    flex h-12 items-center
                    rounded-xl
                    border
                    border-black/10
                    bg-black/[0.02]
                    px-3
                    transition
                    focus-within:border-black
                    dark:border-white/10
                    dark:bg-white/[0.03]
                    dark:focus-within:border-white
                  "
                >
                  <Mail className="h-4 w-4 shrink-0 text-black/45 dark:text-white/45" />

                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="you@example.com"
                    className="
                      h-full w-full
                      bg-transparent
                      px-3
                      text-sm
                      outline-none
                      placeholder:text-black/35
                      dark:placeholder:text-white/35
                    "
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label htmlFor="password" className="text-sm font-medium">
                    Password
                  </label>

                  <Link
                    href="/forgot-password"
                    className="
                      text-xs font-medium
                      text-black/60
                      hover:text-black
                      dark:text-white/60
                      dark:hover:text-white
                    "
                  >
                    Forgot password?
                  </Link>
                </div>

                <div
                  className="
                    flex h-12 items-center
                    rounded-xl
                    border
                    border-black/10
                    bg-black/[0.02]
                    px-3
                    transition
                    focus-within:border-black
                    dark:border-white/10
                    dark:bg-white/[0.03]
                    dark:focus-within:border-white
                  "
                >
                  <LockKeyhole className="h-4 w-4 shrink-0 text-black/45 dark:text-white/45" />

                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    className="
                      h-full w-full
                      bg-transparent
                      px-3
                      text-sm
                      outline-none
                      placeholder:text-black/35
                      dark:placeholder:text-white/35
                    "
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="
                      rounded-lg p-1.5
                      text-black/45
                      transition
                      hover:bg-black/5
                      hover:text-black
                      dark:text-white/45
                      dark:hover:bg-white/10
                      dark:hover:text-white
                    "
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <p className="text-red-500 text-sm mt-2">{error}</p>
              {/* Sign In */}
              <button
                type="submit"
                disabled={loading}
                className="
                  flex h-12 w-full items-center justify-center
                  rounded-xl
                  bg-black
                  text-sm font-semibold
                  text-white
                  transition
                  hover:opacity-85
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                  dark:bg-white
                  dark:text-black
                "
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            {/* Register */}
            <p className="mt-6 text-center text-sm text-black/55 dark:text-white/55">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="
                  font-semibold
                  text-black
                  hover:underline
                  dark:text-white
                "
              >
                Create account
              </Link>
            </p>
          </div>

          {/* Footer */}
          <p className="mt-6 text-center text-xs text-black/40 dark:text-white/40">
            By continuing, you agree to our Terms & Privacy Policy.
          </p>
        </div>
      </div>
    </main>
  );
};

export default SignInPage;
