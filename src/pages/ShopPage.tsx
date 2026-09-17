import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ProductCard } from '../components/ProductCard'
import { products } from '../data/products'
import type { Category } from '../data/types'
import type { Product } from '../data/types'
import { api } from '../lib/api'
import { normalizeProduct } from '../lib/products'

const categories: Array<Category | 'All'> = [
  'All',
  'Spices',
  'Ceylon Tea',
  'Traditional Snacks',
  'Gift Boxes',
  'Premium Collection',
  'Corporate Gifts',
]

const occasions = ['Birthday', 'Wedding', 'Corporate', 'Thank You', 'Tourist Souvenir'] as const

export function ShopPage() {
  const [params, setParams] = useSearchParams()
  const initialCat = (params.get('category') as Category | null) ?? 'All'
  const q = params.get('q') ?? ''

  const [category, setCategory] = useState<Category | 'All'>(
    categories.includes(initialCat as Category | 'All') ? (initialCat as Category | 'All') : 'All',
  )
  const [sort, setSort] = useState('featured')
  const [occasion, setOccasion] = useState('')
  const [maxPrice, setMaxPrice] = useState(10000)
  const [minRating, setMinRating] = useState(0)
  const [catalog, setCatalog] = useState<Product[]>(products)

  useEffect(() => {
    const query = new URLSearchParams()
    if (q) query.set('q', q)
    if (category !== 'All') query.set('category', category)
    query.set('sort', sort)
    query.set('maxPrice', String(maxPrice))
    query.set('minRating', String(minRating))
    if (occasion) query.set('occasion', occasion)
    api<{ products: unknown[] }>(`/products?${query}`)
      .then((result) => setCatalog(result.products.map((product) => normalizeProduct(product as Parameters<typeof normalizeProduct>[0]))))
      .catch(() => setCatalog(products))
  }, [category, maxPrice, minRating, occasion, q, sort])

  const filtered = useMemo(() => {
    let list = [...catalog]
    if (category !== 'All') list = list.filter((p) => p.category === category)
    if (q) {
      const needle = q.toLowerCase()
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(needle) ||
          p.description.toLowerCase().includes(needle) ||
          p.category.toLowerCase().includes(needle),
      )
    }
    if (occasion) list = list.filter((p) => p.occasions.includes(occasion as never))
    list = list.filter((p) => p.price <= maxPrice && p.rating >= minRating)

    switch (sort) {
      case 'price-asc':
        list.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        list.sort((a, b) => b.price - a.price)
        break
      case 'best':
        list.sort((a, b) => Number(b.bestSeller) - Number(a.bestSeller) || b.rating - a.rating)
        break
      case 'newest':
        list.reverse()
        break
      default:
        list.sort((a, b) => Number(b.featured) - Number(a.featured))
    }
    return list
  }, [catalog, category, q, sort, occasion, maxPrice, minRating])

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
      <div className="max-w-2xl">
        <h1 className="font-display text-4xl text-cinnamon md:text-5xl">Shop</h1>
        <p className="mt-2 text-muted">
          Premium Sri Lankan spices, tea, snacks, and gift experiences.
        </p>
      </div>

      <div className="mt-8 flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => {
              setCategory(c)
              if (c === 'All') params.delete('category')
              else params.set('category', c)
              setParams(params)
            }}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              category === c
                ? 'bg-cinnamon text-cream'
                : 'bg-white text-cinnamon ring-1 ring-cinnamon/10 hover:bg-cinnamon/5'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-4 rounded-2xl bg-white/70 p-4 ring-1 ring-cinnamon/8 md:grid-cols-4">
        <label className="text-sm">
          <span className="text-muted">Sort</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="mt-1 w-full rounded-xl border border-cinnamon/15 bg-cream px-3 py-2"
          >
            <option value="featured">Featured</option>
            <option value="price-asc">Price Low to High</option>
            <option value="price-desc">Price High to Low</option>
            <option value="best">Best Selling</option>
            <option value="newest">Newest</option>
          </select>
        </label>
        <label className="text-sm">
          <span className="text-muted">Occasion</span>
          <select
            value={occasion}
            onChange={(e) => setOccasion(e.target.value)}
            className="mt-1 w-full rounded-xl border border-cinnamon/15 bg-cream px-3 py-2"
          >
            <option value="">All</option>
            {occasions.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          <span className="text-muted">Max price: LKR {maxPrice.toLocaleString()}</span>
          <input
            type="range"
            min={500}
            max={10000}
            step={250}
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="mt-3 w-full accent-cinnamon"
          />
        </label>
        <label className="text-sm">
          <span className="text-muted">Min rating</span>
          <select
            value={minRating}
            onChange={(e) => setMinRating(Number(e.target.value))}
            className="mt-1 w-full rounded-xl border border-cinnamon/15 bg-cream px-3 py-2"
          >
            <option value={0}>Any</option>
            <option value={4}>4+</option>
            <option value={4.5}>4.5+</option>
            <option value={4.8}>4.8+</option>
          </select>
        </label>
      </div>

      {q && (
        <p className="mt-4 text-sm text-muted">
          Results for “{q}” — {filtered.length} found
        </p>
      )}

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="mt-16 text-center text-muted">
          <p>No products match your filters.</p>
        </div>
      )}
    </div>
  )
}
