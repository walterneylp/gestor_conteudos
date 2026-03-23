import type { Config } from "drizzle-kit";
import { env } from "@/lib/env";

export default {
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: env.databaseUrl || "postgres://postgres:postgres@localhost:5432/gestor_conteudos",
  },
} satisfies Config;
