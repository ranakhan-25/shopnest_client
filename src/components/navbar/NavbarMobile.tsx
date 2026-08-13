"use client";

import Link from "next/link";
import {
  ChevronDown,
  Heart,
  LogOut,
  Search,
  ShoppingCart,
  UserRound,
  X,
} from "lucide-react";
import { useState } from "react";
import type { StoreConfig, NavItem } from "./Navbar";
import ThemeToggle from "../ui/ThemeToggle";
import { useAuthStore } from "../store/authStore";

interface NavbarMobileProps {
  store: StoreConfig;
  open: boolean;
  onClose: () => void;
}

const NavbarMobile = ({ store, open, onClose }: NavbarMobileProps) => {
  const { user, logout } = useAuthStore();
  const [expanded, setExpanded] = useState<string | null>(null);

  if (!open) return null;

  const handleLogout = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      logout();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] lg:hidden">
      {/* Overlay */}
      <div
        onClick={onClose}
        className="
          absolute inset-0
          bg-black/40
          dark:bg-black/70
          backdrop-blur-[2px]
        "
      />

      {/* Drawer */}
      <aside
        className="
          absolute left-0 top-0
          flex h-dvh
          w-[85vw] max-w-[390px]
          flex-col
          overflow-hidden

          border-r
          border-black/10
          bg-white
          text-black
          shadow-2xl

          dark:border-white/10
          dark:bg-black
          dark:text-white
        "
      >
        {/* Header */}
        <div
          className="
            flex h-16 shrink-0
            items-center justify-between
            border-b
            border-black/10
            bg-white
            px-5

            dark:border-white/10
            dark:bg-black
          "
        >
          <Link href="/" onClick={onClose} className="flex items-center gap-2">
            {store.logo ? (
              <img
                src={store.logo}
                alt={store.name}
                className="h-8 w-auto object-contain"
              />
            ) : (
              <div
                className="
                  flex h-8 w-8
                  items-center justify-center
                  rounded-lg
                  bg-black
                  text-sm font-bold text-white
                  dark:bg-white
                  dark:text-black
                "
              >
                S
              </div>
            )}

            <span className="font-bold text-black dark:text-white">
              {store.name}
            </span>
          </Link>

          <button
            type="button"
            onClick={onClose}
            className="
              rounded-lg p-2
              text-black
              hover:bg-black/5

              dark:text-white
              dark:hover:bg-white/10
            "
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>


        {/* Navigation */}
        <nav
          className="
            min-h-0
            flex-1
            overflow-y-auto
            bg-white
            p-4

            dark:bg-black
          "
        >
          <div className="space-y-1">
            {store.navigation.map((item) => (
              <MobileNavItem
                key={item._id}
                item={item}
                expanded={expanded}
                setExpanded={setExpanded}
                onClose={onClose}
              />
            ))}
            {
              user && <Link className="
                block rounded-lg
                px-3 py-2.5
                text-sm
                text-black/70
                hover:bg-black/5
                hover:text-black

                dark:text-white/70
                dark:hover:bg-white/10
                dark:hover:text-white
              " href={`dashboard`}>Dashboard</Link>
            }
          </div>
        </nav>

        {/* Bottom */}
        <div
          className="
            shrink-0
            border-t
            border-black/10
            bg-white
            p-4

            dark:border-white/10
            dark:bg-black
          "
        >
          {/* Auth */}
          {user ? (
            <div className="mb-4 flex items-center justify-between gap-2 rounded-xl border border-black/10 p-3 dark:border-white/10">
              <div className="flex min-w-0 items-center gap-2">
                {user.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt={user.name}
                    className="h-9 w-9 shrink-0 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-black text-sm font-semibold text-white dark:bg-white dark:text-black">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{user.name}</p>
                  <p className="truncate text-xs text-black/50 dark:text-white/50">
                    {user.email}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="
                  flex h-9 w-9 shrink-0 items-center justify-center
                  rounded-lg
                  text-black/60
                  hover:bg-black/5 hover:text-black

                  dark:text-white/60
                  dark:hover:bg-white/10 dark:hover:text-white
                "
                aria-label="Log out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="mb-4 grid grid-cols-2 gap-2">
              <Link
                href="/auth/signin"
                onClick={onClose}
                className="
                  flex h-11
                  items-center justify-center
                  rounded-xl
                  border
                  border-black/10
                  text-sm font-semibold
                  text-black
                  hover:bg-black/5

                  dark:border-white/10
                  dark:text-white
                  dark:hover:bg-white/10
                "
              >
                Sign In
              </Link>

              <Link
                href="/auth/register"
                onClick={onClose}
                className="
                  flex h-11
                  items-center justify-center
                  rounded-xl
                  bg-black
                  text-sm font-semibold
                  text-white
                  hover:opacity-80

                  dark:bg-white
                  dark:text-black
                "
              >
                Register
              </Link>
            </div>
          )}

          {/* Quick links */}
          <div className="grid grid-cols-3 gap-2">
            <Link
              href="/account/profile"
              onClick={onClose}
              className="
                flex flex-col items-center gap-1
                rounded-xl p-3
                text-xs
                text-black/70
                hover:bg-black/5

                dark:text-white/70
                dark:hover:bg-white/10
              "
            >
              <UserRound className="h-5 w-5" />
              Profile
            </Link>

            <Link
              href="/account/wishlist"
              onClick={onClose}
              className="
                flex flex-col items-center gap-1
                rounded-xl p-3
                text-xs
                text-black/70
                hover:bg-black/5

                dark:text-white/70
                dark:hover:bg-white/10
              "
            >
              <Heart className="h-5 w-5" />
              Wishlist
            </Link>

            <Link
              href="/cart"
              onClick={onClose}
              className="
                flex flex-col items-center gap-1
                rounded-xl p-3
                text-xs
                text-black/70
                hover:bg-black/5

                dark:text-white/70
                dark:hover:bg-white/10
              "
            >
              <ShoppingCart className="h-5 w-5" />
              Cart
            </Link>
          </div>

          <div className="mt-3 flex justify-end">
            <ThemeToggle />
          </div>
        </div>
      </aside>
    </div>
  );
};

