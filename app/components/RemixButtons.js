"use client"

export default function RemixButtons({ recipe }) {

  async function remix(style) {

    const res = await fetch("/api/remix", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        recipe,
        style
      })
    })

    const data = await res.json()

    alert(data.recipe)
  }

  return (

    <div className="flex gap-4 mb-8">

      <button
        onClick={() => remix("Imperial")}
        className="bg-green-600 px-4 py-2 rounded"
      >
        Remix Imperial
      </button>

      <button
        onClick={() => remix("Session")}
        className="bg-green-600 px-4 py-2 rounded"
      >
        Remix Session
      </button>

      <button
        onClick={() => remix("NEIPA")}
        className="bg-green-600 px-4 py-2 rounded"
      >
        Remix NEIPA
      </button>

    </div>

  )
}