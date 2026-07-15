/*
  Warnings:

  - Added the required column `bmi` to the `weight` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "weight" ADD COLUMN     "bmi" INTEGER NOT NULL;
