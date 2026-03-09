import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
 process.env.SUPABASE_URL,
 process.env.SUPABASE_KEY
)

export async function POST(req){

 const data = await req.json()

 const { id, ...updates } = data

 const { error } = await supabase
  .from("Recipes")
  .update(updates)
  .eq("id", id)

 if(error){
  return Response.json({success:false})
 }

 return Response.json({success:true})
}