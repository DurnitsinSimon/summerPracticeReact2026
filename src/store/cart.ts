import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Product } from '../mocks/db'

export type CartItem = {
  product: Product
  quantity: number
}

type CartState = {
  items: CartItem[]
  addItem: (product: Product) => void
  removeItem: (productId: string) => void
  setQuantity: (productId: string, quantity: number) => void
  clear: () => void
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],

      addItem(product) {
        set((state) => {
          const existing = state.items.find((item) => item.product.id === product.id)
          if (existing) {
            return {
              items: state.items.map((item) =>
                item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
              ),
            }
          }
          return { items: [...state.items, { product, quantity: 1 }] }
        })
      },

      removeItem(productId) {
        set((state) => ({ items: state.items.filter((item) => item.product.id !== productId) }))
      },

      setQuantity(productId, quantity) {
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((item) => item.product.id !== productId)
              : state.items.map((item) => (item.product.id === productId ? { ...item, quantity } : item)),
        }))
      },

      clear() {
        set({ items: [] })
      },
    }),
    { name: 'cart' },
  ),
)
