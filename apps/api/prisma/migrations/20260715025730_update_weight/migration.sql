/*
  Warnings:

  - Changed the type of `weightDate` on the `weight` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "weight" DROP COLUMN "weightDate",
ADD COLUMN     "weightDate" DATE NOT NULL;
