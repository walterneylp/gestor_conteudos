const getOptional = (key: string) => {
  const value = process.env[key];

  if (!value || value.trim().length === 0) {
    return undefined;
  }

  return value;
};

export const env = {
  databaseUrl: getOptional("DATABASE_URL"),
  supabaseUrl: getOptional("NEXT_PUBLIC_SUPABASE_URL"),
  supabaseAnonKey: getOptional("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
  n8nOutboundSecret: getOptional("N8N_OUTBOUND_SECRET"),
  n8nInboundSecret: getOptional("N8N_INBOUND_SECRET"),
  externalWebhookSecret: getOptional("EXTERNAL_WEBHOOK_SECRET"),
};

export const isDatabaseConfigured = () => Boolean(env.databaseUrl);
export const isSupabasePublicConfigured = () => Boolean(env.supabaseUrl && env.supabaseAnonKey);
