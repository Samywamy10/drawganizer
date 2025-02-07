"use client";

import { useState } from "react";
import { ItemWithDrawer } from "./types";

interface DrawerItemsProps {
  items: ItemWithDrawer[];
  onDeleteItem: (itemId: number) => Promise<void>;
}

export const DrawerItems: React.FC<DrawerItemsProps> = ({
  items,
  onDeleteItem,
}) => {
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);

  return (
    <>
      {items.map((item) => (
        <div
          key={item.id}
          className="py-2 px-3 hover:bg-[#1a1a1a] rounded-lg transition-colors group relative"
          onMouseEnter={() => setHoveredItem(item.id)}
          onMouseLeave={() => setHoveredItem(null)}
        >
          <span className="text-white group-hover:text-blue-400 transition-colors">
            {item.name} ({item.drawerStartRow}, {item.drawerStartColumn})
          </span>
          {hoveredItem === item.id && (
            <button
              onClick={() => onDeleteItem(item.id)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 
              bg-red-500 text-white rounded-full w-5 h-5 
              flex items-center justify-center 
              hover:bg-red-600 transition-colors text-xs"
            >
              ✕
            </button>
          )}
        </div>
      ))}
    </>
  );
};
