import { Router } from 'express'
import { createHash } from 'node:crypto'

export const payhereRouter = Router()

const MERCHANT_ID = process.env.PAYHERE_MERCHANT_ID || ''
const MERCHANT_SECRET = process.env.PAYHERE_MERCHANT_SECRET || ''
const NOTIFY_URL = process.env.PAYHERE_NOTIFY_URL || 'https://www.payhere.lk/notify'
const SANDBOX = (process.env.PAYHERE_SANDBOX || 'true') !== 'false'

function md5(value) {
  return createHash('md5').update(value).digest('hex').toUpperCase()
}

payhereRouter.get('/config', (_req, res) => {
  res.json({
    configured: Boolean(MERCHANT_ID && MERCHANT_SECRET),
    sandbox: SANDBOX,
    merchantId: MERCHANT_ID || null,
    currency: 'LKR',
    provider: 'payhere',
  })
})

payhereRouter.post('/payhere/hash', (req, res) => {
  if (!MERCHANT_ID || !MERCHANT_SECRET) {
    return res.status(503).json({
      error: 'PayHere is not configured.',
      demoMode: true,
    })
  }
  const orderId = req.body.orderId || `SB-${Date.now()}`
  const currency = req.body.currency || 'LKR'
  const amount = Number(req.body.amount || 0)
  if (!amount || amount <= 0) return res.status(400).json({ error: 'Invalid amount' })
  const amountFormatted = amount.toFixed(2)
  const hash = md5(MERCHANT_ID + orderId + amountFormatted + currency + md5(MERCHANT_SECRET))
  res.json({
    merchant_id: MERCHANT_ID,
    sandbox: SANDBOX,
    order_id: orderId,
    amount: amountFormatted,
    currency,
    hash,
    notify_url: NOTIFY_URL,
    items: req.body.items || 'SpiceBox Lanka Order',
  })
})

payhereRouter.post('/payhere/notify', (req, res) => {
  console.log('[PayHere notify]', req.body)
  res.json({ received: true })
})

payhereRouter.post('/demo/confirm', (req, res) => {
  const { orderId, amount } = req.body
  if (!orderId || !amount) return res.status(400).json({ error: 'orderId and amount required' })
  res.json({
    status: 'success',
    orderId,
    paymentId: `DEMO-${Date.now().toString().slice(-8)}`,
    provider: 'Demo Card (PayHere-ready)',
  })
})
