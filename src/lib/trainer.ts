// src/lib/trainer.ts
import { createSupabaseServer } from "./supabaseServer";

export async function getCurrentTrainer() {
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { user: null, trainer: null };
  
  const { data: trainer } = await supabase
    .from("trainers")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();
  
  return { user, trainer };
}
