// hooks/useUserRole.ts
"use client";

import { useAuthStore } from "../store/authStore";


export type UserRole = "user" | "seller" | "admin";

export function useUserRole(): UserRole | null {
  const { user } = useAuthStore();
  return (user?.role as UserRole) ?? null;
}