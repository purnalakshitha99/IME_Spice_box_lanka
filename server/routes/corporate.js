import { Router } from 'express'
import multer from 'multer'
import path from 'node:path'
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import { CorporateOrder } from '../models/Order.js'
import { Product } from '../models/Product.js'
import { corporateDiscount } from '../services/recommend.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const uploadDir = path.join(__dirname, '../uploads/logos')
fs.mkdirSync(uploadDir, { recursive: true })

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const safe = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_')
    cb(null, `${Date.now()}-${safe}`)
  },
})
const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) return cb(new Error('Logo must be an image.'))
    cb(null, true)
  },
})

const router = Router()

router.post('/calculate', (req, res) => {
  const numberOfBoxes = Number(req.body.numberOfBoxes || 0)
  const budgetPerBox = Number(req.body.budgetPerBox || 0)
  if (numberOfBoxes < 1 || budgetPerBox <= 0) {
    return res.status(400).json({ error: 'Valid number of boxes and budget per box are required.' })
  }
  const discount = corporateDiscount(numberOfBoxes)
  const raw = numberOfBoxes * budgetPerBox
  const estimatedValue = discount.customQuote ? raw : Math.round(raw * (1 - discount.rate))
  res.json({
    numberOfBoxes,
    budgetPerBox,
    totalBudget: raw,
    estimatedValue,
    discountRate: discount.rate,
    customQuote: discount.customQuote,
    message: discount.customQuote
      ? '100+ boxes — custom quotation recommended.'
      : discount.rate
        ? `${discount.rate * 100}% volume discount applied.`
        : 'Standard pricing.',
  })
})

router.post('/', upload.single('logo'), async (req, res) => {
  try {
    const body = req.body
    const numberOfBoxes = Number(body.numberOfBoxes)
    const budgetPerBox = Number(body.budgetPerBox)
    if (!body.companyName || !body.contactPerson || !body.email) {
      return res.status(400).json({ error: 'Company name, contact person and email are required.' })
    }
    if (!numberOfBoxes || numberOfBoxes < 1) {
      return res.status(400).json({ error: 'Corporate order must contain a valid number of boxes.' })
    }
    if (!budgetPerBox || budgetPerBox <= 0) {
      return res.status(400).json({ error: 'Corporate budget must be valid.' })
    }

    let products = []
    if (body.products) {
      const parsed = typeof body.products === 'string' ? JSON.parse(body.products) : body.products
      for (const line of parsed) {
        const p = await Product.findById(line.productId)
        if (!p) continue
        products.push({
          product: p._id,
          name: p.name,
          quantity: Number(line.quantity || numberOfBoxes),
          unitPrice: p.price,
        })
      }
    }

    const discount = corporateDiscount(numberOfBoxes)
    const raw = numberOfBoxes * budgetPerBox
    const estimatedValue = discount.customQuote ? raw : Math.round(raw * (1 - discount.rate))
    const logoUrl = req.file ? `/uploads/logos/${req.file.filename}` : body.logoUrl

    const order = await CorporateOrder.create({
      companyName: body.companyName,
      contactPerson: body.contactPerson,
      email: body.email,
      phone: body.phone,
      numberOfBoxes,
      budgetPerBox,
      totalBudget: raw,
      estimatedValue,
      occasion: body.occasion,
      deliveryDate: body.deliveryDate,
      logoUrl,
      message: body.message,
      packaging: body.packaging,
      productPreferences: body.productPreferences
        ? typeof body.productPreferences === 'string'
          ? JSON.parse(body.productPreferences)
          : body.productPreferences
        : [],
      products,
      status: 'Quote Requested',
    })

    res.status(201).json({
      corporateOrder: order,
      message: 'Corporate quote request submitted successfully.',
    })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

export default router
