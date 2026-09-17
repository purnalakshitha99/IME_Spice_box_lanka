import { Link, useParams } from 'react-router-dom'
import { Button } from '../components/Button'
import { getRecipe, recipes } from '../data/stories'
import { formatLKR, getProduct } from '../data/products'
import { useCartStore } from '../store/cartStore'
import { useToastStore } from '../store/toastStore'

export function RecipesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
      <h1 className="font-display text-4xl text-cinnamon md:text-5xl">Recipes</h1>
      <p className="mt-3 text-muted">Cook and brew with the flavours inside your SpiceBox.</p>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {recipes.map((r) => (
          <Link
            key={r.id}
            to={`/recipes/${r.id}`}
            className="overflow-hidden rounded-3xl bg-white ring-1 ring-cinnamon/8 transition hover:-translate-y-1 hover:shadow-lg"
          >
            <img src={r.image} alt={r.title} className="aspect-[16/10] w-full object-cover" />
            <div className="p-5">
              <div className="flex gap-3 text-xs text-muted">
                <span>{r.prepTime}</span>
                <span>·</span>
                <span>{r.difficulty}</span>
              </div>
              <h2 className="mt-2 font-display text-2xl text-cinnamon">{r.title}</h2>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export function RecipeDetailPage() {
  const { id } = useParams()
  const recipe = getRecipe(id ?? '')
  const addItem = useCartStore((s) => s.addItem)
  const push = useToastStore((s) => s.push)

  if (!recipe) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <h1 className="font-display text-3xl">Recipe not found</h1>
        <Button to="/recipes" className="mt-6">
          Back
        </Button>
      </div>
    )
  }

  const shopIngredients = () => {
    recipe.productIds.forEach((pid) => {
      const p = getProduct(pid)
      if (!p) return
      addItem({
        productId: p.id,
        name: p.name,
        price: p.price,
        image: p.image,
        quantity: 1,
      })
    })
    push('Recipe ingredients added to cart.')
  }

  return (
    <article className="mx-auto max-w-4xl px-4 py-10 md:px-6">
      <img src={recipe.image} alt={recipe.title} className="aspect-[21/9] w-full rounded-3xl object-cover" />
      <h1 className="mt-8 font-display text-4xl text-cinnamon">{recipe.title}</h1>
      <p className="mt-2 text-muted">
        {recipe.prepTime} · {recipe.difficulty}
      </p>
      <div className="mt-10 grid gap-10 md:grid-cols-2">
        <div>
          <h2 className="font-display text-2xl text-cinnamon">Ingredients</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-muted">
            {recipe.ingredients.map((i) => (
              <li key={i}>{i}</li>
            ))}
          </ul>
          <Button className="mt-6" onClick={shopIngredients}>
            Shop Ingredients
          </Button>
          <ul className="mt-4 space-y-1 text-sm text-muted">
            {recipe.productIds.map((pid) => {
              const p = getProduct(pid)
              return p ? (
                <li key={pid}>
                  <Link to={`/product/${pid}`} className="hover:text-cinnamon">
                    {p.name} — {formatLKR(p.price)}
                  </Link>
                </li>
              ) : null
            })}
          </ul>
        </div>
        <div>
          <h2 className="font-display text-2xl text-cinnamon">Instructions</h2>
          <ol className="mt-4 list-decimal space-y-3 pl-5 text-muted">
            {recipe.instructions.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </div>
      </div>
    </article>
  )
}
