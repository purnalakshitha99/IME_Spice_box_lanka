import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Button } from '../components/Button'
import { ProductCard } from '../components/ProductCard'
import { products, formatLKR } from '../data/products'
import { useAuthStore } from '../store/authStore'
import { useWishlistStore } from '../store/wishlistStore'
import { useCartStore } from '../store/cartStore'
import { useToastStore } from '../store/toastStore'
import { api } from '../lib/api'

interface ApiOrder {
  _id: string
  orderId: string
  status: string
  pricing: { total: number }
  items: { product: string; name: string; price: number; image?: string; quantity: number }[]
}

export function AccountPage() {
  const { user, login, register, logout, updateProfile } = useAuthStore()
  const location = useLocation()
  const navigate = useNavigate()
  const [orders, setOrders] = useState<ApiOrder[]>([])
  const [mode, setMode] = useState<'login' | 'register'>(location.pathname === '/register' ? 'register' : 'login')
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [busy, setBusy] = useState(false)
  const push = useToastStore((s) => s.push)

  useEffect(() => {
    if (!user) return
    api<{ orders: ApiOrder[] }>('/orders/mine').then((result) => setOrders(result.orders)).catch((error) => push(error instanceof Error ? error.message : 'Orders could not be loaded', 'error'))
  }, [push, user])

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-4 py-16">
        <h1 className="font-display text-4xl text-cinnamon">
          {mode === 'login' ? 'Welcome back' : 'Create account'}
        </h1>
        <p className="mt-2 text-sm text-muted">
          Tip: use an email containing “admin” to access the admin dashboard.
        </p>
        <form
          className="mt-8 space-y-4"
          onSubmit={async (e) => {
            e.preventDefault()
            setBusy(true)
            try {
              if (mode === 'login') await login(form.email, form.password)
              else await register(form.name, form.email, form.password)
              push(mode === 'login' ? 'Logged in' : 'Account created')
              navigate('/account')
            } catch (error) {
              push(error instanceof Error ? error.message : 'Authentication failed', 'error')
            } finally {
              setBusy(false)
            }
          }}
        >
          {mode === 'register' && (
            <input
              required
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-xl border border-cinnamon/15 bg-white px-4 py-2.5"
            />
          )}
          <input
            required
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full rounded-xl border border-cinnamon/15 bg-white px-4 py-2.5"
          />
          <input
            required
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full rounded-xl border border-cinnamon/15 bg-white px-4 py-2.5"
          />
          <Button type="submit" className="w-full" disabled={busy}>
            {busy ? 'Please wait…' : mode === 'login' ? 'Login' : 'Register'}
          </Button>
        </form>
        <button
          type="button"
          className="mt-4 text-sm text-forest hover:underline"
          onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
        >
          {mode === 'login' ? 'Need an account? Register' : 'Have an account? Login'}
        </button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 md:px-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl text-cinnamon">Hello, {user.name}</h1>
          <p className="mt-1 text-muted">{user.email}</p>
        </div>
        <div className="flex gap-2">
          {user.role === 'admin' && (
            <Button to="/admin" variant="secondary">
              Admin Dashboard
            </Button>
          )}
          <Button variant="outline" onClick={logout}>
            Logout
          </Button>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl bg-forest p-5 text-cream">
          <p className="text-xs uppercase tracking-wider text-gold">SpicePoints</p>
          <p className="font-display text-4xl">{user.loyaltyPoints}</p>
          <p className="mt-1 text-sm text-cream/70">{user.loyaltyLevel}</p>
        </div>
        <div className="rounded-2xl bg-white p-5 ring-1 ring-cinnamon/8">
          <p className="text-xs uppercase tracking-wider text-muted">Orders</p>
          <p className="font-display text-4xl text-cinnamon">{orders.length}</p>
        </div>
        <div className="rounded-2xl bg-white p-5 ring-1 ring-cinnamon/8">
          <p className="text-xs uppercase tracking-wider text-muted">Wishlist</p>
          <p className="font-display text-4xl text-cinnamon">
            <Link to="/wishlist" className="hover:underline">
              View
            </Link>
          </p>
        </div>
      </div>

      <section className="mt-12">
        <h2 className="font-display text-2xl text-cinnamon">My Orders</h2>
        {orders.length === 0 ? (
          <p className="mt-4 text-muted">No orders yet.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {orders.map((o) => (
              <li
                key={o._id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white p-4 ring-1 ring-cinnamon/8"
              >
                <div>
                  <p className="font-medium text-cinnamon">{o.orderId}</p>
                  <p className="text-sm text-muted">
                    {o.status} · {formatLKR(o.pricing.total)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button to={`/track-order?order=${o.orderId}`} size="sm" variant="outline">
                    Track
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => {
                      o.items.forEach((item) => useCartStore.getState().addItem({ productId: item.product, name: item.name, price: item.price, image: item.image || '/products/gift-taste.jpg', quantity: item.quantity }))
                      push('Previous gift added to cart — ready to reorder!')
                    }}
                  >
                    Reorder
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-12">
        <h2 className="font-display text-2xl text-cinnamon">Profile</h2>
        <form
          className="mt-4 grid max-w-lg gap-3"
          onSubmit={async (e) => {
            e.preventDefault()
            const fd = new FormData(e.currentTarget)
            try {
              await updateProfile({ name: String(fd.get('name') || user.name), phone: String(fd.get('phone') || '') })
              push('Profile updated')
            } catch (error) { push(error instanceof Error ? error.message : 'Profile update failed', 'error') }
          }}
        >
          <input
            name="name"
            defaultValue={user.name}
            className="rounded-xl border border-cinnamon/15 bg-white px-4 py-2.5"
          />
          <input
            name="phone"
            defaultValue={user.phone}
            placeholder="Phone"
            className="rounded-xl border border-cinnamon/15 bg-white px-4 py-2.5"
          />
          <Button type="submit" className="w-fit">
            Save
          </Button>
        </form>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-2xl text-cinnamon">Loyalty — SpicePoints</h2>
        <p className="mt-2 text-sm text-muted">
          Earn points on purchase, reviews, referrals, signup, and corporate gifts. Levels: Spice
          Starter → Spice Explorer → Spice Master.
        </p>
      </section>
    </div>
  )
}

export function WishlistPage() {
  const ids = useWishlistStore((s) => s.ids)
  const remove = useWishlistStore((s) => s.remove)
  const addItem = useCartStore((s) => s.addItem)
  const push = useToastStore((s) => s.push)
  const items = products.filter((p) => ids.includes(p.id))

  if (!items.length) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <h1 className="font-display text-4xl text-cinnamon">Wishlist</h1>
        <p className="mt-3 text-muted">Save products and gift boxes you love.</p>
        <Button to="/shop" className="mt-8">
          Browse Shop
        </Button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
      <h1 className="font-display text-4xl text-cinnamon">Wishlist</h1>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((p) => (
          <div key={p.id} className="space-y-2">
            <ProductCard product={p} />
            <div className="flex gap-2 px-1">
              <Button
                size="sm"
                className="flex-1"
                onClick={() => {
                  addItem({
                    productId: p.id,
                    name: p.name,
                    price: p.price,
                    image: p.image,
                    quantity: 1,
                  })
                  push('Moved to cart')
                }}
              >
                Move to Cart
              </Button>
              <Button size="sm" variant="ghost" onClick={() => remove(p.id)}>
                Remove
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
