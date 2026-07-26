export const runtime = "nodejs";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2026-06-24.dahlia",
});

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const sig = req.headers.get("stripe-signature");

    if (!sig) {
      return NextResponse.json({ error: "Missing Stripe signature" }, { status: 400 });
    }

    const event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );

    if (event.type === "customer.subscription.updated") {
      const subscription = event.data.object;

      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );

      await supabase
        .from("profiles")
        .update({
          stripe_price_id: subscription.items.data[0].price.id,
        })
        .eq("stripe_customer_id", subscription.customer);
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("Webhook error:", err);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
