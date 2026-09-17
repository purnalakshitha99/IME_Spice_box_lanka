import { Router } from 'express'
import { GiftBox, CustomSpiceBox } from '../models/GiftBox.js'
import { Product } from '../models/Product.js'
import { requireAuth, authOptional } from '../middleware/auth.js'
import { calcCustomBoxTotals } from '../services/recommend.js'

const router = Router()

router.get('/', async (_req, res) => {
  const boxes = await GiftBox.find({ active: true }).populate('products').sort({ basePrice: 1 })
  res.json({ giftBoxes: boxes })
})

router.post('/custom/calculate', async (req, res) => {
  const { products = [], packaging, ribbon, personalization, budget } = req.body
  const totals = calcCustomBoxTotals({ products, packaging, ribbon, personalization })
  const exceeds = budget != null && totals.totalPrice > Number(budget)
  res.json({
    ...totals,
    budget: budget != null ? Number(budget) : null,
    remaining: budget != null ? Number(budget) - totals.totalPrice : null,
    exceedsBudget: exceeds,
    message: exceeds ? 'Your selected products exceed the current budget.' : undefined,
  })
})

router.get('/custom/mine', requireAuth, async (req, res) => {
  const boxes = await CustomSpiceBox.find({ user: req.user._id, saved: true })
    .populate('products.product')
    .sort({ updatedAt: -1 })
  res.json({ customBoxes: boxes })
})

router.post('/custom', authOptional, async (req, res) => {
  try {
    const {
      occasion,
      recipient,
      budget,
      products,
      packaging,
      ribbon,
      cardType,
      personalization,
      confirmOverBudget,
      saved,
    } = req.body

    if (!occasion) return res.status(400).json({ error: 'Please select an occasion.' })
    if (!budget) return res.status(400).json({ error: 'Please select a budget.' })
    if (!products?.length) return res.status(400).json({ error: 'Please add at least one product.' })

    const validated = []
    for (const line of products) {
      const product = await Product.findById(line.productId || line.product)
      if (!product || !product.active) {
        return res.status(400).json({ error: `Product unavailable: ${line.name || line.productId}` })
      }
      if (product.stock < (line.quantity || 1)) {
        return res.status(400).json({
          error:
            product.stock <= 0
              ? `${product.name} is currently out of stock.`
              : `Only ${product.stock} left for ${product.name}.`,
        })
      }
      validated.push({
        product: product._id,
        quantity: line.quantity || 1,
        priceAtAdd: product.price,
        name: product.name,
      })
    }

    const totals = calcCustomBoxTotals({
      products: validated,
      packaging,
      ribbon,
      personalization,
    })

    if (totals.totalPrice > Number(budget) && !confirmOverBudget) {
      return res.status(400).json({
        error: 'Your selected products exceed the current budget.',
        ...totals,
        exceedsBudget: true,
      })
    }

    const box = await CustomSpiceBox.create({
      user: req.user?._id,
      occasion,
      recipient,
      budget: Number(budget),
      products: validated,
      packaging: packaging || 'Classic',
      ribbon: ribbon || 'Standard',
      cardType,
      personalization,
      productsTotal: totals.productsTotal,
      packagingFee: totals.packagingFee,
      customizationFee: totals.customizationFee,
      totalPrice: totals.totalPrice,
      saved: Boolean(saved),
    })

    res.status(201).json({ customBox: box })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

router.get('/:idOrSlug', async (req, res) => {
  const key = req.params.idOrSlug
  const box =
    (await GiftBox.findOne({ slug: key, active: true }).populate('products')) ||
    (await GiftBox.findById(key).populate('products').catch(() => null))
  if (!box) return res.status(404).json({ error: 'Gift box not found.' })
  res.json({ giftBox: box })
})

export default router
