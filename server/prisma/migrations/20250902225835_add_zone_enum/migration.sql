/*
  Warnings:

  - The `currentLocation` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "public"."Zone" AS ENUM ('ER', 'ICU', 'WARD1', 'WARD2', 'OPD', 'LAB', 'PHARMACY', 'RECEPTION', 'THEATER', 'CAFETERIA', 'ADMIN_OFFICE', 'TRIAGE');

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "currentLocation",
ADD COLUMN     "currentLocation" "public"."Zone";
