import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-06-24.dahlia",
});


export async function POST(request: Request) {
  try {
    // Initialize Supabase client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Get the authenticated user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Parse request body for new plan price ID
    const { newPriceId } = await request.json();

    if (!newPriceId) {
      return NextResponse.json({ error: "Missing newPriceId" }, { status: 400 });
    }

    // Retrieve current subscription
    const subscriptionId = user.user_metadata.stripe_subscription_id;
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);

    // Update subscription with new price
    await stripe.subscriptions.update(subscription.id, {
      items: [
        {
          id: subscription.items.data[0].id,
          price: newPriceId,
        },
      ],
    });

    return NextResponse.json({ message: "Plan updated successfully" });
  } catch (error: any) {
    console.error("Error updating plan:", error);
    return NextResponse.json(
      { error: "Failed to update plan", details: error.message },
      { status: 500 }
    );
  }
}
