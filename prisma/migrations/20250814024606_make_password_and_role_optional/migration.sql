-- AlterTable
ALTER TABLE "public"."User" ALTER COLUMN "password" DROP NOT NULL,
ALTER COLUMN "role" DROP NOT NULL;
