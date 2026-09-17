import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Button } from '../components/Button'
import { api } from '../lib/api'
import { useToastStore } from '../store/toastStore'

const timeline = ['Order Placed', 'Payment Confirmed', 'Preparing', 'Personalizing', 'Quality Checked', 'Packed', 'Dispatched', 'Delivered']
interface TrackedOrder { orderId: string; status: string; customerSnapshot: { name: string }; delivery: { city: string; method: string }; pricing: { total: number } }

export function TrackPage() {
  const [params] = useSearchParams()
  const [orderId, setOrderId] = useState(params.get('order') || '')
  const [email, setEmail] = useState('')
  const [order, setOrder] = useState<TrackedOrder | null>(null)
  const [busy, setBusy] = useState(false)
  const push = useToastStore((s) => s.push)
  const track = async () => {
    setBusy(true)
    try {
      const query = new URLSearchParams({ orderId })
      if (email) query.set('email', email)
      const result = await api<{ order: TrackedOrder }>(`/orders/track?${query}`)
      setOrder(result.order)
    } catch (error) { setOrder(null); push(error instanceof Error ? error.message : 'Order not found', 'error') } finally { setBusy(false) }
  }
  const current = order ? timeline.indexOf(order.status) : -1
  return <div className="mx-auto max-w-2xl px-4 py-12 md:px-6"><h1 className="font-display text-4xl text-cinnamon">Track Your Order</h1><p className="mt-2 text-muted">Enter your order ID and the email used at checkout.</p><form className="mt-8 grid gap-4 rounded-3xl bg-white p-6 ring-1 ring-cinnamon/10" onSubmit={(event) => { event.preventDefault(); void track() }}><input required value={orderId} onChange={(e) => setOrderId(e.target.value)} placeholder="SBL-2026-000001" className="rounded-xl border border-cinnamon/15 bg-cream px-4 py-3" /><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email (recommended)" className="rounded-xl border border-cinnamon/15 bg-cream px-4 py-3" /><Button type="submit" disabled={busy}>{busy ? 'Checking…' : 'Track order'}</Button></form>{order && <section className="mt-8 rounded-3xl bg-white p-6 ring-1 ring-cinnamon/10"><div className="flex justify-between gap-3"><div><p className="font-display text-2xl text-cinnamon">{order.orderId}</p><p className="text-sm text-muted">{order.customerSnapshot.name} · {order.delivery.city}</p></div><span className="h-fit rounded-full bg-forest/10 px-3 py-1 text-sm text-forest">{order.status}</span></div><ol className="mt-8 space-y-3">{timeline.map((status, index) => <li key={status} className={`flex items-center gap-3 ${index <= current ? 'text-cinnamon' : 'text-muted/50'}`}><span className={`grid h-7 w-7 place-items-center rounded-full text-xs ${index <= current ? 'bg-forest text-cream' : 'bg-cream-dark'}`}>{index + 1}</span>{status}</li>)}</ol></section>}</div>
}
