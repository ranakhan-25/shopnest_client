"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ImagePlus,
  Package,
  Save,
  Upload,
  X,
} from "lucide-react";

import { apiFetch } from "@/lib/apiClient";

interface ProductForm {
  name: string;
  description: string;
  price: string;
  category: string;
  stock: string;
}

const categories = [
  "Electronics",
  "Fashion",
  "Beauty",
  "Home",
  "Sports",
  "Books",
  "Accessories",
  "Other",
];

export default function CreateProductPage() {
  const router = useRouter();

  const [formData, setFormData] = useState<ProductForm>({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
  });

  const [imageFile, setImageFile] = useState<File | null>(
    null
  );

  const [imagePreview, setImagePreview] = useState("");

  const [imageUrl, setImageUrl] = useState("");

  const [uploadingImage, setUploadingImage] =
    useState(false);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  // =========================
  // INPUT CHANGE
  // =========================

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================
  // IMAGE SELECT
  // =========================

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // File type validation
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }

    // 5MB limit
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB.");
      return;
    }

    setError("");

    setImageFile(file);

    const previewUrl = URL.createObjectURL(file);

    setImagePreview(previewUrl);
  };

  // =========================
  // REMOVE IMAGE
  // =========================

  const removeImage = () => {
    setImageFile(null);
    setImagePreview("");
    setImageUrl("");
  };

  // =========================
  // UPLOAD TO IMGBB
  // =========================

  const uploadImageToImgBB = async (
    file: File
  ): Promise<string> => {
    const apiKey =
      process.env.NEXT_PUBLIC_IMGBB_API_KEY;

    if (!apiKey) {
      throw new Error(
        "ImgBB API key is not configured."
      );
    }

    const formData = new FormData();

    formData.append("key", apiKey);
    formData.append("image", file);

    const response = await fetch(
      "https://api.imgbb.com/1/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(
        result?.error?.message ||
          "Image upload failed"
      );
    }

    return result.data.url;
  };

  // =========================
  // CREATE PRODUCT
  // =========================

  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    // Validation
    if (
      !formData.name.trim() ||
      !formData.description.trim() ||
      !formData.price ||
      !formData.category ||
      !formData.stock
    ) {
      setError("Please fill in all fields.");
      return;
    }

    if (!imageFile) {
      setError("Please select a product image.");
      return;
    }

    const price = Number(formData.price);
    const stock = Number(formData.stock);

    if (Number.isNaN(price) || price <= 0) {
      setError("Price must be greater than 0.");
      return;
    }

    if (Number.isNaN(stock) || stock < 0) {
      setError("Stock cannot be negative.");
      return;
    }

    try {
      setLoading(true);

      // =========================
      // STEP 1: UPLOAD IMAGE
      // =========================

      setUploadingImage(true);

      const uploadedImageUrl =
        await uploadImageToImgBB(imageFile);

      setImageUrl(uploadedImageUrl);

      setUploadingImage(false);

      // =========================
      // STEP 2: CREATE PRODUCT
      // =========================

      const res = await apiFetch(
        "/api/admin/products",
        {
          method: "POST",
          body: JSON.stringify({
            name: formData.name.trim(),
            description:
              formData.description.trim(),
            price,
            category: formData.category,
            stock,
            image: uploadedImageUrl,
          }),
        }
      );

      const result = await res.json();

      if (!res.ok) {
        throw new Error(
          result.message ||
            "Failed to create product"
        );
      }

      setSuccess(
        result.message ||
          "Product created successfully!"
      );

      // Reset
      setFormData({
        name: "",
        description: "",
        price: "",
        category: "",
        stock: "",
      });

      setImageFile(null);
      setImagePreview("");
      setImageUrl("");

      // Redirect
      setTimeout(() => {
        router.push("/admin/products");
      }, 1200);
    } catch (error) {
      console.error(
        "Create product error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    } finally {
      setLoading(false);
      setUploadingImage(false);
    }
  };

  return (
    <section className="min-h-screen  px-4 py-6  sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* ================= HEADER ================= */}

        <div className="mb-8">
          <button
            type="button"
            onClick={() => router.back()}
            className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
          >
            <ArrowLeft size={17} />
            Back to Products
          </button>

          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Package size={22} />
            </div>

            <div>
              <h1 className="text-2xl font-bold sm:text-3xl">
                Create Product
              </h1>

              <p className="mt-1 text-sm text-muted-foreground">
                Add a new product to your ShopNest
                store.
              </p>
            </div>
          </div>
        </div>

        {/* ================= FORM ================= */}

        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <form onSubmit={handleSubmit}>
            {/* Form header */}

            <div className="border-b border-border px-5 py-5 sm:px-7">
              <h2 className="text-lg font-semibold">
                Product Information
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Enter your product details and upload
                an image.
              </p>
            </div>

            <div className="space-y-6 p-5 sm:p-7">
              {/* Error */}

              {error && (
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400">
                  {error}
                </div>
              )}

              {/* Success */}

              {success && (
                <div className="rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-600 dark:text-green-400">
                  {success}
                </div>
              )}

              {/* ================= IMAGE ================= */}

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Product Image
                </label>

                {!imagePreview ? (
                  <label
                    htmlFor="product-image"
                    className="flex min-h-24 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-muted/30 px-5 text-center transition hover:border-primary hover:bg-primary/5"
                  >
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <ImagePlus size={28} />
                    </div>

                    <p className="text-sm font-semibold">
                      Click to upload product image
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      PNG, JPG, JPEG or WEBP • Max 5MB
                    </p>

                    <span className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
                      <Upload size={16} />
                      Choose Image
                    </span>

                    <input
                      id="product-image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                ) : (
                  <div className="relative overflow-hidden rounded-2xl border border-border bg-muted">
                    <img
                      src={imagePreview}
                      alt="Product preview"
                      className="h-72 w-full object-cover sm:h-80"
                    />

                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-background/90 text-foreground shadow-lg backdrop-blur transition hover:bg-red-500 hover:text-white"
                    >
                      <X size={19} />
                    </button>

                    <div className="absolute bottom-3 left-3 rounded-lg bg-background/90 px-3 py-2 text-xs font-medium text-foreground backdrop-blur">
                      {imageFile?.name}
                    </div>
                  </div>
                )}

                {uploadingImage && (
                  <div className="mt-3 flex items-center gap-2 text-sm text-primary">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    Uploading image...
                  </div>
                )}
              </div>

              {/* ================= NAME ================= */}

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
                  className="w-full rounded-xl border border-border px-4 py-3 text-sm  outline-none transition  focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* ================= DESCRIPTION ================= */}

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
                  rows={5}
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Write a detailed product description..."
                  className="w-full resize-none rounded-xl border border-border  px-4 py-3 text-sm  outline-none transition  focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* ================= PRICE STOCK CATEGORY ================= */}

              <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                {/* Price */}

                <div>
                  <label
                    htmlFor="price"
                    className="mb-2 block text-sm font-medium"
                  >
                    Price ($)
                  </label>

                  <input
                    id="price"
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="29.99"
                    className="w-full rounded-xl border border-border  px-4 py-3 text-sm outline-none transition  focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                {/* Stock */}

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
                    placeholder="50"
                    className="w-full rounded-xl border border-border  px-4 py-3 text-sm outline-none transition  focus:border-primary focus:ring-2 focus:ring-primary/20"
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

                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-border  px-4 py-3 text-sm  outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="">
                      Select category
                    </option>

                    {categories.map((category) => (
                      <option
                        key={category}
                        value={category}
                      >
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* ================= FOOTER ================= */}

            <div className="flex flex-col-reverse gap-3 border-t border-border px-5 py-5 sm:flex-row sm:justify-end sm:px-7">
              <button
                type="button"
                onClick={() =>
                  router.push("/dashboard/admin/products")
                }
                disabled={loading}
                className="rounded-xl border border-border px-5 py-3 text-sm font-medium transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading || uploadingImage}
                className="inline-flex items-center justify-center gap-2 rounded-xl  px-6 py-3 text-sm font-semibold transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 shadow dark:border"
              >
                <Save size={18} />

                {uploadingImage
                  ? "Uploading Image..."
                  : loading
                    ? "Creating..."
                    : "Create Product"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}