import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(req: NextRequest) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (key) => req.cookies.get(key)?.value,
        set: (key, value) => {
          const res = NextResponse.next();
          res.cookies.set(key, value);
          return res;
        },
        remove: (key) => {
          const res = NextResponse.next();
          res.cookies.delete(key);
          return res;
        },
      },
    }
  );

  // Example: check if user is logged in
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/app/:path*"],
};
