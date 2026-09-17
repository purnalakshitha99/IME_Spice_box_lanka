import { useEffect, useMemo, useState } from 'react'
import { Minus, Plus, Sparkles, Trash2 } from 'lucide-react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Button } from '../components/Button'
import { formatLKR } from '../data/products'
import { getGiftPackage } from '../data/giftOccasions'
import type { Product } from '../data/types'
import { api } from '../lib/api'
import { normalizeProduct } from '../lib/products'
import { useCartStore } from '../store/cartStore'
import { useToastStore } from '../store/toastStore'

const occasions = ['Birthday', 'Wedding', 'Anniversary', 'Thank You', 'Corporate', 'New Year', 'Christmas', "Mother's Day", "Father's Day", 'Tourist Gift', 'Just Because']
const steps = ['Occasion', 'Recipient', 'Budget', 'Products', 'Personalize', 'Preview']
type Line = { product: Product; quantity: number; reasons?: string[] }
type Totals = { productsTotal: number; packagingFee: number; customizationFee: number; totalPrice: number; remaining: number | null; exceedsBudget: boolean }

const occasionParamMap: Record<string, string> = {
  birthday: 'Birthday',
  wedding: 'Wedding',
  anniversary: 'Anniversary',
  'thank-you': 'Thank You',
  corporate: 'Corporate',
  seasonal: 'New Year',
}

