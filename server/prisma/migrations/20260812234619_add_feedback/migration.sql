-- CreateEnum
CREATE TYPE "FeedbackType" AS ENUM ('PROBLEM', 'IDEA', 'OTHER');

-- CreateEnum
CREATE TYPE "FeedbackStatus" AS ENUM ('NEW', 'REVIEWING', 'PLANNED', 'IN_PROGRESS', 'COMPLETED', 'DECLINED');

-- CreateTable
CREATE TABLE "Feedback" (
    "id" TEXT NOT NULL,
    "type" "FeedbackType" NOT NULL,
    "area" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "details" TEXT NOT NULL,
    "submittedByName" TEXT NOT NULL,
    "contactEmail" TEXT,
    "pagePath" TEXT,
    "userAgent" TEXT,
    "viewportWidth" INTEGER,
    "viewportHeight" INTEGER,
    "status" "FeedbackStatus" NOT NULL DEFAULT 'NEW',
    "emailSentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Feedback_pkey" PRIMARY KEY ("id")
);
