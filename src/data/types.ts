export type Category =
  | 'Spices'
  | 'Ceylon Tea'
  | 'Traditional Snacks'
  | 'Gift Boxes'
  | 'Premium Collection'
  | 'Corporate Gifts'

export type Occasion =
  | 'Birthday'
  | 'Wedding'
  | 'Anniversary'
  | 'Thank You'
  | 'Corporate'
  | 'New Year'
  | 'Christmas'
  | "Mother's Day"
  | "Father's Day"
  | 'Tourist Souvenir'
  | 'Just Because'

export type Recipient =
  | 'For Her'
  | 'For Him'
  | 'For Family'
  | 'For Friend'
  | 'For Couple'
  | 'For Client'
  | 'For Employee'
  | 'For Business Partner'

export type Interest =
  | 'Tea Lover'
  | 'Cooking Lover'
  | 'Spice Lover'
  | 'Traditional Food Lover'
  | 'Healthy Lifestyle'
  | 'Sri Lankan Culture'
  | 'Premium Gifts'

export interface Product {
  id: string
  name: string
  price: number
  category: Category
  description: string
  shortDescription: string
  image: string
  rating: number
  reviews: number
  origin: string
  ingredients: string
  usage: string
  storage: string
  story: string
  culturalSignificance: string
  occasions: Occasion[]
  interests: Interest[]
  dietary: string[]
  featured?: boolean
  bestSeller?: boolean
  stock: number
  isGiftBox?: boolean
}

export interface Recipe {
  id: string
  title: string
  image: string
  prepTime: string
  difficulty: 'Easy' | 'Medium' | 'Advanced'
  ingredients: string[]
  instructions: string[]
  productIds: string[]
  category: string
}

export interface Story {
  id: string
  title: string
  slug: string
  category: 'Sri Lankan Spices' | 'Ceylon Tea' | 'Traditional Foods' | 'Sri Lankan Recipes' | 'Cultural Heritage'
  image: string
  excerpt: string
  whatIs: string
  origin: string
  whyFamous: string
  traditionalUse: string
  recipes: string[]
}

export interface CartItem {
  id: string
  productId: string
  name: string
  price: number
  image: string
  quantity: number
  customization?: {
    recipientName?: string
    message?: string
    senderName?: string
    packaging?: string
    customBoxId?: string
  }
}

export interface Order {
  id: string
  createdAt: string
  status: OrderStatus
  items: CartItem[]
  subtotal: number
  customizationFee: number
  deliveryFee: number
  discount: number
  total: number
  customer: {
    name: string
    email: string
    phone: string
  }
  address: {
    address: string
    city: string
    district: string
    postalCode: string
  }
  deliveryOption: string
  paymentMethod: string
}

export type OrderStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Preparing'
  | 'Personalizing'
  | 'Quality Check'
  | 'Packed'
  | 'Shipped'
  | 'Delivered'
  | 'Cancelled'

export interface GiftBuilderState {
  occasion: Occasion | null
  recipient: Recipient | null
  budget: number | null
  customBudget: number | null
  interests: Interest[]
  selectedProducts: { productId: string; quantity: number }[]
  personalization: {
    recipientName: string
    message: string
    senderName: string
    logoUploaded: boolean
    cardDesign: string
    packaging: string
  }
}
