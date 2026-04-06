import "dotenv/config";
import { defineConfig } from "prisma/config";

/**
 * Supabase + Prisma Migrate:
 * - Prefer DIRECT_URL = direct host `db.<project>.supabase.co:5432` (from Dashboard).
 * - If migrate fails with P1001, set DIRECT_URL to the Session pooler URI (port 5432 on *.pooler.supabase.com),
 *   not Transaction mode (:6543).
 * - App runtime still uses DATABASE_URL in `src/lib/prisma.ts` (Transaction pooler is OK).
 */
const migrateUrl = process.env.DIRECT_URL ?? process.env.DATABASE_URL;

if (!migrateUrl) {
  throw new Error(
    "Set DATABASE_URL in .env. For Supabase, also set DIRECT_URL for migrations (see .env.example)."
  );
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: migrateUrl,
  },
  migrations: {
    path: "prisma/migrations",
  },
});
