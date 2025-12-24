import { create } from 'zustand';
import { CartItem } from '@/types';

const CART_KEY = 'autocare_cart_v1';

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  getSubtotal: () => number;
  getShippingFee: () => number;
  getTotal: () => number;
  initCart: () => void;
  setItems: (items: CartItem[]) => void;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],

  addItem: (item) => {
    set((state) => {
      const existingIndex = state.items.findIndex((i) => i.productId === item.productId);

      let newItems: CartItem[];

      if (existingIndex !== -1) {
        newItems = [...state.items];
        newItems[existingIndex] = {
          ...newItems[existingIndex],
          quantity: Math.min(newItems[existingIndex].quantity + item.quantity, item.stockQty),
        };
      } else {
        newItems = [...state.items, item];
      }

      localStorage.setItem(CART_KEY, JSON.stringify(newItems));
      return { items: newItems };
    });
  },

  updateQuantity: (productId, quantity) => {
    set((state) => {
      const item = state.items.find((i) => i.productId === productId);
      if (!item) return state;

      const newQuantity = Math.min(Math.max(1, quantity), item.stockQty);

      const newItems = state.items.map((i) =>
        i.productId === productId ? { ...i, quantity: newQuantity } : i
      );

      localStorage.setItem(CART_KEY, JSON.stringify(newItems));
      return { items: newItems };
    });
  },

  removeItem: (productId) => {
    set((state) => {
      const newItems = state.items.filter((i) => i.productId !== productId);
      localStorage.setItem(CART_KEY, JSON.stringify(newItems));
      return { items: newItems };
    });
  },

  clearCart: () => {
    localStorage.removeItem(CART_KEY);
    set({ items: [] });
  },

  getSubtotal: () => {
    const { items } = get();
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  },

  getShippingFee: () => {
    const subtotal = get().getSubtotal();
    return subtotal >= 1000 ? 0 : 60;
  },

  getTotal: () => {
    return get().getSubtotal() + get().getShippingFee();
  },

  initCart: () => {
    try {
      const stored = localStorage.getItem(CART_KEY);
      if (stored) {
        const items: CartItem[] = JSON.parse(stored);
        set({ items });
      }
    } catch (error) {
      console.error('Failed to init cart:', error);
    }
  },

  setItems: (items) => {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
    set({ items });
  },
}));
