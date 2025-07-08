/*
  Warnings:

  - Made the column `updatedAt` on table `Contact` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "Precedence" AS ENUM ('primary', 'secondary');

-- AlterTable
ALTER TABLE "Contact" ALTER COLUMN "phoneNumber" DROP NOT NULL,
ALTER COLUMN "email" DROP NOT NULL,
ALTER COLUMN "updatedAt" SET NOT NULL;
