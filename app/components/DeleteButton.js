"use client"

import { useRouter } from "next/navigation"

export default function DeleteButton({ id }) {

  const router = useRouter()

  async function deleteRecipe() {

    const confirmed = confirm("Delete this recipe?")

    if (!confirmed) return

    await fetch("/api/delete-recipe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        id
      })
    })

    router.push("/recipes")
    router.refresh()
  }

  return (

    <button
      onClick={deleteRecipe}
      className="bg-red-600 px-4 py-2 rounded mb-6"
    >
      Delete Recipe
    </button>

  )
}