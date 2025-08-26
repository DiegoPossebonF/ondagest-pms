/*
  Warnings:

  - A unique constraint covering the columns `[cpf,organizationId]` on the table `Guest` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,numberOfPeople,organizationId]` on the table `Rate` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."Rate_name_organizationId_key";

-- CreateIndex
CREATE UNIQUE INDEX "Guest_cpf_organizationId_key" ON "public"."Guest"("cpf", "organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "Rate_name_numberOfPeople_organizationId_key" ON "public"."Rate"("name", "numberOfPeople", "organizationId");
