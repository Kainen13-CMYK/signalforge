export default function BillingPage() {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>Manage Your Subscription</h1>
      <p>Update your plan, payment method, or cancel your subscription.</p>

      <a
        href="/api/create-portal-session"
        style={{
          marginTop: "1rem",
          display: "inline-block",
          padding: "0.75rem 1.5rem",
          backgroundColor: "#000",
          color: "#fff",
          borderRadius: "6px",
        }}
      >
        Open Billing Portal
      </a>

      <a
        href="/manage-plan"
        style={{
          marginTop: "1rem",
          display: "inline-block",
          padding: "0.75rem 1.5rem",
          backgroundColor: "#444",
          color: "#fff",
          borderRadius: "6px",
        }}
      >
        Change Plan
      </a>
    </div>
  );
}
