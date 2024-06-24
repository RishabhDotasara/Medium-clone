-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "memberOnly" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "BookMark" (
    "id" TEXT NOT NULL,
    "byID" TEXT NOT NULL,
    "postID" TEXT NOT NULL,

    CONSTRAINT "BookMark_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "BookMark" ADD CONSTRAINT "BookMark_byID_fkey" FOREIGN KEY ("byID") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
