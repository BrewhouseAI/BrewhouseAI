"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { supabase } from "@/lib/supabase"

export default function ClientAuth(){

  const [user,setUser] = useState(null)

  useEffect(()=>{

    async function loadUser(){
      const { data } = await supabase.auth.getUser()
      setUser(data.user)
    }

    loadUser()

    const { data: listener } =
      supabase.auth.onAuthStateChange((_event,session)=>{
        setUser(session?.user || null)
      })

    return ()=>listener.subscription.unsubscribe()

  },[])

  async function logout(){

    await supabase.auth.signOut()
    window.location.href="/login"

  }

  if(user){

    return(

      <button
        onClick={logout}
        className="bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded text-sm text-white"
      >
        Logout
      </button>

    )

  }

  return(

    <Link
      href="/login"
      className="bg-amber-500 text-black px-4 py-2 rounded text-sm font-medium"
    >
      Login
    </Link>

  )

}