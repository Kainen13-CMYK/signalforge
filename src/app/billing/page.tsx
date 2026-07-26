export default function BillingPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Manage Your Subscription</h1>

      <p className="mb-6">
        Use the link below to open your Stripe billing portal and manage your
        subscription, payment method, or invoices.
      </p>

      <a
        href="/api/create-portal-session"
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Open Billing Portal
      </a>
    </div>
  );
}
