import { Router } from 'express'
import { Product } from '../models/Product.js'

const router = Router()

router.get('/', async (req, res) => {
  const {
    q,
    category,
    minPrice,
    maxPrice,
    minRating,
    sort = 'featured',
    inStock,
    occasion,
    tag,
  } = req.query

  const filter = { active: true }
  if (category && category !== 'All') filter.category = category
  if (occasion) filter.occasions = occasion
  if (tag) filter.tags = tag
  if (inStock === 'true') filter.stock = { $gt: 0 }
  if (minRating) filter.rating = { $gte: Number(minRating) }
  if (minPrice || maxPrice) {
    filter.price = {}
    if (minPrice) filter.price.$gte = Number(minPrice)
    if (maxPrice) filter.price.$lte = Number(maxPrice)
  }
  if (q) {
    filter.$or = [
      { name: new RegExp(q, 'i') },
      { description: new RegExp(q, 'i') },
      { tags: new RegExp(q, 'i') },
      { category: new RegExp(q, 'i') },
    ]
  }

  let query = Product.find(filter)
  switch (sort) {
    case 'price-asc':
      query = query.sort({ price: 1 })
      break
    case 'price-desc':
      query = query.sort({ price: -1 })
      break
    case 'rating':
      query = query.sort({ rating: -1 })
      break
    case 'newest':
      query = query.sort({ createdAt: -1 })
      break
    case 'popular':
      query = query.sort({ bestSeller: -1, reviewCount: -1 })
      break
    default:
      query = query.sort({ featured: -1, bestSeller: -1 })
  }

  const products = await query.lean({ virtuals: true })
  res.json({ products })
})

router.get('/:idOrSlug', async (req, res) => {
  const key = req.params.idOrSlug
  const product =
    (await Product.findOne({ slug: key, active: true })) ||
    (await Product.findById(key).catch(() => null))
  if (!product) return res.status(404).json({ error: 'Product not found.' })
  res.json({ product })
})

export default router
