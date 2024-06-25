/*
  Warnings:

  - A unique constraint covering the columns `[byID,postID]` on the table `BookMark` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "BookMark_postID_key";

-- CreateIndex
CREATE UNIQUE INDEX "BookMark_byID_postID_key" ON "BookMark"("byID", "postID");
