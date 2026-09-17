import { fetchPaymentConfig, startPayHereCheckout } from './payhere'
import type { PaymentRequest, PaymentResult } from './types'

/**
 * Unified payment facade.
 * - PayHere (when merchant credentials + hash API are configured)
 * - Demo card modal (when PayHere is not configured) — for local/university demos
 * - COD / Bank Transfer — confirm without gateway
 */
export async function processPayment(
  request: PaymentRequest,
  demoPay?: () => Promise<PaymentResult>,
): Promise<PaymentResult> {
  if (request.method === 'Cash on Delivery' || request.method === 'Bank Transfer') {
    return {
      status: 'success',
      orderId: request.orderId,
      provider: request.method,
    }
  }

  const config = await fetchPaymentConfig()

  if (config.configured) {
    try {
      const result = await startPayHereCheckout({
        orderId: request.orderId,
        amount: request.amount,
        itemsSummary: request.itemsSummary,
        customer: request.customer,
      })
      return {
        status: 'success',
        orderId: result.orderId,
        provider: 'PayHere',
        paymentId: result.paymentId,
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Payment failed'
      if ((err as { code?: string })?.code === 'dismissed' || message.includes('dismissed')) {
        return { status: 'cancelled', orderId: request.orderId }
      }
      return { status: 'error', orderId: request.orderId, message }
    }
  }

  if (demoPay) {
    return demoPay()
  }

  return {
    status: 'error',
    orderId: request.orderId,
    message: 'Payment gateway is not configured.',
  }
}

export { fetchPaymentConfig }
