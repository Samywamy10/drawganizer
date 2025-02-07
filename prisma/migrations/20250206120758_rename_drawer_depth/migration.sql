/*
  Warnings:

  - You are about to drop the column `drawerHeight` on the `Drawer` table. All the data in the column will be lost.
  - Added the required column `drawerDepth` to the `Drawer` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Drawer" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "drawerWidth" INTEGER NOT NULL,
    "drawerDepth" INTEGER NOT NULL
);
INSERT INTO "new_Drawer" ("drawerWidth", "id", "name") SELECT "drawerWidth", "id", "name" FROM "Drawer";
DROP TABLE "Drawer";
ALTER TABLE "new_Drawer" RENAME TO "Drawer";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
