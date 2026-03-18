"use client"

import { useRecipe } from "./context/RecipeContext"
import { useState } from "react"
import { supabase } from "../lib/supabase"
import BrewChat from "./components/BrewChat"
import { calculateOG, calculateIBU, calculateSRM } from "@/lib/brewCalculations"
import { useEffect } from "react"

function getBeerColor(srm) {

  if (srm <= 2) return "#F8E37A"
  if (srm <= 4) return "#F1C40F"
  if (srm <= 6) return "#E67E22"
  if (srm <= 9) return "#D35400"
  if (srm <= 12) return "#BA4A00"
  if (srm <= 15) return "#873600"
  if (srm <= 20) return "#6E2C00"
  if (srm <= 25) return "#4E342E"
  if (srm <= 30) return "#3E2723"
  return "#1C1C1C"

}

export default function Home() {

  const [prompt, setPrompt] = useState("")
  const [loading, setLoading] = useState(false)
  const [batchSize, setBatchSize] = useState(20)

  const { recipe, setRecipe } = useRecipe()
  useEffect(() => {
  setRecipe(null)
}, [])

  async function generateRecipe() {

    setLoading(true)

    const res = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ prompt })
    })

    const data = await res.json()

    setRecipe(data)

    setLoading(false)
  }

  async function saveRecipe(){

    const { data:{ user } } = await supabase.auth.getUser()

    if(!user){
      alert("You must login first")
      return
    }

    const recipeWithUser = {
      ...recipe,
      user_id:user.id
    }

    await fetch("/api/save",{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify(recipeWithUser)
    })

    alert("Recipe saved!")
  }

  const malts = recipe?.malts || []
  const hops = recipe?.hops || []

  const calculatedOG = recipe ? calculateOG(malts) : null
  const calculatedIBU = recipe ? calculateIBU(hops) : null
  const calculatedSRM = recipe ? calculateSRM(malts) : null

  return (

    <main className="min-h-screen bg-black text-white p-10 max-w-6xl mx-auto">

      <div className="grid grid-cols-3 gap-8">

        {/* LEFT SIDE */}

        <div className="col-span-2">

          <h1 className="text-4xl font-bold mb-2">
            AI Recipe Generator
          </h1>

          <p className="text-gray-400 mb-6">
            Describe the beer you want to brew
          </p>


          {/* BATCH SIZE */}

          <div className="mb-6">

            <label className="text-gray-400 mr-3">
              Batch size
            </label>

            <input
              value={batchSize}
              onChange={(e) => setBatchSize(Number(e.target.value))}
              className="bg-zinc-900 p-2 rounded w-24 mr-2"
            />

            <span className="text-gray-400">
              liters
            </span>

          </div>


          {/* PROMPT */}

          <div className="bg-zinc-900 p-6 rounded-xl mb-8">

            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows="4"
              placeholder="Example: tropical juicy hazy IPA"
              className="w-full bg-black border border-zinc-700 p-4 rounded-lg mb-4"
            />

            <button
              onClick={generateRecipe}
              className="bg-amber-500 text-black px-6 py-3 rounded-lg font-semibold"
            >
              {loading ? "AI analyserar bryggprofil..." : "Generera recept"}
            </button>

          </div>


          {recipe && (

            <div className="space-y-8">

              {/* STATS */}

              <div className="grid grid-cols-5 gap-4">

                <div className="bg-zinc-900 p-4 rounded-lg text-center">
                  <p className="text-gray-400 text-sm">ABV</p>
                  <p className="text-xl font-bold">{recipe.abv}</p>
                </div>

                <div className="bg-zinc-900 p-4 rounded-lg text-center">
                  <p className="text-gray-400 text-sm">IBU</p>
                  <p className="text-xl font-bold">{calculatedIBU}</p>
                </div>

                <div className="bg-zinc-900 p-4 rounded-lg text-center">
                  <p className="text-gray-400 text-sm">OG</p>
                  <p className="text-xl font-bold">{calculatedOG}</p>
                </div>

                <div className="bg-zinc-900 p-4 rounded-lg text-center">
                  <p className="text-gray-400 text-sm">FG</p>
                  <p className="text-xl font-bold">{recipe.fg}</p>
                </div>

                <div className="bg-zinc-900 p-4 rounded-lg text-center">

                  <p className="text-gray-400 text-sm mb-2">Color</p>

                  <div className="flex justify-center mb-2">

                    <div className="relative w-8 h-16 border border-zinc-700 rounded-b-md overflow-hidden">

                      <div
                        className="absolute bottom-0 w-full"
                        style={{
                          height: "85%",
                          backgroundColor:getBeerColor(calculatedSRM)
                        }}
                      />

                      <div className="absolute top-0 w-full h-2 bg-white opacity-90" />

                    </div>

                  </div>

                  <p className="text-lg font-bold">
                    {calculatedSRM} SRM
                  </p>

                </div>

              </div>


              {/* MALTS */}

              <div className="bg-zinc-900 p-6 rounded-xl">
                <h2 className="text-xl font-bold mb-4">Malt</h2>
                <ul className="list-disc ml-6 space-y-1">
                  {recipe.malts?.map((malt, i) => (
                    <li key={i}>
                      {typeof malt === "string"
                        ? malt
                        : `${malt.name} ${malt.weight}`}
                    </li>
                  ))}
                </ul>
              </div>


              {/* HOPS */}

              <div className="bg-zinc-900 p-6 rounded-xl">
                <h2 className="text-xl font-bold mb-4">Hops</h2>
                <ul className="list-disc ml-6 space-y-1">
                  {recipe.hops?.map((hop, i) => (
                    <li key={i}>
                      {typeof hop === "string"
                        ? hop
                        : `${hop.name} ${hop.weight || hop.amount || ""} ${hop.time || ""}`}
                    </li>
                  ))}
                </ul>
              </div>


              {/* YEAST */}

              <div className="bg-zinc-900 p-6 rounded-xl">
                <h2 className="text-xl font-bold mb-4">Yeast</h2>
                <p>{recipe.yeast}</p>
              </div>


              {/* FLAVOR */}

              {recipe.flavor_profile && (
                <div className="bg-zinc-900 p-6 rounded-xl">
                  <h2 className="text-xl font-bold mb-4">Flavor profile</h2>
                  <p className="text-gray-300">{recipe.flavor_profile}</p>
                </div>
              )}


              {/* BREWING TIPS */}

              {recipe.brewing_tips && (
                <div className="bg-zinc-900 p-6 rounded-xl">
                  <h2 className="text-xl font-bold mb-4">Brewing tips</h2>
                  <p className="text-gray-300">{recipe.brewing_tips}</p>
                </div>
              )}


              {/* SAVE */}

              <button
                onClick={saveRecipe}
                className="bg-green-500 text-black px-6 py-3 rounded-lg font-semibold"
              >
                Save Recipe
              </button>

            </div>

          )}

        </div>


        {/* RIGHT SIDE — CHAT */}

        <div className="sticky top-10 h-fit">

          <BrewChat recipe={recipe} />

        </div>

      </div>

    </main>
  )
}