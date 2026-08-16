"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ShoppingCart } from "lucide-react";

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  image: string;
  creatorEmail?: string;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const isOutOfStock = product.stock <= 0;

  return (
    <article
      className="
        group overflow-hidden rounded
        border border-slate-200
        bg-white
        transition-all duration-300
        hover:-translate-y-1
        hover:border-slate-300
        hover:shadow-lg

        dark:border-slate-800
        dark:bg-slate-900
        dark:hover:border-slate-700
      "
    >
      {/* =========================================
          IMAGE
      ========================================== */}

      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100 dark:bg-slate-800">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="
            (max-width: 640px) 100vw,
            (max-width: 1024px) 50vw,
            25vw
          "
          className="
            object-cover
            transition-transform duration-500
            group-hover:scale-105
          "
        />

        {/* Category */}

        <div
          className="
            absolute left-3 top-3
            rounded-full
            border border-white/50
            bg-white/90
            px-3 py-1
            text-[11px]
            font-medium
            capitalize
            text-slate-700
            backdrop-blur-sm

            dark:border-slate-700/50
            dark:bg-slate-900/90
            dark:text-slate-300
          "
        >
          {product.category}
        </div>

        {/* Stock */}

        <div
          className={`
            absolute right-3 top-3
            rounded-full
            px-3 py-1
            text-[11px]
            font-medium
            ${
              isOutOfStock
                ? "bg-red-100 text-red-600 dark:bg-red-950/60 dark:text-red-400"
                : "bg-white/90 text-slate-700 dark:bg-slate-900/90 dark:text-slate-300"
            }
          `}
        >
          {isOutOfStock
            ? "Out of stock"
            : `${product.stock} left`}
        </div>
      </div>

      {/* =========================================
          CONTENT
      ========================================== */}

      <div className="p-4">
        {/* Product Name */}

        <h3
          className="
            line-clamp-1
            text-base
            font-semibold
            text-slate-950
            dark:text-white
          "
        >
          {product.name}
        </h3>

        {/* Description */}

        <p
          className="
            mt-1.5
            line-clamp-2
            min-h-[40px]
            text-xs
            leading-5
            text-slate-500
            dark:text-slate-400
          "
        >
          {product.description}
        </p>

        {/* Price + Action */}

        <div className="mt-4 flex items-center justify-between gap-3">
          {/* Price */}

          <div>
            <p className="text-[11px] text-slate-400 dark:text-slate-500">
              Price
            </p>

            <p className="mt-0.5 text-lg font-bold text-slate-950 dark:text-white">
              ${product.price.toFixed(2)}
            </p>
          </div>

          {/* Details Button */}

          <Link
            href={`/collections/${product._id}`}
            className="
              inline-flex
              items-center
              gap-1.5
              rounded-xl
              bg-slate-950
              px-3.5
              py-2.5
              text-xs
              font-medium
              text-white
              transition
              hover:bg-slate-700

              dark:bg-white
              dark:text-slate-950
              dark:hover:bg-slate-200
            "
          >
            <ShoppingCart className="h-3.5 w-3.5" />

            Details

            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;