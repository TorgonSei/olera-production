import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  // Never crash — a broken middleware drops the connection entirely
  try {
    let supabaseResponse = NextResponse.next({ request });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            );
            supabaseResponse = NextResponse.next({ request });
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    // Refresh session — MUST do this before checking user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { pathname } = request.nextUrl;

    // Skip auth checks on API routes — they handle auth themselves
    if (pathname.startsWith("/api/")) {
      return supabaseResponse;
    }

    // Protected candidate routes
    if (pathname.startsWith("/profile") || pathname.startsWith("/assessment")) {
      if (!user) {
        const url = request.nextUrl.clone();
        url.pathname = "/join";
        url.searchParams.set("redirect", pathname);
        return NextResponse.redirect(url);
      }
    }

    // Protected admin routes
    if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
      if (!user || user.user_metadata?.role !== "admin") {
        const url = request.nextUrl.clone();
        url.pathname = "/admin/login";
        return NextResponse.redirect(url);
      }
    }

    return supabaseResponse;
  } catch (err) {
    // Log but never crash — always let the request through
    console.error("[proxy] Unexpected error:", err);
    return NextResponse.next({ request });
  }
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
