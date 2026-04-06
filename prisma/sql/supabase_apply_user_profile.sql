-- Run in Supabase: Dashboard → SQL Editor → New query → Paste → Run.
-- Fixes P2022 "column User.username does not exist" when `prisma migrate` fails with P1001 locally.

ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "username" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "avatarUrl" TEXT;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'User' AND column_name = 'updatedAt'
  ) THEN
    ALTER TABLE "User" ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
  END IF;
END $$;

UPDATE "User" SET "updatedAt" = "createdAt";

CREATE UNIQUE INDEX IF NOT EXISTS "User_username_key" ON "User"("username");
