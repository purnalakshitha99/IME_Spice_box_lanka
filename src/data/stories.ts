import type { Recipe, Story } from './types'

export const stories: Story[] = [
  {
    id: 'ceylon-cinnamon-story',
    title: 'Ceylon Cinnamon',
    slug: 'ceylon-cinnamon',
    category: 'Sri Lankan Spices',
    image: '/products/cinnamon.jpg',
    excerpt: 'The true cinnamon of Sri Lanka — delicate, sweet, and world-renowned.',
    whatIs:
      'Ceylon cinnamon (Cinnamomum verum) is the soft, multi-layered bark prized for its subtle sweetness and low coumarin content.',
    origin:
      'It grows abundantly in Sri Lanka’s southern wet zone, especially around Matara, Galle, and Kalutara.',
    whyFamous:
      'Sri Lanka produces the finest true cinnamon, historically sought by traders across continents and still celebrated as a national treasure.',
    traditionalUse:
      'Used in milk tea, sweets, Ayurvedic remedies, and festive cooking across Sinhala and Tamil households.',
    recipes: ['Ceylon Cinnamon Tea', 'Sri Lankan Chicken Curry'],
  },
  {
    id: 'ceylon-tea-story',
    title: 'Ceylon Tea',
    slug: 'ceylon-tea',
    category: 'Ceylon Tea',
    image: '/products/tea.jpg',
    excerpt: 'Misty highlands, bright cups, and an island ritual of hospitality.',
    whatIs:
      'Ceylon tea refers to tea grown in Sri Lanka — from bright low-grown leaf to elegant high-grown liquors.',
    origin: 'Estates across Nuwara Eliya, Dimbula, Uva, and coastal regions.',
    whyFamous:
      'Consistent quality, distinctive regional character, and a global reputation built over 150+ years.',
    traditionalUse: 'Served plain, with milk, or spiced — always as a gesture of welcome.',
    recipes: ['Ceylon Cinnamon Tea', 'Spiced Ceylon Tea'],
  },
  {
    id: 'pepper-story',
    title: 'Ceylon Black Pepper',
    slug: 'ceylon-black-pepper',
    category: 'Sri Lankan Spices',
    image: '/products/pepper.jpg',
    excerpt: 'The warm heat that shaped kitchens and trade routes.',
    whatIs: 'Sun-dried berries of Piper nigrum with floral heat and lasting aroma.',
    origin: 'Grown widely in Matale and other mid-country regions.',
    whyFamous: 'Pepper was once valued like currency and remains essential to Sri Lankan cuisine.',
    traditionalUse: 'Ground fresh into curries, marinades, and medicinal decoctions.',
    recipes: ['Sri Lankan Black Pepper Curry'],
  },
  {
    id: 'new-year-foods',
    title: 'Festive Foods of Avurudu',
    slug: 'avurudu-foods',
    category: 'Traditional Foods',
    image: '/products/kokis.jpg',
    excerpt: 'Kokis, kavum, and the flavours of Sinhala & Tamil New Year.',
    whatIs: 'A constellation of sweet and savoury treats prepared for the April New Year.',
    origin: 'Homes across Sri Lanka during Aluth Avurudu celebrations.',
    whyFamous: 'These foods embody abundance, family, and seasonal renewal.',
    traditionalUse: 'Shared with neighbours and offered first to the Buddha and elders.',
    recipes: ['Traditional Curry Powder Recipe'],
  },
  {
    id: 'spice-routes',
    title: 'Island of Spice Routes',
    slug: 'spice-routes',
    category: 'Cultural Heritage',
    image: '/products/spices-banner.jpg',
    excerpt: 'How Sri Lanka became a crossroads of flavour and culture.',
    whatIs: 'For centuries, Sri Lanka sat at the heart of Indian Ocean spice commerce.',
    origin: 'Ports from Galle to Colombo connected growers with global demand.',
    whyFamous: 'Cinnamon, pepper, and cardamom made the island legendary among traders.',
    traditionalUse: 'Spices remain markers of hospitality, ceremony, and identity.',
    recipes: ['Sri Lankan Chicken Curry'],
  },
]

