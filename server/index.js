import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { connectDb } from './db.js'
import { seedIfEmpty } from './seed.js'
import authRoutes from './routes/auth.js'
import productRoutes from './routes/products.js'
import giftBoxRoutes from './routes/giftBoxes.js'
import orderRoutes from './routes/orders.js'
import corporateRoutes from './routes/corporate.js'
import reviewRoutes from './routes/reviews.js'
import recommendRoutes from './routes/recommend.js'
import contactRoutes from './routes/contact.js'
import adminRoutes from './routes/admin.js'
import experienceRoutes from './routes/experience.js'
import wishlistRoutes from './routes/wishlist.js'
import { payhereRouter } from './routes/payments.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PORT = Number(process.env.PORT || 8787)

async function main() {
  await connectDb()
  await seedIfEmpty()

  const app = express()
  app.use(morgan('dev'))
  app.use(express.json({ limit: '5mb' }))

  const clientOrigins = (process.env.CLIENT_ORIGIN || '')
    .split(',')
    .map((o) => o.trim().replace(/\/+$/, ''))
    .filter(Boolean)

  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin) return callback(null, true)
        const normalized = origin.replace(/\/+$/, '')
        if (
          clientOrigins.includes(normalized) ||
          normalized.endsWith('.vercel.app') ||
          normalized.endsWith('.onrender.com') ||
          normalized.includes('localhost') ||
          normalized.includes('127.0.0.1')
        ) {
          return callback(null, true)
        }
        return callback(null, true)
      },
      credentials: true,
    }),
  )
  app.use(express.urlencoded({ extended: true }))
  app.use(cookieParser())
  app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

  app.get('/api/health', (_req, res) => res.json({ ok: true, brand: 'SpiceBox Lanka' }))

  app.use('/api/auth', authRoutes)
  app.use('/api/products', productRoutes)
  app.use('/api/gift-boxes', giftBoxRoutes)
  app.use('/api/orders', orderRoutes)
  app.use('/api/corporate', corporateRoutes)
  app.use('/api/reviews', reviewRoutes)
  app.use('/api/recommend', recommendRoutes)
  app.use('/api/contact', contactRoutes)
  app.use('/api/admin', adminRoutes)
  app.use('/api/experience', experienceRoutes)
  app.use('/api/wishlist', wishlistRoutes)
  app.use('/api/payments', payhereRouter)

  app.use((err, _req, res, _next) => {
    console.error(err)
    res.status(err.status || 500).json({ error: err.message || 'Server error' })
  })

  app.listen(PORT, () => {
    console.log(`[api] SpiceBox Lanka API → http://localhost:${PORT}`)
  })
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
