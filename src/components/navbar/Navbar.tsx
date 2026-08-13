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

const FALLBACK_STORE: StoreConfig = {
  name: "ShopNest",
  logo: "/logo.jpg",
  navigation: [
    { _id: "1", label: "Home", href: "/" },
    {_id: "2",label: "Collections",href: "/collections",
    },
    { _id: "6", label: "Featured", href: "/featured" },
    { _id: "7", label: "About", href: "/about" },
  ],
};

const Navbar = () => {
  const [store] = useState<StoreConfig | null>(FALLBACK_STORE);
  const [mobileOpen, setMobileOpen] = useState(false);


  

  if (!store) {
    return null;
  }

  return (
    <header
      className="sticky top-0 z-50
      border-b border-black/10 dark:border-white/10
      bg-white/90 dark:bg-black/90
      shadow-sm
      backdrop-blur-xl"
    >
      <NavbarDesktop store={store} onMobileOpen={() => setMobileOpen(true)} />

      <NavbarMobile
        store={store}
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />
    </header>
  );
};

export default Navbar;