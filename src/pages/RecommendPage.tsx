import { useState } from 'react'
import { Button } from '../components/Button'
import { formatLKR } from '../data/products'
import { recommendGifts } from '../data/recommend'
import type { Interest, Occasion, Recipient } from '../data/types'
import { Link } from 'react-router-dom'

export function RecommendPage() {
  const [occasion, setOccasion] = useState<Occasion>('Birthday')
  const [recipient, setRecipient] = useState<Recipient>('For Her')
  const [budget, setBudget] = useState(5000)
  const [interests, setInterests] = useState<Interest[]>(['Tea Lover'])
  const [results, setResults] = useState(() =>
    recommendGifts({ occasion: 'Birthday', recipient: 'For Her', budget: 5000, interests: ['Tea Lover'] }),
  )

  const toggleInterest = (i: Interest) => {
    setInterests((prev) => (prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]))
  }

  const run = () => {
    setResults(recommendGifts({ occasion, recipient, budget, interests }))
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 md:px-6">
      <h1 className="font-display text-4xl text-cinnamon md:text-5xl">Not Sure What to Gift?</h1>
      <p className="mt-3 max-w-2xl text-muted">
        Tell us a little about the moment — our modular recommendation engine suggests gift boxes.
        (Rule-based prototype; ready to connect to an AI API later.)
      </p>

      <div className="mt-8 grid gap-4 rounded-3xl bg-white/80 p-6 ring-1 ring-cinnamon/8 md:grid-cols-2">
        <label className="text-sm">
          Occasion
          <select
            value={occasion}
            onChange={(e) => setOccasion(e.target.value as Occasion)}
            className="mt-1 w-full rounded-xl border border-cinnamon/15 bg-cream px-3 py-2.5"
          >
            {['Birthday', 'Wedding', 'Anniversary', 'Thank You', 'Corporate', 'Christmas'].map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          Recipient
          <select
            value={recipient}
            onChange={(e) => setRecipient(e.target.value as Recipient)}
            className="mt-1 w-full rounded-xl border border-cinnamon/15 bg-cream px-3 py-2.5"
          >
            {['For Her', 'For Him', 'For Family', 'For Friend', 'For Client', 'For Employee'].map(
              (r) => (
                <option key={r}>{r}</option>
              ),
            )}
          </select>
        </label>
        <label className="text-sm md:col-span-2">
          Budget: {formatLKR(budget)}
          <input
            type="range"
            min={3000}
            max={10000}
            step={500}
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
            className="mt-3 w-full accent-cinnamon"
          />
        </label>
        <div className="md:col-span-2">
          <p className="text-sm text-muted">Interests</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {(
              [
                'Tea Lover',
                'Cooking Lover',
                'Spice Lover',
                'Traditional Food Lover',
                'Premium Gifts',
                'Sri Lankan Culture',
              ] as Interest[]
            ).map((i) => (
              <button
                key={i}
                type="button"
                onClick={() => toggleInterest(i)}
                className={`rounded-full px-3 py-1.5 text-sm ${
                  interests.includes(i) ? 'bg-cinnamon text-cream' : 'bg-cream ring-1 ring-cinnamon/10'
                }`}
              >
                {i}
              </button>
            ))}
          </div>
        </div>
        <Button onClick={run} className="md:col-span-2 w-fit">
          Get Recommendations
        </Button>
      </div>

      <div className="mt-10 space-y-6">
        {results.map((r, idx) => (
          <article
            key={r.product.id}
            className="grid gap-6 overflow-hidden rounded-3xl bg-white ring-1 ring-cinnamon/8 md:grid-cols-[240px_1fr]"
          >
            <img src={r.product.image} alt={r.product.name} className="h-full min-h-48 object-cover" />
            <div className="p-6">
              {idx === 0 && (
                <span className="rounded-full bg-gold/20 px-3 py-1 text-xs font-semibold text-cinnamon">
                  Top match
                </span>
              )}
              <h2 className="mt-2 font-display text-3xl text-cinnamon">{r.product.name}</h2>
              <p className="mt-1 font-semibold">{formatLKR(r.product.price)}</p>
              <p className="mt-3 text-sm text-muted">Includes: {r.suggestedContents.join(' · ')}</p>
              <div className="mt-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-forest">
                  Why we recommend this
                </p>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted">
                  {r.reasons.map((reason) => (
                    <li key={reason}>{reason}</li>
                  ))}
                </ul>
              </div>
              <Button to="/gift-builder" className="mt-6">
                Customize This Gift
              </Button>
              <Link to={`/product/${r.product.id}`} className="ml-4 text-sm text-muted hover:text-cinnamon">
                View details
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