interface MobileNavItemProps {
  item: NavItem;
  expanded: string | null;
  setExpanded: (id: string | null) => void;
  onClose: () => void;
}

const MobileNavItem = ({
  item,
  expanded,
  setExpanded,
  onClose,
}: MobileNavItemProps) => {
  const hasChildren = Boolean(item.children?.length);

  if (!hasChildren) {
    return (
      <Link
        href={item.href}
        onClick={onClose}
        className="
          block
          rounded-xl
          px-4 py-3
          text-sm font-medium
          text-black
          hover:bg-black/5

          dark:text-white
          dark:hover:bg-white/10
        "
      >
        {item.label}
      </Link>
    );
  }

  const isOpen = expanded === item._id;

  return (
    <div>
      <button
        type="button"
        onClick={() => setExpanded(isOpen ? null : item._id)}
        className="
          flex w-full
          items-center justify-between
          rounded-xl
          px-4 py-3
          text-sm font-medium
          text-black
          hover:bg-black/5

          dark:text-white
          dark:hover:bg-white/10
        "
      >
        {item.label}

        <ChevronDown
          className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div
          className="
            ml-4
            border-l
            border-black/10
            pl-3

            dark:border-white/10
          "
        >
          {item.children?.map((child) => (
            <Link
              key={child._id}
              href={child.href}
              onClick={onClose}
              className="
                block rounded-lg
                px-3 py-2.5
                text-sm
                text-black/70
                hover:bg-black/5
                hover:text-black

                dark:text-white/70
                dark:hover:bg-white/10
                dark:hover:text-white
              "
            >
              {child.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default NavbarMobile;