"use client"

import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabase"
import Link from "next/link"

export default function RecipesPage() {

  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {

    async function loadRecipes() {

      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from("Recipes")
        .select("*")
        .eq("user_id", user.id)

      if (error) {
        console.log(error)
      }

      setRecipes(data || [])
      setLoading(false)

    }

    loadRecipes()

  }, [])


  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white p-10 max-w-5xl mx-auto">
        <p>Loading recipes...</p>
      </main>
    )
  }


  return (

    <main className="min-h-screen bg-black text-white p-10 max-w-5xl mx-auto">

      <h1 className="text-3xl font-bold mb-8">
        My Recipes
      </h1>


      {recipes.length === 0 && (
        <p className="text-gray-400">
          No recipes yet.
        </p>
      )}


      <div className="grid md:grid-cols-2 gap-6">

        {recipes.map((recipe) => (

          <Link
            key={recipe.id}
            href={`/recipes/${recipe.id}`}
            className="block bg-zinc-900 p-6 rounded-xl hover:bg-zinc-800 transition duration-200"
          >

            <h2 className="text-xl font-bold mb-3">
              {recipe.style}
            </h2>

            <div className="flex gap-4 text-sm text-gray-400">

              <span>
                ABV: {recipe.abv}
              </span>

              <span>
                IBU: {recipe.ibu}
              </span>

              <span>
                OG: {recipe.og}
              </span>

            </div>

          </Link>

        ))}

      </div>

    </main>

  )

}