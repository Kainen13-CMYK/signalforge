import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-06-20",
});

// Supabase client using SERVICE ROLE KEY (server-side only)
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature");
  const body = await req.text();

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  // -----------------------------
  // HANDLE STRIPE EVENTS
  // -----------------------------
  switch (event.type) {
    // -----------------------------
    // CUSTOMER COMPLETED CHECKOUT
    // -----------------------------
    case "checkout.session.completed": {
      const session = event.data.object;

      const userId = session.client_reference_id; // You pass this when creating checkout
      const customerId = session.customer as string;
      const subscriptionId = session.subscription as string;

      // Stripe sometimes stores price differently depending on mode
      const priceId =
        session.metadata?.price_id ||
        session.display_items?.[0]?.price?.id ||
        session.line_items?.data?.[0]?.price?.id;

      const periodEnd =
        session.expires_at ? new Date(session.expires_at * 1000) : null;

      const { error } = await supabase.from("subscriptions").insert({
        user_id: userId,
        stripe_customer_id: customerId,
        stripe_subscription_id: subscriptionId,
        stripe_price_id: priceId,
        status: "active",
        current_period_end: periodEnd,
      });

      if (error) {
        console.error("Supabase insert error:", error);
      } else {
        console.log("Subscription stored:", subscriptionId);
      }

      break;
    }

    // -----------------------------
    // SUBSCRIPTION RENEWAL SUCCESS
    // -----------------------------
    case "invoice.payment_succeeded": {
      const invoice = event.data.object;

      const periodEnd = new Date(
        invoice.lines.data[0].period.end * 1000
      );

      const { error } = await supabase
        .from("subscriptions")
        .update({
          status: "active",
          current_period_end: periodEnd,
        })
        .eq("stripe_subscription_id", invoice.subscription);

      if (error) {
        console.error("Supabase renewal update error:", error);
      } else {
        console.log("Renewal updated:", invoice.subscription);
      }

      break;
    }

    // -----------------------------
    // SUBSCRIPTION PAYMENT FAILED
    // -----------------------------
    case "invoice.payment_failed": {
      const invoice = event.data.object;

      const { error } = await supabase
        .from("subscriptions")
        .update({ status: "past_due" })
        .eq("stripe_subscription_id", invoice.subscription);

      if (error) {
        console.error("Supabase failure update error:", error);
      } else {
        console.log("Payment failed:", invoice.subscription);
      }

      break;
    }

    // -----------------------------
    // SUBSCRIPTION CANCELED
    // -----------------------------
    case "customer.subscription.deleted": {
      const sub = event.data.object;

      const { error } = await supabase
        .from("subscriptions")
        .update({ status: "canceled" })
        .eq("stripe_subscription_id", sub.id);

      if (error) {
        console.error("Supabase cancellation update error:", error);
      } else {
        console.log("Subscription canceled:", sub.id);
      }

      break;
    }

    // -----------------------------
    // EVERYTHING ELSE
    // -----------------------------
    default:
      console.log("Unhandled event:", event.type);
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
