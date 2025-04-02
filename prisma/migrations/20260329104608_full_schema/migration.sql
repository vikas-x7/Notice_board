/*
  Warnings:

  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.
  - Made the column `name` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'STUDENT');

-- CreateEnum
CREATE TYPE "Category" AS ENUM ('ACADEMIC', 'PLACEMENT', 'EVENTS', 'SCHOLARSHIPS', 'SPORTS', 'HOSTEL', 'GENERAL');

-- CreateEnum
CREATE TYPE "Urgency" AS ENUM ('URGENT', 'IMPORTANT', 'NORMAL');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "branch" TEXT,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "department" TEXT,
ADD COLUMN     "isVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'STUDENT',
ADD COLUMN     "rollNo" TEXT,
ADD COLUMN     "tempPassword" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "year" TEXT,
ALTER COLUMN "name" SET NOT NULL;

-- CreateTable
CREATE TABLE "Notice" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" "Category" NOT NULL,
    "urgency" "Urgency" NOT NULL DEFAULT 'NORMAL',
    "expiryDate" TIMESTAMP(3),
    "isPinned" BOOLEAN NOT NULL DEFAULT false,
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    "fileUrl" TEXT,
    "fileName" TEXT,
    "authorId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Notice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bookmark" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "noticeId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Bookmark_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscription" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "category" "Category" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Notice_category_idx" ON "Notice"("category");

-- CreateIndex
CREATE INDEX "Notice_urgency_idx" ON "Notice"("urgency");

-- CreateIndex
CREATE INDEX "Notice_isArchived_idx" ON "Notice"("isArchived");

-- CreateIndex
CREATE INDEX "Notice_isPinned_idx" ON "Notice"("isPinned");

-- CreateIndex
CREATE UNIQUE INDEX "Bookmark_userId_noticeId_key" ON "Bookmark"("userId", "noticeId");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_userId_category_key" ON "Subscription"("userId", "category");

-- AddForeignKey
ALTER TABLE "Notice" ADD CONSTRAINT "Notice_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bookmark" ADD CONSTRAINT "Bookmark_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bookmark" ADD CONSTRAINT "Bookmark_noticeId_fkey" FOREIGN KEY ("noticeId") REFERENCES "Notice"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
