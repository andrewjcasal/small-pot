import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let client: SupabaseClient | undefined;

/**
 * Service-role client. RLS is on with no policies on the sp_* tables, so only
 * this key (never the anon/publishable one) can read or write them.
 */
export function getSupabaseClient(): SupabaseClient {
  if (!client) {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url) throw new Error('SUPABASE_URL is not set');
    if (!key) throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set');
    client = createClient(url, key, { auth: { persistSession: false } });
  }
  return client;
}
