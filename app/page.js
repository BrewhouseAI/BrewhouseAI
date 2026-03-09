"use client"

import { useRecipe } from "./context/RecipeContext"
import { useState } from "react"

import {
  calculateABV,
  calculateOG,
  calculateIBU,
  calculateSRM
} from "@/lib/brew"

export default function Home() {

  const [prompt, setPrompt] = useState("")
  const [loading, setLoading] = useState(false)
  const [batchSize, setBatchSize] = useState(20)

  const { recipe, setRecipe } = useRecipe()

  async function generateRecipe() {

    setLoading(true)

    const res = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        prompt,
        batchSize
      })
    })

    const data = await res.json()

    setRecipe(data)

    setLoading(false)

  }

  async function saveRecipe() {

    await fetch("/api/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(recipe)
    })

    alert("Recipe saved!")

  }

  const og = recipe?.malts
    ? calculateOG(recipe.malts, batchSize)
    : recipe?.og

  const ibu = recipe?.hops
    ? calculateIBU(recipe.hops, og, batchSize)
    : recipe?.ibu

  const abv = og && recipe?.fg
    ? calculateABV(og, recipe.fg)
    : recipe?.abv

  const srm = recipe?.malts
    ? calculateSRM(recipe.malts, batchSize)
    : null

  return (

    <main className="min-h-screen bg-black text-white p-10 max-w-5xl mx-auto">

      <nav className="flex justify-between items-center mb-10">

        <h1 className="text-2xl font-bold">
          BrewAI
        </h1>

        <div className="flex gap-6">

          <a href="/" className="text-gray-400 hover:text-white">
            Create
          </a>

          <a href="/recipes" className="text-gray-400 hover:text-white">
            Recipes
          </a>

        </div>

      </nav>

      <h1 className="text-4xl font-bold mb-2">
        AI Recipe Generator
      </h1>

      <p className="text-gray-400 mb-6">
        Describe the beer you want to brew
      </p>

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

        <div className="space-y-6">

          <div className="grid grid-cols-4 gap-4">

            <div className="bg-zinc-900 p-4 rounded-lg text-center">
              <p className="text-gray-400 text-sm">ABV</p>
              <p className="text-xl font-bold">{abv}%</p>
            </div>

            <div className="bg-zinc-900 p-4 rounded-lg text-center">
              <p className="text-gray-400 text-sm">IBU</p>
              <p className="text-xl font-bold">{ibu}</p>
            </div>

            <div className="bg-zinc-900 p-4 rounded-lg text-center">
              <p className="text-gray-400 text-sm">OG</p>
              <p className="text-xl font-bold">{og}</p>
            </div>

            <div className="bg-zinc-900 p-4 rounded-lg text-center">
              <p className="text-gray-400 text-sm">Color (SRM)</p>
              <p className="text-xl font-bold">{srm}</p>
            </div>

          </div>

          <div className="bg-zinc-900 p-6 rounded-xl">

            <h2 className="text-xl font-bold mb-4">
              Malt
            </h2>

            <ul className="list-disc ml-6 space-y-1">

              {recipe.malts?.map((malt, i) => (

                <li key={i}>
                  {typeof malt === "string"
                    ? malt
                    : `${malt.name} ${malt.weight}`
                  }
                </li>

              ))}

            </ul>

          </div>

          <div className="bg-zinc-900 p-6 rounded-xl">

            <h2 className="text-xl font-bold mb-4">
              Hops
            </h2>

            <ul className="list-disc ml-6 space-y-1">

              {recipe.hops?.map((hop, i) => (

                <li key={i}>
                  {typeof hop === "string"
                    ? hop
                    : `${hop.name} ${hop.weight || ""} ${hop.time || ""}`
                  }
                </li>

              ))}

            </ul>

          </div>

          <div className="bg-zinc-900 p-6 rounded-xl">

            <h2 className="text-xl font-bold mb-4">
              Jäst
            </h2>

            <p>{recipe.yeast}</p>

          </div>

          {recipe.flavor_profile && (

            <div className="bg-zinc-900 p-6 rounded-xl">

              <h2 className="text-xl font-bold mb-4">
                Flavor profile
              </h2>

              <p className="text-gray-300">
                {recipe.flavor_profile}
              </p>

            </div>

          )}

          {recipe.brewing_tips && (

            <div className="bg-zinc-900 p-6 rounded-xl">

              <h2 className="text-xl font-bold mb-4">
                Brewing tips
              </h2>

              <p className="text-gray-300">
                {recipe.brewing_tips}
              </p>

            </div>

          )}

          <button
            onClick={saveRecipe}
            className="bg-green-500 text-black px-6 py-3 rounded-lg font-semibold"
          >
            Save Recipe
          </button>

        </div>

      )}

    </main>

  )

}