import { createClient } from "@supabase/supabase-js"
import EditForm from "@/app/components/EditForm"

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
)

export default async function EditPage({ params }) {

  const { id } = params

  const { data: recipe } = await supabase
    .from("Recipes")
    .select("*")
    .eq("id", id)
    .maybeSingle()

  if (!recipe) {
    return <div className="p-10 text-white">Recipe not found</div>
  }

  return (

    <main className="min-h-screen bg-black text-white p-10 max-w-3xl mx-auto">

      <h1 className="text-3xl font-bold mb-6">
        Edit Recipe
      </h1>

      <EditForm recipe={recipe} />

    </main>

  )
}