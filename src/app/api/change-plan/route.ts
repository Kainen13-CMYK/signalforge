import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.redirect("/login");

  const form = await req.formData();
  const newPriceId = form.get("priceId") as string;

  const { data: sub } = await supabase
    .from("subscriptions")
    .select("stripe_subscription_id")
    .eq("user_id", user.id)
    .maybeSingle();

  const updated = await stripe.subscriptions.update(sub.stripe_subscription_id, {
    items: [
      {
        price: newPriceId,
      },
    ],
    proration_behavior: "create_prorations",
  });

  return NextResponse.json({ updated });
}
