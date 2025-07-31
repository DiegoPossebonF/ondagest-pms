/*
  Warnings:

  - A unique constraint covering the columns `[publicId]` on the table `Booking` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "publicId" TEXT NOT NULL DEFAULT gen_random_uuid();

-- CreateIndex
CREATE UNIQUE INDEX "Booking_publicId_key" ON "Booking"("publicId");
