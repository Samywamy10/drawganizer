/*
  Warnings:

  - You are about to drop the `Location` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `locationId` on the `Item` table. All the data in the column will be lost.
  - Added the required column `drawerColumn` to the `Item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `drawerRow` to the `Item` table without a default value. This is not possible if the table is not empty.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Location";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Drawer" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Item" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "drawerId" INTEGER,
    "drawerRow" INTEGER NOT NULL,
    "drawerColumn" INTEGER NOT NULL,
    CONSTRAINT "Item_drawerId_fkey" FOREIGN KEY ("drawerId") REFERENCES "Drawer" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Item" ("id", "name") SELECT "id", "name" FROM "Item";
DROP TABLE "Item";
ALTER TABLE "new_Item" RENAME TO "Item";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
