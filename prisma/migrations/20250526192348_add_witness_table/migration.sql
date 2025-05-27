-- CreateTable
CREATE TABLE "Witness" (
    "id" SERIAL NOT NULL,
    "fullName" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "rank" TEXT NOT NULL,
    "dateFrom" TIMESTAMP(3) NOT NULL,
    "dateTo" TIMESTAMP(3),
    "birthDate" TIMESTAMP(3) NOT NULL,
    "phone" TEXT NOT NULL,
    "document" TEXT NOT NULL,

    CONSTRAINT "Witness_pkey" PRIMARY KEY ("id")
);
