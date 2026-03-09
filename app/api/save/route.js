import { supabase } from "../../../lib/supabase"

export async function POST(req) {

  const body = await req.json()

  console.log("Saving recipe:", body)

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