import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem } from '../data/types'

interface CartState {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'id'> & { id?: string }) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clear: () => void
  subtotal: () => number
  count: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        const id = item.id ?? `${item.productId}-${Date.now()}`
        const existing = get().items.find(
          (i) => i.productId === item.productId && !item.customization && !i.customization,
        )
        if (existing) {
          set({
            items: get().items.map((i) =>
              i.id === existing.id ? { ...i, quantity: i.quantity + item.quantity } : i,
            ),
          })
        } else {
          set({ items: [...get().items, { ...item, id }] })
        }
      },
      removeItem: (id) => set({ items: get().items.filter((i) => i.id !== id) }),
      updateQuantity: (id, quantity) =>
        set({
          items: get().items.map((i) => (i.id === id ? { ...i, quantity: Math.max(1, quantity) } : i)),
        }),
      clear: () => set({ items: [] }),
      subtotal: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
      count: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    { name: 'spicebox-cart' },
  ),
)
