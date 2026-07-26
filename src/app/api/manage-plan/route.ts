import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2026-06-24.dahlia",
});

type ManagePlanAction =
  | "upgrade"
  | "downgrade"
  | "cancel"
  | "resume";

interface ManagePlanBody {
  action: ManagePlanAction;
  subscriptionId: string;
  customerId: string;
  priceId?: string; // required for upgrade/downgrade
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ManagePlanBody;
    const { action, subscriptionId, customerId, priceId } = body;

    if (!action || !subscriptionId || !customerId) {
      return NextResponse.json(
        { error: "Missing required fields: action, subscriptionId, customerId" },
        { status: 400 }
      );
    }

    let updatedSubscription: Stripe.Subscription | null = null;

    switch (action) {
      case "upgrade":
      case "downgrade": {
        if (!priceId) {
          return NextResponse.json(
            { error: "priceId is required for plan changes" },
            { status: 400 }
          );
        }

        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const currentItem = subscription.items.data[0];

        updatedSubscription = await stripe.subscriptions.update(subscriptionId, {
          items: [
            {
              id: currentItem.id,
              price: priceId,
            },
          ],
          proration_behavior: "create_prorations",
        });

        break;
      }

      case "cancel": {
        updatedSubscription = await stripe.subscriptions.cancel(subscriptionId);
        break;
      }

      case "resume": {
        updatedSubscription = await stripe.subscriptions.update(subscriptionId, {
          cancel_at_period_end: false,
        });
        break;
      }

      default:
        return NextResponse.json(
          { error: `Unsupported action: ${action}` },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      action,
      subscription: updatedSubscription,
    });
  } catch (error: any) {
    console.error("manage-plan error:", error);
    return NextResponse.json(
      { error: error.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}
