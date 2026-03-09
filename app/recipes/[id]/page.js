import { createClient } from "@supabase/supabase-js"
import DeleteButton from "@/app/components/DeleteButton"

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
)

export default async function RecipePage({ params }) {

  const { id } = await params

  const { data: recipe } = await supabase
    .from("Recipes")
    .select("*")
    .eq("id", id)
    .maybeSingle()

  if (!recipe) {
    return (
      <main className="min-h-screen bg-black text-white p-10">
        Recipe not found
      </main>
    )
  }

  const malts = recipe.malts ? JSON.parse(recipe.malts) : []
  const hops = recipe.hops ? JSON.parse(recipe.hops) : []

  return (

    <main className="min-h-screen bg-black text-white p-10 max-w-4xl mx-auto">

      <h1 className="text-4xl font-bold mb-4">
        {recipe.style}
      </h1>

      <div className="flex gap-4 mb-6">

        <a
          href={`/recipes/${recipe.id}/edit`}
          className="bg-blue-600 px-4 py-2 rounded"
        >
          Edit Recipe
        </a>

        <DeleteButton id={recipe.id} />

      </div>

      <div className="grid grid-cols-4 gap-4 mb-10 text-center">

        <div className="bg-zinc-900 p-4 rounded">
          <div className="text-gray-400 text-sm">ABV</div>
          <div className="text-xl font-bold">{recipe.abv}</div>
        </div>

        <div className="bg-zinc-900 p-4 rounded">
          <div className="text-gray-400 text-sm">IBU</div>
          <div className="text-xl font-bold">{recipe.ibu}</div>
        </div>

        <div className="bg-zinc-900 p-4 rounded">
          <div className="text-gray-400 text-sm">OG</div>
          <div className="text-xl font-bold">{recipe.og}</div>
        </div>

        <div className="bg-zinc-900 p-4 rounded">
          <div className="text-gray-400 text-sm">FG</div>
          <div className="text-xl font-bold">{recipe.fg}</div>
        </div>

      </div>

      <p className="text-gray-300 mb-10">
        {recipe.flavor_profile}
      </p>

      <div className="grid grid-cols-3 gap-6 mb-10">

        <div className="bg-zinc-900 p-6 rounded">

          <h2 className="text-xl font-bold mb-4">
            Malts
          </h2>

          <ul className="text-gray-400 space-y-1">

            {malts.map((malt, i) => (

              <li key={i}>
                {malt.name} — {malt.percentage}
              </li>

            ))}

          </ul>

        </div>

        <div className="bg-zinc-900 p-6 rounded">

          <h2 className="text-xl font-bold mb-4">
            Hops
          </h2>

          <ul className="text-gray-400 space-y-1">

            {hops.map((hop, i) => (

              <li key={i}>
                {hop.name} — {hop.timing}
              </li>

            ))}

          </ul>

        </div>

        <div className="bg-zinc-900 p-6 rounded">

          <h2 className="text-xl font-bold mb-4">
            Yeast
          </h2>

          <p className="text-gray-400">
            {recipe.yeast}
          </p>

        </div>

      </div>

      <div className="bg-zinc-900 p-6 rounded mb-6">

        <h2 className="text-xl font-bold mb-4">
          Brewing Tips
        </h2>

        <p className="text-gray-400">
          {recipe.brewing_tips}
        </p>

      </div>

      {recipe.notes && (

        <div className="bg-zinc-900 p-6 rounded">

          <h2 className="text-xl font-bold mb-4">
            Notes
          </h2>

          <p className="text-gray-400">
            {recipe.notes}
          </p>

        </div>

      )}

    </main>

  )
}