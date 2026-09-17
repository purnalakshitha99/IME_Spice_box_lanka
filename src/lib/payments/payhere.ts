import type { CheckoutCustomer, PayHereHashResponse } from './types'
import { API_BASE_URL } from '../api'

const SDK_URL = 'https://www.payhere.lk/lib/payhere.js'

let sdkPromise: Promise<void> | null = null

export function loadPayHereSdk(): Promise<void> {
  if (typeof window === 'undefined') return Promise.reject(new Error('No window'))
  if (window.payhere) return Promise.resolve()
  if (sdkPromise) return sdkPromise

  sdkPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${SDK_URL}"]`)
    if (existing) {
      existing.addEventListener('load', () => resolve())
      existing.addEventListener('error', () => reject(new Error('PayHere SDK failed to load')))
      return
    }
    const script = document.createElement('script')
    script.src = SDK_URL
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('PayHere SDK failed to load'))
    document.body.appendChild(script)
  })

  return sdkPromise
}

export async function fetchPaymentConfig() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/payments/config`)
    if (!res.ok) return { configured: false, sandbox: true, provider: 'payhere' as const }
    return (await res.json()) as {
      configured: boolean
      sandbox: boolean
      merchantId: string | null
      currency: string
      provider: string
    }
  } catch {
    return { configured: false, sandbox: true, provider: 'payhere' as const }
  }
}

export async function requestPayHereHash(input: {
  orderId: string
  amount: number
  items: string
}): Promise<PayHereHashResponse> {
  const res = await fetch(`${API_BASE_URL}/api/payments/payhere/hash`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
  const data = await res.json()
  if (!res.ok) {
    throw Object.assign(new Error(data.error || 'Hash request failed'), { data })
  }
  return data as PayHereHashResponse
}

function splitName(full: string) {
  const parts = full.trim().split(/\s+/)
  return {
    first_name: parts[0] || 'Customer',
    last_name: parts.slice(1).join(' ') || 'SpiceBox',
  }
}

export async function startPayHereCheckout(opts: {
  orderId: string
  amount: number
  itemsSummary: string
  customer: CheckoutCustomer
}): Promise<{ orderId: string; paymentId?: string }> {
  await loadPayHereSdk()
  if (!window.payhere) throw new Error('PayHere SDK unavailable')

  const hashPayload = await requestPayHereHash({
    orderId: opts.orderId,
    amount: opts.amount,
    items: opts.itemsSummary,
  })

  const { first_name, last_name } = splitName(opts.customer.name)

  return new Promise((resolve, reject) => {
    window.payhere!.onCompleted = (orderId) => {
      resolve({ orderId, paymentId: orderId })
    }
    window.payhere!.onDismissed = () => {
      reject(Object.assign(new Error('Payment dismissed'), { code: 'dismissed' }))
    }
    window.payhere!.onError = (error) => {
      reject(new Error(error || 'Payment failed'))
    }

    window.payhere!.startPayment({
      sandbox: hashPayload.sandbox,
      merchant_id: hashPayload.merchant_id,
      return_url: undefined,
      cancel_url: undefined,
      notify_url: hashPayload.notify_url,
      order_id: hashPayload.order_id,
      items: hashPayload.items,
      amount: hashPayload.amount,
      currency: hashPayload.currency,
      hash: hashPayload.hash,
      first_name,
      last_name,
      email: opts.customer.email,
      phone: opts.customer.phone,
      address: opts.customer.address,
      city: opts.customer.city,
      country: 'Sri Lanka',
    })
  })
}
