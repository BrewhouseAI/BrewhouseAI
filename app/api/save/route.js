import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
)

export async function POST(req) {
  try {
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
      brewing_tips,
      user_id
    } = body

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
          user_id
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