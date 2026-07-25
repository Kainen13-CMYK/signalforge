export default function BillingPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Manage Your Subscription</h1>

      <p className="mb-4">
        Use the link below to open your Stripe billing portal and manage your
        subscription, payment method, or invoices.
      </p>

      <a
        href="/api/create-portal-session"
        className="text-blue-600 underline"
      >
        Open Billing Portal
      </a>
    </div>
  );
}
