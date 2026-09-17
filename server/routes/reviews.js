import { Router } from 'express'
import { Review, ContactEnquiry } from '../models/Order.js'
import { Product } from '../models/Product.js'
import { Order } from '../models/Order.js'
import { requireAuth } from '../middleware/auth.js'

const reviews = Router()

reviews.get('/product/:productId', async (req, res) => {
  const list = await Review.find({ product: req.params.productId })
    .populate('customer', 'name')
    .sort({ createdAt: -1 })
  res.json({ reviews: list })
})

reviews.post('/', requireAuth, async (req, res) => {
  try {
    const { productId, rating, comment, image, orderId } = req.body
    if (!productId || !rating) return res.status(400).json({ error: 'Product and rating required.' })

    const completed = await Order.findOne({
      customer: req.user._id,
      status: { $in: ['Delivered', 'Dispatched', 'Packed', 'Payment Confirmed', 'Preparing', 'Quality Checked'] },
      'items.product': productId,
    })
    if (!completed && !orderId) {
      return res.status(403).json({ error: 'Only customers who ordered this product can review it.' })
    }

    const review = await Review.findOneAndUpdate(
      { customer: req.user._id, product: productId },
      { rating, comment, image, order: completed?._id },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    )

    const agg = await Review.aggregate([
      { $match: { product: review.product } },
      { $group: { _id: '$product', avg: { $avg: '$rating' }, count: { $sum: 1 } } },
    ])
    if (agg[0]) {
      await Product.findByIdAndUpdate(productId, {
        rating: Math.round(agg[0].avg * 10) / 10,
        reviewCount: agg[0].count,
      })
    }

    res.status(201).json({ review })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

export default reviews

export const contactRouter = Router()
contactRouter.post('/', async (req, res) => {
  const { name, email, phone, message } = req.body
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email and message are required.' })
  }
  const enquiry = await ContactEnquiry.create({ name, email, phone, message })
  res.status(201).json({ enquiry, message: 'Enquiry submitted. We will reply soon.' })
})
