import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import { Product } from '../models/Product.js'

const router = Router()

router.get('/', requireAuth, async (req, res) => {
  await req.user.populate('wishlist')
  res.json({ wishlist: req.user.wishlist })
})

router.post('/:productId', requireAuth, async (req, res) => {
  const product = await Product.findById(req.params.productId)
  if (!product) return res.status(404).json({ error: 'Product not found.' })
  const id = product._id.toString()
  const has = req.user.wishlist.some((w) => w.toString() === id)
  if (!has) req.user.wishlist.push(product._id)
  await req.user.save()
  res.json({ wishlist: req.user.wishlist, message: 'Added to wishlist.' })
})

router.delete('/:productId', requireAuth, async (req, res) => {
  req.user.wishlist = req.user.wishlist.filter((w) => w.toString() !== req.params.productId)
  await req.user.save()
  res.json({ wishlist: req.user.wishlist, message: 'Removed from wishlist.' })
})

export default router
