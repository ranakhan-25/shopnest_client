"use client";

import type { ComponentType, SVGProps } from "react";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import {
  House,
  ShoppingCart,
  Heart,
  Person,
  Gear,
  CreditCard,
  Cube,
  ArrowRightFromSquare,
} from "@gravity-ui/icons";

import { useAuthStore } from "@/components/store/authStore";
import { ChartArea, Package, Users } from "lucide-react";

type IconType = ComponentType<SVGProps<SVGSVGElement>>;

interface MenuItem {
  label: string;
  href: string;
  icon: IconType;
  exact?: boolean;
}

/* =========================
   User Menu
========================= */

const userMenu: MenuItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard/user",
    icon: House,
    exact: true,
  },
  {
    label: "My Orders",
    href: "/dashboard/user/orders",
    icon: ShoppingCart,
  },
  {
    label: "Wishlist",
    href: "/dashboard/user/wishlist",
    icon: Heart,
  },
  {
    label: "Profile",
    href: "/dashboard/user/profile",
    icon: Person,
  },
  {
    label: "Settings",
    href: "/dashboard/user/settings",
    icon: Gear,
  },
];

/* =========================
   Seller Menu
========================= */

const sellerMenu: MenuItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard/seller",
    icon: House,
    exact: true,
  },
  {
    label: "Products",
    href: "/dashboard/seller/products",
    icon: Package,
  },
  {
    label: "Orders",
    href: "/dashboard/seller/orders",
    icon: ShoppingCart,
  },
  {
    label: "Customers",
    href: "/dashboard/seller/customers",
    icon: Users,
  },
  {
    label: "Analytics",
    href: "/dashboard/seller/analytics",
    icon: ChartArea,
  },
  {
    label: "Payments",
    href: "/dashboard/seller/payments",
    icon: CreditCard,
  },
  {
    label: "Settings",
    href: "/dashboard/seller/settings",
    icon: Gear,
  },
];

/* =========================
   Admin Menu
========================= */

const adminMenu: MenuItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard/admin",
    icon: House,
    exact: true,
  },
  {
    label: "Products",
    href: "/dashboard/admin/products",
    icon: Package,
  },
  {
    label: "Orders",
    href: "/dashboard/admin/orders",
    icon: ShoppingCart,
  },
  {
    label: "Users",
    href: "/dashboard/admin/users",
    icon: Users,
  },
  {
    label: "Sellers",
    href: "/dashboard/admin/sellers",
    icon: Person,
  },
  {
    label: "Categories",
    href: "/dashboard/admin/categories",
    icon: Cube,
  },
  {
    label: "Analytics",
    href: "/dashboard/admin/analytics",
    icon: ChartArea,
  },
  {
    label: "Settings",
    href: "/dashboard/admin/settings",
    icon: Gear,
  },
];

/* =========================
   Get Menu By Role
========================= */

const getMenuByRole = (role?: string): MenuItem[] => {
  switch (role) {
    case "admin":
      return adminMenu;

    case "seller":
      return sellerMenu;

    default:
      return userMenu;
  }
};

/* =========================
   Sidebar Desktop
========================= */

export default function SidebarDesktop() {
  const pathname = usePathname();
  const router = useRouter();

  const { user, logout } = useAuthStore();

  const menuItems = getMenuByRole(user?.role);

  /* =========================
     Logout
  ========================= */

  const handleLogout = () => {
    logout();
    router.replace("/auth/signin");
  };

  return (
    <aside
      className="
        sticky top-0 hidden h-screen w-64 shrink-0
        border-r border-gray-200
        bg-white text-gray-900
        dark:border-gray-800
        dark:bg-black dark:text-white
        lg:block
      "
    >
      <div className="flex h-full flex-col">

        {/* =========================
            User Profile
        ========================= */}

        <div
          className="
            border-b border-gray-200
            p-4
            dark:border-gray-800
          "
        >
          <div
            className="
              flex items-center gap-3
              rounded-xl
              bg-gray-100
              p-3
              dark:bg-gray-900
            "
          >
            {/* Avatar */}

            <div
              className="
                flex h-10 w-10 shrink-0
                items-center justify-center
                rounded-full
                bg-black
                text-sm font-bold
                text-white
                dark:bg-white
                dark:text-black
              "
            >
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </div>

            {/* User Info */}

            <div className="min-w-0">
              <p
                className="
                  truncate
                  text-sm font-semibold
                  text-gray-900
                  dark:text-white
                "
              >
                {user?.name || "User"}
              </p>

              <p
                className="
                  truncate
                  text-xs capitalize
                  text-gray-500
                  dark:text-gray-400
                "
              >
                {user?.role || "user"}
              </p>
            </div>
          </div>
        </div>

        {/* =========================
            Navigation
        ========================= */}

        <nav
          className="
            flex-1
            space-y-1
            overflow-y-auto
            p-3
          "
        >
          {menuItems.map((item) => {
            const Icon = item.icon;

            /*
             * Dashboard:
             * exact route only
             *
             * Other routes:
             * nested route also active
             */

            const isActive = item.exact
              ? pathname === item.href
              : pathname === item.href ||
                pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  group
                  flex items-center gap-3
                  rounded-xl
                  px-3 py-2.5
                  text-sm font-medium
                  transition-all duration-200

                  ${
                    isActive
                      ? `
                        bg-black
                        text-white
                        shadow-sm
                        dark:bg-white
                        dark:text-black
                      `
                      : `
                        text-gray-600
                        hover:bg-gray-100
                        hover:text-gray-900

                        dark:text-gray-400
                        dark:hover:bg-gray-900
                        dark:hover:text-white
                      `
                  }
                `}
              >
                <Icon
                  className={`
                    size-5 shrink-0
                    transition-colors

                    ${
                      isActive
                        ? `
                          text-white
                          dark:text-black
                        `
                        : `
                          text-gray-500
                          group-hover:text-gray-900

                          dark:text-gray-500
                          dark:group-hover:text-white
                        `
                    }
                  `}
                />

                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* =========================
            Logout
        ========================= */}

        <div
          className="
            border-t border-gray-200
            p-3
            dark:border-gray-800
          "
        >
          <button
            type="button"
            onClick={handleLogout}
            className="
              flex w-full
              items-center gap-3
              rounded-xl
              px-3 py-2.5
              text-sm font-medium

              text-red-600
              transition-colors
              hover:bg-red-50

              dark:text-red-400
              dark:hover:bg-red-950/40
            "
          >
            <ArrowRightFromSquare className="size-5" />

            <span>Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
}