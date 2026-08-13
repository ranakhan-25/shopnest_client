"use client";

import Link from "next/link";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaGithub,
  FaLinkedinIn,
} from "react-icons/fa";

import {
  Mail,
  MapPin,
  Phone,
  ShoppingBag,
} from "lucide-react";
import FooterSocialLinks from "./FooterSocialLinks";
import FooterBottom from "./FooterButtom";

const quickLinks = [
    { _id: "1", name: "Home", href: "/" },
    {_id: "2",name: "Collections",href: "/collections",
    },
    { _id: "6", name: "Featured", href: "/featured" },
    { _id: "7", name: "About", href: "/about" },
  ]

const supportLinks = [
  { name: "Contact Us", href: "/contact" },
  { name: "FAQ", href: "/faq" },
  { name: "Privacy Policy", href: "/privacy" },
  { name: "Terms & Conditions", href: "/terms" },
];

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950">

      {/* Main Footer */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-2xl font-bold text-gray-900 dark:text-white"
            >
              <img src="./logo.jpg" alt="logo" className="max-w-10" />

              ShopNest
            </Link>

            <p className="mt-4 max-w-sm text-sm leading-6 text-gray-600 dark:text-gray-400">
              Discover quality products at amazing prices. Shop smarter,
              discover more, and enjoy a simple online shopping experience.
            </p>

            {/* Social Links */}
            <div className="mt-6 flex items-center gap-2">
              <Link
                href="#"
                aria-label="Facebook"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:border-blue-600 hover:bg-blue-600 hover:text-white dark:border-gray-800 dark:text-gray-400 dark:hover:border-blue-600 dark:hover:bg-blue-600 dark:hover:text-white"
              >
                <FaFacebookF size={17} />
              </Link>

              <Link
                href="#"
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:border-blue-600 hover:bg-blue-600 hover:text-white dark:border-gray-800 dark:text-gray-400 dark:hover:border-blue-600 dark:hover:bg-blue-600 dark:hover:text-white"
              >
                <FaInstagram size={17} />
              </Link>

              <Link
                href="#"
                aria-label="Twitter"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:border-blue-600 hover:bg-blue-600 hover:text-white dark:border-gray-800 dark:text-gray-400 dark:hover:border-blue-600 dark:hover:bg-blue-600 dark:hover:text-white"
              >
                <FaTwitter size={17} />
              </Link>

              <Link
                href="#"
                aria-label="GitHub"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:border-blue-600 hover:bg-blue-600 hover:text-white dark:border-gray-800 dark:text-gray-400 dark:hover:border-blue-600 dark:hover:bg-blue-600 dark:hover:text-white"
              >
                <FaGithub size={17} />
              </Link>

              <Link
                href="#"
                aria-label="LinkedIn"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:border-blue-600 hover:bg-blue-600 hover:text-white dark:border-gray-800 dark:text-gray-400 dark:hover:border-blue-600 dark:hover:bg-blue-600 dark:hover:text-white"
              >
                <FaLinkedinIn size={17} />
              </Link>
            </div>
          </div>

          <FooterSocialLinks quickLinks={quickLinks} supportLinks={supportLinks} />

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-white">
              Contact Us
            </h3>

            <div className="mt-5 space-y-4">

              <div className="flex items-start gap-3">
                <MapPin
                  size={18}
                  className="mt-0.5 shrink-0 text-blue-600"
                />

                <p className="text-sm leading-5 text-gray-600 dark:text-gray-400">
                  Mymensingh, Bangladesh
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Mail
                  size={18}
                  className="shrink-0 text-blue-600"
                />

                <a
                  href="mailto:hello@shopnest.com"
                  className="text-sm text-gray-600 transition hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                >
                  hello@shopnest.com
                </a>
              </div>

              <div className="flex items-center gap-3">
                <Phone
                  size={18}
                  className="shrink-0 text-blue-600"
                />

                <a
                  href="tel:+8801000000000"
                  className="text-sm text-gray-600 transition hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                >
                  +880 1000-000000
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <FooterBottom/>
    </footer>
  );
}