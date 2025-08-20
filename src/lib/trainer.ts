// src/lib/trainer.ts
import { createSupabaseServer } from "./supabaseServer";

export async function getCurrentTrainer() {
  const supabase = await createSupabaseServer();

  const { data: { user }, error: userErr } = await supabase.auth.getUser();
  if (userErr || !user) return { user: null, trainer: null };

  const { data: trainer, error } = await supabase
    .from("trainers")
    .select("id, user_id, name, email")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) return { user, trainer: null };
  return { user, trainer };
}
