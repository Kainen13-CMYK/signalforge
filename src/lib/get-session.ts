import { getSupabaseServerClient } from "./supabase-server";

export async function getSession() {
  const supabase = getSupabaseServerClient();
  const { data } = await supabase.auth.getSession();
  return data.session;
}
