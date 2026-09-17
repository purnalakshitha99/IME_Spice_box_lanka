import { Heart, ShoppingBag, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Product } from '../data/types'
import { formatLKR } from '../data/products'
import { useCartStore } from '../store/cartStore'
import { useWishlistStore } from '../store/wishlistStore'
import { useToastStore } from '../store/toastStore'
import { Button } from './Button'

export function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem)
  const { toggle, has } = useWishlistStore()
  const push = useToastStore((s) => s.push)
  const wished = has(product.id)
  const isSpicePouch = product.category === 'Spices'

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white/70 ring-1 ring-cinnamon/8 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-cinnamon/10">
      <div className={`relative aspect-[4/3] overflow-hidden ${isSpicePouch ? 'bg-[#F3EBE0] p-3 sm:p-4' : 'bg-cream-dark'}`}>
        <img
          src={product.image}
          alt={product.name}
          className={`h-full w-full transition duration-500 group-hover:scale-105 ${
            isSpicePouch ? 'object-contain' : 'object-cover'
          }`}
          loading="lazy"
        />
        <button
          type="button"
          aria-label="Wishlist"
          onClick={() => {
            toggle(product.id)
            push(wished ? 'Removed from wishlist' : 'Saved to wishlist', 'info')
          }}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-cinnamon shadow-sm transition hover:scale-105"
        >
          <Heart className={`h-4 w-4 ${wished ? 'fill-clay text-clay' : ''}`} />
        </button>
        {product.bestSeller && (
          <span className="absolute left-3 top-3 rounded-full bg-forest px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-cream">
            Best Seller
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-1 flex items-center gap-1 text-xs text-muted">
          <span className="text-gold">★</span>
          <span>{product.rating}</span>
          <span>({product.reviews})</span>
        </div>
        <h3 className="font-display text-xl text-cinnamon">
          <Link to={`/product/${product.id}`} className="hover:underline">
            {product.name}
          </Link>
        </h3>
        <p className="mt-1 line-clamp-2 flex-1 text-sm text-muted">{product.shortDescription}</p>
        <p className="mt-3 font-semibold text-cinnamon">{formatLKR(product.price)}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button
            size="sm"
            className="flex-1"
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
            <ShoppingBag className="h-3.5 w-3.5" />
            Add
          </Button>
          <Button size="sm" variant="outline" to={`/gift-builder?product=${product.id}`}>
            <Sparkles className="h-3.5 w-3.5" />
            Customize
          </Button>
        </div>
      </div>
    </article>
  )
}
