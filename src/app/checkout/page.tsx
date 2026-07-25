"use client";

import { useState } from "react";

export default function CheckoutPage() {
  const [loading, setLoading] = useState(false);

  async function handleSubscribe() {
    setLoading(true);

    const res = await fetch("/api/create-checkout-session", {
      method: "POST",
    });

    const data = await res.json();

    if (data.url) {
      window.location.href = data.url; // Redirect to Stripe Checkout
    } else {
      alert("Unable to start checkout session.");
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Subscribe to SignalForge</h1>
      <p>Unlock premium features and tools.</p>

      <button
        onClick={handleSubscribe}
        disabled={loading}
        style={{
          marginTop: "1rem",
          padding: "0.75rem 1.5rem",
          fontSize: "1rem",
          backgroundColor: "#000",
          color: "#fff",
          borderRadius: "6px",
          cursor: "pointer",
          opacity: loading ? 0.6 : 1,
        }}
      >
        {loading ? "Redirecting..." : "Subscribe"}
      </button>
    </div>
  );
}
