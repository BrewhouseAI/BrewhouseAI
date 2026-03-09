"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function EditForm({ recipe }) {

  const router = useRouter()

  const [style, setStyle] = useState(recipe.style)

  const [og, setOg] = useState(parseFloat(recipe.og))
  const [fg, setFg] = useState(parseFloat(recipe.fg))

  const [abv, setAbv] = useState(recipe.abv)
  const [ibu, setIbu] = useState(recipe.ibu)

  const [yeast, setYeast] = useState(recipe.yeast)

  const [flavor, setFlavor] = useState(recipe.flavor_profile)
  const [tips, setTips] = useState(recipe.brewing_tips)
  const [notes, setNotes] = useState(recipe.notes || "")

  const [malts, setMalts] = useState(
    recipe.malts ? JSON.parse(recipe.malts) : []
  )

  const [hops, setHops] = useState(
    recipe.hops ? JSON.parse(recipe.hops) : []
  )

  useEffect(() => {

    if(!og || !fg) return

    const calculatedAbv = (og - fg) * 131.25

    setAbv(calculatedAbv.toFixed(1))

  }, [og, fg])

  function updateMalt(index, field, value){

    const copy = [...malts]

    copy[index][field] = value

    setMalts(copy)
  }

  function updateHop(index, field, value){

    const copy = [...hops]

    copy[index][field] = value

    setHops(copy)
  }

  function addMalt(){

    setMalts([...malts,{name:"",percentage:""}])
  }

  function addHop(){

    setHops([...hops,{name:"",timing:""}])
  }

  async function saveRecipe(){

    await fetch("/api/update-recipe",{

      method:"POST",

      headers:{
        "Content-Type":"application/json"
      },

      body:JSON.stringify({
        id:recipe.id,
        style,
        og,
        fg,
        abv,
        ibu,
        yeast,
        flavor_profile:flavor,
        brewing_tips:tips,
        notes,
        malts:JSON.stringify(malts),
        hops:JSON.stringify(hops)
      })

    })

    router.push(`/recipes/${recipe.id}`)
    router.refresh()
  }

  return(

    <div className="space-y-8">

      <div>

        <label className="text-gray-400">Style</label>

        <input
          value={style}
          onChange={(e)=>setStyle(e.target.value)}
          className="w-full p-2 bg-zinc-900 rounded"
        />

      </div>

      <div className="grid grid-cols-4 gap-4">

        <div>

          <label className="text-gray-400">OG</label>

          <input
            value={og}
            onChange={(e)=>setOg(parseFloat(e.target.value))}
            className="w-full p-2 bg-zinc-900 rounded"
          />

        </div>

        <div>

          <label className="text-gray-400">FG</label>

          <input
            value={fg}
            onChange={(e)=>setFg(parseFloat(e.target.value))}
            className="w-full p-2 bg-zinc-900 rounded"
          />

        </div>

        <div>

          <label className="text-gray-400">ABV (auto)</label>

          <input
            value={abv}
            disabled
            className="w-full p-2 bg-zinc-800 rounded"
          />

        </div>

        <div>

          <label className="text-gray-400">IBU</label>

          <input
            value={ibu}
            onChange={(e)=>setIbu(e.target.value)}
            className="w-full p-2 bg-zinc-900 rounded"
          />

        </div>

      </div>

      <div>

        <h2 className="text-xl font-bold mb-2">
          Malts
        </h2>

        {malts.map((malt,i)=>(
          
          <div key={i} className="flex gap-4 mb-2">

            <input
              value={malt.name}
              onChange={(e)=>updateMalt(i,"name",e.target.value)}
              placeholder="Malt name"
              className="bg-zinc-900 p-2 rounded w-full"
            />

            <input
              value={malt.percentage}
              onChange={(e)=>updateMalt(i,"percentage",e.target.value)}
              placeholder="%"
              className="bg-zinc-900 p-2 rounded w-24"
            />

          </div>

        ))}

        <button
          onClick={addMalt}
          className="bg-zinc-700 px-3 py-1 rounded mt-2"
        >
          + Add Malt
        </button>

      </div>

      <div>

        <h2 className="text-xl font-bold mb-2">
          Hops
        </h2>

        {hops.map((hop,i)=>(
          
          <div key={i} className="flex gap-4 mb-2">

            <input
              value={hop.name}
              onChange={(e)=>updateHop(i,"name",e.target.value)}
              placeholder="Hop name"
              className="bg-zinc-900 p-2 rounded w-full"
            />

            <input
              value={hop.timing}
              onChange={(e)=>updateHop(i,"timing",e.target.value)}
              placeholder="Timing"
              className="bg-zinc-900 p-2 rounded w-48"
            />

          </div>

        ))}

        <button
          onClick={addHop}
          className="bg-zinc-700 px-3 py-1 rounded mt-2"
        >
          + Add Hop
        </button>

      </div>

      <div>

        <label className="text-gray-400">Yeast</label>

        <input
          value={yeast}
          onChange={(e)=>setYeast(e.target.value)}
          className="w-full p-2 bg-zinc-900 rounded"
        />

      </div>

      <div>

        <label className="text-gray-400">Flavor profile</label>

        <textarea
          value={flavor}
          onChange={(e)=>setFlavor(e.target.value)}
          className="w-full p-2 bg-zinc-900 rounded"
        />

      </div>

      <div>

        <label className="text-gray-400">Brewing tips</label>

        <textarea
          value={tips}
          onChange={(e)=>setTips(e.target.value)}
          className="w-full p-2 bg-zinc-900 rounded"
        />

      </div>

      <div>

        <label className="text-gray-400">Notes</label>

        <textarea
          value={notes}
          onChange={(e)=>setNotes(e.target.value)}
          className="w-full p-2 bg-zinc-900 rounded"
        />

      </div>

      <button
        onClick={saveRecipe}
        className="bg-green-600 px-6 py-2 rounded"
      >
        Save Recipe
      </button>

    </div>

  )
}