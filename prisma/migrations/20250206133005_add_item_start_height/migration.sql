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
    "itemHeight" INTEGER NOT NULL,
    "startHeight" INTEGER NOT NULL DEFAULT 1,
    CONSTRAINT "Item_drawerId_fkey" FOREIGN KEY ("drawerId") REFERENCES "Drawer" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Item" ("drawerId", "drawerStartColumn", "drawerStartRow", "id", "itemDepth", "itemHeight", "itemWidth", "name") SELECT "drawerId", "drawerStartColumn", "drawerStartRow", "id", "itemDepth", "itemHeight", "itemWidth", "name" FROM "Item";
DROP TABLE "Item";
ALTER TABLE "new_Item" RENAME TO "Item";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
