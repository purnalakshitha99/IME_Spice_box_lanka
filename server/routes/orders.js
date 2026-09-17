import { Router } from 'express'
import { Product } from '../models/Product.js'
import { Order } from '../models/Order.js'
import { CustomSpiceBox } from '../models/GiftBox.js'
import { requireAuth, authOptional } from '../middleware/auth.js'
import { calcCustomBoxTotals } from '../services/recommend.js'

const router = Router()

async function nextOrderId() {
  const year = new Date().getFullYear()
  const count = await Order.countDocuments()
  return `SBL-${year}-${String(count + 1).padStart(6, '0')}`
}

function deliveryFee(method) {
  if (method === 'Express Delivery') return 750
  if (method === 'Pickup') return 0
  return 350
}

router.post('/quote', async (req, res) => {
  try {
    const { items = [], customBoxId, deliveryMethod = 'Standard Delivery' } = req.body
    let subtotal = 0
    let packaging = 0
    let customization = 0
    const lines = []

    for (const item of items) {
      if (item.type === 'custom' && item.customBoxId) continue
      const product = await Product.findById(item.productId)
      if (!product) return res.status(400).json({ error: 'Invalid product in cart.' })
      if (product.stock < (item.quantity || 1)) {
        return res.status(400).json({
          error:
            product.stock <= 0
              ? `${product.name} is currently out of stock.`
              : `Insufficient stock for ${product.name}.`,
        })
      }
      const qty = item.quantity || 1
      subtotal += product.price * qty
      lines.push({
        product: product._id,
        name: product.name,
        image: product.images?.[0],
        price: product.price,
        quantity: qty,
        customization: item.customization,
      })
    }

    let customBox = null
    if (customBoxId) {
      customBox = await CustomSpiceBox.findById(customBoxId)
      if (!customBox) return res.status(400).json({ error: 'Custom SpiceBox not found.' })
      const totals = calcCustomBoxTotals({
        products: customBox.products,
        packaging: customBox.packaging,
        ribbon: customBox.ribbon,
        personalization: customBox.personalization,
      })
      subtotal += totals.productsTotal
      packaging += totals.packagingFee
      customization += totals.customizationFee
    }

    const delivery = deliveryFee(deliveryMethod)
    const discount = subtotal > 8000 ? 500 : 0
    const total = subtotal + packaging + customization + delivery - discount

    res.json({
      lines,
      pricing: { subtotal, packaging, customization, delivery, discount, total },
      customBox,
    })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

router.post('/', authOptional, async (req, res) => {
  try {
    const {
      customer,
      items = [],
      customBoxId,
      delivery,
      paymentMethod = 'Demo Card',
      personalization,
    } = req.body

    if (!customer?.name || !customer?.email || !customer?.phone) {
      return res.status(400).json({ error: 'Customer name, email and phone are required.' })
    }
    if (!delivery?.address || !delivery?.city) {
      return res.status(400).json({ error: 'Delivery address and city are required.' })
    }

    let subtotal = 0
    let packaging = 0
    let customization = 0
    const lines = []

    for (const item of items) {
      const product = await Product.findById(item.productId)
      if (!product) return res.status(400).json({ error: 'Invalid product in cart.' })
      const qty = item.quantity || 1
      if (product.stock < qty) {
        return res.status(400).json({ error: `${product.name} is currently out of stock.` })
      }
      subtotal += product.price * qty
      lines.push({
        product: product._id,
        name: product.name,
        image: product.images?.[0],
        price: product.price,
        quantity: qty,
        customization: item.customization,
      })
      product.stock -= qty
      await product.save()
    }

    let customBox = null
    if (customBoxId) {
      customBox = await CustomSpiceBox.findById(customBoxId).populate('products.product')
      if (!customBox) return res.status(400).json({ error: 'Custom SpiceBox not found.' })
      const totals = calcCustomBoxTotals({
        products: customBox.products,
        packaging: customBox.packaging,
        ribbon: customBox.ribbon,
        personalization: customBox.personalization,
      })
      subtotal += totals.productsTotal
      packaging += totals.packagingFee
      customization += totals.customizationFee

      for (const line of customBox.products) {
        const p = await Product.findById(line.product)
        if (p) {
          if (p.stock < line.quantity) {
            return res.status(400).json({ error: `${p.name} is currently out of stock.` })
          }
          p.stock -= line.quantity
          await p.save()
        }
        lines.push({
          product: line.product,
          name: line.name,
          price: line.priceAtAdd,
          quantity: line.quantity,
          customization: customBox.personalization,
        })
      }
    }

    const dFee = deliveryFee(delivery.method || 'Standard Delivery')
    const discount = subtotal > 8000 ? 500 : 0
    const total = subtotal + packaging + customization + dFee - discount

    let paymentStatus = 'Pending'
    if (paymentMethod === 'Cash on Delivery') paymentStatus = 'COD'
    else if (paymentMethod === 'Bank Transfer') paymentStatus = 'Bank Transfer'
    else paymentStatus = 'Paid'

    const orderId = await nextOrderId()
    const order = await Order.create({
      orderId,
      customer: req.user?._id,
      customerSnapshot: {
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
      },
      items: lines,
      customBox: customBox?._id,
      personalization: personalization || customBox?.personalization,
      delivery: {
        address: delivery.address,
        city: delivery.city,
        district: delivery.district,
        postalCode: delivery.postalCode,
        method: delivery.method || 'Standard Delivery',
        fee: dFee,
      },
      payment: {
        method: paymentMethod,
        status: paymentStatus,
        provider: paymentMethod.includes('PayHere') ? 'PayHere' : paymentMethod,
        paymentId: req.body.paymentId,
      },
      pricing: {
        subtotal,
        packaging,
        customization,
        delivery: dFee,
        discount,
        total,
      },
      status: paymentStatus === 'Paid' || paymentStatus === 'COD' ? 'Payment Confirmed' : 'Order Placed',
    })

    if (req.user) {
      req.user.loyaltyPoints += Math.floor(total / 100)
      if (req.user.loyaltyPoints >= 1000) req.user.loyaltyLevel = 'Spice Master'
      else if (req.user.loyaltyPoints >= 300) req.user.loyaltyLevel = 'Spice Explorer'
      await req.user.save()
    }

    res.status(201).json({
      order,
      message: 'Your order has been successfully placed.',
    })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: e.message })
  }
})

router.get('/mine', requireAuth, async (req, res) => {
  const orders = await Order.find({
    $or: [{ customer: req.user._id }, { 'customerSnapshot.email': req.user.email }],
  }).sort({ createdAt: -1 })
  res.json({ orders })
})

router.get('/track', async (req, res) => {
  const { orderId, email, phone } = req.query
  if (!orderId) return res.status(400).json({ error: 'Order ID is required.' })
  const order = await Order.findOne({ orderId })
  if (!order) return res.status(404).json({ error: 'Order not found.' })
  if (email && order.customerSnapshot.email?.toLowerCase() !== String(email).toLowerCase()) {
    return res.status(403).json({ error: 'Email does not match this order.' })
  }
  if (phone && order.customerSnapshot.phone !== phone) {
    return res.status(403).json({ error: 'Phone does not match this order.' })
  }
  res.json({ order })
})

router.get('/:orderId', requireAuth, async (req, res) => {
  const order = await Order.findOne({ orderId: req.params.orderId })
  if (!order) return res.status(404).json({ error: 'Order not found.' })
  res.json({ order })
})

export default router
