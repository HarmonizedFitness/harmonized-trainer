import { supabase } from '../src/lib/supabase'

export async function getCurrentSessionClient() {
  return (await supabase.auth.getSession()).data.session
}
