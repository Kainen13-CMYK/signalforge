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
    const { subscriptionId, newPriceId } = await req.json();

    if (!subscriptionId || !newPriceId) {
      return NextResponse.json(
        { error: "Missing subscriptionId or newPriceId" },
        { status: 400 }
      );
    }

    // Retrieve the subscription
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);

    // Update the subscription to the new price
    const updated = await stripe.subscriptions.update(subscriptionId, {
      items: [
        {
          id: subscription.items.data[0].id,
          price: newPriceId,
        },
      ],
      proration_behavior: "create_prorations",
    });

    return NextResponse.json({ subscription: updated });
  } catch (error) {
    console.error("Stripe change-plan error:", error);
    return NextResponse.json(
      { error: "Unable to change plan" },
      { status: 500 }
    );
  }
}
