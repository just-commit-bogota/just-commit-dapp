import { createClient } from "@supabase/supabase-js";
import env from "../utils/env";

const { supabaseUrl, supabaseServiceKey } = env;

if (!supabaseUrl || !supabaseServiceKey)
  throw new Error("Missing Supabase URL or service key!");

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export default supabase;
