-- CreateTable
CREATE TABLE "weight" (
    "id" SERIAL NOT NULL,
    "height" INTEGER NOT NULL,
    "weight" INTEGER NOT NULL,
    "goalWeight" INTEGER NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "weight_pkey" PRIMARY KEY ("id")
);
