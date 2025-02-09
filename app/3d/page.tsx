"use client";

import type { Drawer, Item } from "@prisma/client";
import { ExplodedView } from "../grid/ExplodedView";
import { Header } from "../components/Header";
import { useState, useEffect } from "react";
import { getDrawers, getItems } from "../actions";

type ItemWithDrawer = Item & {
  Drawer: Drawer | null;
};

export default function ThreeDPage() {
  const [items, setItems] = useState<ItemWithDrawer[]>([]);
  const [drawers, setDrawers] = useState<Drawer[]>([]);
  const [selectedDrawerId, setSelectedDrawerId] = useState<number | null>(null);

  // Load data on mount
  useEffect(() => {
    async function loadData() {
      try {
        const [fetchedItems, fetchedDrawers] = await Promise.all([
          getItems(),
          getDrawers(),
        ]);

        setItems(fetchedItems);
        setDrawers(fetchedDrawers);
        if (fetchedDrawers.length > 0) {
          setSelectedDrawerId(fetchedDrawers[0].id);
        }
      } catch (error) {
        console.error("Error loading data:", error);
      }
    }

    loadData();
  }, []);

  const selectedDrawer = drawers.find((d) => d.id === selectedDrawerId);
  const drawerItems = items.filter(
    (item) => item.drawerId === selectedDrawerId
  );

  if (!selectedDrawer) return null;

  return (
    <main className="fixed inset-0 bg-black text-white">
      <Header />
      <div className="h-[calc(100vh-64px)] max-w-7xl mx-auto px-6 py-8">
        <ExplodedView
          drawer={selectedDrawer}
          drawers={drawers}
          items={drawerItems}
          onDrawerChange={setSelectedDrawerId}
        />
      </div>
    </main>
  );
}
