import { useEffect, useState } from 'react'
import { MapPin, Sprout, Utensils } from 'lucide-react'
import { useParams } from 'react-router-dom'
import { Button } from '../components/Button'
import { api } from '../lib/api'

interface Experience {
  title: string
  image: string
  category: string
  whereItComesFrom: string
  heritage?: string
  production?: string
  howToUse?: string
  productStory?: string
  recipe?: { title: string; ingredients: string[]; steps: string[]; serving?: string }
}

export function ExperiencePage() {
  const { productId = '' } = useParams()
  const [experience, setExperience] = useState<Experience | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    api<{ experience: Experience }>(`/experience/${productId}`)
      .then((result) => setExperience(result.experience))
      .catch((reason) => setError(reason instanceof Error ? reason.message : 'Experience not found'))
  }, [productId])

  if (error) return <div className="mx-auto max-w-lg px-4 py-24 text-center"><h1 className="font-display text-3xl text-cinnamon">{error}</h1><Button to="/products" className="mt-6">Explore products</Button></div>
  if (!experience) return <div className="px-4 py-24 text-center text-muted">Opening your cultural experience…</div>

  return (
    <article className="pb-16">
      <header className="relative min-h-[55vh] overflow-hidden bg-cinnamon">
        <img src={experience.image} alt={experience.title} className="absolute inset-0 h-full w-full object-cover opacity-55" />
        <div className="absolute inset-0 bg-gradient-to-t from-cinnamon via-cinnamon/30 to-transparent" />
        <div className="relative mx-auto flex min-h-[55vh] max-w-4xl flex-col justify-end px-5 pb-10 text-cream">
          <p className="text-sm uppercase tracking-[.2em] text-gold">{experience.category} · A Sri Lankan story</p>
          <h1 className="mt-3 font-display text-4xl md:text-6xl">{experience.title}</h1>
          <p className="mt-4 flex items-center gap-2 text-cream/80"><MapPin className="h-4 w-4" />{experience.whereItComesFrom}</p>
        </div>
      </header>
      <div className="mx-auto max-w-4xl space-y-8 px-4 py-10 md:px-6">
        <Story title="An island heritage" icon={<Sprout />} text={experience.heritage || experience.productStory} />
        <Story title="From source to SpiceBox" icon={<MapPin />} text={experience.production} />
        <Story title="How to enjoy it" icon={<Utensils />} text={experience.howToUse} />
        {experience.recipe && <section className="rounded-3xl bg-forest p-6 text-cream md:p-8"><p className="text-xs uppercase tracking-[.2em] text-gold">Taste the story</p><h2 className="mt-2 font-display text-3xl">{experience.recipe.title}</h2><div className="mt-6 grid gap-8 md:grid-cols-2"><div><h3 className="text-gold">Ingredients</h3><ul className="mt-3 list-disc space-y-2 pl-5 text-cream/80">{experience.recipe.ingredients.map((item) => <li key={item}>{item}</li>)}</ul></div><div><h3 className="text-gold">Method</h3><ol className="mt-3 list-decimal space-y-2 pl-5 text-cream/80">{experience.recipe.steps.map((item) => <li key={item}>{item}</li>)}</ol></div></div></section>}
        <div className="text-center"><Button to={`/products/${productId}`}>View this product</Button></div>
      </div>
    </article>
  )
}

function Story({ title, icon, text }: { title: string; icon: React.ReactNode; text?: string }) {
  if (!text) return null
  return <section className="rounded-3xl bg-white p-6 ring-1 ring-cinnamon/10 md:p-8"><div className="flex items-center gap-3 text-forest">{icon}<h2 className="font-display text-3xl text-cinnamon">{title}</h2></div><p className="mt-4 text-lg leading-8 text-muted">{text}</p></section>
}
