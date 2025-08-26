/*
  Warnings:

  - A unique constraint covering the columns `[name,numberOfPeople,typeId,organizationId]` on the table `Rate` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."Rate_name_numberOfPeople_organizationId_key";

-- CreateIndex
CREATE UNIQUE INDEX "Rate_name_numberOfPeople_typeId_organizationId_key" ON "public"."Rate"("name", "numberOfPeople", "typeId", "organizationId");
