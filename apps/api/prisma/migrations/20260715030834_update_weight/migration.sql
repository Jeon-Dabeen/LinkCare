/*
  Warnings:

  - You are about to alter the column `height` on the `weight` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `Decimal(4,1)`.
  - You are about to alter the column `bmi` on the `weight` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `Decimal(4,1)`.

*/
-- AlterTable
ALTER TABLE "weight" ALTER COLUMN "height" SET DATA TYPE DECIMAL(4,1),
ALTER COLUMN "weight" SET DATA TYPE DECIMAL(4,1),
ALTER COLUMN "bmi" SET DATA TYPE DECIMAL(4,1);
