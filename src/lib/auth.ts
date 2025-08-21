// src/lib/auth.ts
import { createSupabaseServer } from "./supabaseServer";
import { redirect } from "next/navigation";

/** Get the current authenticated user or redirect to sign-in */
export async function requireUserOrRedirect(pathWhenDenied = "/signin") {
  const supabase = await createSupabaseServer();
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    redirect(pathWhenDenied);
  }
  
  return { user };
}

/** Get the current user if authenticated, otherwise return null */
export async function getCurrentUser() {
  const supabase = await createSupabaseServer();
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    return null;
  }
  
  return user;
}