import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST(req) {

  const { prompt } = await req.json()

  const aiPrompt = `
You are a professional brewing assistant.

IMPORTANT:
All text responses must be written in Swedish.

Create a detailed homebrew beer recipe.

The recipe must be designed for a 20 liter finished batch.

Return ONLY valid JSON.

Use EXACTLY this structure:

{
 "style": "",
 "og": "",
 "fg": "",
 "abv": "",
 "ibu": "",
 "malts": [
   { "name": "", "weight": "" }
 ],
 "hops": [
   { "name": "", "weight": "", "time": "" }
 ],
 "yeast": "",
 "flavor_profile": "",
 "brewing_tips": ""
}

Rules:

malts:
List malt name and weight in kilograms.

Example:
{ "name": "Pilsnermalt", "weight": "4.5 kg" }

hops:
List hop name, weight in grams, and timing.

Example:
{ "name": "Citra", "weight": "30 g", "time": "60 min" }

yeast:
Include yeast strain.

flavor_profile:
Write 3–5 sentences describing aroma, taste and mouthfeel.

brewing_tips:
Write 3–5 sentences with practical brewing advice for homebrewers.

Important:
- The recipe must be realistic for a 20 liter batch
- Do NOT use percentages
- Do NOT include explanations outside JSON

Beer description:
${prompt}
`

  const completion = await openai.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [
      {
        role: "user",
        content: aiPrompt
      }
    ],
    temperature: 0.8
  })

  let text = completion.choices[0].message.content

  // remove markdown wrappers if AI adds them
  text = text.replace("```json", "")
  text = text.replace("```", "")
  text = text.trim()

  let recipe

  try {

    recipe = JSON.parse(text)

  } catch (error) {

    console.error("AI JSON parse error:", text)

    return Response.json({
      error: "Failed to parse AI response",
      raw: text
    })

  }

  return Response.json(recipe)

}