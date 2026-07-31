import { NextResponse } from "next/server";
import Stripe from "stripe";

// Lazy Stripe initializer — prevents build-time crashes
function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    // During build, env vars are not available — return null instead of crashing
    return null;
  }
  return new Stripe(key);
}

export async function POST() {
  const stripe = getStripe();

  // If Stripe isn't configured (build-time or missing env), return safe error
  if (!stripe) {
    return NextResponse.json(
      { error: "Stripe is not configured" },
      { status: 500 }
    );
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID!,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/cancel`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: "Unable to create checkout session" },
      { status: 500 }
    );
  }
}
