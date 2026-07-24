"use client";

import { useState } from "react";
import { supabaseBrowserClient } from "../../lib/supabase-browser";

export default function LoginPage() {
  const [email, setEmail] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    await supabaseBrowserClient.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${location.origin}/dashboard`,
      },
    });

    alert("Magic link sent! Check your email.");
  }

  return (
    <main style={{ padding: "2rem" }}>
      <h1>Login</h1>

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button type="submit">Send Magic Link</button>
      </form>
    </main>
  );
}
