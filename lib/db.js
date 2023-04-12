import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_SERVICE_KEY = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_KEY || "";

const supabase =
  SUPABASE_URL &&
  SUPABASE_SERVICE_KEY &&
  createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

export default supabase;
