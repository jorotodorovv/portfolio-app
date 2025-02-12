/*
  Warnings:

  - A unique constraint covering the columns `[url]` on the table `Post` will be added. If there are existing duplicate values, this will fail.
  - Made the column `url` on table `Post` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Post" ALTER COLUMN "url" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Post_url_key" ON "Post"("url");
