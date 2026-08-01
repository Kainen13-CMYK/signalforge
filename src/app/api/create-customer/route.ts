import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getSupabaseServerClient } from "../../../lib/supabase-server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST() {
  const supabase = getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not logged in" }, { status: 401 });
  }

  // Check if user already has a customer
  const { data: existing } = await supabase
    .from("subscriptions")
    .select("stripe_customer_id")
    .eq("user_id", user.id)
    .single();

  if (existing?.stripe_customer_id) {
    return NextResponse.json({ customer: existing.stripe_customer_id });
  }

  // Create new Stripe customer
  const customer = await stripe.customers.create({
    email: user.email,
    metadata: { user_id: user.id },
  });

  // Store it
  await supabase
    .from("subscriptions")
    .insert({
      user_id: user.id,
      stripe_customer_id: customer.id,
      stripe_status: "none",
    });

  return NextResponse.json({ customer: customer.id });
}
