"use client";

import Link from "next/link";
import {
  ChevronDown,
  Heart,
  Menu,
  Search,
  ShoppingCart,
  UserRound,
} from "lucide-react";
import { useState } from "react";
import type { StoreConfig, NavItem } from "./Navbar";
import ThemeToggle from "../ui/ThemeToggle";
import Image from "next/image";

interface NavbarDesktopProps {
  store: StoreConfig;
  onMobileOpen: () => void;
}

const NavbarDesktop = ({
  store,
  onMobileOpen,
}: NavbarDesktopProps) => {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4">

      {/* Mobile Menu */}
      <button
        onClick={onMobileOpen}
        className="
          rounded-lg p-2
          text-black dark:text-white
          transition
          hover:bg-black/5 dark:hover:bg-white/10
          md:hidden
        "
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Logo */}
      <Link
        href="/"
        className="flex shrink-0 items-center gap-2"
      >
        {store.logo ? (
          <Image
            src={store.logo}
            alt={store.name}
            width={120}
            height={40}
            className="h-9 w-auto object-contain"
          />
        ) : (
          <div
            className="
              flex h-9 w-9 items-center justify-center
              rounded-xl
              bg-black text-white
              dark:bg-white dark:text-black
              font-bold
            "
          >
            S
          </div>
        )}

        <span
          className="
            hidden text-xl font-bold tracking-tight
            text-black dark:text-white
            sm:block
          "
        >
          {store.name}
        </span>
      </Link>

      {/* Navigation */}
      <nav className="hidden flex-1 items-center justify-center gap-1 md:flex">
        {store.navigation.map((item) => (
          <NavLink
            key={item._id}
            item={item}
          />
        ))}
      </nav>

      {/* Actions */}
      <div className="ml-auto flex items-center gap-1">

        {/* Search */}
        <button
          onClick={() => setSearchOpen((prev) => !prev)}
          className="
            rounded-lg p-2.5
            text-black dark:text-white
            transition
            hover:bg-black/5
            dark:hover:bg-white/10
          "
          aria-label="Search"
        >
          <Search className="h-5 w-5" />
        </button>

        {/* Wishlist */}
        <Link
          href="/account/wishlist"
          className="
            hidden rounded-lg p-2.5
            text-black dark:text-white
            transition
            hover:bg-black/5
            dark:hover:bg-white/10
            sm:block
          "
          aria-label="Wishlist"
        >
          <Heart className="h-5 w-5" />
        </Link>

        {/* Account */}
        <Link
          href="/account"
          className="
            hidden rounded-lg p-2.5
            text-black dark:text-white
            transition
            hover:bg-black/5
            dark:hover:bg-white/10
            sm:block
          "
          aria-label="Account"
        >
          <UserRound className="h-5 w-5" />
        </Link>

        {/* Cart */}
        <Link
          href="/cart"
          className="
            relative rounded-lg p-2.5
            text-black dark:text-white
            transition
            hover:bg-black/5
            dark:hover:bg-white/10
          "
          aria-label="Cart"
        >
          <ShoppingCart className="h-5 w-5" />

          <span
            className="
              absolute -right-0.5 -top-0.5
              flex h-4 min-w-4
              items-center justify-center
              rounded-full
              bg-black text-white
              dark:bg-white dark:text-black
              px-1 text-[10px] font-bold
            "
          >
            0
          </span>
        </Link>

        {/* Theme */}
        <ThemeToggle />
      </div>

      {/* Search Box */}
      {searchOpen && (
        <div
          className="
            absolute left-0 right-0 top-full
            border-b
            border-black/10 dark:border-white/10
            bg-white/95 dark:bg-black/95
            p-4
            shadow-lg
            backdrop-blur-xl
            md:hidden
          "
        >
          <form
            action="/search"
            className="mx-auto flex max-w-7xl items-center gap-2"
          >
            <div
              className="
                flex flex-1 items-center
                rounded-xl
                border
                border-black/10 dark:border-white/10
                bg-black/5 dark:bg-white/5
                px-3
              "
            >
              <Search
                className="
                  h-4 w-4
                  text-black/50
                  dark:text-white/50
                "
              />

              <input
                type="search"
                name="q"
                placeholder="Search products..."
                className="
                  h-11 w-full
                  bg-transparent
                  px-3
                  text-sm
                  text-black dark:text-white
                  placeholder:text-black/40
                  dark:placeholder:text-white/40
                  outline-none
                "
              />
            </div>

            <button
              type="submit"
              className="
                rounded-xl
                bg-black text-white
                dark:bg-white dark:text-black
                px-5 py-3
                text-sm font-medium
                transition
                hover:opacity-80
              "
            >
              Search
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

const NavLink = ({
  item,
}: {
  item: NavItem;
}) => {
  const [open, setOpen] = useState(false);

  if (!item.children?.length) {
    return (
      <Link
        href={item.href}
        className="
          rounded-lg px-3 py-2
          text-sm font-medium
          text-black/70 dark:text-white/70
          transition
          hover:bg-black/5
          hover:text-black
          dark:hover:bg-white/10
          dark:hover:text-white
        "
      >
        {item.label}
      </Link>
    );
  }

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        className="
          flex items-center gap-1
          rounded-lg px-3 py-2
          text-sm font-medium
          text-black/70 dark:text-white/70
          transition
          hover:bg-black/5
          hover:text-black
          dark:hover:bg-white/10
          dark:hover:text-white
        "
      >
        {item.label}

        <ChevronDown
          className={`
            h-4 w-4
            transition-transform
            ${open ? "rotate-180" : ""}
          `}
        />
      </button>

      {open && (
        <div className="absolute left-0 top-full w-56 pt-2">
          <div
            className="
              rounded-xl
              border
              border-black/10 dark:border-white/10
              bg-white/95 dark:bg-black/95
              p-2
              shadow-xl
              backdrop-blur-xl
            "
          >
            {item.children.map((child) => (
              <Link
                key={child._id}
                href={child.href}
                className="
                  block rounded-lg
                  px-3 py-2.5
                  text-sm
                  text-black/70 dark:text-white/70
                  transition
                  hover:bg-black/5
                  hover:text-black
                  dark:hover:bg-white/10
                  dark:hover:text-white
                "
              >
                {child.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NavbarDesktop;