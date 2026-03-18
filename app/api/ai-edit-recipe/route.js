import OpenAI from "openai"
import { createClient } from "@supabase/supabase-js"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

export async function POST(req) {

  const body = await req.json()

  const { message, recipeId } = body

  const { data: recipe } = await supabase
    .from("Recipes")
    .select("*")
    .eq("id", recipeId)
    .single()

  const malts = JSON.parse(recipe.malts || "[]")
  const hops = JSON.parse(recipe.hops || "[]")

  const prompt = `
You are a brewing AI.

User request:
${message}

Current recipe:

Malts:
${JSON.stringify(malts)}

Hops:
${JSON.stringify(hops)}

Return ONLY JSON.

Example:

{
 "action":"update_recipe",
 "malts":[],
 "hops":[]
}
`

  const completion = await openai.chat.completions.create({

    model: "gpt-4o-mini",

    messages: [
      { role: "system", content: "You are a brewing expert." },
      { role: "user", content: prompt }
    ]

  })

  const text = completion.choices[0].message.content

  let aiData

  try {
    aiData = JSON.parse(text)
  } catch {
    return Response.json({ error: "AI parse error" })
  }

  if (aiData.action === "update_recipe") {

    await supabase
      .from("Recipes")
      .update({
        malts: JSON.stringify(aiData.malts),
        hops: JSON.stringify(aiData.hops)
      })
      .eq("id", recipeId)

  }

  return Response.json({ success: true })

}