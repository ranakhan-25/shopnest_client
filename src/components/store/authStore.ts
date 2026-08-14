import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface AuthUser {
  _id: string;
  name: string;
  email: string;
  role: undefined | string;
  profileImage?: string;
}

interface AuthStore {
  user: AuthUser | null;
  accessToken: string | null;

  hasHydrated: boolean;

  setAuth: (user: AuthUser, accessToken: string) => void;
  setAccessToken: (accessToken: string) => void;
  logout: () => void;
  setHasHydrated: (value: boolean) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,

      hasHydrated: false,

      setAuth: (user, accessToken) =>
        set({
          user,
          accessToken,
        }),

      setAccessToken: (accessToken) =>
        set({
          accessToken,
        }),

      logout: () =>
        set({
          user: null,
          accessToken: null,
        }),

      setHasHydrated: (value) =>
        set({
          hasHydrated: value,
        }),
    }),
    {
      name: "shopnest-auth",

      onRehydrateStorage: () => {
        return (state) => {
          state?.setHasHydrated(true);
        };
      },
    }
  )
);