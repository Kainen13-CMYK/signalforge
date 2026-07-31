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

export async function POST(req: Request) {
  const stripe = getStripe();

  // If Stripe isn't configured (build-time or missing env), return safe error
  if (!stripe) {
    return NextResponse.json(
      { error: "Stripe is not configured" },
      { status: 500 }
    );
  }

  try {
    const { customerId } = await req.json();

    if (!customerId) {
      return NextResponse.json(
        { error: "Missing customerId" },
        { status: 400 }
      );
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe portal session error:", error);
    return NextResponse.json(
      { error: "Unable to create portal session" },
      { status: 500 }
    );
  }
}
