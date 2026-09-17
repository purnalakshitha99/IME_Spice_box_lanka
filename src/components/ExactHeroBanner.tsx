import { Link } from 'react-router-dom'

/** Invisible hit areas mapped over the exact hero banner image */
const spots: { to: string; label: string; style: React.CSSProperties }[] = [
  // Top nav
  { to: '/', label: 'Home', style: { left: '22%', top: '4%', width: '5%', height: '8%' } },
  {
    to: '/build-your-spicebox',
    label: 'Build My SpiceBox',
    style: { left: '27.5%', top: '4%', width: '11%', height: '8%' },
  },
  {
    to: '/products',
    label: 'Our Products',
    style: { left: '39%', top: '4%', width: '10%', height: '8%' },
  },
  {
    to: '/corporate-gifting',
    label: 'Corporate Gifting',
    style: { left: '49.5%', top: '4%', width: '10%', height: '8%' },
  },
  { to: '/our-story', label: 'About Us', style: { left: '60%', top: '4%', width: '6%', height: '8%' } },
  { to: '/contact', label: 'Contact', style: { left: '66.5%', top: '4%', width: '5%', height: '8%' } },
  { to: '/products', label: 'Search', style: { left: '74%', top: '4%', width: '3.5%', height: '8%' } },
  { to: '/account', label: 'Account', style: { left: '77.5%', top: '4%', width: '3.5%', height: '8%' } },
  { to: '/cart', label: 'Cart', style: { left: '81%', top: '4%', width: '4%', height: '8%' } },
  { to: '/login', label: 'Login / Signup', style: { left: '85.5%', top: '3.5%', width: '11%', height: '9%' } },

  // Hero feature icons
  {
    to: '/products?category=Spices',
    label: 'Authentic Sri Lankan Products',
    style: { left: '3%', top: '52%', width: '10%', height: '14%' },
  },
  {
    to: '/gift-boxes',
    label: 'Personalized Gift Boxes',
    style: { left: '13.5%', top: '52%', width: '10%', height: '14%' },
  },
  {
    to: '/stories',
    label: 'QR Code Cultural Experience',
    style: { left: '24%', top: '52%', width: '10%', height: '14%' },
  },

  // CTAs
  {
    to: '/build-your-spicebox',
    label: 'Build My SpiceBox',
    style: { left: '3%', top: '68%', width: '16%', height: '9%' },
  },
  {
    to: '/gift-boxes',
    label: 'Explore Gift Boxes',
    style: { left: '20%', top: '68%', width: '14%', height: '9%' },
  },

  // Bottom feature bar
  {
    to: '/recommend',
    label: 'Smart Recommendation',
    style: { left: '4%', top: '84%', width: '22%', height: '14%' },
  },
  {
    to: '/build-your-spicebox',
    label: 'Full Customization',
    style: { left: '27%', top: '84%', width: '22%', height: '14%' },
  },
  {
    to: '/track-order',
    label: 'Islandwide Delivery',
    style: { left: '50%', top: '84%', width: '22%', height: '14%' },
  },
  {
    to: '/stories',
    label: 'A Sri Lankan Cultural Experience',
    style: { left: '73%', top: '84%', width: '23%', height: '14%' },
  },
]

export function ExactHeroBanner() {
  return (
    <section className="relative w-full bg-[#1a120c]" aria-label="SpiceBox Lanka hero">
      <div className="relative mx-auto w-full max-w-[1920px]">
        <img
          src="/hero/hero-exact-1080.jpg"
          alt="SpiceBox Lanka — A Taste of Sri Lanka, Personalized for You. Open wooden gift box with Ceylon tea, spices, Happy Birthday card, and feature bar."
          width={1920}
          height={748}
          decoding="async"
          fetchPriority="high"
          className="block h-auto w-full select-none"
          draggable={false}
        />

        {/* Working clickable overlays — image itself is unchanged */}
        {spots.map((s) => (
          <Link
            key={`${s.label}-${s.to}`}
            to={s.to}
            aria-label={s.label}
            className="absolute z-10 rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d89b28]"
            style={s.style}
          />
        ))}
      </div>
    </section>
  )
}
