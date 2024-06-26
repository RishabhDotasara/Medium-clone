-- DropIndex
DROP INDEX "Follow_id_key";

-- AlterTable
ALTER TABLE "Follow" ADD CONSTRAINT "Follow_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "generator" TEXT NOT NULL,
    "recepients" TEXT[],

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);
