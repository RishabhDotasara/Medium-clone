-- CreateTable
CREATE TABLE "Follow" (
    "id" TEXT NOT NULL,
    "followerID" TEXT NOT NULL,
    "followeeID" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Follow_id_key" ON "Follow"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Follow_followerID_followeeID_key" ON "Follow"("followerID", "followeeID");

-- AddForeignKey
ALTER TABLE "Follow" ADD CONSTRAINT "Follow_followeeID_fkey" FOREIGN KEY ("followeeID") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
