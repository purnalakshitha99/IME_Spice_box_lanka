import { useState } from 'react'
import { Lock } from 'lucide-react'
import { Button } from './Button'
import { formatLKR } from '../data/products'
import type { PaymentResult } from '../lib/payments/types'

interface Props {
  open: boolean
  orderId: string
  amount: number
  onResult: (result: PaymentResult) => void
  onClose: () => void
}

/** Branded demo checkout when PayHere merchant keys are not configured. */
export function PaymentModal({ open, orderId, amount, onResult, onClose }: Props) {
  const [card, setCard] = useState('4111111111111111')
  const [expiry, setExpiry] = useState('12/28')
  const [cvc, setCvc] = useState('123')
  const [name, setName] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  if (!open) return null

  const pay = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (card.replace(/\s/g, '').length < 15 || !expiry || cvc.length < 3 || !name.trim()) {
      setError('Please enter valid card details.')
      return
    }
    setBusy(true)
    await new Promise((r) => setTimeout(r, 1400))
    setBusy(false)
    onResult({
      status: 'success',
      orderId,
      provider: 'Demo Card (PayHere-ready)',
      paymentId: `DEMO-${Date.now().toString().slice(-8)}`,
    })
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-cinnamon/50 p-4 backdrop-blur-sm sm:items-center">
      <div
        role="dialog"
        aria-modal
        className="w-full max-w-md overflow-hidden rounded-3xl bg-cream shadow-2xl"
      >
        <div className="bg-cinnamon px-6 py-5 text-cream">
          <div className="flex items-center gap-2 text-gold">
            <Lock className="h-4 w-4" />
            <span className="text-xs font-semibold uppercase tracking-[0.2em]">Secure Payment</span>
          </div>
          <h2 className="mt-2 font-display text-2xl">Pay with Card</h2>
          <p className="mt-1 text-sm text-cream/75">
            Demo gateway · switches to PayHere when merchant keys are set
          </p>
          <p className="mt-3 font-display text-3xl text-gold">{formatLKR(amount)}</p>
          <p className="text-xs text-cream/60">Order {orderId}</p>
        </div>

        <form onSubmit={pay} className="space-y-3 p-6">
          <label className="block text-sm">
            <span className="text-muted">Name on card</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-xl border border-cinnamon/15 bg-white px-4 py-2.5"
              placeholder="As printed on card"
              required
            />
          </label>
          <label className="block text-sm">
            <span className="text-muted">Card number</span>
            <input
              value={card}
              onChange={(e) => setCard(e.target.value)}
              className="mt-1 w-full rounded-xl border border-cinnamon/15 bg-white px-4 py-2.5"
              inputMode="numeric"
              required
            />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block text-sm">
              <span className="text-muted">Expiry</span>
              <input
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                className="mt-1 w-full rounded-xl border border-cinnamon/15 bg-white px-4 py-2.5"
                placeholder="MM/YY"
                required
              />
            </label>
            <label className="block text-sm">
              <span className="text-muted">CVC</span>
              <input
                value={cvc}
                onChange={(e) => setCvc(e.target.value)}
                className="mt-1 w-full rounded-xl border border-cinnamon/15 bg-white px-4 py-2.5"
                required
              />
            </label>
          </div>
          {error && <p className="text-sm text-clay">{error}</p>}
          <div className="flex gap-2 pt-2">
            <Button type="button" variant="ghost" className="flex-1" onClick={onClose} disabled={busy}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={busy}>
              {busy ? 'Processing…' : `Pay ${formatLKR(amount)}`}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
