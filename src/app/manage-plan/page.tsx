"use client";

import { useState } from "react";

export default function ManagePlanPage() {
  const [loading, setLoading] = useState<string | null>(null);

  async function handlePlanSelect(plan: "ignite" | "momentum" | "apex") {
    try {
      setLoading(plan);

      const res = await fetch("/api/manage-plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ plan }),
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url; // Redirect to Stripe Checkout
      } else {
        console.error("Stripe session error:", data);
      }
    } catch (err) {
      console.error("Plan selection error:", err);
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <h1 className="text-4xl font-bold mb-10 text-center">Choose Your Plan</h1>

      <div className="grid md:grid-cols-3 gap-8">

        {/* Ignite */}
        <div className="border rounded-xl p-6 shadow-sm">
          <h2 className="text-2xl font-bold">Ignite</h2>
          <p className="text-gray-500 mt-1">Perfect for beginners</p>
          <p className="text-4xl font-bold mt-4">$20<span className="text-lg">/mo</span></p>

          <button
            onClick={() => handlePlanSelect("ignite")}
            disabled={loading === "ignite"}
            className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg"
          >
            {loading === "ignite" ? "Loading..." : "Choose Ignite"}
          </button>
        </div>

        {/* Momentum */}
        <div className="border rounded-xl p-6 shadow-sm bg-blue-50">
          <h2 className="text-2xl font-bold">Momentum</h2>
          <p className="text-gray-500 mt-1">Most Popular</p>
          <p className="text-4xl font-bold mt-4">$40<span className="text-lg">/mo</span></p>

          <button
            onClick={() => handlePlanSelect("momentum")}
            disabled={loading === "momentum"}
            className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg"
          >
            {loading === "momentum" ? "Loading..." : "Choose Momentum"}
          </button>
        </div>

        {/* Apex */}
        <div className="border rounded-xl p-6 shadow-sm">
          <h2 className="text-2xl font-bold">Apex</h2>
          <p className="text-gray-500 mt-1">Best Value</p>
          <p className="text-4xl font-bold mt-4">$75<span className="text-lg">/mo</span></p>

          <button
            onClick={() => handlePlanSelect("apex")}
            disabled={loading === "apex"}
            className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg"
          >
            {loading === "apex" ? "Loading..." : "Choose Apex"}
          </button>
        </div>

      </div>
    </div>
  );
}
