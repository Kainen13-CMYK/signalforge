import { getSupabaseServerClient } from "./supabase-server";

export async function getSubscription(userId: string) {
  const supabase = getSupabaseServerClient();

  const { data, error } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error) {
    console.error("Error fetching subscription:", error.message);
    return null;
  }

  return data;
}
