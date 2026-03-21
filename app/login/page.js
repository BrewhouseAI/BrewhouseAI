"use client"

import { useState } from "react"
import { supabase } from "../../lib/supabase"
import { useRouter } from "next/navigation"

export default function LoginPage() {

  const router = useRouter()

  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")
  const [loading,setLoading] = useState(false)

  async function signIn(){

    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if(error){
      alert(error.message)
      setLoading(false)
      return
    }

    router.push("/")
  }

  async function signUp(){

    setLoading(true)

    const { error } = await supabase.auth.signUp({
      email,
      password
    })

    if(error){
      alert(error.message)
      setLoading(false)
      return
    }

    alert("Account created!")
    setLoading(false)
  }

  // 🔥 NY FUNKTION
  async function resetPassword(){

    if(!email){
      alert("Enter your email first")
      return
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "https://brewhouse-ai.vercel.app/update-password"
    })

    if(error){
      alert(error.message)
    } else {
      alert("Check your email for reset link")
    }

  }

  return(

    <main className="min-h-screen bg-black text-white flex items-center justify-center">

      <div className="bg-zinc-900 p-8 rounded-xl w-96">

        <h1 className="text-2xl font-bold mb-6">
          BrewAI Login
        </h1>

        <input
          placeholder="Email"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
          className="w-full p-3 mb-3 bg-black border border-zinc-700 rounded"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
          className="w-full p-3 mb-3 bg-black border border-zinc-700 rounded"
        />

        {/* 🔥 NY KNAPP */}
        <button
          onClick={resetPassword}
          className="text-sm text-gray-400 hover:text-white mb-6"
        >
          Forgot password?
        </button>

        <button
          onClick={signIn}
          className="w-full bg-amber-500 text-black py-3 rounded font-bold mb-3"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <button
          onClick={signUp}
          className="w-full bg-zinc-700 py-3 rounded"
        >
          Create account
        </button>

      </div>

    </main>

  )

}