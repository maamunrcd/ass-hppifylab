-- AlterTable
ALTER TABLE "User" ADD COLUMN "username" TEXT;
ALTER TABLE "User" ADD COLUMN "avatarUrl" TEXT;
ALTER TABLE "User" ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Existing rows: align updatedAt with createdAt
UPDATE "User" SET "updatedAt" = "createdAt";

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
