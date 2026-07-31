import { NextResponse } from "next/server";

// Lazy email client initializer — prevents build-time crashes
function getEmailClient() {
  const key = process.env.EMAIL_API_KEY; // rename to match your provider

  if (!key) {
    // During build, env vars are not available — return null instead of crashing
    return null;
  }

  // Example: Resend
  // return new Resend(key);

  // Example: SendGrid
  // sgMail.setApiKey(key);
  // return sgMail;

  // Example: Nodemailer
  // return nodemailer.createTransport({
  //   service: "gmail",
  //   auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
  // });

  return null; // Replace with your actual client
}

export async function POST(req: Request) {
  const emailClient = getEmailClient();

  // If email client isn't configured (build-time or missing env), return safe error
  if (!emailClient) {
    return NextResponse.json(
      { error: "Email service is not configured" },
      { status: 500 }
    );
  }

  try {
    const { to, subject, message } = await req.json();

    if (!to || !subject || !message) {
      return NextResponse.json(
        { error: "Missing to, subject, or message" },
        { status: 400 }
      );
    }

    // Example: Resend
    // await emailClient.emails.send({
    //   from: "noreply@yourdomain.com",
    //   to,
    //   subject,
    //   html: message,
    // });

    // Example: SendGrid
    // await emailClient.send({
    //   to,
    //   from: "noreply@yourdomain.com",
    //   subject,
    //   html: message,
    // });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Email error:", error);
    return NextResponse.json(
      { error: "Unable to send email" },
      { status: 500 }
    );
  }
}
