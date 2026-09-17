import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/Button'
import { formatLKR } from '../data/products'
import { useCartStore } from '../store/cartStore'
import { useToastStore } from '../store/toastStore'
import { api } from '../lib/api'
import type { PaymentMethod } from '../lib/payments/types'

export function CheckoutPage() {
  const [step, setStep] = useState(1)
  const [paying, setPaying] = useState(false)
  const navigate = useNavigate()
  const { items, subtotal, clear } = useCartStore()
  const push = useToastStore((s) => s.push)

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    district: '',
    postalCode: '',
    deliveryOption: 'Standard Delivery',
    paymentMethod: 'PayHere' as PaymentMethod,
  })

  const deliveryFee =
    form.deliveryOption === 'Express Delivery' ? 750 : form.deliveryOption === 'Pickup' ? 0 : 350
  const total = subtotal() + deliveryFee

  const update = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }))

  const placeOrder = async () => {
    if (!form.name || !form.email || !form.phone) {
      push('Please complete customer details', 'error')
      setStep(1)
      return
    }
    if (!form.address || !form.city) {
      push('Please complete delivery address', 'error')
      setStep(2)
      return
    }

    setPaying(true)

    try {
      const custom = items.find((item) => item.customization?.customBoxId)
      const result = await api<{ order: { orderId: string } }>('/orders', {
        method: 'POST',
        json: {
          customer: { name: form.name, email: form.email, phone: form.phone },
          items: items.filter((item) => !item.customization?.customBoxId).map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            customization: item.customization,
          })),
          customBoxId: custom?.customization?.customBoxId,
          delivery: {
            address: form.address,
            city: form.city,
            district: form.district,
            postalCode: form.postalCode,
            method: form.deliveryOption,
          },
          paymentMethod: form.paymentMethod,
        },
      })
      clear()
      push('Order placed successfully!')
      navigate(`/order-success?orderId=${encodeURIComponent(result.order.orderId)}`)
    } catch (err) {
      setPaying(false)
      push(err instanceof Error ? err.message : 'Order could not be placed', 'error')
    }
  }

  if (!items.length) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <h1 className="font-display text-3xl text-cinnamon">Nothing to checkout</h1>
        <Button to="/shop" className="mt-6">
          Browse Shop
        </Button>
      </div>
    )
  }

  const paymentOptions: { id: PaymentMethod; label: string; hint: string }[] = [
    {
      id: 'PayHere',
      label: 'Card / PayHere',
      hint: 'Secure PayHere card checkout',
    },
    { id: 'Cash on Delivery', label: 'Cash on Delivery', hint: 'Pay when your gift arrives' },
    { id: 'Bank Transfer', label: 'Bank Transfer', hint: 'We will email transfer instructions' },
  ]

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 md:px-6">
      <h1 className="font-display text-4xl text-cinnamon">Checkout</h1>
      <div className="mt-6 flex gap-2 overflow-x-auto text-xs font-medium">
        {['Customer', 'Address', 'Delivery', 'Payment', 'Review'].map((label, i) => (
          <span
            key={label}
            className={`rounded-full px-3 py-1.5 ${
              step === i + 1 ? 'bg-cinnamon text-cream' : 'bg-white text-muted'
            }`}
          >
            {i + 1}. {label}
          </span>
        ))}
      </div>

      <div className="mt-8 rounded-3xl bg-white/80 p-6 ring-1 ring-cinnamon/8 md:p-8">
        {step === 1 && (
          <Fields
            fields={[
              ['name', 'Name'],
              ['email', 'Email'],
              ['phone', 'Phone'],
            ]}
            form={form}
            update={update}
          />
        )}
        {step === 2 && (
          <Fields
            fields={[
              ['address', 'Address'],
              ['city', 'City'],
              ['district', 'District'],
              ['postalCode', 'Postal Code'],
            ]}
            form={form}
            update={update}
          />
        )}
        {step === 3 && (
          <div className="space-y-3">
            {['Standard Delivery', 'Express Delivery', 'Pickup'].map((opt) => (
              <label
                key={opt}
                className={`flex cursor-pointer items-center gap-3 rounded-xl p-4 ring-1 ${
                  form.deliveryOption === opt ? 'bg-cream ring-gold' : 'ring-cinnamon/10'
                }`}
              >
                <input
                  type="radio"
                  name="delivery"
                  checked={form.deliveryOption === opt}
                  onChange={() => update('deliveryOption', opt)}
                />
                {opt}
              </label>
            ))}
          </div>
        )}
        {step === 4 && (
          <div className="space-y-3">
            {paymentOptions.map((opt) => (
              <label
                key={opt.id}
                className={`flex cursor-pointer flex-col gap-1 rounded-xl p-4 ring-1 ${
                  form.paymentMethod === opt.id ? 'bg-cream ring-gold' : 'ring-cinnamon/10'
                }`}
              >
                <span className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    checked={form.paymentMethod === opt.id}
                    onChange={() => update('paymentMethod', opt.id)}
                  />
                  <span className="font-medium text-cinnamon">{opt.label}</span>
                </span>
                <span className="pl-7 text-xs text-muted">{opt.hint}</span>
              </label>
            ))}
          </div>
        )}
        {step === 5 && (
          <div className="space-y-3 text-sm">
            <p>
              <strong>{form.name}</strong> · {form.email} · {form.phone}
            </p>
            <p>
              {form.address}, {form.city}, {form.district} {form.postalCode}
            </p>
            <p>
              {form.deliveryOption} · {form.paymentMethod}
            </p>
            <p className="font-display text-2xl text-cinnamon">Total {formatLKR(total)}</p>
          </div>
        )}

        <div className="mt-8 flex justify-between">
          <Button variant="ghost" disabled={step === 1 || paying} onClick={() => setStep((s) => s - 1)}>
            Back
          </Button>
          {step < 5 ? (
            <Button onClick={() => setStep((s) => s + 1)}>Continue</Button>
          ) : (
            <Button onClick={placeOrder} disabled={paying}>
              {paying
                ? 'Processing…'
                : form.paymentMethod === 'PayHere'
                  ? 'Pay & Place Order'
                  : 'Place Order'}
            </Button>
          )}
        </div>
      </div>

    </div>
  )
}

function Fields({
  fields,
  form,
  update,
}: {
  fields: [string, string][]
  form: Record<string, string>
  update: (k: string, v: string) => void
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {fields.map(([key, label]) => (
        <label key={key} className="text-sm">
          <span className="text-muted">{label}</span>
          <input
            required
            value={form[key]}
            onChange={(e) => update(key, e.target.value)}
            className="mt-1 w-full rounded-xl border border-cinnamon/15 bg-cream px-4 py-2.5"
          />
        </label>
      ))}
    </div>
  )
}
