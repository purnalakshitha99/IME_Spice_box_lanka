import { useMemo, useState } from 'react'
import { Button } from '../components/Button'
import { corporateDiscount } from '../data/recommend'
import { formatLKR } from '../data/products'
import { useToastStore } from '../store/toastStore'

const tiers = [
  {
    name: 'Essential',
    price: 5000,
    features: ['Custom message', 'Standard packaging', 'QR story card', 'Bulk ready'],
  },
  {
    name: 'Premium',
    price: 7500,
    features: ['Company logo', 'Premium packaging', 'Curated assortment', 'Dedicated support'],
  },
  {
    name: 'Executive',
    price: 12000,
    features: ['Full branding', 'Luxury heritage box', 'Priority production', 'Account manager'],
  },
]

export function CorporatePage() {
  const push = useToastStore((s) => s.push)
  const [qty, setQty] = useState(25)
  const [tier, setTier] = useState(tiers[1])
  const discount = corporateDiscount(qty)
  const unit = tier.price
  const discounted = discount < 0 ? unit : unit * (1 - discount)
  const total = discount < 0 ? null : discounted * qty

  const formDefaults = useMemo(
    () => ({
      company: '',
      contact: '',
      email: '',
      phone: '',
      boxes: String(qty),
      budget: String(tier.price),
      date: '',
      requirements: '',
      message: '',
    }),
    [qty, tier.price],
  )
  const [form, setForm] = useState(formDefaults)

  return (
    <div>
      <section className="relative overflow-hidden bg-cinnamon text-cream">
        <div className="absolute inset-0 opacity-30">
          <img
            src="/products/gift-corporate.jpg"
            alt=""
            className="h-full w-full object-cover"
          />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-24 md:px-6">
          <p className="text-sm uppercase tracking-[0.25em] text-gold">Corporate Gifting</p>
          <h1 className="mt-4 max-w-3xl font-display text-4xl md:text-6xl">
            Make Your Brand Part of a Sri Lankan Experience.
          </h1>
          <p className="mt-5 max-w-xl text-cream/80">
            Logo-ready packaging, bulk pricing, and personalized messages — gifts that feel cultural,
            premium, and unmistakably yours.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
        <h2 className="font-display text-3xl text-cinnamon">Built for teams & clients</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            'Custom Company Logo',
            'Corporate Packaging',
            'Bulk Orders',
            'Personalized Messages',
            'Employee Gifts',
            'Client Gifts',
            'Event Gifts',
            'Flexible Budgets',
          ].map((f) => (
            <div key={f} className="rounded-2xl bg-white/70 px-4 py-5 text-sm font-medium text-cinnamon ring-1 ring-cinnamon/8">
              {f}
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white/50 py-16">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <h2 className="font-display text-3xl text-cinnamon">Pricing tiers</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {tiers.map((t) => (
              <button
                key={t.name}
                type="button"
                onClick={() => setTier(t)}
                className={`rounded-3xl p-6 text-left transition ring-1 ${
                  tier.name === t.name
                    ? 'bg-forest text-cream ring-forest'
                    : 'bg-white text-cinnamon ring-cinnamon/10 hover:ring-gold'
                }`}
              >
                <h3 className="font-display text-2xl">{t.name}</h3>
                <p className="mt-2 font-semibold">From {formatLKR(t.price)}</p>
                <ul className="mt-4 space-y-2 text-sm opacity-80">
                  {t.features.map((f) => (
                    <li key={f}>· {f}</li>
                  ))}
                </ul>
              </button>
            ))}
          </div>

          <div className="mt-10 max-w-lg rounded-2xl bg-cream p-6 ring-1 ring-cinnamon/10">
            <label className="text-sm text-muted">
              Number of boxes: {qty}
              <input
                type="range"
                min={1}
                max={120}
                value={qty}
                onChange={(e) => setQty(Number(e.target.value))}
                className="mt-3 w-full accent-cinnamon"
              />
            </label>
            <p className="mt-4 text-sm">
              {discount < 0
                ? '100+ boxes — custom quotation required'
                : discount > 0
                  ? `${discount * 100}% automatic volume discount applied`
                  : '1–20 boxes — standard pricing'}
            </p>
            <p className="mt-2 font-display text-3xl text-cinnamon">
              {total === null ? 'Request custom quote' : formatLKR(Math.round(total))}
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-16 md:px-6">
        <h2 className="font-display text-3xl text-cinnamon">Request Corporate Quote</h2>
        <form
          className="mt-8 grid gap-4 sm:grid-cols-2"
          onSubmit={(e) => {
            e.preventDefault()
            push('Corporate quote request received. We will contact you shortly.')
            setForm(formDefaults)
          }}
        >
          {(
            [
              ['company', 'Company Name'],
              ['contact', 'Contact Person'],
              ['email', 'Email'],
              ['phone', 'Phone'],
              ['boxes', 'Number of Boxes'],
              ['budget', 'Budget Per Box'],
              ['date', 'Event Date'],
            ] as const
          ).map(([key, label]) => (
            <label key={key} className="text-sm">
              <span className="text-muted">{label}</span>
              <input
                required
                value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                className="mt-1 w-full rounded-xl border border-cinnamon/15 bg-white px-4 py-2.5"
              />
            </label>
          ))}
          <label className="text-sm sm:col-span-2">
            <span className="text-muted">Customization Requirements</span>
            <textarea
              value={form.requirements}
              onChange={(e) => setForm({ ...form, requirements: e.target.value })}
              className="mt-1 w-full rounded-xl border border-cinnamon/15 bg-white px-4 py-2.5"
              rows={3}
            />
          </label>
          <label className="text-sm sm:col-span-2">
            <span className="text-muted">Message</span>
            <textarea
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="mt-1 w-full rounded-xl border border-cinnamon/15 bg-white px-4 py-2.5"
              rows={3}
            />
          </label>
          <Button type="submit" className="sm:col-span-2 w-fit">
            Request a Quote
          </Button>
        </form>
      </section>
    </div>
  )
}
