import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,   // 🔥 viktig
    autoRefreshToken: true, // 🔥 viktig
    detectSessionInUrl: true // 🔥 fixar login/reset flows
  }
})