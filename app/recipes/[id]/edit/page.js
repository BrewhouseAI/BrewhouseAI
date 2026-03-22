"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useParams, useRouter } from "next/navigation"
import EditForm from "@/app/components/EditForm"

export default function EditPage() {

  const { id } = useParams()
  const router = useRouter()

  const [recipe, setRecipe] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {

    async function loadRecipe() {

      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        router.push("/login")
        return
      }

      const { data, error } = await supabase
        .from("Recipes")
        .select("*")
        .eq("id", id)
        .single()

      if (!error && data) {
        setRecipe(data)
      }

      setLoading(false)
    }

    if (id) {
      loadRecipe()
    }

  }, [id])


  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white p-10">
        Loading...
      </main>
    )
  }

  if (!recipe) {
    return (
      <main className="min-h-screen bg-black text-white p-10">
        Recipe not found
      </main>
    )
  }

  return (

    <main className="min-h-screen bg-black text-white p-10 max-w-3xl mx-auto">

      <h1 className="text-3xl font-bold mb-6">
        Edit Recipe
      </h1>

      <EditForm recipe={recipe} />

    </main>

  )

}