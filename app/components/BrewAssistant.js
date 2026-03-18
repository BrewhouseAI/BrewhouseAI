"use client"

import { useState } from "react"

export default function BrewAssistant({ recipe, step, setSteps, mashTimeRemaining, setNextAction }) {

  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)

  async function sendMessage(){

    if(!input.trim()) return

    const userMessage = {
      role:"user",
      content:input
    }

    const updatedMessages = [...messages, userMessage]

    setMessages(updatedMessages)
    setInput("")
    setLoading(true)

    const res = await fetch("/api/brew-ai",{

      method:"POST",

      headers:{
        "Content-Type":"application/json"
      },

      body:JSON.stringify({
        messages:updatedMessages,
        recipe,
        step,
        mashTimeRemaining
      })

    })

    const data = await res.json()

    setMessages(prev => [

      ...prev,

      {
        role:"assistant",
        content:data.message
      }

    ])

    if(data.steps){
      setSteps(data.steps)
    }

    if(data.next_action && setNextAction){
      setNextAction(data.next_action)
    }

    setLoading(false)

  }

  function handleKey(e){

    if(e.key === "Enter" && !e.shiftKey){
      e.preventDefault()
      sendMessage()
    }

  }

  function clearChat(){
    setMessages([])
  }

  return(

    <div className="flex flex-col h-full">

      <div className="flex justify-between items-center mb-3">

        <h2 className="font-semibold text-lg">
          BrewAI Assistant
        </h2>

        <button
          onClick={clearChat}
          className="text-sm text-gray-400 hover:text-white"
        >
          Clear
        </button>

      </div>

      <div className="text-xs text-gray-500 mb-3">
        Current step: <span className="text-amber-400">{step}</span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 pr-1">

        {messages.map((m,i)=>(

          <div
            key={i}
            className={`flex ${m.role==="user" ? "justify-end" : "justify-start"}`}
          >

            <div
              className={`px-4 py-2 rounded-xl max-w-[75%] text-sm ${
                m.role==="user"
                  ? "bg-amber-500 text-black"
                  : "bg-zinc-800 text-gray-200"
              }`}
            >

              {m.content}

            </div>

          </div>

        ))}

        {loading &&(

          <p className="text-gray-400 text-sm">
            BrewAI tänker...
          </p>

        )}

      </div>

      <div className="mt-3 flex gap-2">

        <input
          value={input}
          onChange={(e)=>setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Fråga BrewAI..."
          className="flex-1 bg-black border border-zinc-700 rounded px-3 py-2 text-sm"
        />

        <button
          onClick={sendMessage}
          className="bg-amber-500 text-black px-4 py-2 rounded font-medium"
        >
          Send
        </button>

      </div>

    </div>

  )

}