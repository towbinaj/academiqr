// Supabase client initialization
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase env variables are missing. Check .env.local')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false
  }
})

export async function checkConnection() {
  try {
    const { data, error } = await supabase.from('link_lists').select('id').limit(1)
    if (error) throw error
    return true
  } catch (e) {
    console.warn('Supabase connection check failed:', e.message)
    return false
  }
}




