/*
  Warnings:

  - A unique constraint covering the columns `[postID]` on the table `BookMark` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "BookMark_postID_key" ON "BookMark"("postID");
