export interface GiftPackage {
  id: string
  name: string
  slug: string
  price: number
  priceLabel?: string
  description: string
  includes: string[]
  image: string
  badge?: string
}

export interface GiftOccasion {
  id: string
  name: string
  slug: string
  description: string
  image: string
  packages: GiftPackage[]
}

/**
 * Edit occasion names, packages, prices, and images here.
 * Image paths resolve from /public (e.g. /products/gift-birthday.jpg).
 */
export const giftOccasions: GiftOccasion[] = [
  {
    id: 'birthday',
    name: 'Birthday Gifts',
    slug: 'birthday',
    description: 'Warm, personal boxes for birthdays that feel truly special.',
    image: '/products/gift-birthday.jpg',
    packages: [
      {
        id: 'birthday-delight',
        name: 'Birthday Delight',
        slug: 'birthday-delight',
        price: 3500,
        description: 'A thoughtful Sri Lankan birthday surprise filled with authentic flavours.',
        includes: [
          'Ceylon Tea',
          'Ceylon Cinnamon',
          'Premium Spice Selection',
          'Birthday Message Card',
        ],
        image: '/products/gift-taste.jpg',
      },
      {
        id: 'birthday-celebration',
        name: 'Birthday Celebration Box',
        slug: 'birthday-celebration',
        price: 5500,
        description: 'A premium birthday collection created for someone special.',
        includes: [
          'Premium Ceylon Tea',
          'Cinnamon Sticks',
          'Cardamom',
          'Black Pepper',
          'Handmade Treat',
          'Personalized Birthday Card',
        ],
        image: '/products/gift-birthday.jpg',
      },
      {
        id: 'signature-birthday',
        name: 'Signature Birthday Collection',
        slug: 'signature-birthday',
        price: 8500,
        description: 'An elegant premium gift box for an unforgettable birthday.',
        includes: [
          'Premium Tea Collection',
          'Ceylon Cinnamon',
          'Cardamom',
          'Pepper',
          'Traditional Sri Lankan Treats',
          'Premium Packaging',
          'Personalized Message',
        ],
        image: '/products/gift-heritage.jpg',
      },
    ],
  },
  {
    id: 'wedding',
    name: 'Wedding Gifts',
    slug: 'wedding',
    description: 'Elegant Sri Lankan gifts to celebrate love and new beginnings.',
    image: '/products/gift-heritage.jpg',
    packages: [
      {
        id: 'wedding-blessings',
        name: 'Wedding Blessings Box',
        slug: 'wedding-blessings',
        price: 4500,
        description: 'A graceful welcome gift with island flavours and warm wishes.',
        includes: ['Ceylon Tea', 'Cinnamon', 'Cardamom', 'Wedding Greeting Card'],
        image: '/products/gift-tea.jpg',
      },
      {
        id: 'elegant-wedding',
        name: 'Elegant Wedding Collection',
        slug: 'elegant-wedding',
        price: 7500,
        description: 'A refined wedding gift with spices, tea, and elegant presentation.',
        includes: [
          'Premium Tea',
          'Ceylon Spices',
          'Traditional Sri Lankan Treats',
          'Elegant Wedding Packaging',
          'Personalized Couple Message',
        ],
        image: '/products/gift-heritage.jpg',
      },
      {
        id: 'luxury-wedding',
        name: 'Luxury Wedding Gift Box',
        slug: 'luxury-wedding',
        price: 12500,
        description: 'A luxurious Sri Lankan wedding collection for a memorable celebration.',
        includes: [
          'Premium Ceylon Tea Selection',
          'Luxury Spice Collection',
          'Cinnamon',
          'Cardamom',
          'Pepper',
          'Artisan Sri Lankan Treats',
          'Premium Gift Packaging',
          'Personalized Wedding Note',
        ],
        image: '/products/box-closed-luxury.jpg',
      },
    ],
  },
  {
    id: 'anniversary',
    name: 'Anniversary Gifts',
    slug: 'anniversary',
    description: 'Celebrate years together with thoughtfully curated island flavours.',
    image: '/products/gift-tea.jpg',
    packages: [
      {
        id: 'sweet-memories',
        name: 'Sweet Memories',
        slug: 'sweet-memories',
        price: 3900,
        description: 'A gentle anniversary box of tea, spice, and heartfelt notes.',
        includes: [
          'Ceylon Tea',
          'Cinnamon',
          'Cardamom',
          'Personalized Anniversary Card',
        ],
        image: '/products/gift-tea.jpg',
      },
      {
        id: 'timeless-together',
        name: 'Timeless Together',
        slug: 'timeless-together',
        price: 6500,
        description: 'A premium anniversary collection for lasting moments shared.',
        includes: [
          'Premium Ceylon Tea',
          'Cinnamon',
          'Cardamom',
          'Premium Spices',
          'Sri Lankan Treats',
          'Personalized Anniversary Card',
        ],
        image: '/products/gift-birthday.jpg',
      },
      {
        id: 'anniversary-signature',
        name: 'Anniversary Signature Box',
        slug: 'anniversary-signature',
        price: 9500,
        description: 'An elevated signature gift for a milestone anniversary.',
        includes: [
          'Premium Tea Collection',
          'Ceylon Cinnamon',
          'Cardamom',
          'Pepper',
          'Sri Lankan Treats',
          'Premium Packaging',
          'Personalized Anniversary Card',
        ],
        image: '/products/gift-heritage.jpg',
      },
    ],
  },
  {
    id: 'corporate',
    name: 'Corporate Gifts',
    slug: 'corporate',
    description: 'Brandable Sri Lankan gifts for clients, teams, and partners.',
    image: '/products/gift-corporate.jpg',
    packages: [
      {
        id: 'corporate-essential',
        name: 'Corporate Essential',
        slug: 'corporate-essential',
        price: 4000,
        description: 'A polished starter gift for clients and team appreciation.',
        includes: [
          'Ceylon Tea',
          'Cinnamon',
          'Custom Message Card',
          'Company Logo Option',
        ],
        image: '/products/gift-corporate.jpg',
        badge: 'Bulk order pricing available',
      },
      {
        id: 'executive-corporate',
        name: 'Executive Sri Lankan Gift Box',
        slug: 'executive-corporate',
        price: 7500,
        description: 'An executive-ready gift with premium packaging and branding space.',
        includes: [
          'Premium Ceylon Tea',
          'Spice Selection',
          'Custom Message Card',
          'Company Logo Placement',
          'Custom Packaging',
        ],
        image: '/products/gift-tea.jpg',
        badge: 'Bulk order pricing available',
      },
      {
        id: 'premium-corporate',
        name: 'Premium Corporate Collection',
        slug: 'premium-corporate',
        price: 12000,
        description: 'A luxury corporate collection for VIP clients and milestones.',
        includes: [
          'Premium Tea Collection',
          'Luxury Spice Set',
          'Artisan Treats',
          'Custom Message Card',
          'Company Logo',
          'Premium Custom Packaging',
        ],
        image: '/products/box-closed-luxury.jpg',
        badge: 'Bulk order pricing available',
      },
    ],
  },
  {
    id: 'thank-you',
    name: 'Thank You Gifts',
    slug: 'thank-you',
    description: 'Simple, warm gestures of gratitude with authentic Sri Lankan taste.',
    image: '/products/gift-taste.jpg',
    packages: [
      {
        id: 'little-thank-you',
        name: 'A Little Thank You',
        slug: 'little-thank-you',
        price: 2900,
        description: 'A small, sincere thank-you box of island essentials.',
        includes: ['Ceylon Tea', 'Cinnamon', 'Thank You Message Card'],
        image: '/products/gift-taste.jpg',
      },
      {
        id: 'with-gratitude',
        name: 'With Gratitude',
        slug: 'with-gratitude',
        price: 4900,
        description: 'A thoughtful thank-you collection for colleagues and friends.',
        includes: [
          'Premium Ceylon Tea',
          'Cinnamon',
          'Cardamom',
          'Sri Lankan Treat',
          'Personalized Thank You Card',
        ],
        image: '/products/gift-tea.jpg',
      },
      {
        id: 'premium-appreciation',
        name: 'Premium Appreciation Box',
        slug: 'premium-appreciation',
        price: 7900,
        description: 'A premium appreciation gift that feels considered and complete.',
        includes: [
          'Premium Tea Collection',
          'Ceylon Spices',
          'Traditional Treats',
          'Premium Packaging',
          'Personalized Appreciation Card',
        ],
        image: '/products/gift-heritage.jpg',
      },
    ],
  },
  {
    id: 'seasonal',
    name: 'Seasonal & New Year Gifts',
    slug: 'seasonal',
    description: 'Festive Sri Lankan boxes for New Year and seasonal celebrations.',
    image: '/products/kokis.jpg',
    packages: [
      {
        id: 'festive-spice',
        name: 'Festive Spice Box',
        slug: 'festive-spice',
        price: 3900,
        description: 'A bright festive starter with classic Sri Lankan spices and tea.',
        includes: ['Ceylon Tea', 'Cinnamon', 'Cardamom', 'Festive Greeting Card'],
        image: '/products/spices-banner.jpg',
      },
      {
        id: 'celebration-box',
        name: 'Sri Lankan Celebration Box',
        slug: 'celebration-box',
        price: 6500,
        description: 'A festive celebration box for New Year and family gatherings.',
        includes: [
          'Premium Ceylon Tea',
          'Cinnamon',
          'Pepper',
          'Traditional Sri Lankan Treats',
          'Seasonal Message Card',
        ],
        image: '/products/kokis.jpg',
      },
      {
        id: 'premium-festive',
        name: 'Premium Festive Collection',
        slug: 'premium-festive',
        price: 9900,
        description: 'A premium festive collection for memorable seasonal gifting.',
        includes: [
          'Premium Tea Collection',
          'Luxury Spice Selection',
          'Cardamom',
          'Traditional Treats',
          'Premium Packaging',
          'Personalized Festive Note',
        ],
        image: '/products/gift-heritage.jpg',
      },
    ],
  },
]

export function getGiftOccasion(idOrSlug: string) {
  return giftOccasions.find((o) => o.id === idOrSlug || o.slug === idOrSlug)
}

export function getGiftPackage(packageId: string) {
  for (const occasion of giftOccasions) {
    const pkg = occasion.packages.find((p) => p.id === packageId || p.slug === packageId)
    if (pkg) return { occasion, package: pkg }
  }
  return null
}
