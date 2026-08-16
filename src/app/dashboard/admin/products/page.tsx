"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Package,
  RefreshCw,
  ShoppingBag,
  Boxes,
} from "lucide-react";

import { apiFetch } from "@/lib/apiClient";
import type { Product } from "@/types/product";

interface Pagination {
  currentPage: number;
  limit: number;
  totalProducts: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ProductResponse {
  success: boolean;
  message: string;
  data: Product[];
  pagination: Pagination;
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [deletingId, setDeletingId] = useState<string | null>(null);

  /* =========================
     FETCH PRODUCTS
  ========================= */

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const query = new URLSearchParams({
        page: currentPage.toString(),
        limit: "12",
      });

      if (searchValue.trim()) {
        query.set("search", searchValue.trim());
      }

      const res = await apiFetch(`/api/admin/products?${query.toString()}`);

      const result: ProductResponse = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Failed to fetch products");
      }

      setProducts(Array.isArray(result.data) ? result.data : []);

      setPagination(result.pagination || null);
    } catch (error) {
      console.error("Fetch products error:", error);

      setError(error instanceof Error ? error.message : "Something went wrong");

      setProducts([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      fetchProducts();
    }
    fetchData()
  }, [searchValue, currentPage]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setCurrentPage(1);
    setSearchValue(search);
  };

  /* =========================
     DELETE PRODUCT
  ========================= */

  const handleDelete = async (productId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?",
    );

    if (!confirmed) return;

    try {
      setDeletingId(productId);

      const res = await apiFetch(`/api/admin/product/${productId}`, {
        method: "DELETE",
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Failed to delete product");
      }

      setProducts((prev) =>
        prev.filter((product) => product._id !== productId),
      );

      alert(result.message);
    } catch (error) {
      console.error("Delete product error:", error);

      alert(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setDeletingId(null);
    }
  };

  console.log(products);
  /* =========================
     LOADING
  ========================= */

  if (loading) {
    return (
      <section className="space-y-6">
        <div className="h-10 w-56 animate-pulse rounded-lg bg-muted" />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-28 animate-pulse rounded-2xl bg-muted"
            />
          ))}
        </div>

        <div className="h-96 animate-pulse rounded-2xl bg-muted" />
      </section>
    );
  }

  /* =========================
     ERROR
  ========================= */

  if (error) {
    return (
      <section className="flex min-h-[500px] items-center justify-center">
        <div className="max-w-md text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10">
            <Package className="h-8 w-8 text-red-500" />
          </div>

          <h2 className="text-xl font-bold text-foreground">
            Unable to load products
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">{error}</p>

          <button
            onClick={fetchProducts}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground"
          >
            <RefreshCw size={17} />
            Try Again
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      {/* =========================
          HEADER
      ========================= */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <Boxes className="h-5 w-5 text-primary" />
            </div>

            <h1 className="text-2xl font-bold ">Products</h1>
          </div>

          <p className="mt-2 text-sm text-muted-foreground">
            Manage your ShopNest products
          </p>
        </div>

        <Link
          href="/dashboard/admin/products/create"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold  shadow-sm transition hover:opacity-90"
        >
          <Plus size={18} />
          Add Product
        </Link>
      </div>

      {/* =========================
          STATS
      ========================= */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Products</p>

              <p className="mt-2 text-2xl font-bold ">
                {pagination?.totalProducts || 0}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
              <Package className="text-primary" size={21} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Visible Products</p>

              <p className="mt-2 text-2xl font-bold ">{products.length}</p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-500/10">
              <ShoppingBag className="text-green-500" size={21} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">In Stock</p>

              <p className="mt-2 text-2xl font-bold ">
                {products.filter((product) => product.stock > 0).length}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10">
              <Boxes className="text-blue-500" size={21} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Out of Stock</p>

              <p className="mt-2 text-2xl font-bold ">
                {products.filter((product) => product.stock === 0).length}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-500/10">
              <Package className="text-red-500" size={21} />
            </div>
          </div>
        </div>
      </div>

      {/* =========================
          SEARCH
      ========================= */}

      <div className="rounded-2xl border border-border bg-card p-4">
        <form
          onSubmit={handleSearch}
          className="flex flex-col gap-3 sm:flex-row"
        >
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="
                h-11
                w-full
                rounded-xl
                border
                border-border
                bg-background
                pl-10
                pr-4
                text-sm
                text-foreground
                outline-none
                transition
                placeholder:text-muted-foreground
                focus:border-primary
              "
            />
          </div>

          <button
            type="submit"
            className="h-11 rounded-xl bg-primary px-6 text-sm font-medium text-primary-foreground"
          >
            Search
          </button>
        </form>
      </div>

      {/* =========================
          EMPTY STATE
      ========================= */}

      {products.length === 0 ? (
        <div className="flex min-h-[430px] items-center justify-center rounded-3xl border border-dashed border-border bg-card">
          <div className="max-w-sm px-6 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-muted">
              <Package size={38} className="text-muted-foreground" />
            </div>

            <h2 className="mt-6 text-xl font-bold text-foreground">
              No Products Found
            </h2>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {searchValue
                ? `We couldn't find any product matching "${searchValue}".`
                : "Your product collection is empty. Add your first product to get started."}
            </p>

            {!searchValue && (
              <Link
                href="/admin/products/create"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
              >
                <Plus size={17} />
                Create Product
              </Link>
            )}
          </div>
        </div>
      ) : (
        /* =========================
           PRODUCT TABLE
        ========================= */

        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          {/* Desktop */}

          <div className="hidden overflow-x-auto md:block">
            <table className="w-full">
              <thead className="border-b border-border bg-muted/40">
                <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="px-5 py-4">Product</th>

                  <th className="px-5 py-4">Category</th>

                  <th className="px-5 py-4">Price</th>

                  <th className="px-5 py-4">Stock</th>

                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-border">
                {products.map((product) => (
                  <tr
                    key={product._id}
                    className="transition hover:bg-muted/30"
                  >
                    {/* Product */}

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative h-14 w-14 overflow-hidden rounded-xl bg-muted">
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        </div>

                        <div className="min-w-0">
                          <p className="max-w-[220px] truncate font-semibold ">
                            {product.name}
                          </p>

                          <p className="mt-1 max-w-[220px] truncate text-xs text-muted-foreground">
                            {product.creatorEmail}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}

                    <td className="px-5 py-4">
                      <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-foreground">
                        {product.category}
                      </span>
                    </td>

                    {/* Price */}

                    <td className="px-5 py-4">
                      <span className="font-semibold ">
                        ${product.price.toFixed(2)}
                      </span>
                    </td>

                    {/* Stock */}

                    <td className="px-5 py-4">
                      {product.stock > 0 ? (
                        <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs font-medium text-green-600 dark:text-green-400">
                          {product.stock} in stock
                        </span>
                      ) : (
                        <span className="rounded-full bg-red-500/10 px-3 py-1 text-xs font-medium text-red-600 dark:text-red-400">
                          Out of stock
                        </span>
                      )}
                    </td>

                    {/* Actions */}

                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/dashboard/admin/products/edit/${product._id}`}
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition hover:bg-muted hover:text-foreground"
                          title="Edit"
                        >
                          <Pencil size={16} />
                        </Link>

                        <button
                          type="button"
                          disabled={deletingId === product._id}
                          onClick={() => handleDelete(product._id)}
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-500/30 text-red-500 transition hover:bg-red-500/10 disabled:opacity-50"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile */}

          <div className="divide-y divide-border md:hidden">
            {products.map((product) => (
              <div key={product._id} className="p-4">
                <div className="flex gap-3">
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-muted">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-semibold text-foreground">
                      {product.name}
                    </h3>

                    <p className="mt-1 text-sm text-muted-foreground">
                      {product.category}
                    </p>

                    <p className="mt-2 font-bold text-foreground">
                      ${product.price.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  {product.stock > 0 ? (
                    <span className="text-xs font-medium text-green-600 dark:text-green-400">
                      {product.stock} in stock
                    </span>
                  ) : (
                    <span className="text-xs font-medium text-red-500">
                      Out of stock
                    </span>
                  )}

                  <div className="flex gap-2">
                    <Link
                      href={`/dashboard/admin/products/edit/${product._id}`}
                      className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-medium text-foreground"
                    >
                      <Pencil size={14} />
                      Edit
                    </Link>

                    <button
                      type="button"
                      disabled={deletingId === product._id}
                      onClick={() => handleDelete(product._id)}
                      className="flex items-center gap-1.5 rounded-lg border border-red-500/30 px-3 py-2 text-xs font-medium text-red-500"
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {pagination && pagination.totalPages > 1 && (
        <div className="flex flex-col gap-4 border-t border-border px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Result information */}

          <div className="text-sm text-muted-foreground">
            Showing{" "}
            <span className="font-medium ">
              {(pagination.currentPage - 1) * pagination.limit + 1}
            </span>{" "}
            -
            <span className="font-medium ">
              {" "}
              {Math.min(
                pagination.currentPage * pagination.limit,
                pagination.totalProducts,
              )}
            </span>{" "}
            of{" "}
            <span className="font-medium ">
              {pagination.totalProducts}
            </span>{" "}
            products
          </div>

          {/* Pagination */}

          <div className="flex items-center gap-2">
            {/* Previous */}

            <button
              type="button"
              disabled={!pagination.hasPreviousPage}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              className="
          rounded-lg
          border border-border
          px-3 py-2
          text-sm font-medium
          
          transition
          hover:bg-muted
          disabled:cursor-not-allowed
          disabled:opacity-40
        "
            >
              Previous
            </button>

            {/* Page numbers */}

            <div className="flex items-center gap-1">
              {Array.from(
                {
                  length: pagination.totalPages,
                },
                (_, index) => index + 1,
              ).map((page) => {
                const isActive = page === pagination.currentPage;

                return (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setCurrentPage(page)}
                    className={`
                flex h-9 min-w-9
                items-center justify-center
                rounded-lg
                px-2
                text-sm font-medium
                transition

                ${
                  isActive
                    ? "bg-primary "
                    : "border border-border  hover:bg-muted"
                }
              `}
                  >
                    {page}
                  </button>
                );
              })}
            </div>

            {/* Next */}

            <button
              type="button"
              disabled={!pagination.hasNextPage}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className="
          rounded-lg
          border border-border
          px-3 py-2
          text-sm font-medium
         
          transition
          hover:bg-muted
          disabled:cursor-not-allowed
          disabled:opacity-40
        "
            >
              Next
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
