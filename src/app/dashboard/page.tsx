import { redirect } from "next/navigation";
import { getSession } from "../../lib/get-session";
import { getSubscription } from "../../lib/get-subscription";

export default async function DashboardPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  // Create Stripe customer if missing
  await fetch("/api/create-customer", { method: "POST" });

  const subscription = await getSubscription(session.user.id);

  if (!subscription || subscription.stripe_status !== "active") {
    redirect("/pricing");
  }

  return (
    <main>
      <h1>Dashboard</h1>
      <p>Welcome, {session.user.email}</p>
      <p>Status: {subscription.stripe_status}</p>

      <form action="/logout" method="post">
        <button>Logout</button>
      </form>
    </main>
  );
}
