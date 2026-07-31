import { NextResponse } from "next/server";
import Stripe from "stripe";

// Prevent Next.js from trying to parse the body
export const config = {
  api: {
    bodyParser: false,
  },
};

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

  const sig = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    return NextResponse.json(
      { error: "Missing Stripe webhook signature or secret" },
      { status: 400 }
    );
  }

  let event;

  try {
    const rawBody = await req.text();

    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    );
  }

  try {
    // Handle events
    switch (event.type) {
      case "customer.subscription.created":
        console.log("Subscription created:", event.data.object.id);
        break;

      case "customer.subscription.updated":
        console.log("Subscription updated:", event.data.object.id);
        break;

      case "customer.subscription.deleted":
        console.log("Subscription deleted:", event.data.object.id);
        break;

      default:
        console.log("Unhandled event type:", event.type);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook handler error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
