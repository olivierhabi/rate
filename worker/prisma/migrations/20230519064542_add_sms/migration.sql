-- CreateTable
CREATE TABLE "Sms" (
    "id" SERIAL NOT NULL,
    "sender_email" TEXT NOT NULL,
    "recipient_email" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "status" "STATUS_TYPE" NOT NULL DEFAULT 'PENDING',
    "userId" INTEGER,

    CONSTRAINT "Sms_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Sms" ADD CONSTRAINT "Sms_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
