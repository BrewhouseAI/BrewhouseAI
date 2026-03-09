import Link from "next/link"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
)

export default async function RecipesPage() {

  const { data: recipes } = await supabase
    .from("Recipes")
    .select("*")
    .order("id", { ascending: false })

  return (

    <main className="min-h-screen bg-black text-white p-10">

      <h1 className="text-4xl font-bold mb-8">
        My Recipes
      </h1>

      <div className="grid grid-cols-3 gap-6">

        {recipes?.map((recipe) => (

          <Link key={recipe.id} href={`/recipes/${recipe.id}`}>

            <div className="bg-zinc-900 p-6 rounded-xl hover:bg-zinc-800 cursor-pointer">

              <h2 className="text-xl font-bold mb-2">
                {recipe.style}
              </h2>

              <div className="flex gap-4 text-sm text-gray-400 mb-4">

                <span>ABV {recipe.abv}</span>
                <span>IBU {recipe.ibu}</span>

              </div>

              <p className="text-gray-400 text-sm line-clamp-3">
                {recipe.flavor_profile}
              </p>

            </div>

          </Link>

        ))}

      </div>

    </main>

  )
}