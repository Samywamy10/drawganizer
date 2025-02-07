"use client";

import { useState } from "react";
import type { Drawer } from "@prisma/client";
import { ItemWithDrawer } from "./types";
import { AddItemLine } from "./AddLineItem";
import { DrawerItems } from "./DrawerItems";
import { addItem } from "./actions";

interface DrawerSection {
  drawer: Drawer;
  items: ItemWithDrawer[];
  onAddItem: (drawerId: number, name: string) => Promise<void>;
  onDeleteItem: (itemId: number) => Promise<void>;
}

export const DrawerSection: React.FC<DrawerSection> = ({
  drawer,
  items,
  onAddItem,
  onDeleteItem,
}) => {
  const handleAddPlaceholderItem = async (
    drawerId: number,
    name: string,
    position: { row: number; col: number },
    size: { width: number; height: number }
  ) => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("drawerId", drawerId.toString());
    await addItem(formData, position, size);
  };

  return (
    <div className="mb-6">
      <div className="text-2xl font-bold text-white mb-3 gradient-text">
        {drawer.name}
      </div>

      <div className="pl-4">
        <DrawerItems items={items} onDeleteItem={onDeleteItem} />
        <AddItemLine
          drawer={drawer}
          onAddPlaceholderItem={handleAddPlaceholderItem}
        />
      </div>
    </div>
  );
};
