import { Button } from '../components/Button'
import { useToastStore } from '../store/toastStore'

const faqs = [
  {
    q: 'How does Gift Builder work?',
    a: 'Choose occasion, recipient, budget and interests, pick products, personalize, then preview and add to cart.',
  },
  {
    q: 'Do you deliver islandwide?',
    a: 'Yes — standard and express options are available at checkout. Pickup is also supported in Colombo.',
  },
  {
    q: 'What is the QR Cultural Experience?',
    a: 'Each gift can include a QR code linking to stories, origins, and recipes for the products inside.',
  },
  {
    q: 'Can I order corporate gifts with our logo?',
    a: 'Yes. Use the Corporate page to request a quote with logo and packaging requirements.',
  },
  {
    q: 'What is SpicePoints?',
    a: 'Our loyalty program. Earn points on purchases and activities; unlock Spice Starter, Explorer, and Master levels.',
  },
  {
    q: 'Returns & shipping',
    a: 'Unopened products can be returned within 7 days. Custom personalized gifts are final sale unless damaged in transit.',
  },
]

export function ContactPage() {
  const push = useToastStore((s) => s.push)
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 md:px-6">
      <h1 className="font-display text-4xl text-cinnamon">Contact</h1>
      <p className="mt-2 text-muted">We’d love to help craft your next Sri Lankan gift.</p>
      <form
        className="mt-8 grid gap-4"
        onSubmit={(e) => {
          e.preventDefault()
          push('Message sent — we’ll reply soon.')
          ;(e.target as HTMLFormElement).reset()
        }}
      >
        <input required placeholder="Name" className="rounded-xl border border-cinnamon/15 bg-white px-4 py-2.5" />
        <input required type="email" placeholder="Email" className="rounded-xl border border-cinnamon/15 bg-white px-4 py-2.5" />
        <textarea required rows={5} placeholder="Message" className="rounded-xl border border-cinnamon/15 bg-white px-4 py-2.5" />
        <Button type="submit" className="w-fit">
          Send Message
        </Button>
      </form>
      <div className="mt-10 text-sm text-muted">
        <p>hello@spiceboxlanka.lk</p>
        <p>+94 11 234 5678</p>
        <p>Colombo, Sri Lanka</p>
      </div>
    </div>
  )
}

export function FAQPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 md:px-6">
      <h1 className="font-display text-4xl text-cinnamon">FAQ</h1>
      <div className="mt-8 space-y-4">
        {faqs.map((f) => (
          <details key={f.q} className="group rounded-2xl bg-white p-5 ring-1 ring-cinnamon/8">
            <summary className="cursor-pointer list-none font-medium text-cinnamon">
              {f.q}
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-muted">{f.a}</p>
          </details>
        ))}
      </div>
      <Button to="/contact" variant="outline" className="mt-8">
        Still need help? Contact us
      </Button>
    </div>
  )
}
