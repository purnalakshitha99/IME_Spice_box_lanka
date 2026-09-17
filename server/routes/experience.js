import { Router } from 'express'
import { Product } from '../models/Product.js'

const router = Router()

router.get('/:productId', async (req, res) => {
  const key = req.params.productId
  const product =
    (await Product.findOne({ slug: key, active: true })) ||
    (await Product.findById(key).catch(() => null))
  if (!product) return res.status(404).json({ error: 'Experience not found.' })

  res.json({
    experience: {
      id: product._id,
      slug: product.slug,
      title: product.name,
      image: product.images?.[0],
      whereItComesFrom: product.origin || 'Sri Lanka',
      heritage: product.heritage || product.culturalStory,
      production: product.production,
      howToUse: product.usage,
      recipe: product.recipe,
      productStory: product.culturalStory,
      category: product.category,
    },
  })
})

export default router
