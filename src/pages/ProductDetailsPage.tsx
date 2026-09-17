import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { Heart, QrCode, ShoppingBag, Sparkles } from 'lucide-react'
import { Button } from '../components/Button'
import { formatLKR, getProduct, products } from '../data/products'
import type { Product } from '../data/types'
import { ProductCard } from '../components/ProductCard'
import { useCartStore } from '../store/cartStore'
import { useWishlistStore } from '../store/wishlistStore'
import { useToastStore } from '../store/toastStore'
import { api } from '../lib/api'
import { normalizeProduct } from '../lib/products'
import { useAuthStore } from '../store/authStore'

export function ProductDetailsPage() {
  const { id } = useParams()
  const [product, setProduct] = useState<Product | undefined>(() => getProduct(id ?? ''))
  const [loading, setLoading] = useState(true)
  const [reviews, setReviews] = useState<{ _id: string; rating: number; comment: string; customer?: { name?: string } }[]>([])
  const navigate = useNavigate()
  const addItem = useCartStore((s) => s.addItem)
  const { toggle, has } = useWishlistStore()
  const push = useToastStore((s) => s.push)
  const user = useAuthStore((s) => s.user)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    api<{ product: unknown }>(`/products/${id}`)
      .then((result) => setProduct(normalizeProduct(result.product as Parameters<typeof normalizeProduct>[0])))
      .catch(() => setProduct(getProduct(id)))
      .finally(() => setLoading(false))
  }, [id])

  useEffect(() => {
    if (!product?.id) return
    api<{ reviews: typeof reviews }>(`/reviews/product/${product.id}`).then((result) => setReviews(result.reviews)).catch(() => undefined)
  }, [product?.id])

  const related = useMemo(
    () => products.filter((p) => p.category === product?.category && p.id !== product?.id).slice(0, 4),
    [product],
  )

  if (loading && !product) return <div className="px-4 py-24 text-center text-muted">Loading product…</div>
  if (!product) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="font-display text-3xl text-cinnamon">Product not found</h1>
        <Button to="/shop" className="mt-6">
          Back to Shop
        </Button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
      <nav className="text-sm text-muted">
        <Link to="/shop" className="hover:text-cinnamon">
          Shop
        </Link>
        <span className="mx-2">/</span>
        <span className="text-cinnamon">{product.name}</span>
      </nav>

      <div className="mt-8 grid gap-10 lg:grid-cols-2">
        <div className={`overflow-hidden rounded-3xl ${product.category === 'Spices' ? 'bg-[#F3EBE0] p-6' : 'bg-white'}`}>
          <img
            src={product.image}
            alt={product.name}
            className={`aspect-square w-full ${product.category === 'Spices' ? 'object-contain' : 'object-cover'}`}
          />
        </div>
        <div>
          <p className="text-sm font-medium uppercase tracking-wider text-forest">{product.category}</p>
          <h1 className="mt-2 font-display text-4xl text-cinnamon md:text-5xl">{product.name}</h1>
          <div className="mt-3 flex items-center gap-2 text-sm text-muted">
            <span className="text-gold">★ {product.rating}</span>
            <span>({product.reviews} reviews)</span>
          </div>
          <p className="mt-4 font-display text-3xl text-cinnamon">{formatLKR(product.price)}</p>
          <p className="mt-4 leading-relaxed text-muted">{product.description}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              size="lg"
              onClick={() => {
                addItem({
                  productId: product.id,
                  name: product.name,
                  price: product.price,
                  image: product.image,
                  quantity: 1,
                })
                push(`${product.name} added to your SpiceBox.`)
              }}
            >
              <ShoppingBag className="h-4 w-4" />
              Add to Cart
            </Button>
            <Button size="lg" variant="outline" to="/build-your-spicebox">
              <Sparkles className="h-4 w-4" />
              Customize Gift
            </Button>
            <button
              type="button"
              onClick={() => toggle(product.id)}
              className="rounded-full p-3 ring-1 ring-cinnamon/15 hover:bg-cinnamon/5"
            >
              <Heart className={`h-5 w-5 ${has(product.id) ? 'fill-clay text-clay' : 'text-cinnamon'}`} />
            </button>
          </div>

          <dl className="mt-10 grid gap-4 sm:grid-cols-2">
            {[
              ['Origin', product.origin],
              ['Ingredients', product.ingredients],
              ['Usage', product.usage],
              ['Storage', product.storage],
            ].map(([k, v]) => (
              <div key={k} className="rounded-2xl bg-white/70 p-4 ring-1 ring-cinnamon/8">
                <dt className="text-xs font-semibold uppercase tracking-wider text-muted">{k}</dt>
                <dd className="mt-1 text-sm text-cinnamon">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <section className="mt-16 grid gap-8 lg:grid-cols-2">
        <div className="rounded-3xl bg-forest p-8 text-cream">
          <h2 className="font-display text-3xl">Discover the Story</h2>
          <p className="mt-4 text-cream/80">{product.story}</p>
          <p className="mt-4 text-cream/80">{product.culturalSignificance}</p>
          <Button
            variant="gold"
            className="mt-6"
            onClick={() => navigate(`/stories/${product.id.includes('tea') ? 'ceylon-tea' : 'ceylon-cinnamon'}`)}
          >
            Read full story
          </Button>
        </div>
        <div className="flex flex-col items-center justify-center rounded-3xl bg-white p-8 ring-1 ring-cinnamon/8">
          <QrCode className="h-28 w-28 text-cinnamon" />
          <h3 className="mt-4 font-display text-2xl text-cinnamon">Scan to Explore</h3>
          <p className="mt-2 max-w-sm text-center text-sm text-muted">
            QR placeholder for cultural storytelling — open the linked story experience on mobile.
          </p>
          <Button to={`/experience/${product.id}`} variant="outline" className="mt-4">
            Open QR Landing
          </Button>
        </div>
      </section>

      <section className="mt-16 rounded-3xl bg-white p-6 ring-1 ring-cinnamon/8 md:p-8">
        <h2 className="font-display text-3xl text-cinnamon">Customer Reviews</h2>
        {user ? (
          <form className="mt-5 grid gap-3" onSubmit={async (event) => {
            event.preventDefault()
            const data = new FormData(event.currentTarget)
            try {
              await api('/reviews', { method: 'POST', json: { productId: product.id, rating: Number(data.get('rating')), comment: String(data.get('comment') || '') } })
              push('Thank you for sharing your experience.')
              event.currentTarget.reset()
              const result = await api<{ reviews: typeof reviews }>(`/reviews/product/${product.id}`)
              setReviews(result.reviews)
            } catch (error) { push(error instanceof Error ? error.message : 'Review could not be submitted', 'error') }
          }}>
            <select name="rating" className="w-fit rounded-xl border border-cinnamon/15 bg-cream px-4 py-2"><option value="5">5 stars</option><option value="4">4 stars</option><option value="3">3 stars</option><option value="2">2 stars</option><option value="1">1 star</option></select>
            <textarea name="comment" required rows={3} placeholder="What did you enjoy?" className="rounded-xl border border-cinnamon/15 bg-cream px-4 py-3" />
            <Button type="submit" className="w-fit">Submit review</Button>
          </form>
        ) : <p className="mt-3 text-muted"><Link to="/login" className="text-forest underline">Log in</Link> to write a verified review.</p>}
        <div className="mt-8 space-y-4">{reviews.map((review) => <div key={review._id} className="border-t border-cinnamon/10 pt-4"><p className="text-gold">{'★'.repeat(review.rating)}</p><p className="mt-1 text-muted">{review.comment}</p><p className="mt-1 text-xs text-cinnamon">{review.customer?.name || 'SpiceBox customer'}</p></div>)}{!reviews.length && <p className="text-sm text-muted">No reviews yet.</p>}</div>
      </section>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="font-display text-3xl text-cinnamon">You may also like</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
