/*
  Warnings:

  - The values [CHIRURGIA] on the enum `ReportType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."ReportType_new" AS ENUM ('REFERTO', 'NOTA', 'ESAME');
ALTER TABLE "public"."reports" ALTER COLUMN "report_type" DROP DEFAULT;
ALTER TABLE "public"."reports" ALTER COLUMN "report_type" TYPE "public"."ReportType_new" USING ("report_type"::text::"public"."ReportType_new");
ALTER TYPE "public"."ReportType" RENAME TO "ReportType_old";
ALTER TYPE "public"."ReportType_new" RENAME TO "ReportType";
DROP TYPE "public"."ReportType_old";
ALTER TABLE "public"."reports" ALTER COLUMN "report_type" SET DEFAULT 'REFERTO';
COMMIT;
