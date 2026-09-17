import { CheckCircle2 } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import { Button } from '../components/Button'

export function OrderSuccessPage() {
  const [params] = useSearchParams()
  const orderId = params.get('orderId')
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center px-4 py-16 text-center">
      <CheckCircle2 className="h-16 w-16 text-gold" />
      <p className="mt-5 text-sm uppercase tracking-[.2em] text-forest">Order confirmed</p>
      <h1 className="mt-3 font-display text-4xl text-cinnamon">Your Sri Lankan gift journey has begun.</h1>
      <p className="mt-4 text-muted">We will send order and delivery updates to your email.</p>
      {orderId && <div className="mt-6 rounded-2xl bg-white px-6 py-4 ring-1 ring-cinnamon/10"><p className="text-xs uppercase tracking-wider text-muted">Order ID</p><p className="mt-1 font-display text-2xl text-cinnamon">{orderId}</p></div>}
      <div className="mt-8 flex flex-wrap justify-center gap-3"><Button to={`/track-order?order=${encodeURIComponent(orderId || '')}`}>Track order</Button><Button to="/" variant="outline">Return home</Button></div>
    </div>
  )
}
