import { createClient } from "@supabase/supabase-js";
import { env } from "@/lib/env";

let browserClient: ReturnType<typeof createClient> | undefined;

export const getSupabaseBrowserClient = () => {
  if (!env.supabaseUrl || !env.supabaseAnonKey) {
    return undefined;
  }

  if (!browserClient) {
    browserClient = createClient(env.supabaseUrl, env.supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  }

  return browserClient;
};
