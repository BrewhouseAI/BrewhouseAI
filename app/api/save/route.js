import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

export async function POST(req) {

  const body = await req.json()

  const { data, error } = await supabase
    .from("Recipes")
    .insert([body])
    .select()

  if (error) {

    console.log("SUPABASE ERROR:", error)

    return Response.json({
      success: false,
      error
    })

  }

  return Response.json({
    success: true,
    data
  })

}