import { create } from "zustand";

export interface SelectedProduct {
  id: string;
  coverImage: string | null;
  images: string[];
  url: string | null;
}

interface SelectedProductsState {
  selected: SelectedProduct[];
  toggle: (product: SelectedProduct, checked: boolean) => void;
  toggleAll: (products: SelectedProduct[], checked: boolean) => void;
  clear: () => void;
}

export const useSelectedProducts = create<SelectedProductsState>((set) => ({
  selected: [],

  toggle: (product, checked) =>
    set((state) => {
      const exists = state.selected.find((p) => p.id === product.id);
      if (checked && !exists) {
        return { selected: [...state.selected, product] };
      }
      if (!checked && exists) {
        return {
          selected: state.selected.filter((p) => p.id !== product.id),
        };
      }
      return state;
    }),

  toggleAll: (products, checked) =>
    set((state) => {
      if (checked) {
        const merged = [
          ...state.selected,
          ...products.filter(
            (p) => !state.selected.some((s) => s.id === p.id)
          ),
        ];
        return { selected: merged };
      } else {
        const removeIds = products.map((p) => p.id);
        return {
          selected: state.selected.filter((p) => !removeIds.includes(p.id)),
        };
      }
    }),

  clear: () => set({ selected: [] }),
}));