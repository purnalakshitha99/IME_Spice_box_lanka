import { Link } from 'react-router-dom'
import { Button } from '../components/Button'
import { formatLKR } from '../data/products'
import { useCartStore } from '../store/cartStore'

export function CartPage() {
  const { items, updateQuantity, removeItem, subtotal } = useCartStore()
  const customization = items.reduce(
    (sum, i) => sum + (i.customization ? 200 * i.quantity : 0),
    0,
  )
  const delivery = items.length ? 350 : 0
  const discount = subtotal() > 8000 ? 500 : 0
  const total = subtotal() + customization + delivery - discount

  if (!items.length) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <h1 className="font-display text-4xl text-cinnamon">Your cart is empty</h1>
        <p className="mt-3 text-muted">Start building a personalized Sri Lankan gift.</p>
        <Button to="/gift-builder" className="mt-8">
          Build Your Gift
        </Button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-6">
      <h1 className="font-display text-4xl text-cinnamon">Cart</h1>
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]">
        <ul className="space-y-4">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex flex-col gap-4 rounded-2xl bg-white/80 p-4 ring-1 ring-cinnamon/8 sm:flex-row"
            >
              <img src={item.image} alt={item.name} className="h-28 w-full rounded-xl object-cover sm:w-28" />
              <div className="flex-1">
                <h3 className="font-medium text-cinnamon">{item.name}</h3>
                {item.customization?.recipientName && (
                  <p className="mt-1 text-sm text-muted">
                    For {item.customization.recipientName}
                    {item.customization.packaging ? ` · ${item.customization.packaging}` : ''}
                  </p>
                )}
                <p className="mt-2 font-semibold">{formatLKR(item.price)}</p>
                <div className="mt-3 flex items-center gap-3">
                  <input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item.id, Number(e.target.value))}
                    className="w-16 rounded-lg border border-cinnamon/15 bg-cream px-2 py-1 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="text-sm text-clay hover:underline"
                  >
                    Remove
                  </button>
                  <button type="button" className="text-sm text-muted hover:text-cinnamon">
                    Save for later
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <aside className="h-fit rounded-2xl bg-cinnamon p-6 text-cream">
          <h2 className="font-display text-2xl text-gold">Order Summary</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt>Subtotal</dt>
              <dd>{formatLKR(subtotal())}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Customization</dt>
              <dd>{formatLKR(customization)}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Delivery</dt>
              <dd>{formatLKR(delivery)}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Discount</dt>
              <dd>-{formatLKR(discount)}</dd>
            </div>
            <div className="flex justify-between border-t border-cream/15 pt-3 text-base font-semibold">
              <dt>Total</dt>
              <dd className="text-gold">{formatLKR(total)}</dd>
            </div>
          </dl>
          <Button to="/checkout" variant="gold" className="mt-6 w-full">
            Proceed to Checkout
          </Button>
          <Link to="/shop" className="mt-3 block text-center text-sm text-cream/70 hover:text-gold">
            Continue Shopping
          </Link>
        </aside>
      </div>
    </div>
  )
}
