import { Link, useParams } from 'react-router-dom'
import { QrCode } from 'lucide-react'
import { Button } from '../components/Button'
import { getStory, stories } from '../data/stories'

const categories = [
  'All',
  'Sri Lankan Spices',
  'Ceylon Tea',
  'Traditional Foods',
  'Sri Lankan Recipes',
  'Cultural Heritage',
] as const

export function StoriesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
      <h1 className="font-display text-4xl text-cinnamon md:text-5xl">Sri Lankan Stories</h1>
      <p className="mt-3 max-w-2xl text-muted">
        Cultural storytelling that lives beyond the gift box — the same content unlocked by QR codes.
      </p>
      <div className="mt-8 flex flex-wrap gap-2">
        {categories.map((c) => (
          <span
            key={c}
            className="rounded-full bg-white px-3 py-1.5 text-sm text-cinnamon ring-1 ring-cinnamon/10"
          >
            {c}
          </span>
        ))}
      </div>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {stories.map((s) => (
          <Link
            key={s.id}
            to={`/stories/${s.slug}`}
            className="group overflow-hidden rounded-3xl bg-white ring-1 ring-cinnamon/8 transition hover:-translate-y-1 hover:shadow-lg"
          >
            <img
              src={s.image}
              alt={s.title}
              className="aspect-[16/10] w-full object-cover transition duration-500 group-hover:scale-105"
            />
            <div className="p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-forest">{s.category}</p>
              <h2 className="mt-1 font-display text-2xl text-cinnamon">{s.title}</h2>
              <p className="mt-2 text-sm text-muted">{s.excerpt}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export function StoryDetailPage() {
  const { slug } = useParams()
  const story = getStory(slug ?? '')

  if (!story) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <h1 className="font-display text-3xl">Story not found</h1>
        <Button to="/stories" className="mt-6">
          Back to Stories
        </Button>
      </div>
    )
  }

  return (
    <article>
      <div className="relative min-h-[50vh]">
        <img src={story.image} alt={story.title} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-cinnamon/70" />
        <div className="relative mx-auto flex min-h-[50vh] max-w-4xl items-end px-4 pb-12 md:px-6">
          <div className="text-cream">
            <p className="text-sm uppercase tracking-wider text-gold">{story.category}</p>
            <h1 className="mt-2 font-display text-5xl">{story.title}</h1>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-3xl space-y-10 px-4 py-14 md:px-6">
        {[
          ['What is it?', story.whatIs],
          ['Where does it come from?', story.origin],
          ['Why is Sri Lanka famous for it?', story.whyFamous],
          ['How is it traditionally used?', story.traditionalUse],
        ].map(([q, a]) => (
          <section key={q}>
            <h2 className="font-display text-2xl text-cinnamon">{q}</h2>
            <p className="mt-3 leading-relaxed text-muted">{a}</p>
          </section>
        ))}
        <section>
          <h2 className="font-display text-2xl text-cinnamon">Popular recipes</h2>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-muted">
            {story.recipes.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
          <Button to="/recipes" className="mt-6" variant="outline">
            Browse Recipes
          </Button>
        </section>
      </div>
    </article>
  )
}

export function QrLandingPage() {
  const { id } = useParams()
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center px-4 text-center">
      <QrCode className="h-16 w-16 text-cinnamon" />
      <h1 className="mt-6 font-display text-3xl text-cinnamon">QR Cultural Experience</h1>
      <p className="mt-3 text-muted">
        You scanned a SpiceBox code{id ? ` for “${id}”` : ''}. Dive into the story behind your gift.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button to="/stories/ceylon-cinnamon">Ceylon Cinnamon Story</Button>
        <Button to="/stories/ceylon-tea" variant="outline">
          Ceylon Tea Story
        </Button>
      </div>
    </div>
  )
}
