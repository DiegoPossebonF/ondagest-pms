-- AlterTable
ALTER TABLE "public"."Booking" ALTER COLUMN "organizationId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."Discount" ALTER COLUMN "organizationId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."Guest" ALTER COLUMN "organizationId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."Payment" ALTER COLUMN "organizationId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."Rate" ALTER COLUMN "organizationId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."Service" ALTER COLUMN "organizationId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."Unit" ALTER COLUMN "organizationId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."UnitType" ALTER COLUMN "organizationId" DROP NOT NULL;
