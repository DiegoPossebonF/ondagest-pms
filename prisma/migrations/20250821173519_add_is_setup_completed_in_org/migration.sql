/*
  Warnings:

  - You are about to drop the column `invoiceMessageReceipt` on the `Organization` table. All the data in the column will be lost.
  - You are about to drop the column `invoiceMessageVoucher` on the `Organization` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Organization" DROP COLUMN "invoiceMessageReceipt",
DROP COLUMN "invoiceMessageVoucher",
ADD COLUMN     "isSetupCompleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "sharingMessageReceipt" TEXT,
ADD COLUMN     "sharingMessageVoucher" TEXT;
