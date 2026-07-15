/*
  Warnings:

  - You are about to drop the column `goalWeight` on the `weight` table. All the data in the column will be lost.
  - You are about to alter the column `weight` on the `weight` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `Decimal(3,1)`.

*/
-- AlterTable
ALTER TABLE "weight" DROP COLUMN "goalWeight",
ALTER COLUMN "weight" SET DATA TYPE DECIMAL(3,1);
