import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "@/lib/env";

export const getDb = () => {
  if (!env.databaseUrl) {
    return undefined;
  }

  const queryClient = postgres(env.databaseUrl, { prepare: false });
  return drizzle(queryClient);
};
