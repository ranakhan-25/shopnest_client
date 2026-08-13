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

  setAuth: (user: AuthUser, accessToken: string) => void;
  setAccessToken: (accessToken: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,

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
    }),
    {
      name: "shopnest-auth",
    }
  )
);