-- CreateTable
CREATE TABLE "Organization" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "logoUrl" TEXT,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "website" TEXT,
    "facebook" TEXT,
    "instagram" TEXT,
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "zipCode" TEXT,
    "country" TEXT,
    "cpf" TEXT,
    "cnpj" TEXT,
    "rules" TEXT,
    "invoiceMessageVoucher" TEXT,
    "invoiceMessageReceipt" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
