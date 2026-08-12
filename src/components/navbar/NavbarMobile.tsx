"use client";

import Link from "next/link";
import {
  ChevronDown,
  Heart,
  Search,
  ShoppingCart,
  UserRound,
  X,
} from "lucide-react";
import { useState } from "react";
import type { StoreConfig, NavItem } from "./Navbar";
import ThemeToggle from "../ui/ThemeToggle";

interface NavbarMobileProps {
  store: StoreConfig;
  open: boolean;
  onClose: () => void;
}

const NavbarMobile = ({
  store,
  open,
  onClose,
}: NavbarMobileProps) => {
  const [expanded, setExpanded] = useState<string | null>(null);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] md:hidden">
      {/* Overlay */}
      <button
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        aria-label="Close menu"
      />

      {/* Drawer */}
      <aside className="relative flex h-full w-[85%] max-w-sm flex-col border-r bg-background shadow-2xl">
        {/* Header */}
        <div className="flex h-16 items-center justify-between border-b px-5">
          <Link
            href="/"
            onClick={onClose}
            className="flex items-center gap-2"
          >
            {store.logo ? (
              <img
                src={store.logo}
                alt={store.name}
                className="h-8 w-auto"
              />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary font-bold text-primary-foreground">
                S
              </div>
            )}

            <span className="font-bold">
              {store.name}
            </span>
          </Link>

          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-accent"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Search */}
        <div className="border-b p-4">
          <form
            action="/search"
            onSubmit={onClose}
            className="flex items-center rounded-xl border bg-muted/40 px-3"
          >
            <Search className="h-4 w-4 text-muted-foreground" />

            <input
              type="search"
              name="q"
              placeholder="Search products..."
              className="h-11 w-full bg-transparent px-3 text-sm outline-none"
            />
          </form>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
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
          </div>
        </nav>

        {/* Quick Links */}
        <div className="border-t p-4">
          <div className="grid grid-cols-3 gap-2">
            <Link
              href="/account"
              onClick={onClose}
              className="flex flex-col items-center gap-1 rounded-xl p-3 text-xs hover:bg-accent"
            >
              <UserRound className="h-5 w-5" />
              Account
            </Link>

            <Link
              href="/account/wishlist"
              onClick={onClose}
              className="flex flex-col items-center gap-1 rounded-xl p-3 text-xs hover:bg-accent"
            >
              <Heart className="h-5 w-5" />
              Wishlist
            </Link>

            <Link
              href="/cart"
              onClick={onClose}
              className="flex flex-col items-center gap-1 rounded-xl p-3 text-xs hover:bg-accent"
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
        className="block rounded-xl px-4 py-3 text-sm font-medium hover:bg-accent"
      >
        {item.label}
      </Link>
    );
  }

  const isOpen = expanded === item._id;

  return (
    <div>
      <button
        onClick={() =>
          setExpanded(isOpen ? null : item._id)
        }
        className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-medium hover:bg-accent"
      >
        {item.label}

        <ChevronDown
          className={`h-4 w-4 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="ml-4 border-l pl-3">
          {item.children?.map((child) => (
            <Link
              key={child._id}
              href={child.href}
              onClick={onClose}
              className="block rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
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