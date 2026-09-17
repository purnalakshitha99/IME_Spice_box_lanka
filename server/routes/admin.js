import { Router } from 'express'
import QRCode from 'qrcode'
import { requireAuth, requireAdmin } from '../middleware/auth.js'
import { Product } from '../models/Product.js'
import { Order, CorporateOrder, Review, ContactEnquiry } from '../models/Order.js'
import { GiftBox } from '../models/GiftBox.js'
import { User } from '../models/User.js'

const router = Router()
router.use(requireAuth, requireAdmin)

router.get('/dashboard', async (_req, res) => {
  const [orders, products, users, corporate] = await Promise.all([
    Order.find(),
    Product.find(),
    User.countDocuments({ role: 'customer' }),
    CorporateOrder.find(),
  ])

  const totalSales = orders.reduce((s, o) => s + (o.pricing?.total || 0), 0)
  const pending = orders.filter((o) =>
    ['Order Placed', 'Payment Confirmed', 'Preparing'].includes(o.status),
  ).length
  const completed = orders.filter((o) => o.status === 'Delivered').length
  const lowStock = products.filter((p) => p.stock > 0 && p.stock < 20)
  const outOfStock = products.filter((p) => p.stock <= 0)

  const monthly = Array.from({ length: 12 }, (_, i) => ({ month: i + 1, sales: 0, orders: 0 }))
  for (const o of orders) {
    const m = new Date(o.createdAt).getMonth()
    monthly[m].sales += o.pricing?.total || 0
    monthly[m].orders += 1
  }

  const popularity = {}
  for (const o of orders) {
    for (const item of o.items || []) {
      const key = item.name || 'Unknown'
      popularity[key] = (popularity[key] || 0) + item.quantity
    }
  }
  const popularProducts = Object.entries(popularity)
    .map(([name, qty]) => ({ name, qty }))
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 8)

  res.json({
    metrics: {
      totalSales,
      totalOrders: orders.length,
      pendingOrders: pending,
      completedOrders: completed,
      customers: users,
      corporateOrders: corporate.length,
      lowStock: lowStock.length,
      outOfStock: outOfStock.length,
      products: products.length,
    },
    monthly,
    popularProducts,
    lowStockProducts: lowStock,
  })
})

router.get('/products', async (_req, res) => {
  const products = await Product.find().sort({ createdAt: -1 })
  res.json({ products })
})

router.post('/products', async (req, res) => {
  const product = await Product.create(req.body)
  product.qrPath = `/experience/${product.slug}`
  await product.save()
  res.status(201).json({ product })
})

router.put('/products/:id', async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true })
  if (!product) return res.status(404).json({ error: 'Product not found.' })
  res.json({ product })
})

router.delete('/products/:id', async (req, res) => {
  await Product.findByIdAndUpdate(req.params.id, { active: false })
  res.json({ message: 'Product archived.' })
})

router.post('/products/:id/qr', async (req, res) => {
  const product = await Product.findById(req.params.id)
  if (!product) return res.status(404).json({ error: 'Product not found.' })

  const base = process.env.PUBLIC_APP_URL || req.body.baseUrl || 'http://localhost:5174'
  const path = `/experience/${product.slug}`
  product.qrPath = path
  await product.save()

  const url = `${base.replace(/\/$/, '')}${path}`
  const dataUrl = await QRCode.toDataURL(url, { margin: 1, width: 512 })
  const png = await QRCode.toBuffer(url, { type: 'png', width: 512, margin: 1 })

  res.json({
    productId: product._id,
    qrPath: path,
    url,
    dataUrl,
    pngBase64: `data:image/png;base64,${png.toString('base64')}`,
  })
})

router.get('/orders', async (req, res) => {
  const filter = {}
  if (req.query.status) filter.status = req.query.status
  if (req.query.q) {
    filter.$or = [
      { orderId: new RegExp(req.query.q, 'i') },
      { 'customerSnapshot.name': new RegExp(req.query.q, 'i') },
      { 'customerSnapshot.email': new RegExp(req.query.q, 'i') },
    ]
  }
  const orders = await Order.find(filter).sort({ createdAt: -1 })
  res.json({ orders })
})

router.patch('/orders/:id/status', async (req, res) => {
  const order = await Order.findById(req.params.id)
  if (!order) return res.status(404).json({ error: 'Order not found.' })
  if (req.body.status) order.status = req.body.status
  if (req.body.paymentStatus) order.payment.status = req.body.paymentStatus
  await order.save()
  res.json({ order })
})

router.get('/inventory', async (_req, res) => {
  const products = await Product.find().sort({ stock: 1 })
  res.json({
    inventory: products.map((p) => ({
      id: p._id,
      name: p.name,
      stock: p.stock,
      minimum: 20,
      status: p.stock <= 0 ? 'Out of Stock' : p.stock < 20 ? 'Low Stock' : 'OK',
      price: p.price,
    })),
  })
})

router.get('/corporate-orders', async (_req, res) => {
  const orders = await CorporateOrder.find().sort({ createdAt: -1 })
  res.json({ corporateOrders: orders })
})

router.patch('/corporate-orders/:id', async (req, res) => {
  const order = await CorporateOrder.findByIdAndUpdate(req.params.id, req.body, { new: true })
  if (!order) return res.status(404).json({ error: 'Not found.' })
  res.json({ corporateOrder: order })
})

router.get('/qr-content', async (_req, res) => {
  const products = await Product.find().select(
    'name slug culturalStory heritage production usage recipe origin images qrPath',
  )
  res.json({ products })
})

router.put('/qr-content/:id', async (req, res) => {
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    {
      culturalStory: req.body.culturalStory,
      heritage: req.body.heritage,
      production: req.body.production,
      usage: req.body.usage,
      recipe: req.body.recipe,
      origin: req.body.origin,
    },
    { new: true },
  )
  if (!product) return res.status(404).json({ error: 'Not found.' })
  res.json({ product })
})

router.get('/enquiries', async (_req, res) => {
  const enquiries = await ContactEnquiry.find().sort({ createdAt: -1 })
  res.json({ enquiries })
})

router.get('/gift-boxes', async (_req, res) => {
  const giftBoxes = await GiftBox.find().populate('products')
  res.json({ giftBoxes })
})

router.get('/reviews', async (_req, res) => {
  const reviews = await Review.find().populate('customer', 'name').populate('product', 'name')
  res.json({ reviews })
})

export default router
