import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Heart, Menu, Search, ShoppingBag, User, X } from 'lucide-react'
import { Logo } from './Logo'
import { Button } from './Button'
import { useCartStore } from '../store/cartStore'
import { useWishlistStore } from '../store/wishlistStore'
import { useAuthStore } from '../store/authStore'

const links = [
  { to: '/', label: 'Home' },
  { to: '/products', label: 'Shop' },
  { to: '/gift-boxes', label: 'Gift Boxes' },
  { to: '/build-your-spicebox', label: 'Build My SpiceBox' },
  { to: '/corporate-gifting', label: 'Corporate Gifting' },
  { to: '/our-story', label: 'Our Story' },
  { to: '/contact', label: 'Contact' },
]

export function Navbar() {
  const [open, setOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [q, setQ] = useState('')
  const navigate = useNavigate()
  const count = useCartStore((s) => s.count())
  const wishCount = useWishlistStore((s) => s.ids.length)
  const user = useAuthStore((s) => s.user)

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!q.trim()) return
    navigate(`/products?q=${encodeURIComponent(q.trim())}`)
    setSearchOpen(false)
    setOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 border-b border-cinnamon/10 bg-cream/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-6">
        <Logo />

        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              className={({ isActive }) =>
                `rounded-full px-3 py-2 text-sm font-medium transition ${
                  isActive ? 'bg-cinnamon/10 text-cinnamon' : 'text-muted hover:text-cinnamon'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <button
            type="button"
            aria-label="Search"
            onClick={() => setSearchOpen((v) => !v)}
            className="rounded-full p-2 text-cinnamon hover:bg-cinnamon/5"
          >
            <Search className="h-5 w-5" />
          </button>
          <Link to="/wishlist" className="relative rounded-full p-2 text-cinnamon hover:bg-cinnamon/5" aria-label="Wishlist">
            <Heart className="h-5 w-5" />
            {wishCount > 0 && (
              <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-clay px-1 text-[10px] text-cream">
                {wishCount}
              </span>
            )}
          </Link>
          <Link to="/cart" className="relative rounded-full p-2 text-cinnamon hover:bg-cinnamon/5" aria-label="Cart">
            <ShoppingBag className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-forest px-1 text-[10px] text-cream">
                {count}
              </span>
            )}
          </Link>
          <Link to={user ? '/account' : '/account'} className="rounded-full p-2 text-cinnamon hover:bg-cinnamon/5" aria-label="Account">
            <User className="h-5 w-5" />
          </Link>
          <Button to="/build-your-spicebox" size="sm" className="hidden md:inline-flex">
            Build My SpiceBox
          </Button>
          <button
            type="button"
            className="rounded-full p-2 text-cinnamon hover:bg-cinnamon/5 lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {searchOpen && (
        <form onSubmit={submitSearch} className="border-t border-cinnamon/10 px-4 py-3 md:px-6">
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search products, gift boxes, recipes, stories…"
            className="w-full rounded-full border border-cinnamon/15 bg-white px-4 py-2.5 text-sm outline-none focus:border-gold"
          />
        </form>
      )}

      {open && (
        <div className="border-t border-cinnamon/10 bg-cream px-4 py-4 lg:hidden">
          <nav className="flex flex-col gap-1">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === '/'}
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-3 text-base font-medium text-cinnamon hover:bg-cinnamon/5"
              >
                {l.label}
              </NavLink>
            ))}
            <Button to="/build-your-spicebox" className="mt-2 w-full">
              Build My SpiceBox
            </Button>
          </nav>
        </div>
      )}
    </header>
  )
}
