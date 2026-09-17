import type { Product } from '../data/types'

type ApiProduct = Partial<Product> & {
  _id?: string
  slug?: string
  images?: string[]
  reviewCount?: number
  culturalStory?: string
  heritage?: string
}

export function normalizeProduct(product: ApiProduct): Product {
  return {
    id: product.id || product._id || product.slug || '',
    name: product.name || 'Sri Lankan Selection',
    price: Number(product.price || 0),
    category: (product.category || 'Spices') as Product['category'],
    description: product.description || product.shortDescription || '',
    shortDescription: product.shortDescription || product.description || '',
    image: product.image || product.images?.[0] || '/products/gift-taste.jpg',
    rating: Number(product.rating || 0),
    reviews: Number(product.reviews ?? product.reviewCount ?? 0),
    origin: product.origin || 'Sri Lanka',
    ingredients: product.ingredients || 'See product label',
    usage: product.usage || '',
    storage: product.storage || '',
    story: product.story || product.culturalStory || '',
    culturalSignificance: product.culturalSignificance || product.heritage || '',
    occasions: product.occasions || [],
    interests: product.interests || [],
    dietary: product.dietary || [],
    featured: product.featured,
    bestSeller: product.bestSeller,
    stock: Number(product.stock || 0),
    isGiftBox: product.isGiftBox,
  }
}
