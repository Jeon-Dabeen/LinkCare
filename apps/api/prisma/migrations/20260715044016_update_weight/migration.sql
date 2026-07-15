/*
  Warnings:

  - You are about to drop the `weight` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "weight";

-- CreateTable
CREATE TABLE "Weight" (
    "id" SERIAL NOT NULL,
    "height" DECIMAL(4,1) NOT NULL,
    "weight" DECIMAL(4,1) NOT NULL,
    "weightDate" DATE NOT NULL,
    "bmi" DECIMAL(4,1) NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Weight_pkey" PRIMARY KEY ("id")
);
