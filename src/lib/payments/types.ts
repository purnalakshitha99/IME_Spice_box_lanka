export type PaymentMethod = 'PayHere' | 'Cash on Delivery' | 'Bank Transfer'

export interface CheckoutCustomer {
  name: string
  email: string
  phone: string
  address: string
  city: string
  district: string
  postalCode: string
}

export interface PaymentRequest {
  orderId: string
  amount: number
  itemsSummary: string
  customer: CheckoutCustomer
  method: PaymentMethod
}

export type PaymentResult =
  | { status: 'success'; orderId: string; provider: string; paymentId?: string }
  | { status: 'cancelled'; orderId: string }
  | { status: 'error'; orderId: string; message: string }

export interface PayHereHashResponse {
  merchant_id: string
  sandbox: boolean
  order_id: string
  amount: string
  currency: string
  hash: string
  notify_url: string
  items: string
}

declare global {
  interface Window {
    payhere?: {
      onCompleted: ((orderId: string) => void) | null
      onDismissed: (() => void) | null
      onError: ((error: string) => void) | null
      startPayment: (payment: Record<string, unknown>) => void
    }
  }
}
