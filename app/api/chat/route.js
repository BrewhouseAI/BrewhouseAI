import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST(req){

  const { messages, recipe } = await req.json()

  const systemPrompt = `

Du är BrewAI – en världsledande expert på hembryggning.

Du kan:

- analysera recept
- förbättra recept
- ändra recept

VIKTIGT:

Om du ändrar receptet måste du ALLTID returnera JSON.

Format:

{
 "message":"förklaring",
 "recipe_update": {HELA receptet uppdaterat}
}

Om användaren bara ställer en fråga returnera:

{
 "message":"svar"
}

Receptet måste innehålla:

style
og
fg
abv
ibu
malts
hops
yeast
flavor_profile
brewing_tips

Nuvarande recept:

${JSON.stringify(recipe,null,2)}

Svara alltid på svenska.

`

  const completion = await openai.chat.completions.create({

    model:"gpt-4.1-mini",

    messages:[
      {role:"system",content:systemPrompt},
      ...messages
    ],

    temperature:0.7

  })

  let text = completion.choices[0].message.content

  text = text.replace(/```json/g,"").replace(/```/g,"").trim()

  let result

  try{

    result = JSON.parse(text)

  }catch{

    result = { message:text }

  }

  return Response.json(result)

}