import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { GiftBuilderState, Interest, Occasion, Recipient } from '../data/types'
import { getProduct } from '../data/products'

const defaultPersonalization = {
  recipientName: '',
  message: '',
  senderName: '',
  logoUploaded: false,
  cardDesign: 'Heritage Gold',
  packaging: 'Classic SpiceBox',
}

interface GiftStore extends GiftBuilderState {
  step: number
  setStep: (step: number) => void
  setOccasion: (o: Occasion) => void
  setRecipient: (r: Recipient) => void
  setBudget: (b: number | null, custom?: number | null) => void
  toggleInterest: (i: Interest) => void
  addProduct: (productId: string) => void
  removeProduct: (productId: string) => void
  setQuantity: (productId: string, quantity: number) => void
  setPersonalization: (p: Partial<GiftBuilderState['personalization']>) => void
  productsTotal: () => number
  packagingFee: () => number
  customizationFee: () => number
  total: () => number
  reset: () => void
}

const initial: GiftBuilderState = {
  occasion: null,
  recipient: null,
  budget: null,
  customBudget: null,
  interests: [],
  selectedProducts: [],
  personalization: defaultPersonalization,
}

export const useGiftBuilderStore = create<GiftStore>()(
  persist(
    (set, get) => ({
      ...initial,
      step: 1,
      setStep: (step) => set({ step }),
      setOccasion: (occasion) => set({ occasion }),
      setRecipient: (recipient) => set({ recipient }),
      setBudget: (budget, customBudget = null) => set({ budget, customBudget }),
      toggleInterest: (interest) => {
        const has = get().interests.includes(interest)
        set({
          interests: has
            ? get().interests.filter((i) => i !== interest)
            : [...get().interests, interest],
        })
      },
      addProduct: (productId) => {
        const existing = get().selectedProducts.find((p) => p.productId === productId)
        if (existing) {
          set({
            selectedProducts: get().selectedProducts.map((p) =>
              p.productId === productId ? { ...p, quantity: p.quantity + 1 } : p,
            ),
          })
        } else {
          set({ selectedProducts: [...get().selectedProducts, { productId, quantity: 1 }] })
        }
      },
      removeProduct: (productId) =>
        set({ selectedProducts: get().selectedProducts.filter((p) => p.productId !== productId) }),
      setQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeProduct(productId)
          return
        }
        set({
          selectedProducts: get().selectedProducts.map((p) =>
            p.productId === productId ? { ...p, quantity } : p,
          ),
        })
      },
      setPersonalization: (p) =>
        set({ personalization: { ...get().personalization, ...p } }),
      productsTotal: () =>
        get().selectedProducts.reduce((sum, s) => {
          const product = getProduct(s.productId)
          return sum + (product?.price ?? 0) * s.quantity
        }, 0),
      packagingFee: () => {
        const style = get().personalization.packaging
        if (style === 'Luxury Heritage') return 800
        if (style === 'Corporate Executive') return 600
        return 350
      },
      customizationFee: () => {
        const p = get().personalization
        let fee = 0
        if (p.message.trim()) fee += 200
        if (p.logoUploaded) fee += 500
        if (p.cardDesign === 'Gold Foil') fee += 300
        return fee
      },
      total: () => get().productsTotal() + get().packagingFee() + get().customizationFee(),
      reset: () => set({ ...initial, personalization: { ...defaultPersonalization }, step: 1 }),
    }),
    { name: 'spicebox-gift-builder' },
  ),
)
