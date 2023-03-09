import { createClient } from '@supabase/supabase-js'

const NEXT_PUBLIC_SUPABASE_URL = process.env.SUPABASE_URL
const NEXT_PUBLIC_SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY

if (!NEXT_PUBLIC_SUPABASE_URL || !NEXT_PUBLIC_SUPABASE_SERVICE_KEY) {
  throw new Error('Missing Supabase URL or service key')
}

const supabase = createClient(NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_SERVICE_KEY)

export default supabase