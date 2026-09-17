import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { giftOccasions, type GiftPackage } from '../../data/giftOccasions'
import { Button } from '../Button'
import { GiftPackageGrid } from './GiftPackageGrid'
import { GiftPackageModal } from './GiftPackageModal'
import { OccasionCategoryTabs } from './OccasionCategoryTabs'

const fade = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-40px' },
  transition: { duration: 0.45 },
}

export function GiftOccasionSection() {
  const [selectedId, setSelectedId] = useState(giftOccasions[0]?.id ?? 'birthday')
  const [activePackage, setActivePackage] = useState<GiftPackage | null>(null)

  const selected = useMemo(
    () => giftOccasions.find((o) => o.id === selectedId) ?? giftOccasions[0],
    [selectedId],
  )

  return (
    <section id="gift-by-occasion" className="scroll-mt-24 border-t border-cinnamon/10 bg-[#fdfaf5]">
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-20">
        <motion.div {...fade} className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl text-cinnamon md:text-4xl">
            Find the Perfect Gift for Every Occasion
          </h2>
          <p className="mt-3 text-muted">
            Thoughtfully curated Sri Lankan gift boxes for every special moment.
          </p>
        </motion.div>

        <motion.div {...fade} className="mt-10">
          <OccasionCategoryTabs
            occasions={giftOccasions}
            selectedId={selected.id}
            onSelect={setSelectedId}
          />
        </motion.div>

        <div className="mt-8 md:mt-10">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h3 className="font-display text-2xl text-forest">{selected.name}</h3>
              <p className="mt-1 max-w-xl text-sm text-muted">{selected.description}</p>
            </div>
            <p className="text-xs tracking-wide text-muted uppercase">
              {selected.packages.length} packages
            </p>
          </div>

          <GiftPackageGrid
            packages={selected.packages}
            occasionSlug={selected.slug}
            onView={setActivePackage}
          />
        </div>

        {/* Custom gift CTA — matches existing forest premium sections */}
        <motion.div
          {...fade}
          className="mt-14 overflow-hidden rounded-3xl bg-forest px-6 py-10 text-cream md:mt-16 md:px-10 md:py-12"
        >
          <div className="max-w-2xl">
            <h3 className="font-display text-3xl md:text-4xl">Can&apos;t Find the Perfect Box?</h3>
            <p className="mt-3 text-cream/80">
              Create your own Sri Lankan gift box by choosing your favourite spices, tea, treats and
              personalized message.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button to="/build-your-spicebox" variant="gold" size="lg">
                Build Your Gift Box
              </Button>
              <Button
                to="/contact"
                size="lg"
                className="border border-cream/40 bg-transparent text-cream hover:border-cream hover:bg-cream/10"
              >
                Contact Us
              </Button>
            </div>
          </div>
        </motion.div>
      </div>

      <GiftPackageModal
        open={Boolean(activePackage)}
        pkg={activePackage}
        occasion={selected}
        onClose={() => setActivePackage(null)}
      />
    </section>
  )
}
