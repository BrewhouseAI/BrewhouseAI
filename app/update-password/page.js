"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export default function UpdatePasswordPage() {

  const router = useRouter()

  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  async function updatePassword() {

    setLoading(true)

    const { error } = await supabase.auth.updateUser({
      password
    })

    if (error) {
      alert(error.message)
      setLoading(false)
      return
    }

    alert("Password updated!")

    router.push("/login")

  }

  return (

    <main className="min-h-screen bg-black text-white flex items-center justify-center">

      <div className="bg-zinc-900 p-8 rounded-xl w-96">

        <h1 className="text-2xl font-bold mb-6">
          Set new password
        </h1>

        <input
          type="password"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-6 bg-black border border-zinc-700 rounded"
        />

        <button
          onClick={updatePassword}
          className="w-full bg-amber-500 text-black py-3 rounded font-bold"
        >
          {loading ? "Saving..." : "Update password"}
        </button>

      </div>

    </main>

  )

}