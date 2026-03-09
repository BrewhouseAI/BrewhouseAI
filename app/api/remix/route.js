import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST(req) {

  const { recipe, style } = await req.json()

  const prompt = `
You are a professional brewmaster.

Take this beer recipe and remix it into a ${style} version.

Return JSON in this format:

{
  "style": "",
  "abv": "",
  "ibu": "",
  "og": "",
  "fg": "",
  "malts": [],
  "hops": [],
  "yeast": "",
  "flavor_profile": "",
  "brewing_tips": ""
}

Original recipe:
${JSON.stringify(recipe)}
`

  const completion = await openai.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [
      {
        role: "user",
        content: prompt
      }
    ],
    temperature: 0.8
  })

  const text = completion.choices[0].message.content

  return Response.json({ recipe: text })
}