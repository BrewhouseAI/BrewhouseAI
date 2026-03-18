import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST(req){

  const { messages, recipe } = await req.json()

  const systemPrompt = `

Du är BrewAI – en världsledande expert på hembryggning.

Du analyserar och modifierar öltrecept.

REGLER:

1. Om användaren vill ändra receptet måste du returnera JSON.
2. JSON måste innehålla:
   message
   recipe_update

3. recipe_update måste innehålla HELA receptet.

EXEMPEL:

{
 "message":"Jag ökade beskan genom att lägga till 20 g Cascade vid 10 minuter.",
 "recipe_update":{
   "style":"American IPA",
   "og":1.060,
   "fg":1.012,
   "abv":6.3,
   "ibu":55,
   "malts":[...],
   "hops":[...],
   "yeast":"US-05",
   "flavor_profile":"...",
   "brewing_tips":"..."
 }
}

Om användaren bara ställer en fråga returnera:

{
 "message":"svar"
}

RECEPTET:

${JSON.stringify(recipe,null,2)}

SVARA ALLTID PÅ SVENSKA.

RETURNERA ENDAST JSON.

`

  const completion = await openai.chat.completions.create({

    model:"gpt-4.1-mini",

    messages:[
      {role:"system",content:systemPrompt},
      ...messages
    ],

    temperature:0.6

  })

  let text = completion.choices[0].message.content

  text = text
    .replace(/```json/g,"")
    .replace(/```/g,"")
    .trim()

  let result

  try{

    result = JSON.parse(text)

  }catch{

    result = {
      message:text
    }

  }
  
  console.log("AI RESPONSE:", result)
  return Response.json(result)

}