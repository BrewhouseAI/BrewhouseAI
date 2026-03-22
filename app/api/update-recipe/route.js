import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_KEY
)

export async function POST(req){

  try {

    // 🔥 AUTH
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return Response.json({ error: "Not authenticated" }, { status: 401 })
    }

    const data = await req.json()

    const { id, ...updates } = data

    // 🔥 JSON safety
    if (updates.malts && typeof updates.malts !== "string") {
      updates.malts = JSON.stringify(updates.malts)
    }

    if (updates.hops && typeof updates.hops !== "string") {
      updates.hops = JSON.stringify(updates.hops)
    }

    // 🔥 extra säkerhet
    const { data: existing } = await supabase
      .from("Recipes")
      .select("user_id")
      .eq("id", id)
      .single()

    if (!existing || existing.user_id !== user.id) {
      return Response.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { error } = await supabase
      .from("Recipes")
      .update(updates)
      .eq("id", id)

    if (error) {
      return Response.json({ error: error.message }, { status: 500 })
    }

    return Response.json({ success: true })

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }

}