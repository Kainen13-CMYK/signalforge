import { createClient } from "@supabase/supabase-js";

export async function checkSubscription(userId: string) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data } = await supabase
    .from("subscriptions")
    .select("status")
    .eq("user_id", userId)
    .maybeSingle();

  return data?.status === "active";
}