export function BuildYourSpiceBoxPage() {
  const [searchParams] = useSearchParams()
  const [step, setStep] = useState(0)
  const [occasion, setOccasion] = useState('')
  const [recipient, setRecipient] = useState({ type: 'Friend', ageGroup: 'Adult', style: 'Thoughtful', teaLover: false, spiceLover: false, foodLover: false, cultureLover: false })
  const [budget, setBudget] = useState(5000)
  const [catalog, setCatalog] = useState<Product[]>([])
  const [lines, setLines] = useState<Line[]>([])
  const [personalization, setPersonalization] = useState({ recipientName: '', message: '', senderName: '' })
  const [packaging, setPackaging] = useState('Classic')
  const [ribbon, setRibbon] = useState('Standard')
  const [cardType, setCardType] = useState('Heritage Gold')
  const [totals, setTotals] = useState<Totals>({ productsTotal: 0, packagingFee: 350, customizationFee: 0, totalPrice: 350, remaining: 4650, exceedsBudget: false })
  const [busy, setBusy] = useState(false)
  const [prefillNote, setPrefillNote] = useState('')
  const push = useToastStore((s) => s.push)
  const addItem = useCartStore((s) => s.addItem)
  const navigate = useNavigate()

  useEffect(() => {
    const occasionParam = searchParams.get('occasion') || ''
    const packageParam = searchParams.get('package') || ''
    const mapped = occasionParamMap[occasionParam.toLowerCase()] || occasionParam
    if (mapped && occasions.includes(mapped)) {
      setOccasion(mapped)
    }
    if (packageParam) {
      const found = getGiftPackage(packageParam)
      if (found) {
        setBudget(found.package.price)
        setPrefillNote(`Starting from “${found.package.name}” (${found.occasion.name}).`)
        if (!mapped) {
          const fromSlug = occasionParamMap[found.occasion.slug]
          if (fromSlug) setOccasion(fromSlug)
        }
      }
    }
  }, [searchParams])

  const calculateBody = useMemo(() => ({
    products: lines.map(({ product, quantity }) => ({ productId: product.id, price: product.price, quantity })),
    packaging, ribbon, personalization, budget,
  }), [lines, packaging, ribbon, personalization, budget])

  useEffect(() => {
    api<{ products: unknown[] }>('/products?inStock=true')
      .then((r) => setCatalog(r.products.map((p) => normalizeProduct(p as Parameters<typeof normalizeProduct>[0]))))
      .catch(() => push('Products could not be loaded. Please try again.', 'error'))
  }, [push])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      api<Totals>('/gift-boxes/custom/calculate', { method: 'POST', json: calculateBody })
        .then(setTotals)
        .catch(() => undefined)
    }, 180)
    return () => window.clearTimeout(timer)
  }, [calculateBody])

  const add = (product: Product, reasons?: string[]) => {
    const projected = totals.totalPrice + product.price
    if (projected > budget && !window.confirm(`This takes your box ${formatLKR(projected - budget)} over budget. Add it anyway?`)) return
    setLines((current) => {
      const found = current.find((line) => line.product.id === product.id)
      return found
        ? current.map((line) => line.product.id === product.id ? { ...line, quantity: line.quantity + 1 } : line)
        : [...current, { product, quantity: 1, reasons }]
    })
  }

  const recommend = async () => {
    setBusy(true)
    try {
      const result = await api<{ recommendations: { product: unknown; reasons: string[] }[] }>('/recommend', {
        method: 'POST',
        json: { occasion, budget, recipientType: recipient.type, ...recipient },
      })
      setLines(result.recommendations.map((item) => ({
        product: normalizeProduct(item.product as Parameters<typeof normalizeProduct>[0]),
        quantity: 1,
        reasons: item.reasons,
      })))
      push('Smart recommendations added to your box.')
    } catch (error) {
      push(error instanceof Error ? error.message : 'Recommendations unavailable', 'error')
    } finally {
      setBusy(false)
    }
  }

  const save = async () => {
    setBusy(true)
    try {
      const result = await api<{ customBox: { _id: string; totalPrice: number } }>('/gift-boxes/custom', {
        method: 'POST',
        json: { occasion, recipient, budget, products: calculateBody.products, packaging, ribbon, cardType, personalization, confirmOverBudget: totals.exceedsBudget },
      })
      addItem({
        productId: `custom:${result.customBox._id}`,
        name: `Custom SpiceBox — ${occasion}`,
        price: result.customBox.totalPrice,
        image: '/products/gift-heritage.jpg',
        quantity: 1,
        customization: { ...personalization, packaging, customBoxId: result.customBox._id },
      })
      push('Your custom SpiceBox was saved and added to cart.')
      navigate('/cart')
    } catch (error) {
      push(error instanceof Error ? error.message : 'Could not save your SpiceBox', 'error')
    } finally {
      setBusy(false)
    }
  }

  const canContinue = [occasion, recipient.type, budget > 0, lines.length > 0, true, true][step]

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
      <p className="text-sm font-semibold uppercase tracking-[.2em] text-forest">Made by you</p>
      <h1 className="mt-2 font-display text-4xl text-cinnamon md:text-5xl">Build Your Sri Lankan SpiceBox</h1>
      {prefillNote && (
        <p className="mt-3 rounded-2xl bg-forest/5 px-4 py-3 text-sm text-forest ring-1 ring-forest/10">
          {prefillNote}
        </p>
      )}
      <div className="mt-8 flex gap-2 overflow-x-auto pb-2">
        {steps.map((label, index) => <button key={label} onClick={() => setStep(index)} className={`whitespace-nowrap rounded-full px-4 py-2 text-sm ${step === index ? 'bg-cinnamon text-cream' : 'bg-white text-muted'}`}>{index + 1}. {label}</button>)}
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_350px]">
        <section className="rounded-3xl bg-white/80 p-6 ring-1 ring-cinnamon/10 md:p-8">
          {step === 0 && <Choice title="What are you celebrating?" options={occasions} value={occasion} onChange={setOccasion} />}
          {step === 1 && (
            <div>
              <Title>Tell us about the recipient</Title>
              <div className="grid gap-4 sm:grid-cols-3">
                <Select label="Recipient" value={recipient.type} options={['Friend', 'Partner', 'Family', 'Client', 'Employee', 'Host']} onChange={(type) => setRecipient({ ...recipient, type })} />
                <Select label="Age group" value={recipient.ageGroup} options={['Teen', 'Young Adult', 'Adult', 'Senior']} onChange={(ageGroup) => setRecipient({ ...recipient, ageGroup })} />
                <Select label="Gift style" value={recipient.style} options={['Thoughtful', 'Traditional', 'Modern', 'Premium', 'Adventurous']} onChange={(style) => setRecipient({ ...recipient, style })} />
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {([['teaLover', 'Tea lover'], ['spiceLover', 'Spice lover'], ['foodLover', 'Food lover'], ['cultureLover', 'Culture lover']] as const).map(([key, label]) => (
                  <label key={key} className="flex items-center gap-3 rounded-xl bg-cream p-4"><input type="checkbox" checked={recipient[key]} onChange={(e) => setRecipient({ ...recipient, [key]: e.target.checked })} className="accent-cinnamon" />{label}</label>
                ))}
              </div>
            </div>
          )}
          {step === 2 && (
            <div>
              <Title>Choose your budget</Title>
              <div className="flex flex-wrap gap-2">{[3000, 5000, 7500, 10000].map((amount) => <button key={amount} onClick={() => setBudget(amount)} className={`rounded-full px-5 py-3 ${budget === amount ? 'bg-cinnamon text-cream' : 'bg-cream text-cinnamon'}`}>{formatLKR(amount)}</button>)}</div>
              <label className="mt-6 block max-w-xs text-sm text-muted">Custom amount<input type="number" min="1500" value={budget} onChange={(e) => setBudget(Number(e.target.value))} className="mt-1 w-full rounded-xl border border-cinnamon/15 bg-cream px-4 py-3 text-cinnamon" /></label>
            </div>
          )}
          {step === 3 && (
            <div>
              <div className="flex flex-wrap items-center justify-between gap-3"><Title>Build your selection</Title><Button onClick={recommend} disabled={busy}><Sparkles className="h-4 w-4" />Smart recommendations</Button></div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {catalog.map((product) => {
                  const line = lines.find((item) => item.product.id === product.id)
                  return <div key={product.id} className="flex gap-3 rounded-2xl bg-cream p-3"><img src={product.image} alt="" className="h-20 w-20 rounded-xl object-cover" /><div className="min-w-0 flex-1"><p className="truncate font-medium text-cinnamon">{product.name}</p><p className="text-sm text-muted">{formatLKR(product.price)}</p>{line ? <div className="mt-2 flex items-center gap-2"><button onClick={() => setLines((all) => all.map((x) => x.product.id === product.id ? { ...x, quantity: Math.max(1, x.quantity - 1) } : x))}><Minus className="h-4 w-4" /></button><span>{line.quantity}</span><button onClick={() => add(product)}><Plus className="h-4 w-4" /></button><button className="ml-auto text-clay" onClick={() => setLines((all) => all.filter((x) => x.product.id !== product.id))}><Trash2 className="h-4 w-4" /></button></div> : <Button size="sm" className="mt-2" onClick={() => add(product)}>Add</Button>}</div></div>
                })}
              </div>
            </div>
          )}
          {step === 4 && (
            <div>
              <Title>Add a personal touch</Title>
              <div className="grid gap-4 sm:grid-cols-2">
                {(['recipientName', 'senderName'] as const).map((key) => <label key={key} className="text-sm text-muted">{key === 'recipientName' ? 'Recipient name' : 'From'}<input value={personalization[key]} onChange={(e) => setPersonalization({ ...personalization, [key]: e.target.value })} className="mt-1 w-full rounded-xl border border-cinnamon/15 bg-cream px-4 py-3" /></label>)}
                <label className="text-sm text-muted sm:col-span-2">Message<textarea rows={3} value={personalization.message} onChange={(e) => setPersonalization({ ...personalization, message: e.target.value })} className="mt-1 w-full rounded-xl border border-cinnamon/15 bg-cream px-4 py-3" /></label>
                <Select label="Packaging" value={packaging} options={['Classic', 'Premium', 'Traditional', 'Luxury']} onChange={setPackaging} />
                <Select label="Ribbon" value={ribbon} options={['Standard', 'Premium']} onChange={setRibbon} />
                <Select label="Card type" value={cardType} options={['Heritage Gold', 'Birthday', 'Wedding', 'Thank You', 'Minimal Cream']} onChange={setCardType} />
              </div>
            </div>
          )}
          {step === 5 && <div><Title>Your SpiceBox is ready</Title><p className="text-muted">Review the live preview, then save it to your cart. All pricing is confirmed by the server.</p><Button className="mt-6" size="lg" onClick={save} disabled={busy || !lines.length}>{busy ? 'Saving…' : 'Save & Add to Cart'}</Button></div>}
          <div className="mt-8 flex justify-between"><Button variant="ghost" disabled={step === 0} onClick={() => setStep(step - 1)}>Back</Button>{step < steps.length - 1 && <Button disabled={!canContinue} onClick={() => setStep(step + 1)}>Continue</Button>}</div>
        </section>

        <aside className="h-fit lg:sticky lg:top-24">
          <div className={`relative min-h-72 overflow-hidden rounded-3xl p-6 text-cream shadow-xl ${packaging === 'Luxury' ? 'bg-forest' : packaging === 'Traditional' ? 'bg-clay' : 'bg-cinnamon'}`}>
            <div className="absolute inset-x-0 top-1/2 h-7 -translate-y-1/2 bg-gold/90" />
            <div className="absolute bottom-0 top-0 left-1/2 w-7 -translate-x-1/2 bg-gold/90" />
            <div className="relative z-10 mx-auto mt-12 max-w-56 rounded-xl border border-gold bg-cream p-5 text-center text-cinnamon shadow-lg">
              <p className="text-xs uppercase tracking-[.2em]">SpiceBox Lanka</p>
              <p className="mt-2 font-display text-2xl">For {personalization.recipientName || 'Someone Special'}</p>
              {personalization.message && <p className="mt-2 line-clamp-3 text-xs italic">“{personalization.message}”</p>}
            </div>
          </div>
          <div className="mt-4 rounded-2xl bg-white p-5 ring-1 ring-cinnamon/10">
            <div className="flex justify-between"><span className="text-muted">Total</span><strong className="text-cinnamon">{formatLKR(totals.totalPrice)}</strong></div>
            <div className={`mt-2 flex justify-between text-sm ${totals.exceedsBudget ? 'text-clay' : 'text-forest'}`}><span>{totals.exceedsBudget ? 'Over budget' : 'Remaining'}</span><span>{formatLKR(Math.abs(totals.remaining ?? 0))}</span></div>
            <p className="mt-3 text-xs text-muted">{lines.reduce((sum, line) => sum + line.quantity, 0)} products · {packaging} packaging · {ribbon} ribbon</p>
          </div>
        </aside>
      </div>
    </div>
  )
}

function Title({ children }: { children: React.ReactNode }) { return <h2 className="mb-6 font-display text-3xl text-cinnamon">{children}</h2> }
function Choice({ title, options, value, onChange }: { title: string; options: string[]; value: string; onChange: (value: string) => void }) {
  return <div><Title>{title}</Title><div className="flex flex-wrap gap-2">{options.map((option) => <button key={option} onClick={() => onChange(option)} className={`rounded-full px-4 py-3 ${value === option ? 'bg-cinnamon text-cream' : 'bg-cream text-cinnamon'}`}>{option}</button>)}</div></div>
}
function Select({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return <label className="text-sm text-muted">{label}<select value={value} onChange={(e) => onChange(e.target.value)} className="mt-1 w-full rounded-xl border border-cinnamon/15 bg-cream px-4 py-3 text-cinnamon">{options.map((option) => <option key={option}>{option}</option>)}</select></label>
}
