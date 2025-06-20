/*
  Warnings:

  - Made the column `cpf` on table `Guest` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Guest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "cpf" TEXT NOT NULL,
    "city" TEXT,
    "carPlate" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Guest" ("carPlate", "city", "cpf", "createdAt", "email", "id", "name", "phone", "updatedAt") SELECT "carPlate", "city", "cpf", "createdAt", "email", "id", "name", "phone", "updatedAt" FROM "Guest";
DROP TABLE "Guest";
ALTER TABLE "new_Guest" RENAME TO "Guest";
CREATE UNIQUE INDEX "Guest_email_key" ON "Guest"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
