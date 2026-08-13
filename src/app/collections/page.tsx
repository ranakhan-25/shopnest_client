"use client";

import { useState, useEffect } from "react";
import { Product, PaginationData } from "@/types/product";

import ProductGrid from "@/components/product/ProductGrid";
import ProductSearchFilteringSorting from "@/components/product/ProductSearchFilteringSorting";
import ProductPagination from "@/components/product/ProductPagination";
import ProductsBanner from "@/components/product/ProductsBanner";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const [search, setSearch] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [sort, setSort] = useState<string>("");
  const [page, setPage] = useState<number>(1);


  const fetchProducts = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: "12",
        ...(search && { search }),
        ...(category && { category }),
        ...(sort && { sort }),
      });

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/product/get-all-products?${queryParams}`,
      );
      const data = await res.json();

      if (data.success) {
        setProducts(data.data.products);
        setPagination(data.data.pagination);
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadProducts = async () => {
      await fetchProducts();
    };
    loadProducts();
  }, [page, search, category, sort]);

  return (
    <>
      <ProductsBanner />
      <div className="max-w-7xl mx-auto px-4 py-8 bg-white dark:bg-gray-900 min-h-screen transition-colors duration-300">
        <h1 className="text-3xl font-bold mb-6 mt-5 text-gray-900 dark:text-white">
          Our Products
        </h1>

        <ProductSearchFilteringSorting
          search={search}
          setSearch={setSearch}
          category={category}
          setCategory={setCategory}
          sort={sort}
          setSort={setSort}
          setPage={setPage}
        />

        <ProductGrid products={products} loading={loading} />

        {pagination && (
          <ProductPagination pagination={pagination} setPage={setPage} />
        )}
      </div>
    </>
  );
}
