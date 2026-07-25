export default function CancelPage() {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>Checkout Canceled</h1>
      <p>Your subscription was not activated.</p>

      <a
        href="/checkout"
        style={{
          marginTop: "1rem",
          display: "inline-block",
          padding: "0.75rem 1.5rem",
          backgroundColor: "#000",
          color: "#fff",
          borderRadius: "6px",
        }}
      >
        Try Again
      </a>
    </div>
  );
}
