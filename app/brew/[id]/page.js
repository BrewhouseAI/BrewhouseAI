"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { supabase } from "@/lib/supabase"
import BrewAssistant from "@/app/components/BrewAssistant"

export default function BrewPage() {

  const params = useParams()
  const id = params.id

  const [recipe, setRecipe] = useState(null)

  const [step, setStep] = useState("Mash")

  const [stepsByStage, setStepsByStage] = useState({})
  const [nextAction, setNextAction] = useState("")

  const [mashStarted, setMashStarted] = useState(false)
  const [mashTimeLeft, setMashTimeLeft] = useState(60 * 60)

  const [boilStarted, setBoilStarted] = useState(false)
  const [boilTimeLeft, setBoilTimeLeft] = useState(60 * 60)

  const stepOrder = ["Mash","Boil","Cooling","Fermentation"]


  /* LOAD RECIPE */

  useEffect(()=>{

    async function loadRecipe(){

      const { data } = await supabase
      .from("Recipes")
      .select("*")
      .eq("id",id)
      .single()

      setRecipe(data)

    }

    if(id) loadRecipe()

  },[id])


  /* AUTO GENERATE STEPS WHEN STEP CHANGES */

  useEffect(()=>{

    if(!recipe) return

    if(stepsByStage[step]) return

    async function generateSteps(){

      const res = await fetch("/api/brew-ai",{

        method:"POST",

        headers:{
          "Content-Type":"application/json"
        },

        body:JSON.stringify({

          messages:[
            {
              role:"user",
              content:`guide me through the ${step} stage`
            }
          ],

          recipe,
          step

        })

      })

      const data = await res.json()

      if(data.steps){

        setStepsByStage(prev => ({
          ...prev,
          [step]: data.steps
        }))

      }

      if(data.next_action){

        setNextAction(data.next_action)

      }

    }

    generateSteps()

  },[step,recipe])


  /* MASH TIMER */

  useEffect(()=>{

    if(!mashStarted) return

    const timer=setInterval(()=>{

      setMashTimeLeft(prev=>{

        if(prev<=1){
          clearInterval(timer)
          return 0
        }

        return prev-1

      })

    },1000)

    return ()=>clearInterval(timer)

  },[mashStarted])


  /* BOIL TIMER */

  useEffect(()=>{

    if(!boilStarted) return

    const timer=setInterval(()=>{

      setBoilTimeLeft(prev=>{

        if(prev<=1){
          clearInterval(timer)
          return 0
        }

        return prev-1

      })

    },1000)

    return ()=>clearInterval(timer)

  },[boilStarted])


  if(!recipe){

    return(
      <main className="min-h-screen bg-black text-white p-10">
        Loading brew day...
      </main>
    )

  }


  const mashMinutes=Math.floor(mashTimeLeft/60)
  const mashSeconds=mashTimeLeft%60

  const boilMinutes=Math.floor(boilTimeLeft/60)
  const boilSeconds=boilTimeLeft%60


  return(

  <main className="min-h-screen bg-black text-white p-10 max-w-7xl mx-auto">

    <div className="mb-10">

      <h1 className="text-3xl font-bold">
        Brew Day
      </h1>

      <p className="text-gray-400">
        {recipe.style}
      </p>

    </div>


    {/* BREW METRICS */}

    <div className="flex gap-10 mb-10">

      <div>
        <div className="text-xs text-gray-500">OG</div>
        <div className="text-lg">{recipe.og}</div>
      </div>

      <div>
        <div className="text-xs text-gray-500">ABV</div>
        <div className="text-lg">{recipe.abv}</div>
      </div>

      <div>
        <div className="text-xs text-gray-500">IBU</div>
        <div className="text-lg">{recipe.ibu}</div>
      </div>

    </div>


    <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">


      {/* LEFT SIDE */}

      <div className="lg:col-span-3 space-y-8">


        {/* STEP NAV */}

        <div className="flex gap-3 flex-wrap">

          {stepOrder.map((s)=>(

            <button
              key={s}
              onClick={()=>setStep(s)}
              className={`px-4 py-2 rounded-lg ${
                step===s
                ? "bg-amber-500 text-black"
                : "bg-zinc-800 hover:bg-zinc-700"
              }`}
            >
              {s}
            </button>

          ))}

        </div>


        {/* STEP PROGRESS */}

        <div className="text-sm text-gray-400">
          Step {stepOrder.indexOf(step)+1} of {stepOrder.length}
        </div>


        {/* BREW GUIDE */}

        <div className="bg-zinc-900 p-6 rounded-xl">

          <h2 className="text-lg font-semibold mb-3">
            Brew Guide
          </h2>

          <div className="text-amber-400">
            {nextAction}
          </div>

        </div>


        {/* MASH */}

        {step==="Mash" &&(

          <div className="bg-zinc-900 p-6 rounded-xl space-y-4">

            <h2 className="text-xl font-bold">
              Mash
            </h2>

            <div className="flex gap-6 text-gray-300">

              <div>
                <div className="text-xs text-gray-500">Temperature</div>
                <div className="text-lg">67°C</div>
              </div>

              <div>
                <div className="text-xs text-gray-500">Time</div>
                <div className="text-lg">60 minutes</div>
              </div>

            </div>

            {!mashStarted &&(

              <button
                onClick={()=>setMashStarted(true)}
                className="bg-green-600 px-4 py-2 rounded"
              >
                Start Mash Timer
              </button>

            )}

            {mashStarted &&(

              <div className="text-4xl font-mono">

                {mashMinutes}:{mashSeconds.toString().padStart(2,"0")}

              </div>

            )}

          </div>

        )}


        {/* BOIL */}

        {step==="Boil" &&(

          <div className="bg-zinc-900 p-6 rounded-xl space-y-4">

            <h2 className="text-xl font-bold">
              Boil
            </h2>

            {!boilStarted &&(

              <button
                onClick={()=>setBoilStarted(true)}
                className="bg-green-600 px-4 py-2 rounded"
              >
                Start Boil Timer
              </button>

            )}

            {boilStarted &&(

              <div className="text-4xl font-mono">

                {boilMinutes}:{boilSeconds.toString().padStart(2,"0")}

              </div>

            )}

          </div>

        )}


        {/* BREW STEPS */}

        {stepsByStage[step] && (

          <div className="bg-zinc-900 p-6 rounded-xl">

            <h2 className="text-lg font-semibold mb-4">
              Brew Steps
            </h2>

            <div className="space-y-4">

              {stepsByStage[step].map((s,i)=>(
                <div
                  key={i}
                  className="bg-black border border-zinc-800 p-4 rounded-lg"
                >

                  <div className="text-xs text-gray-400 mb-1">
                    STEP {i+1}
                  </div>

                  <div className="text-gray-200">
                    {s}
                  </div>

                </div>
              ))}

            </div>

          </div>

        )}

      </div>


      {/* AI PANEL */}

      <div className="bg-zinc-900 rounded-xl p-5 h-[650px] sticky top-10">

        <BrewAssistant
          recipe={recipe}
          step={step}
          setSteps={(newSteps)=>{
            setStepsByStage(prev => ({
              ...prev,
              [step]: newSteps
            }))
          }}
          mashTimeRemaining={`${mashMinutes}:${mashSeconds}`}
          setNextAction={setNextAction}
        />

      </div>


    </div>

  </main>

  )

}