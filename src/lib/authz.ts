// src/lib/authz.ts
import { createSupabaseServer } from "./supabaseServer";
import { redirect } from "next/navigation";

/** Use in server components/pages that should only be visible to trainers */
export async function requireTrainerOrRedirect(pathWhenDenied = "/signin") {
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(pathWhenDenied);

  const { data: trainer } = await supabase
    .from("trainers")
    .select("id,user_id,email,name")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!trainer) redirect(`${pathWhenDenied}?msg=not_trainer`);
  return { user, trainer };
}
