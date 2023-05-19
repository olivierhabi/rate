/*
  Warnings:

  - You are about to drop the column `body` on the `Sms` table. All the data in the column will be lost.
  - You are about to drop the column `recipient_email` on the `Sms` table. All the data in the column will be lost.
  - You are about to drop the column `sender_email` on the `Sms` table. All the data in the column will be lost.
  - You are about to drop the column `subject` on the `Sms` table. All the data in the column will be lost.
  - Added the required column `message` to the `Sms` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `Sms` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sender` to the `Sms` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Sms" DROP COLUMN "body",
DROP COLUMN "recipient_email",
DROP COLUMN "sender_email",
DROP COLUMN "subject",
ADD COLUMN     "message" TEXT NOT NULL,
ADD COLUMN     "phone" TEXT NOT NULL,
ADD COLUMN     "sender" TEXT NOT NULL;
