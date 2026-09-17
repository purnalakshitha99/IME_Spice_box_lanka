import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Check, Minus, Plus, Trash2 } from 'lucide-react'
import { Button } from '../components/Button'
import { formatLKR, getProduct, products } from '../data/products'
import { useGiftBuilderStore } from '../store/giftBuilderStore'
import { useCartStore } from '../store/cartStore'
import { useToastStore } from '../store/toastStore'
import type { Interest, Occasion, Recipient } from '../data/types'

const occasions: Occasion[] = [
  'Birthday',
  'Wedding',
  'Anniversary',
  'Thank You',
  'Corporate',
  'New Year',
  'Christmas',
  "Mother's Day",
  "Father's Day",
  'Tourist Souvenir',
  'Just Because',
]

const recipients: Recipient[] = [
  'For Her',
  'For Him',
  'For Family',
  'For Friend',
  'For Couple',
  'For Client',
  'For Employee',
  'For Business Partner',
]

const budgets = [
  { label: 'LKR 3,000', value: 3000 },
  { label: 'LKR 5,000', value: 5000 },
  { label: 'LKR 7,500', value: 7500 },
  { label: 'LKR 10,000+', value: 10000 },
]

const interests: Interest[] = [
  'Tea Lover',
  'Cooking Lover',
  'Spice Lover',
  'Traditional Food Lover',
  'Healthy Lifestyle',
  'Sri Lankan Culture',
  'Premium Gifts',
]

