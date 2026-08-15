"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Briefcase,
  Camera,
  Glasses,
  Laptop,
  Shirt,
  Smartphone,
  Watch,
  Box,
} from "lucide-react";
import { useEffect, useState } from "react";

import type { Product } from "@/types/product";

const API = `${process.env.NEXT_PUBLIC_API_URL}/api/product/get-all-products`;

const categoryIcons = {
  watches: Watch,
  bags: Briefcase,
  laptops: Laptop,
  cameras: Camera,
  fashion: Shirt,
  shoes: Box,
  accessories: Glasses,
  electronics: Smartphone,
  default: Box,
};


const categoryImages: Record<string, string> = {
  watches: "https://images.unsplash.com/photo-1524805444758-089113d48a6d",
  bags: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62",
  laptops: "https://images.unsplash.com/photo-1517336714739-489689fd1ca8",
  cameras: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32",
  fashion: "https://images.unsplash.com/photo-1551028719-00167b16eac5",
  shoes: "https://images.unsplash.com/photo-1552346154-21d32810aba3",
  accessories: "https://images.unsplash.com/photo-1511499767150-a48a237f0083",
  electronics: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9",
  default: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
};

const getCategoryIcon = (category: string) => {
  const key = category.toLowerCase().trim();

  if (key.includes("watch")) return categoryIcons.watches;
  if (key.includes("bag")) return categoryIcons.bags;
  if (key.includes("laptop")) return categoryIcons.laptops;
  if (key.includes("camera")) return categoryIcons.cameras;
  if (key.includes("fashion") || key.includes("clothing")) return categoryIcons.fashion;
  if (key.includes("shoe")) return categoryIcons.shoes;
  if (key.includes("accessor")) return categoryIcons.accessories;
  if (key.includes("electronic")) return categoryIcons.electronics;

  return categoryIcons.default;
};

const getCategoryImage = (category: string) => {
  const key = category.toLowerCase().trim();

  for (const [catKey, imgUrl] of Object.entries(categoryImages)) {
    if (key.includes(catKey)) {
      return imgUrl;
    }
  }

  return categoryImages.default;
};

export default function Categories() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(API);

        if (!res.ok) {
          throw new Error("Failed to fetch products");
        }

        const result = await res.json();

        const productList = result?.data;
        setProducts(Array.isArray(productList) ? productList : []);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Something went wrong",
        );
      } finally {
        setLoading(false);
      }
    };

    getProducts();
  }, []);

  const categories = [...new Set(products.map((product) => product.category))];

  if (loading) {
    return (
      <section className="py-16 dark:bg-black">
        <div className="container mx-auto px-4">
          <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div className="w-full">
              <div className="h-5 w-40 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
              <div className="mt-3 h-10 w-64 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-800" />
              <div className="mt-4 h-5 w-full max-w-2xl animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
            </div>
            <div className="h-5 w-36 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6"
              >
                <div className="h-12 w-12 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-800" />
                <div className="mt-5 h-6 w-28 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
                <div className="mt-3 h-4 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 dark:bg-black">
        <div className="container mx-auto px-4">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center dark:border-red-900/50 dark:bg-red-950/30">
            <h3 className="text-lg font-semibold text-red-700 dark:text-red-400">
              Failed to Load Categories
            </h3>
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
              {error}
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (categories.length === 0) {
    return (
      <section className="py-16 dark:bg-black">
        <div className="container mx-auto px-4">
          <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-6 py-12 text-center dark:border-gray-700 dark:bg-gray-900">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              No Categories Available
            </h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Categories will appear here when products are available.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 dark:bg-black">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <span className="text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-gray-100">
              Explore Collection
            </span>

            <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Shop by Category
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-600 dark:text-gray-400 sm:text-base">
              Explore our wide range of products and find exactly what you are
              looking for.
            </p>
          </div>

          <Link
            href="/collections"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-gray-900 transition hover:text-gray-700 dark:text-gray-100 dark:hover:text-gray-300"
          >
            View All Products
            <ArrowRight
              size={17}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((category) => {
            const Icon = getCategoryIcon(category);
            const categoryImage = getCategoryImage(category);

            return (
              <Link
                key={category}
                href={`/collections?category=${encodeURIComponent(category)}`}
                className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-gray-400 hover:shadow-xl dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-600 sm:p-6"
              >
                {/* Background Image with Overlay for Visual Depth */}
                <div className="absolute inset-0 z-0 overflow-hidden opacity-15 transition-transform duration-500 group-hover:scale-110 dark:opacity-10">
                  <Image
                    src={categoryImage}
                    alt={category}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="relative z-10">
                  {/* Icon */}
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-gray-900 shadow-sm transition duration-300 group-hover:scale-110 group-hover:bg-gray-900 group-hover:text-white dark:bg-gray-800 dark:text-gray-200 dark:group-hover:bg-white dark:group-hover:text-gray-950">
                    <Icon size={24} />
                  </div>

                  {/* Category Name */}
                  <h3 className="mt-5 text-base font-semibold capitalize text-gray-900 dark:text-white sm:text-lg">
                    {category}
                  </h3>

                  {/* Explore */}
                  <div className="mt-2 flex items-center gap-1 text-sm font-medium text-gray-500 transition group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white">
                    Explore
                    <ArrowRight
                      size={15}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}