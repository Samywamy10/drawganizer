/*
  Warnings:

  - Added the required column `drawerHeight` to the `Drawer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `itemHeight` to the `Item` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Drawer" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "drawerWidth" INTEGER NOT NULL,
    "drawerDepth" INTEGER NOT NULL,
    "drawerHeight" INTEGER NOT NULL
);
INSERT INTO "new_Drawer" ("drawerDepth", "drawerWidth", "id", "name") SELECT "drawerDepth", "drawerWidth", "id", "name" FROM "Drawer";
DROP TABLE "Drawer";
ALTER TABLE "new_Drawer" RENAME TO "Drawer";
CREATE TABLE "new_Item" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "drawerId" INTEGER,
    "drawerStartRow" INTEGER NOT NULL,
    "drawerStartColumn" INTEGER NOT NULL,
    "itemWidth" INTEGER NOT NULL,
    "itemDepth" INTEGER NOT NULL,
    "itemHeight" INTEGER NOT NULL,
    CONSTRAINT "Item_drawerId_fkey" FOREIGN KEY ("drawerId") REFERENCES "Drawer" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Item" ("drawerId", "drawerStartColumn", "drawerStartRow", "id", "itemDepth", "itemWidth", "name") SELECT "drawerId", "drawerStartColumn", "drawerStartRow", "id", "itemDepth", "itemWidth", "name" FROM "Item";
DROP TABLE "Item";
ALTER TABLE "new_Item" RENAME TO "Item";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
