import { createClient } from "@supabase/supabase-js";
import { env } from "@/lib/env";

let browserClient: ReturnType<typeof createClient> | undefined;
let serverClient: ReturnType<typeof createClient> | undefined;

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

export const getSupabaseServerClient = () => {
  if (!env.supabaseUrl || !env.supabaseAnonKey) {
    return undefined;
  }

  if (!serverClient) {
    serverClient = createClient(env.supabaseUrl, env.supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }

  return serverClient;
};
