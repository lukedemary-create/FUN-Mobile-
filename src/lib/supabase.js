import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY || 'placeholder-key'

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
