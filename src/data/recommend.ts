import type { Interest, Occasion, Product, Recipient } from './types'
import { products } from './products'

export interface RecommendationInput {
  occasion?: Occasion | null
  recipient?: Recipient | null
  budget?: number | null
  interests?: Interest[]
  preferredCategories?: string[]
}

export interface RecommendationResult {
  product: Product
  score: number
  reasons: string[]
  suggestedContents: string[]
}

/**
 * Modular rule-based engine — swap with AI API later.
 * Interface stays stable: recommendGifts(input) -> RecommendationResult[]
 */
export function recommendGifts(input: RecommendationInput): RecommendationResult[] {
  const budget = input.budget ?? 5000
  const interests = input.interests ?? []
  const occasion = input.occasion

  const giftBoxes = products.filter((p) => p.isGiftBox)

  const scored = giftBoxes.map((product) => {
    let score = 0
    const reasons: string[] = []

    // Budget fit
    const budgetDiff = Math.abs(product.price - budget)
    if (budgetDiff <= 500) {
      score += 40
      reasons.push('Fits the selected budget')
    } else if (product.price <= budget) {
      score += 25
      reasons.push('Comfortably within budget')
    } else if (product.price <= budget * 1.15) {
      score += 10
      reasons.push('Close to your budget range')
    }

    // Occasion
    if (occasion && product.occasions.includes(occasion)) {
      score += 30
      reasons.push('Suitable for the occasion')
    }

    // Interests
    const interestHits = interests.filter((i) => product.interests.includes(i))
    if (interestHits.length) {
      score += interestHits.length * 12
      reasons.push("Matches the recipient's interest")
    }

    // Recipient heuristics
    if (input.recipient === 'For Her' && product.id.includes('tea')) {
      score += 8
    }
    if (input.recipient === 'For Client' || input.recipient === 'For Business Partner') {
      if (product.category === 'Corporate Gifts' || product.category === 'Premium Collection') {
        score += 20
        reasons.push('Appropriate for professional gifting')
      }
    }
    if (input.recipient === 'For Employee' && product.category === 'Corporate Gifts') {
      score += 15
    }

    if (product.bestSeller) score += 5
    if (product.featured) score += 5

    const suggestedContents = product.ingredients.split(',').map((s) => s.trim()).slice(0, 5)

    return {
      product,
      score,
      reasons: reasons.length ? reasons : ['A premium Sri Lankan gift experience'],
      suggestedContents,
    }
  })

  return scored.sort((a, b) => b.score - a.score).slice(0, 3)
}

export function corporateDiscount(quantity: number): number {
  if (quantity >= 100) return -1 // custom quote
  if (quantity >= 51) return 0.1
  if (quantity >= 21) return 0.05
  return 0
}
