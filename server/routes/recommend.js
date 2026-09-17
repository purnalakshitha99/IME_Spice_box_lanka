import { Router } from 'express'
import { Product } from '../models/Product.js'
import { recommendProducts } from '../services/recommend.js'

const router = Router()

router.post('/', async (req, res) => {
  const products = await Product.find({ active: true, stock: { $gt: 0 } })
  const result = recommendProducts(products, req.body || {})
  res.json(result)
})

export default router
