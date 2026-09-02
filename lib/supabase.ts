import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { cache } from "react";

import type { Database } from "./database.types";

export type Client = SupabaseClient<Database>;

/**
 * The database is not reachable from the browser. Row level security is on
 * with no policies, so the public anon key is refused outright; the server
 * connects with the service role key, which bypasses RLS.
 *
 * Neither variable carries a NEXT_PUBLIC_ prefix, and that is load-bearing:
 * the prefix is what inlines a value into the client bundle, and the service
 * role key grants unrestricted access to every table. It must only ever be
 * read on the server.
 */
function credentials() {
  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "Supabase is not configured. Copy .env.example to .env.local and fill in " +
        "SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
    );
  }

  return { url, serviceRoleKey };
}

/**
 * Client for Server Components and Server Actions, memoised per request.
 *
 * There is no browser counterpart on purpose: exporting one would invite a
 * client component to import it and leak the key.
 */
export const getServerClient = cache((): Client => {
  const { url, serviceRoleKey } = credentials();

  return createClient<Database>(url, serviceRoleKey, {
    auth: {
      // A service role connection has no user session to keep alive.
      persistSession: false,
      autoRefreshToken: false,
    },
  });
});
