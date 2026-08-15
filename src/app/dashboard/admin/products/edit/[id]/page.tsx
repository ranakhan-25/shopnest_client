"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { ArrowLeft, ImagePlus, Loader2, Save } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { apiFetch } from "@/lib/apiClient";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  image: string;
  createdById: string;
  creatorEmail: string;
  createdAt?: string;
  updatedAt?: string;
  quantity?: number;
}

interface ProductResponse {
  success: boolean;
  message: string;
  data: Product;
}

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();

  const id = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    image: "",
  });

  // =========================
  // Fetch Product
  // =========================

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await apiFetch(`/api/admin/products/${id}`);

        const result: ProductResponse = await res.json();

        if (!res.ok) {
          throw new Error(result.message || "Failed to fetch product");
        }

        const product = result.data;

        setFormData({
          name: product.name || "",
          description: product.description || "",
          price: String(product.price ?? ""),
          category: product.category || "",
          stock: String(product.stock ?? ""),
          image: product.image || "",
        });

        setImagePreview(product.image || "");
      } catch (error) {
        console.error("Fetch product error:", error);

        setError(
          error instanceof Error ? error.message : "Failed to load product",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // =========================
  // Input Change
  // =========================

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================
  // Image Change
  // =========================

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image");
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  // =========================
  // Upload Image to ImgBB
  // =========================

  const uploadToImgBB = async (file: File) => {
    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

    if (!apiKey) {
      throw new Error("ImgBB API key is missing");
    }

    const body = new FormData();

    body.append("key", apiKey);
    body.append("image", file);

    const res = await fetch("https://api.imgbb.com/1/upload", {
      method: "POST",
      body,
    });

    const result = await res.json();

    if (!res.ok || !result.success) {
      throw new Error("Image upload failed");
    }

    return result.data.url as string;
  };

  // =========================
  // Submit
  // =========================

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setSubmitting(true);
      setError("");

      let imageUrl = formData.image;

      // New image selected
      if (imageFile) {
        imageUrl = await uploadToImgBB(imageFile);
      }

      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: Number(formData.price),
        category: formData.category.trim(),
        stock: Number(formData.stock),
        image: imageUrl,
      };

      if (!payload.name) {
        throw new Error("Product name is required");
      }

      if (!payload.description) {
        throw new Error("Product description is required");
      }

      if (!payload.category) {
        throw new Error("Product category is required");
      }

      if (payload.price < 0) {
        throw new Error("Price cannot be negative");
      }

      if (payload.stock < 0) {
        throw new Error("Stock cannot be negative");
      }

      const res = await apiFetch(`/api/admin/products/${id}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Failed to update product");
      }

      alert(result.message || "Product updated successfully");

      router.push("/dashboard/admin/products");
      router.refresh();
    } catch (error) {
      console.error("Update product error:", error);

      setError(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  // =========================
  // Loading
  // =========================

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />

          <p className="text-sm text-gray-600 dark:text-gray-300">
            Loading product...
          </p>
        </div>
      </div>
    );
  }

  // =========================
  // Error
  // =========================

  if (error && !formData.name) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center p-6">
        <div className="w-full max-w-md rounded-2xl border border-red-200 bg-white p-6 text-center shadow-sm dark:border-red-900 dark:bg-gray-950">
          <h2 className="text-lg font-semibold text-red-600 dark:text-red-400">
            Failed to load product
          </h2>

          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            {error}
          </p>

          <button
            type="button"
            onClick={() => router.push("/dashboard/admin/products")}
            className="mt-5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-white px-4 py-6 text-gray-900 dark:bg-black dark:text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Header */}

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <button
              type="button"
              onClick={() => router.push("/dashboard/admin/products")}
              className="mb-3 flex items-center gap-2 text-sm text-gray-600 transition hover:text-black dark:text-gray-400 dark:hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Products
            </button>

            <h1 className="text-2xl font-bold sm:text-3xl">Edit Product</h1>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Update product information and save your changes.
            </p>
          </div>
        </div>

        {/* Form */}

        <form
          onSubmit={handleSubmit}
          className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Left */}

            <div className="space-y-5 p-5 sm:p-7">
              {/* Product Name */}

              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium"
                >
                  Product Name
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter product name"
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-primary dark:border-gray-700 dark:bg-black"
                  required
                />
              </div>

              {/* Category */}

              <div>
                <label
                  htmlFor="category"
                  className="mb-2 block text-sm font-medium"
                >
                  Category
                </label>

                <input
                  id="category"
                  name="category"
                  type="text"
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="Fashion"
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-primary dark:border-gray-700 dark:bg-black"
                  required
                />
              </div>

              {/* Price + Stock */}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="price"
                    className="mb-2 block text-sm font-medium"
                  >
                    Price
                  </label>

                  <input
                    id="price"
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-primary dark:border-gray-700 dark:bg-black"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="stock"
                    className="mb-2 block text-sm font-medium"
                  >
                    Stock
                  </label>

                  <input
                    id="stock"
                    name="stock"
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-primary dark:border-gray-700 dark:bg-black"
                    required
                  />
                </div>
              </div>

              {/* Description */}

              <div>
                <label
                  htmlFor="description"
                  className="mb-2 block text-sm font-medium"
                >
                  Description
                </label>

                <textarea
                  id="description"
                  name="description"
                  rows={6}
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter product description"
                  className="w-full resize-none rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-primary dark:border-gray-700 dark:bg-black"
                  required
                />
              </div>
            </div>

            {/* Right - Image */}

            <div className="border-t border-gray-200 p-5 dark:border-gray-800 lg:border-l lg:border-t-0 sm:p-7">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Product Image
                </label>

                <label
                  htmlFor="image"
                  className="group relative flex min-h-[350px] cursor-pointer items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 transition hover:border-primary dark:border-gray-700 dark:bg-black"
                >
                  {imagePreview ? (
                    <>
                      <img
                        src={imagePreview}
                        alt="Product preview"
                        className="h-full max-h-[350px] w-full object-cover"
                      />

                      <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition group-hover:opacity-100">
                        <div className="rounded-xl bg-white px-4 py-2 text-sm font-medium text-black">
                          Change Image
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center text-center">
                      <ImagePlus className="mb-3 h-10 w-10 text-gray-400" />

                      <p className="text-sm font-medium">
                        Upload product image
                      </p>

                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        PNG, JPG or WEBP
                      </p>
                    </div>
                  )}

                  <input
                    id="image"
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>

                {imageFile && (
                  <p className="mt-2 truncate text-xs text-gray-500 dark:text-gray-400">
                    New image: {imageFile.name}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Error */}

          {error && (
            <div className="mx-5 mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400 sm:mx-7">
              {error}
            </div>
          )}

          {/* Footer */}

          <div className="flex flex-col-reverse gap-3 border-t border-gray-200 p-5 dark:border-gray-800 sm:flex-row sm:justify-end sm:p-7">
            <button
              type="button"
              onClick={() => router.push("/dashboard/admin/products")}
              disabled={submitting}
              className="rounded-xl border border-gray-300 px-5 py-3 text-sm font-medium transition hover:bg-gray-100 disabled:opacity-50 dark:border-gray-700 dark:hover:bg-gray-900"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="flex items-center justify-center gap-2 rounded-xl shadow dark:border px-6 py-3 text-sm font-semibold  transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Update Product
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
