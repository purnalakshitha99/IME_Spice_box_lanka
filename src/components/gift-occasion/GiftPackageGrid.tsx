import { AnimatePresence, motion } from 'framer-motion'
import type { GiftPackage } from '../../data/giftOccasions'
import { GiftPackageCard } from './GiftPackageCard'

interface GiftPackageGridProps {
  packages: GiftPackage[]
  occasionSlug: string
  onView: (pkg: GiftPackage) => void
}

export function GiftPackageGrid({ packages, occasionSlug, onView }: GiftPackageGridProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={occasionSlug}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.28 }}
        className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
      >
        {packages.map((pkg) => (
          <GiftPackageCard
            key={pkg.id}
            pkg={pkg}
            occasionSlug={occasionSlug}
            onView={onView}
          />
        ))}
      </motion.div>
    </AnimatePresence>
  )
}
