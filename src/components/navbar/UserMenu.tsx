"use client";

import Link from "next/link";
import { LogOut, UserRound, Heart } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "../store/authStore";
import { GrDashboard } from "react-icons/gr";
import { useRouter } from "next/navigation";

const UserMenu = () => {
  const { user, logout } = useAuthStore();
  const router = useRouter()
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const role = user?.role;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  const handleLogout = async () => {
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`,
        {
          method: "POST",
          credentials: "include",
        }
      );
       router.push("/")
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      logout();
      setOpen(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Link
          href="/auth/signin"
          className="
            hidden rounded-xl border
            border-black/10 dark:border-white/10
            px-4 py-2
            text-sm font-medium
            text-black dark:text-white
            transition
            hover:bg-black/5
            dark:hover:bg-white/10
            sm:block
          "
        >
          Sign In
        </Link>

        <Link
          href="/auth/register"
          className="
            rounded-xl
            bg-black text-white
            dark:bg-white dark:text-black
            px-4 py-2
            text-sm font-medium
            transition
            hover:opacity-80
          "
        >
          Register
        </Link>
      </div>
    );
  }

  return (
    <div
      ref={menuRef}
      className="relative"
    >
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="
          flex items-center gap-2
          rounded-full
          p-1
          transition
          hover:bg-black/5
          dark:hover:bg-white/10
        "
        aria-label="Open profile menu"
      >
        {user.profileImage ? (
          <img
            src={user.profileImage}
            alt={user.name}
            className="
              h-9 w-9
              rounded-full
              object-cover
              ring-2
              ring-black/10
              dark:ring-white/10
            "
          />
        ) : (
          <div
            className="
              flex h-9 w-9
              items-center justify-center
              rounded-full
              bg-black text-white
              dark:bg-white dark:text-black
              text-sm font-bold
            "
          >
            {user.name.charAt(0).toUpperCase()}
          </div>
        )}
      </button>

      {open && (
        <div
          className="
            absolute right-0 top-12
            z-[100]
            w-60
            overflow-hidden
            rounded-2xl
            border
            border-black/10
            dark:border-white/10
            bg-white/95
            dark:bg-black/95
            shadow-2xl
            backdrop-blur-xl
          "
        >
          {/* User info */}
          <div
            className="
              border-b
              border-black/10
              dark:border-white/10
              px-4 py-4
            "
          >
            <p className="truncate font-semibold text-black dark:text-white">
              {user.name}
            </p>

            <p
              className="
                truncate
                text-xs
                text-black/50
                dark:text-white/50
              "
            >
              {user.email}
            </p>
          </div>

          <div className="p-2">
            <Link
              href="/account/profile"
              onClick={() => setOpen(false)}
              className="
                flex items-center gap-3
                rounded-xl
                px-3 py-2.5
                text-sm
                text-black/80
                dark:text-white/80
                transition
                hover:bg-black/5
                dark:hover:bg-white/10
              "
            >
              <UserRound className="h-4 w-4" />
              Profile
            </Link>

            <Link
              href={`/dashboard/${role}`}
              onClick={() => setOpen(false)}
              className="
                flex items-center gap-3
                rounded-xl
                px-3 py-2.5
                text-sm
                text-black/80
                dark:text-white/80
                transition
                hover:bg-black/5
                dark:hover:bg-white/10
              "
            >
              <GrDashboard className="h-4 w-4" />
              DashBoard
            </Link>
            <Link
              href="/account/wishlist"
              onClick={() => setOpen(false)}
              className="
                flex items-center gap-3
                rounded-xl
                px-3 py-2.5
                text-sm
                text-black/80
                dark:text-white/80
                transition
                hover:bg-black/5
                dark:hover:bg-white/10
              "
            >
              <Heart className="h-4 w-4" />
              Wishlist
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="
                flex w-full items-center gap-3
                rounded-xl
                px-3 py-2.5
                text-sm
                text-red-600
                transition
                hover:bg-red-500/10
              "
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;