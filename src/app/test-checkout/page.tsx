"use client";

export default function TestCheckoutPage() {
  async function startCheckout() {
    console.log("Button clicked!");

    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        priceId: "price_1TwV8GGfVgjNlec7Zhu9YRQb",
        userId: "test-user",
      }),
    });

    const data = await res.json();
    console.log("API response:", data);

    if (data.url) {
      window.location.href = data.url;
    }
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Test Checkout</h1>
      <button
        onClick={startCheckout}
        style={{
          padding: "1rem 2rem",
          fontSize: "1.2rem",
          cursor: "pointer",
          background: "black",
          color: "white",
          borderRadius: "8px",
        }}
      >
        Start Test Checkout
      </button>
    </div>
  );
}
