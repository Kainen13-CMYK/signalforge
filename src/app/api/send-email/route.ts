export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";        
import { createClient } from "@supabase/supabase-js";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST() {
  try {
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { success: false, error: "Missing RESEND_API_KEY environment variable." },
        { status: 500 }
      );
    }

    const data = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "you@example.com",
      subject: "Hello world",
      html: "<p>It works!</p>",
    });

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to send email." },
      { status: 500 }
    );
  }
}
