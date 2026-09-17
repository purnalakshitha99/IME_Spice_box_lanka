import { motion } from 'framer-motion'
import {
  ArrowRight,
  Gift,
  Heart,
  Leaf,
  Pencil,
  QrCode,
  Truck,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '../components/Button'
import { ProductCard } from '../components/ProductCard'
import { products } from '../data/products'

const fade = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-40px' },
  transition: { duration: 0.5 },
}

const heroValues = [
  { icon: Leaf, label: 'Authentic Sri Lankan Products' },
  { icon: Gift, label: 'Personalized Gift Boxes' },
  { icon: QrCode, label: 'QR Code Cultural Experience' },
]

const featureBar = [
  {
    icon: Gift,
    title: 'Smart Recommendation',
    text: 'Get the perfect box for your occasion',
    to: '/recommend',
  },
  {
    icon: Pencil,
    title: 'Full Customization',
    text: 'Name, message & logo',
    to: '/build-your-spicebox',
  },
  {
    icon: Truck,
    title: 'Islandwide Delivery',
    text: 'Safe & timely',
    to: '/contact',
  },
  {
    icon: Heart,
    title: 'A Sri Lankan Cultural Experience',
    text: '',
    to: '/stories',
  },
]

const categories = [
  {
    title: 'Taste of Sri Lanka',
    desc: 'A curated journey through cinnamon, pepper, and island flavours.',
    image: '/products/spices-banner.jpg',
    to: '/shop?category=Gift%20Boxes',
  },
  {
    title: 'Tea & Spice Collection',
    desc: 'Highland Ceylon tea paired with fragrant spice treasures.',
    image: '/products/tea.jpg',
    to: '/shop?category=Ceylon%20Tea',
  },
  {
    title: 'Personalized Gifts',
    desc: 'Names, messages, and packaging — gifts that feel truly theirs.',
    image: '/products/gift-birthday.jpg',
    to: '/build-your-spicebox',
  },
  {
    title: 'Corporate Gifting',
    desc: 'Brandable bulk gifts for clients, teams, and milestones.',
    image: '/products/gift-corporate.jpg',
    to: '/corporate-gifting',
  },
]

const steps = [
  { n: '01', title: 'Choose Occasion', text: 'Birthday, thank you, corporate, and more.' },
  { n: '02', title: 'Set Your Budget', text: 'From LKR 3,000 to custom luxury ranges.' },
  { n: '03', title: 'Pick Your Products', text: 'Spices, tea, snacks — build live.' },
  { n: '04', title: 'Personalize Your Gift', text: 'Message, name, packaging, logo.' },
]

