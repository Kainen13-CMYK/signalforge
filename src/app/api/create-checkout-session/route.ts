export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2026-06-24.dahlia",
});

export async function POST(req: NextRequest) {
  try {
    // Supabase client (server-side)
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Get authenticated user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    // Parse incoming body
    const { newPriceId } = await req.json();

    if (!newPriceId) {
      return NextResponse.json(
        { error: "Missing newPriceId" },
        { status: 400 }
      );
    }

    // Get subscription ID from user metadata
    const subscriptionId = user.user_metadata.stripe_subscription_id;

    if (!subscriptionId) {
      return NextResponse.json(
        { error: "User has no subscription" },
        { status: 400 }
      );
    }

    // Retrieve subscription
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);

    // Update subscription to new price
    const updatedSubscription = await stripe.subscriptions.update(
      subscription.id,
      {
        items: [
          {
            id: subscription.items.data[0].id,
            price: newPriceId,
          },
        ],
        proration_behavior: "create_prorations",
      }
    );

    return NextResponse.json({
      message: "Plan changed successfully",
      subscription: updatedSubscription,
    });
  } catch (error: any) {
    console.error("Change plan error:", error);
    return NextResponse.json(
      { error: error.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}
