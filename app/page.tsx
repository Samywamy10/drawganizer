"use client";

import { useEffect, useState } from "react";
import ItemList from "./ItemList";
import { ItemWithDrawer } from "./types";
import { getItems } from "./actions";

export default function Home() {
  const [items, setItems] = useState<ItemWithDrawer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const data = await getItems();
        console.log(data);
        setItems(data);
      } catch (error) {
        console.error("Failed to fetch items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-6 pt-8">
        {loading ? <div>Loading...</div> : <ItemList items={items} />}
      </div>
    </main>
  );
}
