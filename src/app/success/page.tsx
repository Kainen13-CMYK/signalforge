export default function SuccessPage() {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>Subscription Activated</h1>
      <p>Your premium access is now live.</p>

      <a
        href="/billing"
        style={{
          marginTop: "1rem",
          display: "inline-block",
          padding: "0.75rem 1.5rem",
          backgroundColor: "#000",
          color: "#fff",
          borderRadius: "6px",
        }}
      >
        Go to Billing
      </a>
    </div>
  );
}
