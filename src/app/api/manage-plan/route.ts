import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

export async function GET() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/login`);
    }

    const cu    }

    // Return subscription details
    const activeSub = subscriptions.data[0];
    return NextResponse.json({
      plan: activeSub.items.data[0].price.nickname,
      product: activeSub.items.data[0].price.product,
      current_period_end: activeSub.current_period_end,
    });
  } catch (error: any) {
    console.error("Error retrieving plan:", error);
    return NextResponse.json(
      { error: "Failed to retrieve plan", details: error.message },
      { status: 500 }
    );stomerId = user.user_metadata?.stripe_customer_id;

    if (!customerId) {
      return NextResponse.json(
        { error: "No Stripe customer ID found for this user." },
        { status: 400 }
      );
    }

    // Retrieve the customer’s active subscriptions
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "active",
      expand: ["data.items.price.product"],
    });

    if (!subscriptions.data.length) {
      return NextResponse.json(
        { message: "No active subscriptions found." },
        { status: 404 }
      );

  }
}
