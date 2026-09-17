import { useEffect, useState } from 'react'
import { Gift, ShoppingBag } from 'lucide-react'
import { useParams } from 'react-router-dom'
import { Button } from '../components/Button'
import { formatLKR } from '../data/products'
import { api } from '../lib/api'
import { useCartStore } from '../store/cartStore'
import { useToastStore } from '../store/toastStore'

interface GiftBox {
  _id: string
  name: string
  slug: string
  description: string
  basePrice: number
  image: string
  category: string
  products?: { name: string }[]
}

export function GiftBoxesPage() {
  const [boxes, setBoxes] = useState<GiftBox[]>([])
  const [error, setError] = useState('')
  const addItem = useCartStore((s) => s.addItem)
  const push = useToastStore((s) => s.push)

  useEffect(() => {
    api<{ giftBoxes: GiftBox[] }>('/gift-boxes').then((result) => setBoxes(result.giftBoxes)).catch((reason) => setError(reason instanceof Error ? reason.message : 'Gift boxes unavailable'))
  }, [])

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 md:px-6">
      <div className="mx-auto max-w-2xl text-center"><Gift className="mx-auto h-8 w-8 text-gold" /><h1 className="mt-3 font-display text-4xl text-cinnamon md:text-5xl">Sri Lankan Gift Boxes</h1><p className="mt-3 text-muted">From a charming Mini to a Luxury heritage journey — ready to give, easy to personalize.</p></div>
      {error && <p className="mt-12 text-center text-clay">{error}</p>}
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {boxes.map((box, index) => (
          <article key={box._id} className="flex flex-col overflow-hidden rounded-3xl bg-white ring-1 ring-cinnamon/10">
            <div className="relative"><img src={box.image} alt={box.name} className="aspect-[4/3] w-full object-cover" /><span className="absolute left-3 top-3 rounded-full bg-forest px-3 py-1 text-xs text-cream">{['Mini', 'Taste', 'Premium', 'Luxury'][index] || box.category}</span></div>
            <div className="flex flex-1 flex-col p-5"><h2 className="font-display text-2xl text-cinnamon">{box.name}</h2><p className="mt-2 flex-1 text-sm text-muted">{box.description}</p>{box.products?.length ? <p className="mt-3 text-xs text-forest">{box.products.map((p) => p.name).join(' · ')}</p> : null}<p className="mt-4 font-display text-2xl text-cinnamon">{formatLKR(box.basePrice)}</p><div className="mt-4 grid gap-2"><Button onClick={() => { addItem({ productId: box._id, name: box.name, price: box.basePrice, image: box.image, quantity: 1 }); push(`${box.name} added to cart.`) }}><ShoppingBag className="h-4 w-4" />Add to Cart</Button><div className="grid grid-cols-2 gap-2"><Button variant="outline" size="sm" to="/build-your-spicebox">Customize</Button><Button variant="ghost" size="sm" to={`/gift-boxes/${box.slug}`}>View details</Button></div></div></div>
          </article>
        ))}
      </div>
    </div>
  )
}

export function GiftBoxDetailsPage() {
  const { id = '' } = useParams()
  const [box, setBox] = useState<GiftBox | null>(null)
  const [error, setError] = useState('')
  const addItem = useCartStore((s) => s.addItem)
  const push = useToastStore((s) => s.push)
  useEffect(() => {
    api<{ giftBox: GiftBox }>(`/gift-boxes/${id}`).then((result) => setBox(result.giftBox)).catch((reason) => setError(reason instanceof Error ? reason.message : 'Gift box not found'))
  }, [id])
  if (error) return <div className="px-4 py-24 text-center text-clay">{error}</div>
  if (!box) return <div className="px-4 py-24 text-center text-muted">Loading gift box…</div>
  return <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:px-6 lg:grid-cols-2"><img src={box.image} alt={box.name} className="aspect-square w-full rounded-3xl object-cover" /><div className="self-center"><p className="text-sm uppercase tracking-[.2em] text-forest">{box.category} collection</p><h1 className="mt-2 font-display text-5xl text-cinnamon">{box.name}</h1><p className="mt-5 text-lg leading-8 text-muted">{box.description}</p>{box.products?.length ? <div className="mt-6"><h2 className="font-display text-2xl text-cinnamon">Inside the box</h2><ul className="mt-3 list-disc space-y-2 pl-5 text-muted">{box.products.map((p) => <li key={p.name}>{p.name}</li>)}</ul></div> : null}<p className="mt-7 font-display text-3xl text-cinnamon">{formatLKR(box.basePrice)}</p><div className="mt-6 flex flex-wrap gap-3"><Button onClick={() => { addItem({ productId: box._id, name: box.name, price: box.basePrice, image: box.image, quantity: 1 }); push('Gift box added to cart.') }}>Add to Cart</Button><Button to="/build-your-spicebox" variant="outline">Customize yours</Button></div></div></div>
}
