/*
  Warnings:

  - Added the required column `text` to the `AcceptedAnswer` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_AcceptedAnswer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "questionId" TEXT NOT NULL,
    "text" TEXT NOT NULL
);
INSERT INTO "new_AcceptedAnswer" ("id", "questionId") SELECT "id", "questionId" FROM "AcceptedAnswer";
DROP TABLE "AcceptedAnswer";
ALTER TABLE "new_AcceptedAnswer" RENAME TO "AcceptedAnswer";
CREATE TABLE "new_Question" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "gameId" TEXT NOT NULL,
    "img" TEXT,
    "text" TEXT NOT NULL
);
INSERT INTO "new_Question" ("gameId", "id", "img", "text") SELECT "gameId", "id", "img", "text" FROM "Question";
DROP TABLE "Question";
ALTER TABLE "new_Question" RENAME TO "Question";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
