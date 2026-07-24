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
  const priceId = form.get("priceId") as string;

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer_creation: "always",
    client_reference_id: user.id,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: "http://localhost:3000/dashboard",
    cancel_url: "http://localhost:3000/pricing",
  });

  return NextResponse.redirect(session.url!);
}
