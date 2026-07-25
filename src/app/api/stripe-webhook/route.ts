import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

export const config = {
  api: {
    bodyParser: false,
  },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

function buffer(readable: any) {
  return new Promise((resolve, reject) => {
    const chunks: any[] = [];
    readable.on("data", (chunk: any) => chunks.push(chunk));
    readable.on("end", () => resolve(Buffer.concat(chunks)));
    readable.on("error", reject);
  });
}

export async function POST(req: Request) {
  const rawBody = await buffer(req.body);
  const sig = req.headers.get("stripe-signature");

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook error: ${err.message}` }, { status: 400 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Handle subscription events
  if (event.type === "customer.subscription.created" ||
      event.type === "customer.subscription.updated") {

    const subscription = event.data.object;

    const userId = subscription.metadata.user_id;
    const plan = subscription.metadata.plan;

    await supabase
      .from("profiles")
      .update({
        plan,
        subscription_id: subscription.id,
      })
      .eq("id", userId);
  }

  if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object;
    const userId = subscription.metadata.user_id;

    await supabase
      .from("profiles")
      .update({
        plan: "free",
        subscription_id: null,
      })
      .eq("id", userId);
  }

  return NextResponse.json({ received: true });
}
