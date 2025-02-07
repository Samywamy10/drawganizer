"use client";

import { useEffect, useState } from "react";
import GridView from "./GridView";
import { getItems, getDrawers } from "../actions";
import { ItemWithDrawer } from "../types";
import { Drawer } from "@prisma/client";

export default function GridPage() {
  const [items, setItems] = useState<ItemWithDrawer[]>([]);
  const [drawers, setDrawers] = useState<Drawer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [itemsData, drawersData] = await Promise.all([
          getItems(),
          getDrawers(),
        ]);
        setItems(itemsData);
        setDrawers(drawersData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-6 pt-8">
        {loading ? (
          <div>Loading...</div>
        ) : (
          <GridView items={items} drawers={drawers} />
        )}
      </div>
    </main>
  );
}
