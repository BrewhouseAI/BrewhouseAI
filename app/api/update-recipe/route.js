import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

export async function POST(req){

  const data = await req.json()

  const { id, ...updates } = data

  // säkerställ att malts och hops sparas som JSON-strängar
  if(updates.malts && typeof updates.malts !== "string"){
    updates.malts = JSON.stringify(updates.malts)
  }

  if(updates.hops && typeof updates.hops !== "string"){
    updates.hops = JSON.stringify(updates.hops)
  }

  const { error } = await supabase
    .from("Recipes")
    .update(updates)
    .eq("id", id)

  if(error){
    console.error(error)
    return Response.json({success:false})
  }

  return Response.json({success:true})

}