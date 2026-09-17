import type { GiftOccasion } from '../../data/giftOccasions'

interface OccasionCategoryTabsProps {
  occasions: GiftOccasion[]
  selectedId: string
  onSelect: (id: string) => void
}

export function OccasionCategoryTabs({
  occasions,
  selectedId,
  onSelect,
}: OccasionCategoryTabsProps) {
  return (
    <div className="relative">
      {/* Mobile: horizontal scroll */}
      <div className="flex gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] sm:hidden [&::-webkit-scrollbar]:hidden">
        {occasions.map((o) => (
          <OccasionChip
            key={o.id}
            occasion={o}
            selected={selectedId === o.id}
            onSelect={onSelect}
            className="min-w-[148px] shrink-0"
          />
        ))}
      </div>

      {/* Tablet / Desktop: grid */}
      <div className="hidden gap-3 sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
        {occasions.map((o) => (
          <OccasionChip
            key={o.id}
            occasion={o}
            selected={selectedId === o.id}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  )
}

function OccasionChip({
  occasion,
  selected,
  onSelect,
  className = '',
}: {
  occasion: GiftOccasion
  selected: boolean
  onSelect: (id: string) => void
  className?: string
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(occasion.id)}
      aria-pressed={selected}
      className={`group overflow-hidden rounded-2xl text-left ring-1 transition duration-300 ${
        selected
          ? 'bg-forest ring-forest shadow-md shadow-forest/15'
          : 'bg-white/80 ring-cinnamon/10 hover:-translate-y-0.5 hover:ring-gold/50 hover:shadow-md'
      } ${className}`}
    >
      <div className="relative aspect-[5/3] overflow-hidden">
        <img
          src={occasion.image}
          alt=""
          className={`h-full w-full object-cover transition duration-500 ${
            selected ? 'opacity-90' : 'group-hover:scale-105'
          }`}
          loading="lazy"
        />
        <div
          className={`absolute inset-0 ${
            selected
              ? 'bg-gradient-to-t from-forest via-forest/40 to-transparent'
              : 'bg-gradient-to-t from-cinnamon/70 via-cinnamon/20 to-transparent'
          }`}
        />
        {selected && (
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-gold ring-2 ring-cream/80" />
        )}
      </div>
      <div className={`px-3 py-2.5 ${selected ? 'text-cream' : 'text-cinnamon'}`}>
        <p className="text-sm leading-snug font-semibold">{occasion.name}</p>
        <p
          className={`mt-0.5 line-clamp-2 text-[11px] leading-snug ${
            selected ? 'text-cream/75' : 'text-muted'
          }`}
        >
          {occasion.description}
        </p>
      </div>
    </button>
  )
}
