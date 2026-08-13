import type { Cart } from "@/types/product";
import { apiFetch } from "./apiClient";


export const getCart = async (): Promise<Cart> => {
  const res = await apiFetch("/api/cart/product");

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Failed to fetch cart");
  }

  return result.data;
};