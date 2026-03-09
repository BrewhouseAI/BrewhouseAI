"use client"

import { useState } from "react"
import { useRecipe } from "../context/RecipeContext"

export default function BrewChat(){

  const { recipe, setRecipe } = useRecipe()

  const [open,setOpen] = useState(false)
  const [messages,setMessages] = useState([])
  const [input,setInput] = useState("")
  const [loading,setLoading] = useState(false)

  async function sendMessage(){

    if(!input) return

    const userMessage = {
      role:"user",
      content:input
    }

    setMessages(prev=>[...prev,userMessage])
    setInput("")
    setLoading(true)

    try{

      const res = await fetch("/api/chat",{

        method:"POST",

        headers:{
          "Content-Type":"application/json"
        },

        body:JSON.stringify({
          messages:[...messages,userMessage],
          recipe
        })

      })

      const data = await res.json()

      setMessages(prev=>[
        ...prev,
        {role:"assistant",content:data.message}
      ])

      // ⭐ här uppdateras receptet

      if(data.recipe_update){

        setRecipe(data.recipe_update)

      }

    }catch(err){

      setMessages(prev=>[
        ...prev,
        {role:"assistant",content:"AI kunde inte svara just nu."}
      ])

    }

    setLoading(false)

  }

  return(

    <>

      {!open && (

        <button
          onClick={()=>setOpen(true)}
          className="fixed bottom-6 right-6 bg-amber-500 text-black px-5 py-3 rounded-full font-bold shadow-lg"
        >
          BrewAI
        </button>

      )}

      {open && (

        <div className="fixed bottom-6 right-6 w-80 bg-zinc-900 rounded-xl shadow-xl flex flex-col">

          <div className="flex justify-between items-center p-3 border-b border-zinc-700">

            <span className="font-bold">
              BrewAI Assistant
            </span>

            <button
              onClick={()=>setOpen(false)}
              className="text-gray-400"
            >
              ✕
            </button>

          </div>

          <div className="p-3 space-y-3 overflow-y-auto max-h-80">

            {messages.map((m,i)=>(

              <div
                key={i}
                className={m.role==="user"?"text-right":"text-left"}
              >

                <div className={`
                  inline-block px-3 py-2 rounded-lg
                  ${m.role==="user"
                    ?"bg-amber-500 text-black"
                    :"bg-zinc-800"}
                `}>
                  {m.content}
                </div>

              </div>

            ))}

            {loading && (
              <p className="text-gray-400 text-sm">
                AI tänker...
              </p>
            )}

          </div>

          <div className="flex border-t border-zinc-700">

            <input
              value={input}
              onChange={(e)=>setInput(e.target.value)}
              placeholder="Fråga om receptet..."
              className="flex-1 bg-transparent p-3 outline-none"
            />

            <button
              onClick={sendMessage}
              className="px-4 bg-amber-500 text-black font-semibold"
            >
              Send
            </button>

          </div>

        </div>

      )}

    </>

  )

}