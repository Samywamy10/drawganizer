/*
  Warnings:

  - You are about to drop the column `drawerColumn` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `drawerRow` on the `Item` table. All the data in the column will be lost.
  - Added the required column `drawerHeight` to the `Drawer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `drawerWidth` to the `Drawer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `drawerHeight` to the `Item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `drawerStartColumn` to the `Item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `drawerStartRow` to the `Item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `drawerWidth` to the `Item` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Drawer" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "drawerWidth" INTEGER NOT NULL,
    "drawerHeight" INTEGER NOT NULL
);
INSERT INTO "new_Drawer" ("id", "name") SELECT "id", "name" FROM "Drawer";
DROP TABLE "Drawer";
ALTER TABLE "new_Drawer" RENAME TO "Drawer";
CREATE TABLE "new_Item" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "drawerId" INTEGER,
    "drawerStartRow" INTEGER NOT NULL,
    "drawerStartColumn" INTEGER NOT NULL,
    "drawerWidth" INTEGER NOT NULL,
    "drawerHeight" INTEGER NOT NULL,
    CONSTRAINT "Item_drawerId_fkey" FOREIGN KEY ("drawerId") REFERENCES "Drawer" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Item" ("drawerId", "id", "name") SELECT "drawerId", "id", "name" FROM "Item";
DROP TABLE "Item";
ALTER TABLE "new_Item" RENAME TO "Item";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
