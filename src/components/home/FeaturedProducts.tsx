// components/FeaturedProducts.tsx
"use client";

import { useState, useEffect } from "react";
import { Product } from "@/types/product";
import ProductCard from "../product/ProductCard";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/product/get-all-products?limit=8&sort=latest`);
        const data = await res.json();

        if (data.success) {
          setProducts(data.data);
        } else {
          setError(data.message || "Failed to fetch products.");
        }
      } catch (err) {
        console.error("Error fetching featured products:", err);
        setError("Something went wrong. Please check your internet connection or backend server.");
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-4 py-12 bg-white dark:bg-gray-950 transition-colors">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
          All Products
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Explore our complete collection of quality products.
        </p>
      </div>

      {/* Explore All Link Button */}
      <Link
        href="/collections"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-gray-900 hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 transition-colors shadow-sm"
      >
        Explore All
        <ArrowRight size={16} />
      </Link>
    </div>

      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="bg-gray-200 dark:bg-gray-800 animate-pulse h-80 rounded-lg shadow-sm"
            ></div>
          ))}
        </div>
      )}

  
      {error && !loading && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 p-6 rounded-lg text-center my-8">
          <p className="font-semibold text-lg mb-1">Oops! Failed to load products</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {!loading && !error && products.length === 0 && (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          No featured products available at the moment.
        </div>
      )}
      {!loading && !error && products.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}