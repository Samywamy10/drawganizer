"use client";

import { useState } from "react";
import { ItemSearch } from "../ItemSearch";
import { DrawerGrid } from "./DrawerGrid";
import type { ItemWithDrawer } from "../types";
import type { Drawer } from "@prisma/client";

interface GridViewProps {
  items: ItemWithDrawer[];
  drawers: Drawer[];
}

export default function GridView({ items, drawers }: GridViewProps) {
  const [searchTerm, setSearchTerm] = useState("");

  // Group items by drawer
  const drawerItems = drawers.map((drawer) => ({
    drawer,
    items: items.filter((item) => item.drawerId === drawer.id),
  }));

  // Filter drawers based on search
  const filteredDrawerItems = drawerItems.filter(({ drawer, items }) => {
    return (
      items.some((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      ) || drawer.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div>
      <div className="mb-8">
        <ItemSearch searchTerm={searchTerm} onSearchChange={setSearchTerm} />
      </div>

      <div>
        {filteredDrawerItems.map(({ drawer, items }) => (
          <DrawerGrid
            key={drawer.id}
            drawer={drawer}
            items={items}
            searchTerm={searchTerm}
          />
        ))}
      </div>
    </div>
  );
}
