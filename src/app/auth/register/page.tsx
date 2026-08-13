"use client";

import Link from "next/link";
import {
  ChevronDown,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Phone,
  UserRound,
} from "lucide-react";
import { FormEvent, useState } from "react";
import { FaFacebook, FaGoogle } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/components/store/authStore";

type RegisterRole = "user" | "seller";

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [role, setRole] = useState<RegisterRole>("user");
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);

    try {
      const form = new FormData(e.currentTarget);

      const name = form.get("name")?.toString().trim();
      const email = form.get("email")?.toString().trim();
      const phone = form.get("phone")?.toString().trim();
      const password = form.get("password")?.toString();
      const selectedRole = form.get("role") as RegisterRole;

      const registerData = {
        name,
        email,
        phone,
        password,
        role: selectedRole,
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(registerData),
        },
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      console.log(data)
      useAuthStore.getState().setAuth(data.user, data.accessToken);

      alert("register successfully");
      router.push("/auth/signin");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = () => {
    console.log("Google Sign Up");
  };

  const handleFacebookSignUp = () => {
    console.log("Facebook Sign Up");
  };

  return (
    <main
      className="
        min-h-[calc(100vh-4rem)]
        bg-white
        px-4 py-10
        text-black
        transition-colors
        dark:bg-black
        dark:text-white
        sm:py-14
      "
    >
      <div className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-md items-center justify-center">
        <div className="w-full">
          {/* Heading */}
          <div className="mb-8 text-center">
            <div
              className="
                mx-auto mb-5
                flex h-14 w-14
                items-center justify-center
                rounded-2xl
                border border-black/10
                bg-black
                text-white
                shadow-sm
                dark:border-white/10
                dark:bg-white
                dark:text-black
              "
            >
              <UserRound className="h-6 w-6" />
            </div>

            <h1 className="text-3xl font-bold tracking-tight">
              Create your account
            </h1>

            <p className="mt-2 text-sm text-black/55 dark:text-white/55">
              Join ShopNest and start shopping today.
            </p>
          </div>

          {/* Card */}
          <div
            className="
              rounded-2xl
              border border-black/10
              bg-white
              p-5
              shadow-sm
              dark:border-white/10
              dark:bg-white/[0.03]
              sm:p-7
            "
          >
            {/* Social Buttons */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {/* Google */}
              <button
                type="button"
                onClick={handleGoogleSignUp}
                className="
                  flex h-11
                  items-center justify-center gap-2
                  rounded-xl
                  border border-black/10
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
                <FaGoogle className="h-4 w-4" />
                Google
              </button>

              {/* Facebook */}
              <button
                type="button"
                onClick={handleFacebookSignUp}
                className="
                  flex h-11
                  items-center justify-center gap-2
                  rounded-xl
                  border border-black/10
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
                <FaFacebook className="h-4 w-4" />
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

            {/* Register Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium"
                >
                  Full name
                </label>

                <div
                  className="
                    flex h-12 items-center
                    rounded-xl
                    border border-black/10
                    bg-black/[0.02]
                    px-3
                    transition
                    focus-within:border-black
                    dark:border-white/10
                    dark:bg-white/[0.03]
                    dark:focus-within:border-white
                  "
                >
                  <UserRound
                    className="
                      h-4 w-4 shrink-0
                      text-black/45
                      dark:text-white/45
                    "
                  />

                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    autoComplete="name"
                    placeholder="Enter your name"
                    className="
                      h-full w-full
                      bg-transparent
                      px-3
                      text-sm
                      text-black
                      outline-none
                      placeholder:text-black/35
                      dark:text-white
                      dark:placeholder:text-white/35
                    "
                  />
                </div>
              </div>

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
                    border border-black/10
                    bg-black/[0.02]
                    px-3
                    transition
                    focus-within:border-black
                    dark:border-white/10
                    dark:bg-white/[0.03]
                    dark:focus-within:border-white
                  "
                >
                  <Mail
                    className="
                      h-4 w-4 shrink-0
                      text-black/45
                      dark:text-white/45
                    "
                  />

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
                      text-black
                      outline-none
                      placeholder:text-black/35
                      dark:text-white
                      dark:placeholder:text-white/35
                    "
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label
                  htmlFor="phone"
                  className="mb-2 block text-sm font-medium"
                >
                  Phone number
                </label>

                <div
                  className="
                    flex h-12 items-center
                    rounded-xl
                    border border-black/10
                    bg-black/[0.02]
                    px-3
                    transition
                    focus-within:border-black
                    dark:border-white/10
                    dark:bg-white/[0.03]
                    dark:focus-within:border-white
                  "
                >
                  <Phone
                    className="
                      h-4 w-4 shrink-0
                      text-black/45
                      dark:text-white/45
                    "
                  />

                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    autoComplete="tel"
                    placeholder="+880 1XXXXXXXXX"
                    className="
                      h-full w-full
                      bg-transparent
                      px-3
                      text-sm
                      text-black
                      outline-none
                      placeholder:text-black/35
                      dark:text-white
                      dark:placeholder:text-white/35
                    "
                  />
                </div>
              </div>

              {/* Role */}
              <div>
                <label
                  htmlFor="role"
                  className="mb-2 block text-sm font-medium"
                >
                  Account type
                </label>

                <div
                  className="
                    relative flex h-12 items-center
                    rounded-xl
                    border border-black/10
                    bg-black/[0.02]
                    px-3
                    transition
                    focus-within:border-black
                    dark:border-white/10
                    dark:bg-white/[0.03]
                    dark:focus-within:border-white
                  "
                >
                  <UserRound
                    className="
                      h-4 w-4 shrink-0
                      text-black/45
                      dark:text-white/45
                    "
                  />

                  <select
                    id="role"
                    name="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value as RegisterRole)}
                    className="
                      h-full w-full
                      appearance-none
                      bg-transparent
                      px-3 pr-8
                      text-sm
                      text-black
                      outline-none
                      dark:text-white
                    "
                  >
                    <option
                      value="user"
                      className="bg-white text-black dark:bg-black dark:text-white"
                    >
                      User
                    </option>

                    <option
                      value="seller"
                      className="bg-white text-black dark:bg-black dark:text-white"
                    >
                      Seller
                    </option>
                  </select>

                  <ChevronDown
                    className="
                      pointer-events-none
                      absolute right-3
                      h-4 w-4
                      text-black/50
                      dark:text-white/50
                    "
                  />
                </div>

                <p className="mt-2 text-xs text-black/40 dark:text-white/40">
                  {role === "seller"
                    ? "Create an account to sell products on ShopNest."
                    : "Create an account to shop on ShopNest."}
                </p>
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium"
                >
                  Password
                </label>

                <div
                  className="
                    flex h-12 items-center
                    rounded-xl
                    border border-black/10
                    bg-black/[0.02]
                    px-3
                    transition
                    focus-within:border-black
                    dark:border-white/10
                    dark:bg-white/[0.03]
                    dark:focus-within:border-white
                  "
                >
                  <LockKeyhole
                    className="
                      h-4 w-4 shrink-0
                      text-black/45
                      dark:text-white/45
                    "
                  />

                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={6}
                    autoComplete="new-password"
                    placeholder="Create a password"
                    className="
                      h-full w-full
                      bg-transparent
                      px-3
                      text-sm
                      text-black
                      outline-none
                      placeholder:text-black/35
                      dark:text-white
                      dark:placeholder:text-white/35
                    "
                  />
                  <p className="text-red-500 text-sm mt-2">{error}</p>
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

                <p className="mt-2 text-xs text-black/40 dark:text-white/40">
                  Password must be at least 6 characters.
                </p>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="
                  mt-2
                  flex h-12 w-full
                  items-center justify-center
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
                {loading ? "Creating account..." : "Create Account"}
              </button>
            </form>

            {/* Sign In */}
            <p
              className="
                mt-6
                text-center
                text-sm
                text-black/55
                dark:text-white/55
              "
            >
              Already have an account?{" "}
              <Link
                href="/signin"
                className="
                  font-semibold
                  text-black
                  hover:underline
                  dark:text-white
                "
              >
                Sign In
              </Link>
            </p>
          </div>

          {/* Footer */}
          <p
            className="
              mt-6
              text-center
              text-xs
              text-black/40
              dark:text-white/40
            "
          >
            By creating an account, you agree to our{" "}
            <Link
              href="/terms"
              className="underline hover:text-black dark:hover:text-white"
            >
              Terms
            </Link>{" "}
            &{" "}
            <Link
              href="/privacy"
              className="underline hover:text-black dark:hover:text-white"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </main>
  );
};

export default RegisterPage;
