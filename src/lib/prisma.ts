import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

/**
 * Normalizes DATABASE_URL for `pg`. Common issues: wrapping quotes in .env,
 * Prisma Accelerate URLs (not supported with adapter-pg), or special chars in password.
 */
function getDatabaseUrl(): string {
  const raw = process.env.DATABASE_URL;
  if (raw == null || String(raw).trim() === "") {
    throw new Error("DATABASE_URL is not set");
  }

  let s = String(raw).trim();
  if (
    (s.startsWith('"') && s.endsWith('"')) ||
    (s.startsWith("'") && s.endsWith("'"))
  ) {
    s = s.slice(1, -1).trim();
  }

  const lower = s.toLowerCase();
  if (lower.startsWith("prisma://") || lower.startsWith("prisma+")) {
    throw new Error(
      "DATABASE_URL cannot be a Prisma Accelerate URL (prisma:// / prisma+postgres://) with @prisma/adapter-pg. Use the Postgres URI from Supabase: Settings → Database → Connection string → URI (pooler or direct)."
    );
  }

  if (!lower.startsWith("postgres://") && !lower.startsWith("postgresql://")) {
    throw new Error(
      'DATABASE_URL must start with postgres:// or postgresql://. Copy the full URI from Supabase (not the JDBC or "psql" only form).'
    );
  }

  return s;
}

function createPrismaClient() {
  const connectionString = getDatabaseUrl();

  let pool: Pool;
  try {
    pool = new Pool({ connectionString });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    throw new Error(
      `Could not open Postgres pool (${msg}). Fix DATABASE_URL: remove extra quotes, use postgres://… from Supabase, URL-encode the password if it contains @ : / # ? & = +.`
    );
  }

  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
