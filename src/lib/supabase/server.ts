import { createServerClient } from "@supabase/ssr";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

function getCookieHandlers() {
  return {
    async getAll() {
      const store = await cookies();
      return store.getAll();
    },
    async setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
      const store = await cookies();
      cookiesToSet.forEach(({ name, value, options }) => {
        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          store.set(name, value, options as any);
        } catch {
          /* Server component — ignore */
        }
      });
    },
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function createClient(): Promise<ReturnType<typeof createServerClient<any>>> {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              cookieStore.set(name, value, options as any)
            );
          } catch { /* Server component */ }
        },
      },
    }
  );
}

// Service-role client — uses plain supabase-js (no cookie injection) so the
// service_role JWT is used as the Authorization header and RLS is fully bypassed.
export function createServiceClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
