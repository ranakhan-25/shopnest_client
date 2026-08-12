"use client";

import { useEffect, useState } from "react";
import NavbarDesktop from "./NavbarDesktop";
import NavbarMobile from "./NavbarMobile";

export interface NavItem {
  _id: string;
  label: string;
  href: string;
  children?: NavItem[];
}

export interface StoreConfig {
  name: string;
  logo?: string;
  navigation: NavItem[];
}

const Navbar = () => {
  // const [store, setStore] = useState<StoreConfig | null>(null);
  // const [loading, setLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  // useEffect(() => {
  //   const fetchNavbar = async () => {
  //     try {
  //       const response = await fetch(
  //         `${process.env.NEXT_PUBLIC_API_URL}/api/store/navbar`,
  //         {
  //           cache: "no-store",
  //         }
  //       );

  //       if (!response.ok) {
  //         throw new Error("Failed to fetch navbar");
  //       }

  //       const data = await response.json();

  //       setStore(data.data);
  //     } catch (error) {
  //       console.error("Navbar API Error:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchNavbar();
  // }, []);
  const storeData: StoreConfig = {
  name: "ShopNest",
  logo: "/logo.jpg",

  navigation: [
    {
      _id: "1",
      label: "Home",
      href: "/",
    },
    {
      _id: "2",
      label: "Collections",
      href: "/collections",
      children: [
        {
          _id: "3",
          label: "New Arrivals",
          href: "/collections/new-arrivals",
        },
        {
          _id: "4",
          label: "Trending Now",
          href: "/collections/trending",
        },
        {
          _id: "5",
          label: "Best Sellers",
          href: "/collections/best-sellers",
        },
      ],
    },
    {
      _id: "6",
      label: "Featured",
      href: "/featured",
    },
    {
      _id: "7",
      label: "About",
      href: "/about",
    },
  ],
};

  // if (loading) {
  //   return (
  //     <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
  //       <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
  //         <div className="h-8 w-32 animate-pulse rounded-md bg-muted" />
  //         <div className="hidden h-8 w-80 animate-pulse rounded-md bg-muted md:block" />
  //         <div className="h-8 w-20 animate-pulse rounded-md bg-muted" />
  //       </div>
  //     </header>
  //   );
  // }

  if (!storeData) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50
    border-b border-black/10 dark:border-white/10
    bg-white/90 dark:bg-black/90
    shadow-sm
    backdrop-blur-xl
    supports-[backdrop-filter]:bg-white/75
    supports-[backdrop-filter]:dark:bg-black/75">
      <NavbarDesktop
        store={storeData}
        onMobileOpen={() => setMobileOpen(true)}
      />

      <NavbarMobile
        store={storeData}
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />
    </header>
  );
};

export default Navbar;