/*
  Warnings:

  - You are about to drop the `Item` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Item";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Drawer" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "locationId" INTEGER NOT NULL,
    CONSTRAINT "Drawer_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DrawerGridLayout" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "drawerId" INTEGER NOT NULL,
    "rows" INTEGER NOT NULL DEFAULT 10,
    "columns" INTEGER NOT NULL DEFAULT 10,
    "cellWidth" REAL NOT NULL DEFAULT 1.0,
    "cellHeight" REAL NOT NULL DEFAULT 1.0,
    CONSTRAINT "DrawerGridLayout_drawerId_fkey" FOREIGN KEY ("drawerId") REFERENCES "Drawer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ItemType" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "baseWidth" INTEGER NOT NULL DEFAULT 1,
    "baseHeight" INTEGER NOT NULL DEFAULT 1,
    "category" TEXT,
    "tags" TEXT
);

-- CreateTable
CREATE TABLE "DrawerItem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "drawerId" INTEGER NOT NULL,
    "itemTypeId" INTEGER NOT NULL,
    "stackOrder" INTEGER NOT NULL DEFAULT 0,
    "parentItemId" INTEGER,
    CONSTRAINT "DrawerItem_drawerId_fkey" FOREIGN KEY ("drawerId") REFERENCES "Drawer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "DrawerItem_itemTypeId_fkey" FOREIGN KEY ("itemTypeId") REFERENCES "ItemType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "DrawerItem_parentItemId_fkey" FOREIGN KEY ("parentItemId") REFERENCES "DrawerItem" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "OccupiedCell" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "drawerItemId" INTEGER NOT NULL,
    "row" INTEGER NOT NULL,
    "column" INTEGER NOT NULL,
    CONSTRAINT "OccupiedCell_drawerItemId_fkey" FOREIGN KEY ("drawerItemId") REFERENCES "DrawerItem" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DrawerItemLog" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "drawerItemId" INTEGER NOT NULL,
    "actionType" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB
);

-- CreateIndex
CREATE UNIQUE INDEX "DrawerGridLayout_drawerId_key" ON "DrawerGridLayout"("drawerId");

-- CreateIndex
CREATE UNIQUE INDEX "OccupiedCell_drawerItemId_row_column_key" ON "OccupiedCell"("drawerItemId", "row", "column");
