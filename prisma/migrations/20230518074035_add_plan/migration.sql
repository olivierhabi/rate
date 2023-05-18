-- AlterTable
ALTER TABLE "User" ADD COLUMN     "planId" INTEGER;

-- CreateTable
CREATE TABLE "Plan" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "ReqPerMonth" TEXT NOT NULL,
    "ReqPerSec" TEXT NOT NULL,

    CONSTRAINT "Plan_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan"("id") ON DELETE SET NULL ON UPDATE CASCADE;
