import { X } from 'lucide-react'
import { useEffect } from 'react'
import type { GiftOccasion, GiftPackage } from '../../data/giftOccasions'
import { formatLKR } from '../../data/products'
import { Button } from '../Button'

interface GiftPackageModalProps {
  open: boolean
  pkg: GiftPackage | null
  occasion: GiftOccasion | null
  onClose: () => void
}

export function GiftPackageModal({ open, pkg, occasion, onClose }: GiftPackageModalProps) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open || !pkg || !occasion) return null

  const customizeTo = `/build-your-spicebox?occasion=${encodeURIComponent(occasion.slug)}&package=${encodeURIComponent(pkg.id)}`

  return (
    <div
      className="fixed inset-0 z-[80] flex items-end justify-center bg-cinnamon/60 p-0 sm:items-center sm:p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="gift-package-title"
    >
      <div
        className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-t-3xl bg-cream shadow-2xl sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative aspect-[16/9] overflow-hidden sm:aspect-[21/9]">
          <img src={pkg.image} alt={pkg.name} className="h-full w-full object-cover" />
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="absolute top-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-cream/95 text-cinnamon shadow"
          >
            <X className="h-5 w-5" />
          </button>
          {pkg.badge && (
            <span className="absolute bottom-3 left-3 rounded-full bg-forest px-3 py-1 text-xs font-semibold text-cream">
              {pkg.badge}
            </span>
          )}
        </div>

        <div className="p-5 md:p-8">
          <p className="text-xs font-semibold tracking-[0.18em] text-forest uppercase">
            {occasion.name}
          </p>
          <h2 id="gift-package-title" className="mt-1 font-display text-3xl text-cinnamon md:text-4xl">
            {pkg.name}
          </h2>
          <p className="mt-3 leading-relaxed text-muted">{pkg.description}</p>

          <div className="mt-6">
            <h3 className="font-display text-xl text-cinnamon">What&apos;s inside</h3>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {pkg.includes.map((item) => (
                <li key={item} className="flex gap-2 text-sm text-cinnamon/90">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <p className="mt-6 font-display text-3xl text-cinnamon">
            <span className="mr-1 text-sm font-sans font-medium tracking-wide text-muted uppercase">
              From
            </span>
            {formatLKR(pkg.price)}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button to={customizeTo} variant="gold">
              Customize this box
            </Button>
            {occasion.slug === 'corporate' ? (
              <Button to="/corporate-gifting" variant="outline">
                Corporate / bulk enquiry
              </Button>
            ) : (
              <Button to="/gift-boxes" variant="outline">
                Browse all gift boxes
              </Button>
            )}
            <Button variant="ghost" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
