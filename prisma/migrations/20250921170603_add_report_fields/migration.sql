/*
  Warnings:

  - Added the required column `doc_name` to the `reports` table without a default value. This is not possible if the table is not empty.
  - Added the required column `informazioni` to the `reports` table without a default value. This is not possible if the table is not empty.
  - Added the required column `note` to the `reports` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."ReportType" AS ENUM ('REFERTO', 'NOTA', 'CHIRURGIA');

-- AlterTable
ALTER TABLE "public"."reports" ADD COLUMN     "doc_name" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "informazioni" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "note" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "report_type" "public"."ReportType" NOT NULL DEFAULT 'REFERTO';