export function HomePage() {
  const popular = products.filter((p) => p.isGiftBox).slice(0, 5)

  return (
    <>
      {/* Hero — second design image look, Full HD photos, working buttons */}
      <section className="relative overflow-hidden bg-[#1b3022]">
        {/* Full HD plantation background — no blur filter */}
        <img
          src="/hero/tea-plantation.jpg"
          alt=""
          width={1920}
          height={1080}
          decoding="async"
          fetchPriority="high"
          className="absolute inset-0 h-full w-full object-cover object-[center_30%]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(20,28,18,0.78)_0%,rgba(20,28,18,0.48)_45%,rgba(20,28,18,0.2)_72%,rgba(20,28,18,0.35)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,28,18,0.2)_0%,transparent_40%,rgba(12,8,6,0.45)_100%)]" />

        <div className="relative mx-auto grid min-h-[min(92svh,820px)] max-w-[1280px] items-center gap-8 px-4 pb-16 pt-24 sm:px-6 md:pt-28 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:pb-20 lg:pt-32">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="max-w-[540px]"
          >
            <h1 className="font-display text-[2.4rem] leading-[1.15] font-semibold text-white text-balance sm:text-[2.85rem] lg:text-[3.35rem]">
              A Taste of Sri Lanka,{' '}
              <span className="font-script text-[1.2em] font-normal text-[#d4a04c]">Personalized</span>{' '}
              for You.
            </h1>
            <p className="mt-4 max-w-[440px] text-[15px] leading-relaxed text-white/95 sm:text-base">
              Create your own custom gift box with authentic Sri Lankan spices, Ceylon tea and local
              delights.
            </p>

            <div className="mt-7 flex max-w-[520px] items-stretch divide-x divide-white/30">
              {heroValues.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex flex-1 flex-col items-center px-2 text-center sm:px-3"
                >
                  <span className="mb-2 flex h-10 w-10 items-center justify-center rounded-full border border-white/60 text-white">
                    <Icon className="h-4 w-4" strokeWidth={1.5} />
                  </span>
                  <span className="text-[10px] leading-snug text-white/95 sm:text-[11px]">
                    {label}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/build-your-spicebox"
                className="inline-flex items-center gap-2 rounded-full bg-[#d4a04c] px-6 py-3 text-sm font-semibold text-[#3e2723] shadow-md transition hover:bg-[#c6913d]"
              >
                Build My SpiceBox <span aria-hidden>›</span>
              </Link>
              <Link
                to="/gift-boxes"
                className="inline-flex items-center rounded-full border border-white/85 px-6 py-3 text-sm font-medium text-white transition hover:bg-white/10"
              >
                Explore Gift Boxes
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative mx-auto w-full max-w-[560px] lg:max-w-none"
          >
            <div className="overflow-hidden rounded-[18px] shadow-[0_28px_60px_-18px_rgba(0,0,0,0.55)] ring-1 ring-white/10">
              <img
                src="/hero/gift-box.jpg"
                alt="Open SpiceBox Lanka gift box with Ceylon tea, spices and birthday card"
                width={1920}
                height={1440}
                decoding="async"
                className="aspect-[5/4] w-full object-cover"
              />
            </div>
          </motion.div>
        </div>

        {/* Feature bar — sits on hero edge, no extra white gap below */}
        <div className="relative z-10 -mb-px px-3 sm:px-5">
          <div className="mx-auto grid max-w-[1180px] grid-cols-2 overflow-hidden rounded-t-[28px] bg-[#fdfaf5] shadow-[0_-8px_30px_rgba(0,0,0,0.12)] md:grid-cols-4">
            {featureBar.map(({ icon: Icon, title, text, to }, i) => (
              <Link
                key={title}
                to={to}
                className={`flex items-start gap-3 px-4 py-4 transition hover:bg-[#f5efe3] md:px-5 md:py-5 ${
                  i > 0 ? 'md:border-l md:border-[#3e2723]/12' : ''
                }`}
              >
                <Icon className="mt-0.5 h-6 w-6 shrink-0 text-[#5a3a2e]" strokeWidth={1.6} />
                <div>
                  <p className="text-[13px] leading-snug font-semibold text-[#3e2723] md:text-sm">
                    {title}
                  </p>
                  {text ? (
                    <p className="mt-0.5 text-[11px] leading-snug text-[#6b5c52] md:text-xs">{text}</p>
                  ) : null}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="bg-[#fdfaf5] px-4 pt-8 pb-16 md:px-6 md:pt-10 md:pb-20">
        <div className="mx-auto max-w-7xl">
        <motion.div {...fade}>
          <h2 className="font-display text-3xl text-cinnamon md:text-4xl">
            Choose Your Sri Lankan Experience
          </h2>
          <p className="mt-2 max-w-xl text-muted">
            Four paths into island flavour — each designed as a premium gift experience.
          </p>
        </motion.div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((c, i) => (
            <motion.div key={c.title} {...fade} transition={{ delay: i * 0.08, duration: 0.5 }}>
              <Link to={c.to} className="group block overflow-hidden rounded-2xl">
                <div className="relative aspect-[3/4]">
                  <img
                    src={c.image}
                    alt={c.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-cinnamon/90 via-cinnamon/30 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <h3 className="font-display text-2xl text-cream">{c.title}</h3>
                    <p className="mt-1 text-sm text-cream/75">{c.desc}</p>
                    <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-gold">
                      Explore <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
        </div>
      </section>

      {/* Gift Builder CTA */}
      <section className="bg-forest text-cream">
        <div className="mx-auto max-w-7xl px-4 py-20 md:px-6">
          <motion.div {...fade} className="max-w-2xl">
            <h2 className="font-display text-3xl md:text-4xl">Create a Gift That Feels Personal</h2>
            <p className="mt-3 text-cream/80">
              Our Gift Builder turns occasion, budget, and taste into a box that feels made for
              someone — not pulled off a shelf.
            </p>
          </motion.div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s) => (
              <motion.div key={s.n} {...fade} className="border-t border-gold/40 pt-4">
                <span className="font-display text-3xl text-gold">{s.n}</span>
                <h3 className="mt-2 font-display text-xl">{s.title}</h3>
                <p className="mt-1 text-sm text-cream/70">{s.text}</p>
              </motion.div>
            ))}
          </div>
          <div className="mt-10">
            <Button to="/build-your-spicebox" variant="gold" size="lg">
              Build My Gift
            </Button>
          </div>
        </div>
      </section>

      {/* QR Stories */}
      <section className="mx-auto max-w-7xl px-4 py-20 md:px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <motion.div {...fade}>
            <h2 className="font-display text-3xl text-cinnamon md:text-4xl">Gifts With a Story</h2>
            <p className="mt-4 leading-relaxed text-muted">
              Every SpiceBox can take you beyond the box. Scan the QR code to discover the story
              behind your ingredients, Sri Lankan traditions, recipes and ways to enjoy your
              products.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3 text-sm font-medium text-cinnamon">
              <span className="rounded-full bg-white px-4 py-2 ring-1 ring-cinnamon/10">Gift Box</span>
              <ArrowRight className="h-4 w-4 text-gold" />
              <span className="rounded-full bg-white px-4 py-2 ring-1 ring-cinnamon/10">QR Code</span>
              <ArrowRight className="h-4 w-4 text-gold" />
              <span className="rounded-full bg-white px-4 py-2 ring-1 ring-cinnamon/10">
                Cultural Experience
              </span>
            </div>
            <Button to="/stories" className="mt-8" variant="secondary">
              Explore Sri Lankan Stories
            </Button>
          </motion.div>
          <motion.div {...fade} className="relative overflow-hidden rounded-3xl">
            <img
              src="/products/cinnamon.jpg"
              alt="Ceylon cinnamon story"
              className="aspect-[4/3] w-full object-cover"
            />
            <div className="absolute bottom-4 right-4 flex items-center gap-3 rounded-2xl bg-cream/95 px-4 py-3 shadow-lg">
              <QrCode className="h-10 w-10 text-cinnamon" />
              <div>
                <p className="text-xs uppercase tracking-wider text-muted">Scan to explore</p>
                <p className="font-medium text-cinnamon">Cultural Story</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Popular */}
      <section className="border-t border-cinnamon/10 bg-white/40 py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <motion.div {...fade} className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-3xl text-cinnamon md:text-4xl">Popular Gift Boxes</h2>
              <p className="mt-2 text-muted">Ready-to-gift collections, or start customizing.</p>
            </div>
            <Button to="/gift-boxes" variant="outline">
              View all
            </Button>
          </motion.div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {popular.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          <div className="mt-12 text-center">
            <Button to="/recommend" variant="ghost">
              Not sure what to gift? Try smart recommendations
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
