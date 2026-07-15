/*
  Warnings:

  - Added the required column `weightDate` to the `weight` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "weight" ADD COLUMN     "weightDate" TEXT NOT NULL;