const steps = [
  'Occasion',
  'Recipient',
  'Budget',
  'Interests',
  'Products',
  'Personalize',
  'Preview',
]

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-4 py-2.5 text-sm font-medium transition ${
        active
          ? 'bg-cinnamon text-cream shadow-md'
          : 'bg-white text-cinnamon ring-1 ring-cinnamon/12 hover:bg-cinnamon/5'
      }`}
    >
      {children}
    </button>
  )
}

export function GiftBuilderPage() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const push = useToastStore((s) => s.push)
  const addItem = useCartStore((s) => s.addItem)
  const store = useGiftBuilderStore()

  useEffect(() => {
    const pid = params.get('product')
    if (pid && getProduct(pid)) {
      store.addProduct(pid)
      store.setStep(5)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const budgetLimit = store.customBudget ?? store.budget ?? 10000
  const selectable = products.filter((p) => !p.isGiftBox || p.category === 'Gift Boxes')

  const canNext = () => {
    switch (store.step) {
      case 1:
        return !!store.occasion
      case 2:
        return !!store.recipient
      case 3:
        return !!store.budget || !!store.customBudget
      case 4:
        return store.interests.length > 0
      case 5:
        return store.selectedProducts.length > 0
      case 6:
        return store.personalization.recipientName.trim().length > 0
      default:
        return true
    }
  }

  const addToCart = () => {
    addItem({
      productId: 'custom-gift',
      name: `Custom Gift — ${store.occasion ?? 'SpiceBox'}`,
      price: store.total(),
      image: '/products/gift-taste.jpg',
      quantity: 1,
      customization: {
        recipientName: store.personalization.recipientName,
        message: store.personalization.message,
        senderName: store.personalization.senderName,
        packaging: store.personalization.packaging,
      },
    })
    push('Your personalized gift is ready!')
    store.reset()
    navigate('/cart')
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-6">
      <div className="max-w-2xl">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-forest">Gift Builder</p>
        <h1 className="mt-2 font-display text-4xl text-cinnamon md:text-5xl">
          Build Your Perfect Sri Lankan Gift
        </h1>
        <p className="mt-3 text-muted">
          Seven guided steps from occasion to a preview-ready personalized SpiceBox.
        </p>
      </div>

      {/* Progress */}
      <div className="mt-8 overflow-x-auto">
        <div className="flex min-w-max gap-2">
          {steps.map((label, i) => {
            const n = i + 1
            const done = store.step > n
            const active = store.step === n
            return (
              <button
                key={label}
                type="button"
                onClick={() => store.setStep(n)}
                className={`flex items-center gap-2 rounded-full px-3 py-2 text-xs font-medium transition ${
                  active
                    ? 'bg-cinnamon text-cream'
                    : done
                      ? 'bg-forest/15 text-forest'
                      : 'bg-white text-muted ring-1 ring-cinnamon/10'
                }`}
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-black/10 text-[10px]">
                  {done ? <Check className="h-3 w-3" /> : n}
                </span>
                {label}
              </button>
            )
          })}
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="rounded-3xl bg-white/80 p-6 ring-1 ring-cinnamon/8 md:p-8">
          {store.step === 1 && (
            <Step title="Select Occasion">
              <div className="flex flex-wrap gap-2">
                {occasions.map((o) => (
                  <Chip key={o} active={store.occasion === o} onClick={() => store.setOccasion(o)}>
                    {o}
                  </Chip>
                ))}
              </div>
            </Step>
          )}

          {store.step === 2 && (
            <Step title="Select Recipient">
              <div className="flex flex-wrap gap-2">
                {recipients.map((r) => (
                  <Chip key={r} active={store.recipient === r} onClick={() => store.setRecipient(r)}>
                    {r}
                  </Chip>
                ))}
              </div>
            </Step>
          )}

          {store.step === 3 && (
            <Step title="Set Your Budget">
              <div className="flex flex-wrap gap-2">
                {budgets.map((b) => (
                  <Chip
                    key={b.value}
                    active={store.budget === b.value && !store.customBudget}
                    onClick={() => store.setBudget(b.value, null)}
                  >
                    {b.label}
                  </Chip>
                ))}
                <Chip
                  active={store.customBudget !== null}
                  onClick={() => store.setBudget(null, store.customBudget ?? 6000)}
                >
                  Custom Budget
                </Chip>
              </div>
              {store.customBudget !== null && (
                <label className="mt-6 block text-sm">
                  <span className="text-muted">Custom amount (LKR)</span>
                  <input
                    type="number"
                    min={1000}
                    value={store.customBudget}
                    onChange={(e) => store.setBudget(null, Number(e.target.value))}
                    className="mt-2 w-full max-w-xs rounded-xl border border-cinnamon/15 bg-cream px-4 py-2.5"
                  />
                </label>
              )}
            </Step>
          )}

          {store.step === 4 && (
            <Step title="Select Interests" subtitle="Choose one or more">
              <div className="flex flex-wrap gap-2">
                {interests.map((i) => (
                  <Chip
                    key={i}
                    active={store.interests.includes(i)}
                    onClick={() => store.toggleInterest(i)}
                  >
                    {i}
                  </Chip>
                ))}
              </div>
            </Step>
          )}

          {store.step === 5 && (
            <Step title="Select Products" subtitle={`Budget guide: ${formatLKR(budgetLimit)}`}>
              <div className="grid gap-4 sm:grid-cols-2">
                {selectable
                  .filter((p) => !p.isGiftBox)
                  .map((p) => {
                    const selected = store.selectedProducts.find((s) => s.productId === p.id)
                    return (
                      <div
                        key={p.id}
                        className={`flex gap-3 rounded-2xl p-3 ring-1 transition ${
                          selected ? 'bg-cream ring-gold' : 'bg-cream/40 ring-cinnamon/8'
                        }`}
                      >
                        <img
                          src={p.image}
                          alt={p.name}
                          className="h-20 w-20 rounded-xl object-cover"
                        />
                        <div className="min-w-0 flex-1">
                          <h3 className="truncate font-medium text-cinnamon">{p.name}</h3>
                          <p className="text-sm text-muted">{formatLKR(p.price)}</p>
                          {selected ? (
                            <div className="mt-2 flex items-center gap-2">
                              <button
                                type="button"
                                className="rounded-full bg-white p-1 ring-1 ring-cinnamon/10"
                                onClick={() => store.setQuantity(p.id, selected.quantity - 1)}
                              >
                                <Minus className="h-3.5 w-3.5" />
                              </button>
                              <span className="text-sm font-medium">{selected.quantity}</span>
                              <button
                                type="button"
                                className="rounded-full bg-white p-1 ring-1 ring-cinnamon/10"
                                onClick={() => store.setQuantity(p.id, selected.quantity + 1)}
                              >
                                <Plus className="h-3.5 w-3.5" />
                              </button>
                              <button
                                type="button"
                                className="ml-auto text-clay"
                                onClick={() => store.removeProduct(p.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          ) : (
                            <Button size="sm" className="mt-2" onClick={() => store.addProduct(p.id)}>
                              Add
                            </Button>
                          )}
                        </div>
                      </div>
                    )
                  })}
              </div>
            </Step>
          )}

          {store.step === 6 && (
            <Step title="Personalize">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label="Recipient Name"
                  value={store.personalization.recipientName}
                  onChange={(v) => store.setPersonalization({ recipientName: v })}
                  required
                />
                <Field
                  label="Sender Name"
                  value={store.personalization.senderName}
                  onChange={(v) => store.setPersonalization({ senderName: v })}
                />
                <label className="sm:col-span-2 text-sm">
                  <span className="text-muted">Personal Message</span>
                  <textarea
                    rows={3}
                    value={store.personalization.message}
                    onChange={(e) => store.setPersonalization({ message: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-cinnamon/15 bg-cream px-4 py-2.5"
                    placeholder="Write a warm note…"
                  />
                </label>
                <label className="text-sm">
                  <span className="text-muted">Card Design</span>
                  <select
                    value={store.personalization.cardDesign}
                    onChange={(e) => store.setPersonalization({ cardDesign: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-cinnamon/15 bg-cream px-4 py-2.5"
                  >
                    <option>Heritage Gold</option>
                    <option>Gold Foil</option>
                    <option>Minimal Cream</option>
                    <option>Forest Leaf</option>
                  </select>
                </label>
                <label className="text-sm">
                  <span className="text-muted">Packaging Style</span>
                  <select
                    value={store.personalization.packaging}
                    onChange={(e) => store.setPersonalization({ packaging: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-cinnamon/15 bg-cream px-4 py-2.5"
                  >
                    <option>Classic SpiceBox</option>
                    <option>Luxury Heritage</option>
                    <option>Corporate Executive</option>
                  </select>
                </label>
                <label className="flex items-center gap-3 text-sm sm:col-span-2">
                  <input
                    type="checkbox"
                    checked={store.personalization.logoUploaded}
                    onChange={(e) => store.setPersonalization({ logoUploaded: e.target.checked })}
                    className="accent-cinnamon"
                  />
                  Upload Company Logo (prototype toggle)
                </label>
              </div>
            </Step>
          )}

          {store.step === 7 && (
            <Step title="Preview Your Gift">
              <div className="overflow-hidden rounded-2xl bg-cream">
                <img
                  src="/products/gift-heritage.jpg"
                  alt="Gift preview"
                  className="aspect-[16/9] w-full object-cover"
                />
                <div className="p-6">
                  <h3 className="font-display text-2xl text-cinnamon">
                    For {store.personalization.recipientName || 'someone special'}
                  </h3>
                  {store.personalization.message && (
                    <p className="mt-2 italic text-muted">“{store.personalization.message}”</p>
                  )}
                  <ul className="mt-4 space-y-2 text-sm">
                    {store.selectedProducts.map((s) => {
                      const p = getProduct(s.productId)
                      return (
                        <li key={s.productId} className="flex justify-between">
                          <span>
                            {p?.name} × {s.quantity}
                          </span>
                          <span>{formatLKR((p?.price ?? 0) * s.quantity)}</span>
                        </li>
                      )
                    })}
                  </ul>
                  <div className="mt-4 space-y-1 border-t border-cinnamon/10 pt-4 text-sm">
                    <Row label="Packaging" value={formatLKR(store.packagingFee())} />
                    <Row label="Customization" value={formatLKR(store.customizationFee())} />
                    <Row label="Total" value={formatLKR(store.total())} bold />
                  </div>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Button variant="outline" onClick={() => store.setStep(5)}>
                      Edit Gift
                    </Button>
                    <Button onClick={addToCart}>Add to Cart</Button>
                  </div>
                </div>
              </div>
            </Step>
          )}

          {store.step < 7 && (
            <div className="mt-8 flex justify-between gap-3">
              <Button
                variant="ghost"
                disabled={store.step === 1}
                onClick={() => store.setStep(store.step - 1)}
              >
                Back
              </Button>
              <Button
                disabled={!canNext()}
                onClick={() => store.setStep(store.step + 1)}
              >
                Continue
              </Button>
            </div>
          )}
        </div>

        {/* Live box preview */}
        <aside className="h-fit rounded-3xl bg-cinnamon p-6 text-cream lg:sticky lg:top-24">
          <h3 className="font-display text-2xl text-gold">Live Box Preview</h3>
          <p className="mt-1 text-sm text-cream/70">Updates as you build</p>
          <dl className="mt-6 space-y-3 text-sm">
            <PreviewRow label="Occasion" value={store.occasion} />
            <PreviewRow label="Recipient" value={store.recipient} />
            <PreviewRow
              label="Budget"
              value={
                store.customBudget
                  ? formatLKR(store.customBudget)
                  : store.budget
                    ? formatLKR(store.budget)
                    : null
              }
            />
            <PreviewRow
              label="Interests"
              value={store.interests.length ? store.interests.join(', ') : null}
            />
          </dl>
          <ul className="mt-4 max-h-40 space-y-2 overflow-y-auto text-sm">
            {store.selectedProducts.length === 0 && (
              <li className="text-cream/50">No products yet</li>
            )}
            {store.selectedProducts.map((s) => (
              <li key={s.productId} className="flex justify-between gap-2">
                <span className="truncate">{getProduct(s.productId)?.name}</span>
                <span>×{s.quantity}</span>
              </li>
            ))}
          </ul>
          <div className="mt-6 border-t border-cream/15 pt-4">
            <p className="text-xs uppercase tracking-wider text-cream/50">Running total</p>
            <p className="font-display text-3xl text-gold">{formatLKR(store.total())}</p>
            {store.budget && store.total() > budgetLimit && (
              <p className="mt-2 text-xs text-gold">Slightly over your budget guide</p>
            )}
          </div>
        </aside>
      </div>
    </div>
  )
}

function Step({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <h2 className="font-display text-2xl text-cinnamon md:text-3xl">{title}</h2>
      {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
      <div className="mt-6">{children}</div>
    </div>
  )
}

function Field({
  label,
  value,
  onChange,
  required,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  required?: boolean
}) {
  return (
    <label className="text-sm">
      <span className="text-muted">
        {label}
        {required && ' *'}
      </span>
      <input
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-xl border border-cinnamon/15 bg-cream px-4 py-2.5"
      />
    </label>
  )
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className={`flex justify-between ${bold ? 'text-base font-semibold text-cinnamon' : ''}`}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  )
}

function PreviewRow({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-cream/50">{label}</dt>
      <dd className="text-right">{value ?? '—'}</dd>
    </div>
  )
}
