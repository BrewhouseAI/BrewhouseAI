import { createClient } from "@supabase/supabase-js"
import DeleteButton from "@/app/components/DeleteButton"
import BrewChat from "@/app/components/BrewChat"

import { calculateOG, calculateIBU, calculateSRM, hopDatabase } from "@/lib/brewCalculations"

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
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

  const { data: batches } = await supabase
    .from("Batches")
    .select("*")
    .eq("recipe_id", id)
    .order("brew_date", { ascending: false })

  const malts = recipe.malts ? JSON.parse(recipe.malts) : []
  const hops = recipe.hops ? JSON.parse(recipe.hops) : []

  const calculatedOG = calculateOG(malts)
  const calculatedIBU = calculateIBU(hops)
  const calculatedSRM = calculateSRM(malts)

  return (

    <main className="min-h-screen bg-black text-white p-10 max-w-6xl mx-auto">

      <div className="grid grid-cols-3 gap-8">

        {/* LEFT SIDE */}

        <div className="col-span-2">

          <h1 className="text-4xl font-bold mb-4">
            {recipe.style}
          </h1>

          <div className="flex gap-4 mb-6">

            <a
              href={`/recipes/${recipe.id}/edit`}
              className="bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded"
            >
              Edit Recipe
            </a>

            <DeleteButton id={recipe.id} />

            <a
              href={`/brew/${recipe.id}`}
              className="bg-amber-500 hover:bg-amber-400 text-black px-4 py-2 rounded font-semibold"
            >
              Start Brew Day
            </a>

          </div>


          {/* STATS */}

          <div className="grid grid-cols-5 gap-4 mb-10 text-center">

            <div className="bg-zinc-900 p-4 rounded">
              <div className="text-gray-400 text-sm">ABV</div>
              <div className="text-xl font-bold">{recipe.abv}</div>
            </div>

            <div className="bg-zinc-900 p-4 rounded">
              <div className="text-gray-400 text-sm">IBU</div>
              <div className="text-xl font-bold">{calculatedIBU}</div>
            </div>

            <div className="bg-zinc-900 p-4 rounded">
              <div className="text-gray-400 text-sm">OG</div>
              <div className="text-xl font-bold">{calculatedOG}</div>
            </div>

            <div className="bg-zinc-900 p-4 rounded">
              <div className="text-gray-400 text-sm">FG</div>
              <div className="text-xl font-bold">{recipe.fg}</div>
            </div>

            <div className="bg-zinc-900 p-4 rounded">

              <div className="text-gray-400 text-sm mb-2">Color</div>

              <div
                className="w-12 h-12 rounded mx-auto mb-2"
                style={{ backgroundColor: `hsl(${40 - calculatedSRM * 2}, 80%, 50%)` }}
              />

              <div className="text-xl font-bold">{calculatedSRM} SRM</div>

            </div>

          </div>


          {/* DESCRIPTION */}

          <p className="text-gray-300 mb-10">
            {recipe.flavor_profile}
          </p>


          {/* INGREDIENTS */}

          <div className="grid grid-cols-3 gap-6 mb-10">

            {/* MALTS */}

            <div className="bg-zinc-900 p-6 rounded">

              <h2 className="text-xl font-bold mb-4">
                Malts
              </h2>

              <ul className="text-gray-400 space-y-2">

                {malts.map((malt, i) => {

                  if (typeof malt === "string") {
                    return <li key={i}>{malt}</li>
                  }

                  return (
                    <li key={i}>
                      {malt.name} — {malt.weight}
                    </li>
                  )

                })}

              </ul>

            </div>


            {/* HOPS */}

            <div className="bg-zinc-900 p-6 rounded">

              <h2 className="text-xl font-bold mb-4">
                Hops
              </h2>

              <ul className="text-gray-400 space-y-4">

                {hops.map((hop, i) => {

                  if (typeof hop === "string") {
                    return <li key={i}>{hop}</li>
                  }

                  const name = (hop.name || "").toLowerCase()

                  let aa = "?"

                  for (const key in hopDatabase) {
                    if (name.includes(key)) {
                      aa = hopDatabase[key].aa
                      break
                    }
                  }

                  return (
                    <li key={i}>

                      <div className="font-medium text-white">
                        {hop.name}
                      </div>

                      <div className="text-sm text-gray-400">
                        {aa}% AA • {hop.weight || hop.amount} • {hop.time}
                      </div>

                    </li>
                  )

                })}

              </ul>

            </div>


            {/* YEAST */}

            <div className="bg-zinc-900 p-6 rounded">

              <h2 className="text-xl font-bold mb-4">
                Yeast
              </h2>

              <p className="text-gray-400">
                {recipe.yeast}
              </p>

            </div>

          </div>


          {/* BREWING TIPS */}

          <div className="bg-zinc-900 p-6 rounded mb-6">

            <h2 className="text-xl font-bold mb-4">
              Brewing Tips
            </h2>

            <p className="text-gray-400">
              {recipe.brewing_tips}
            </p>

          </div>

        </div>


        {/* RIGHT SIDE — AI CHAT */}

        <div>

          <div className="sticky top-10 h-fit">
  <BrewChat recipe={recipe} />
</div>

        </div>

      </div>

    </main>

  )

}