"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { supabase } from "@/lib/supabase"

export default function Navbar() {

  const [user, setUser] = useState(null)

  useEffect(() => {

    async function loadUser() {

      const { data } = await supabase.auth.getUser()
      setUser(data.user)

    }

    loadUser()

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
    })

    return () => {
      listener.subscription.unsubscribe()
    }

  }, [])


  async function logout() {

    await supabase.auth.signOut()
    window.location.href = "/login"

  }


  return (

    <nav className="border-b border-zinc-800 bg-black">

      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* LEFT SIDE */}

        <div className="flex items-center gap-6">

          <Link
            href="/"
            className="font-bold text-lg text-amber-400"
          >
            BrewAI
          </Link>

          <Link
            href="/"
            className="text-gray-300 hover:text-white"
          >
            Create
          </Link>

          <Link
            href="/recipes"
            className="text-gray-300 hover:text-white"
          >
            Recipes
          </Link>

        </div>


        {/* RIGHT SIDE */}

        <div className="flex items-center gap-4">

          {user ? (

            <button
              onClick={logout}
              className="bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded text-sm"
            >
              Logout
            </button>

          ) : (

            <Link
              href="/login"
              className="bg-amber-500 text-black px-4 py-2 rounded text-sm font-medium"
            >
              Login
            </Link>

          )}

        </div>

      </div>

    </nav>

  )

}