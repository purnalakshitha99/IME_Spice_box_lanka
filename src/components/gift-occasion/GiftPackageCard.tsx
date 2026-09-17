import type { GiftPackage } from '../../data/giftOccasions'
import { formatLKR } from '../../data/products'
import { Button } from '../Button'

interface GiftPackageCardProps {
  pkg: GiftPackage
  occasionSlug: string
  onView: (pkg: GiftPackage) => void
}

export function GiftPackageCard({ pkg, occasionSlug, onView }: GiftPackageCardProps) {
  const customizeTo = `/build-your-spicebox?occasion=${encodeURIComponent(occasionSlug)}&package=${encodeURIComponent(pkg.id)}`
  const visibleIncludes = pkg.includes.slice(0, 5)
  const extraCount = pkg.includes.length - visibleIncludes.length

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white/80 ring-1 ring-cinnamon/10 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-cinnamon/10">
      <div className="relative aspect-[4/3] overflow-hidden bg-cream-dark">
        <img
          src={pkg.image}
          alt={pkg.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {pkg.badge && (
          <span className="absolute left-3 top-3 max-w-[80%] rounded-full bg-forest px-2.5 py-1 text-[10px] font-semibold tracking-wide text-cream">
            {pkg.badge}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4 md:p-5">
        <h3 className="font-display text-xl text-cinnamon md:text-[1.35rem]">{pkg.name}</h3>
        <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted">{pkg.description}</p>

        <ul className="mt-3 space-y-1 text-sm text-cinnamon/85">
          {visibleIncludes.map((item) => (
            <li key={item} className="flex gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" aria-hidden />
              <span>{item}</span>
            </li>
          ))}
          {extraCount > 0 && (
            <li className="pl-3.5 text-xs text-muted">+{extraCount} more included</li>
          )}
        </ul>

        <p className="mt-4 font-semibold text-cinnamon">
          <span className="text-xs font-medium tracking-wide text-muted uppercase">From </span>
          {formatLKR(pkg.price)}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          <Button size="sm" variant="secondary" className="flex-1" onClick={() => onView(pkg)}>
            View Package
          </Button>
          <Button size="sm" variant="outline" className="flex-1" to={customizeTo}>
            Customize
          </Button>
        </div>
      </div>
    </article>
  )
}