export const recipes: Recipe[] = [
  {
    id: 'chicken-curry',
    title: 'Sri Lankan Chicken Curry',
    image: '/products/curry.jpg',
    prepTime: '50 min',
    difficulty: 'Medium',
    category: 'Mains',
    ingredients: [
      '1 kg chicken',
      '3 tbsp Sri Lankan Curry Powder',
      '1 tsp Ceylon Black Pepper',
      'Cinnamon stick',
      'Onion, garlic, ginger, curry leaves',
      'Coconut milk',
    ],
    instructions: [
      'Marinate chicken with curry powder, pepper, and salt.',
      'Sauté aromatics until golden.',
      'Add chicken and seal in spices.',
      'Pour coconut milk and simmer until tender.',
      'Finish with a cinnamon stick and fresh curry leaves.',
    ],
    productIds: ['sri-lankan-curry-powder', 'ceylon-black-pepper', 'ceylon-cinnamon'],
  },
  {
    id: 'cinnamon-tea',
    title: 'Ceylon Cinnamon Tea',
    image: '/products/tea.jpg',
    prepTime: '10 min',
    difficulty: 'Easy',
    category: 'Drinks',
    ingredients: ['Premium Ceylon Tea', 'Ceylon Cinnamon stick', 'Optional honey'],
    instructions: [
      'Bring water to a gentle boil.',
      'Add tea and a cinnamon stick.',
      'Steep 3–4 minutes.',
      'Strain and sweeten lightly if desired.',
    ],
    productIds: ['premium-ceylon-tea', 'ceylon-cinnamon'],
  },
  {
    id: 'pepper-curry',
    title: 'Sri Lankan Black Pepper Curry',
    image: '/products/pepper.jpg',
    prepTime: '45 min',
    difficulty: 'Medium',
    category: 'Mains',
    ingredients: [
      'Protein of choice',
      'Freshly cracked Ceylon Black Pepper',
      'Garlic, ginger, onion',
      'Curry leaves',
      'Coconut milk',
    ],
    instructions: [
      'Toast cracked pepper lightly.',
      'Build a fragrant base with aromatics.',
      'Add protein and pepper.',
      'Simmer with coconut milk until rich and fragrant.',
    ],
    productIds: ['ceylon-black-pepper', 'ceylon-cinnamon'],
  },
  {
    id: 'curry-powder-recipe',
    title: 'Traditional Curry Powder Recipe',
    image: '/products/spices-banner.jpg',
    prepTime: '30 min',
    difficulty: 'Advanced',
    category: 'Pantry',
    ingredients: [
      'Coriander seeds',
      'Cumin seeds',
      'Fennel seeds',
      'Dried chilli',
      'Ceylon Cinnamon',
      'Ceylon Cloves',
      'Cardamom',
    ],
    instructions: [
      'Dry-roast spices separately until aromatic.',
      'Cool completely.',
      'Grind to a fine powder.',
      'Store airtight and use within weeks for peak flavour.',
    ],
    productIds: ['ceylon-cinnamon', 'ceylon-cloves', 'ceylon-cardamom'],
  },
  {
    id: 'spiced-tea',
    title: 'Spiced Ceylon Tea',
    image: '/products/cardamom.jpg',
    prepTime: '12 min',
    difficulty: 'Easy',
    category: 'Drinks',
    ingredients: [
      'Premium Ceylon Tea',
      'Cardamom pods',
      'Ceylon Cinnamon',
      'Clove',
      'Milk (optional)',
    ],
    instructions: [
      'Lightly crush cardamom.',
      'Simmer spices in water for 3 minutes.',
      'Add tea and steep.',
      'Strain; add milk if preferred.',
    ],
    productIds: ['premium-ceylon-tea', 'ceylon-cardamom', 'ceylon-cinnamon', 'ceylon-cloves'],
  },
]

export function getStory(slug: string) {
  return stories.find((s) => s.slug === slug)
}

export function getRecipe(id: string) {
  return recipes.find((r) => r.id === id)
}
