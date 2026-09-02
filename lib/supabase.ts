import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { cache } from "react";

import type { Database } from "./database.types";

export type Client = SupabaseClient<Database>;

function credentials() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Supabase is not configured. Copy .env.example to .env.local and fill in " +
        "NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    );
  }

  return { url, anonKey };
}

// Retriever has no sign-in yet, so there is no session to persist or refresh
// and the same anon credentials work on both sides of the network boundary.
// Session persistence is switched off so the browser client does not write
// empty auth state into the shared workshop laptops' local storage.
const options = {
  auth: { persistSession: false, autoRefreshToken: false },
} as const;

/**
 * Client for Server Components and Server Actions, memoised per request.
 */
export const getServerClient = cache((): Client => {
  const { url, anonKey } = credentials();
  return createClient<Database>(url, anonKey, options);
});

let browserClient: Client | undefined;

/**
 * Client for Client Components. Created once per browser session.
 */
export function getBrowserClient(): Client {
  if (!browserClient) {
    const { url, anonKey } = credentials();
    browserClient = createClient<Database>(url, anonKey, options);
  }
  return browserClient;
}
