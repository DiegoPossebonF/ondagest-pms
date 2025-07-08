-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Rate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "value" REAL NOT NULL,
    "numberOfPeople" INTEGER NOT NULL,
    "typeId" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Rate_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "UnitType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Rate" ("createdAt", "id", "name", "numberOfPeople", "typeId", "updatedAt", "value") SELECT "createdAt", "id", "name", "numberOfPeople", "typeId", "updatedAt", "value" FROM "Rate";
DROP TABLE "Rate";
ALTER TABLE "new_Rate" RENAME TO "Rate";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
