import { create } from "zustand";
import { persist } from "zustand/middleware";

type Theme = "light" | "dark";
export type SortOption =
  | "default"
  | "price-low"
  | "price-high"
  | "name-az"
  | "name-za";

interface ThemeStore {
  theme: Theme;
  toggleTheme: () => void;
}

type ProductFilterStore = {
  search: string;
  category: string;
  sort: SortOption;

  setSearch: (search: string) => void;
  setCategory: (category: string) => void;
  setSort: (sort: SortOption) => void;

  resetFilters: () => void;
};
export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      theme: "light",

      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === "light" ? "dark" : "light",
        })),
    }),
    {
      name: "shopnest-theme",
    },
  ),
);

export const useProductFilterStore = create<ProductFilterStore>((set) => ({
  search: "",
  category: "All",
  sort: "default",

  setSearch: (search) => set({ search }),

  setCategory: (category) => set({ category }),

  setSort: (sort) => set({ sort }),

  resetFilters: () =>
    set({
      search: "",
      category: "All",
      sort: "default",
    }),
}));
