"use client";

import { useState } from "react";
import { addItem, deleteItem } from "./actions";
import { ItemWithDrawer } from "./types";
import { ItemSearch } from "./ItemSearch";
import { DrawerSection } from "./DrawerSection";

interface ItemListProps {
  items: ItemWithDrawer[];
}

const ItemList: React.FC<ItemListProps> = ({ items }) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Group items by drawer with filtering
  const groupedItems = items.reduce(
    (acc, item) => {
      // Ensure Drawer is not null
      if (!item.Drawer) return acc;

      // Apply filtering at the item level
      const matchesSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.Drawer.name.toLowerCase().includes(searchTerm.toLowerCase());

      if (matchesSearch) {
        if (!acc[item.Drawer.id]) {
          acc[item.Drawer.id] = {
            drawer: {
              id: item.Drawer.id,
              name: item.Drawer.name,
              drawerWidth: item.Drawer.drawerWidth,
              drawerDepth: item.Drawer.drawerDepth,
              drawerHeight: item.Drawer.drawerHeight,
            },
            items: [],
          };
        }
        acc[item.Drawer.id].items.push(item);
      }

      return acc;
    },
    {} as {
      [drawerId: number]: {
        drawer: {
          id: number;
          name: string;
          drawerWidth: number;
          drawerDepth: number;
          drawerHeight: number;
        };
        items: ItemWithDrawer[];
      };
    }
  );

  const handleAddItem = async (drawerId: number, name: string) => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("drawerId", drawerId.toString());
    await addItem(formData);
  };

  return (
    <div>
      <div className="mb-8">
        <ItemSearch searchTerm={searchTerm} onSearchChange={setSearchTerm} />
      </div>

      {Object.values(groupedItems).map(({ drawer, items }) => (
        <DrawerSection
          key={drawer.id}
          drawer={drawer}
          items={items}
          onAddItem={handleAddItem}
          onDeleteItem={deleteItem}
        />
      ))}
    </div>
  );
};

export default ItemList;
