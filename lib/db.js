import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = "https://yrjyojfejukxkmxacefq.supabase.co"
const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlyanlvamZlanVreGtteGFjZWZxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY3ODM4ODg0NiwiZXhwIjoxOTkzOTY0ODQ2fQ.bEN26-5XHA2z8Ex1N1TtausaUHkrXX9yKYOQlODhWNc"

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  throw new Error('Missing Supabase URL or service key')
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

export default supabase