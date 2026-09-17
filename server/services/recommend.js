/**
 * Rule-based gift recommendation engine (modular / API-ready).
 */
export function recommendProducts(products, input) {
  const {
    occasion,
    budget = 5000,
    teaLover,
    spiceLover,
    foodLover,
    cultureLover,
    preferences = [],
    recipientType,
  } = input

  const reasonsFor = (p) => {
    const reasons = []
    if (teaLover && (p.category === 'Ceylon Tea' || p.interests?.includes('Tea Lover') || p.tags?.includes('tea'))) {
      reasons.push('You selected Tea Lover')
    }
    if (spiceLover && (p.category === 'Spices' || p.interests?.includes('Spice Lover'))) {
      reasons.push('You selected Spice Lover')
    }
    if (foodLover && p.category === 'Traditional Snacks') {
      reasons.push('You selected Food Lover')
    }
    if (cultureLover && (p.category === 'Lifestyle' || p.interests?.includes('Sri Lankan Culture'))) {
      reasons.push('Matches Sri Lankan culture interest')
    }
    if (occasion && p.occasions?.includes(occasion)) {
      reasons.push(`Suitable for ${occasion}`)
    }
    if (preferences.some((pref) => p.tags?.includes(pref) || p.interests?.includes(pref))) {
      reasons.push('Matches your preferred products')
    }
    if (recipientType && /mother|her|female/i.test(recipientType) && p.tags?.includes('gift-her')) {
      reasons.push(`Thoughtful for ${recipientType}`)
    }
    if (!reasons.length && p.featured) reasons.push('Popular SpiceBox pick')
    return reasons
  }

  const scored = products
    .filter((p) => p.stock > 0 && p.active !== false)
    .map((p) => {
      let score = 0
      const reasons = reasonsFor(p)
      score += reasons.length * 15
      if (p.bestSeller) score += 8
      if (p.featured) score += 5
      if (p.price <= budget * 0.4) score += 10
      if (p.price > budget) score -= 40
      return { product: p, score, reasons }
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)

  const picked = []
  let total = 0
  const packagingReserve = 500
  const cardReserve = 300
  const limit = Math.max(budget - packagingReserve - cardReserve, budget * 0.7)

  for (const item of scored) {
    if (picked.length >= 6) break
    if (total + item.product.price <= limit) {
      picked.push(item)
      total += item.product.price
    }
  }

  // Ensure at least 3 if possible
  if (picked.length < 3) {
    for (const item of scored) {
      if (picked.find((p) => p.product._id?.toString() === item.product._id?.toString())) continue
      if (picked.length >= 5) break
      picked.push(item)
    }
  }

  return {
    recommendations: picked.map((p) => ({
      product: p.product,
      reasons: p.reasons.length
        ? p.reasons
        : [`Recommended because you selected ${[occasion, recipientType].filter(Boolean).join(' + ') || 'your preferences'}`],
      why: p.reasons[0] || `Recommended for your ${occasion || 'gift'} brief`,
    })),
    estimatedTotal: picked.reduce((s, p) => s + p.product.price, 0),
    budget,
  }
}

export function packagingFee(style) {
  const map = { Classic: 350, Premium: 550, Traditional: 450, Luxury: 800 }
  return map[style] || 350
}

export function ribbonFee(style) {
  return style === 'Premium' ? 200 : 0
}

export function customizationFee(personalization = {}) {
  let fee = 0
  if (personalization.message?.trim()) fee += 200
  if (personalization.recipientName?.trim()) fee += 100
  return fee
}

export function calcCustomBoxTotals({ products = [], packaging = 'Classic', ribbon = 'Standard', personalization = {} }) {
  const productsTotal = products.reduce((s, p) => s + (p.priceAtAdd ?? p.price ?? 0) * (p.quantity || 1), 0)
  const pack = packagingFee(packaging)
  const rib = ribbonFee(ribbon)
  const custom = customizationFee(personalization)
  return {
    productsTotal,
    packagingFee: pack + rib,
    customizationFee: custom,
    totalPrice: productsTotal + pack + rib + custom,
  }
}

export function corporateDiscount(quantity) {
  if (quantity >= 100) return { rate: 0, customQuote: true }
  if (quantity >= 51) return { rate: 0.1, customQuote: false }
  if (quantity >= 21) return { rate: 0.05, customQuote: false }
  return { rate: 0, customQuote: false }
}
