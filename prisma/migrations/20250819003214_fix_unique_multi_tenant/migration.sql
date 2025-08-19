/*
  Warnings:

  - A unique constraint covering the columns `[email,organizationId]` on the table `Guest` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,organizationId]` on the table `Rate` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,organizationId]` on the table `Unit` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,organizationId]` on the table `UnitType` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."Guest_email_key";

-- DropIndex
DROP INDEX "public"."Unit_name_key";

-- DropIndex
DROP INDEX "public"."UnitType_name_key";

-- CreateIndex
CREATE UNIQUE INDEX "Guest_email_organizationId_key" ON "public"."Guest"("email", "organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "Rate_name_organizationId_key" ON "public"."Rate"("name", "organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "Unit_name_organizationId_key" ON "public"."Unit"("name", "organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "UnitType_name_organizationId_key" ON "public"."UnitType"("name", "organizationId");
