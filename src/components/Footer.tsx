import { Link } from 'react-router-dom'
import { Logo } from './Logo'
import { useToastStore } from '../store/toastStore'

export function Footer() {
  const push = useToastStore((s) => s.push)

  return (
    <footer className="mt-20 border-t border-cinnamon/10 bg-cinnamon text-cream">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-2 md:px-6 lg:grid-cols-4">
        <div>
          <Logo light />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-cream/75">
            Authentic Sri Lankan flavours, personalized into meaningful gifts.
          </p>
          <p className="mt-3 font-display text-lg italic text-gold">
            A Taste of Sri Lanka, Made Personal.
          </p>
        </div>

        <div>
          <h4 className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-gold">
            Quick Links
          </h4>
          <ul className="mt-4 space-y-2 text-sm text-cream/80">
            {[
              ['/', 'Home'],
              ['/products', 'Shop'],
              ['/gift-boxes', 'Gift Boxes'],
              ['/build-your-spicebox', 'Build My SpiceBox'],
              ['/corporate-gifting', 'Corporate'],
              ['/our-story', 'Our Story'],
              ['/contact', 'Contact'],
            ].map(([to, label]) => (
              <li key={to}>
                <Link to={to} className="hover:text-gold">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-gold">
            Explore
          </h4>
          <ul className="mt-4 space-y-2 text-sm text-cream/80">
            {[
              ['/stories', 'Sri Lankan Stories'],
              ['/recipes', 'Recipes'],
              ['/experience/ceylon-cinnamon', 'Cultural Experience'],
              ['/account', 'SpicePoints'],
              ['/faq', 'FAQ'],
            ].map(([to, label]) => (
              <li key={to}>
                <Link to={to} className="hover:text-gold">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-gold">
            Newsletter
          </h4>
          <p className="mt-4 text-sm text-cream/75">
            Discover Sri Lankan flavours, stories and exclusive gift collections.
          </p>
          <form
            className="mt-4 flex gap-2"
            onSubmit={(e) => {
              e.preventDefault()
              push('Welcome to the SpiceBox circle!')
              ;(e.target as HTMLFormElement).reset()
            }}
          >
            <input
              required
              type="email"
              placeholder="Your email"
              className="min-w-0 flex-1 rounded-full border border-cream/20 bg-cinnamon-light px-4 py-2.5 text-sm text-cream placeholder:text-cream/50 outline-none focus:border-gold"
            />
            <button
              type="submit"
              className="rounded-full bg-gold px-4 py-2.5 text-sm font-semibold text-cinnamon hover:bg-gold-dark"
            >
              Subscribe
            </button>
          </form>
          <div className="mt-6 flex gap-4 text-sm text-cream/70">
            {['Facebook', 'Instagram', 'TikTok', 'YouTube'].map((s) => (
              <span key={s} className="cursor-default hover:text-gold">
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-cream/10 py-4 text-center text-xs text-cream/50">
        © {new Date().getFullYear()} SpiceBox Lanka. Crafted with island heritage.
      </div>
    </footer>
  )
}
