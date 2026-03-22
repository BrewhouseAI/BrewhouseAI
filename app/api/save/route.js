import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_KEY
)

export async function POST(req) {

  try {

    // 🔥 AUTH CHECK
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return Response.json({ error: "Not authenticated" }, { status: 401 })
    }

    const body = await req.json()

    const {
      style,
      og,
      fg,
      abv,
      ibu,
      malts,
      hops,
      yeast,
      flavor_profile,
      brewing_tips
    } = body

    // 🔥 user_id sätts på servern (inte från frontend!)
    const { data, error } = await supabase
      .from("Recipes")
      .insert([
        {
          style,
          og,
          fg,
          abv,
          ibu,
          malts,
          hops,
          yeast,
          flavor_profile,
          brewing_tips,
          user_id: user.id
        }
      ])
      .select()

    if (error) {
      return Response.json({ error: error.message }, { status: 500 })
    }

    return Response.json({ success: true, data })

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }

}