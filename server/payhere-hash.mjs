import { createHash } from 'node:crypto'
import { createServer } from 'node:http'
import { URL } from 'node:url'

/**
 * PayHere hash API — Merchant Secret stays on the server only.
 *
 * Env:
 *   PAYHERE_MERCHANT_ID
 *   PAYHERE_MERCHANT_SECRET
 *   PAYHERE_NOTIFY_URL (optional)
 *   PAYMENT_PORT (default 8787)
 */

const PORT = Number(process.env.PAYMENT_PORT || 8787)
const MERCHANT_ID = process.env.PAYHERE_MERCHANT_ID || ''
const MERCHANT_SECRET = process.env.PAYHERE_MERCHANT_SECRET || ''
const NOTIFY_URL = process.env.PAYHERE_NOTIFY_URL || 'https://www.payhere.lk/notify'
const SANDBOX = (process.env.PAYHERE_SANDBOX || 'true') !== 'false'

function md5(value) {
  return createHash('md5').update(value).digest('hex').toUpperCase()
}

function payhereHash(orderId, amount, currency) {
  const amountFormatted = Number(amount).toFixed(2)
  return md5(MERCHANT_ID + orderId + amountFormatted + currency + md5(MERCHANT_SECRET))
}

function json(res, status, body) {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  })
  res.end(JSON.stringify(body))
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = []
    req.on('data', (c) => chunks.push(c))
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
    req.on('error', reject)
  })
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url || '/', `http://localhost:${PORT}`)

  if (req.method === 'OPTIONS') {
    return json(res, 204, {})
  }

  if (url.pathname === '/api/payments/config' && req.method === 'GET') {
    return json(res, 200, {
      configured: Boolean(MERCHANT_ID && MERCHANT_SECRET),
      sandbox: SANDBOX,
      merchantId: MERCHANT_ID || null,
      currency: 'LKR',
      provider: 'payhere',
    })
  }

  if (url.pathname === '/api/payments/payhere/hash' && req.method === 'POST') {
    if (!MERCHANT_ID || !MERCHANT_SECRET) {
      return json(res, 503, {
        error: 'PayHere is not configured. Set PAYHERE_MERCHANT_ID and PAYHERE_MERCHANT_SECRET.',
        demoMode: true,
      })
    }

    try {
      const raw = await readBody(req)
      const body = JSON.parse(raw || '{}')

      const orderId = body.orderId || `SB-${Date.now()}`
      const currency = body.currency || 'LKR'
      const amount = Number(body.amount || 0)
      if (!amount || amount <= 0) {
        return json(res, 400, { error: 'Invalid amount' })
      }

      const amountFormatted = amount.toFixed(2)
      const hash = payhereHash(orderId, amountFormatted, currency)

      return json(res, 200, {
        merchant_id: MERCHANT_ID,
        sandbox: SANDBOX,
        order_id: orderId,
        amount: amountFormatted,
        currency,
        hash,
        notify_url: NOTIFY_URL,
        items: body.items || 'SpiceBox Lanka Order',
      })
    } catch {
      return json(res, 400, { error: 'Invalid JSON body' })
    }
  }

  if (url.pathname === '/api/payments/payhere/notify' && req.method === 'POST') {
    const raw = await readBody(req)
    console.log('[PayHere notify]', raw.slice(0, 500))
    return json(res, 200, { received: true })
  }

  json(res, 404, { error: 'Not found' })
})

server.listen(PORT, () => {
  console.log(`[payment] PayHere hash server on http://localhost:${PORT}`)
  console.log(
    MERCHANT_ID && MERCHANT_SECRET
      ? '[payment] Merchant credentials loaded'
      : '[payment] Demo mode — set PAYHERE_MERCHANT_ID + PAYHERE_MERCHANT_SECRET for live sandbox',
  )
})
