/*
  Warnings:

  - You are about to drop the column `drawerHeight` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `drawerWidth` on the `Item` table. All the data in the column will be lost.
  - Added the required column `itemDepth` to the `Item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `itemWidth` to the `Item` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Item" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "drawerId" INTEGER,
    "drawerStartRow" INTEGER NOT NULL,
    "drawerStartColumn" INTEGER NOT NULL,
    "itemWidth" INTEGER NOT NULL,
    "itemDepth" INTEGER NOT NULL,
    CONSTRAINT "Item_drawerId_fkey" FOREIGN KEY ("drawerId") REFERENCES "Drawer" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Item" ("drawerId", "drawerStartColumn", "drawerStartRow", "id", "name") SELECT "drawerId", "drawerStartColumn", "drawerStartRow", "id", "name" FROM "Item";
DROP TABLE "Item";
ALTER TABLE "new_Item" RENAME TO "Item";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
