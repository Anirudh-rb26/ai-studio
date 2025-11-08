/*
  Warnings:

  - Added the required column `updatedAt` to the `Generation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Generation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "prompt" TEXT NOT NULL,
    "style" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'completed',
    "userId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Generation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Generation" ("createdAt", "id", "imageUrl", "prompt", "style", "userId") SELECT "createdAt", "id", "imageUrl", "prompt", "style", "userId" FROM "Generation";
DROP TABLE "Generation";
ALTER TABLE "new_Generation" RENAME TO "Generation";
CREATE INDEX "Generation_userId_idx" ON "Generation"("userId");
CREATE INDEX "Generation_createdAt_idx" ON "Generation"("createdAt");
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_User" ("email", "id", "password") SELECT "email", "id", "password" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
