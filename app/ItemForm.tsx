"use client";

import { useState } from "react";
import { addItem } from "./actions";

interface ItemFormProps {
  drawers: {
    id: number;
    name: string;
    drawerWidth: number;
    drawerDepth: number;
    drawerHeight: number;
  }[];
}

const ItemForm: React.FC<ItemFormProps> = ({ drawers }) => {
  const [newItemName, setNewItemName] = useState("");
  const [selectedDrawerId, setSelectedDrawerId] = useState<number | null>(null);
  const [position, setPosition] = useState({ row: 1, col: 1 });
  const [size, setSize] = useState({ width: 1, depth: 1, height: 1 });
  const [error, setError] = useState("");

  const selectedDrawer = drawers.find((d) => d.id === selectedDrawerId);

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newItemName && selectedDrawerId !== null) {
      // Validate position and size
      if (!selectedDrawer) {
        setError("Please select a drawer");
        return;
      }

      const maxRow = selectedDrawer.drawerDepth - size.depth + 1;
      const maxCol = selectedDrawer.drawerWidth - size.width + 1;

      if (
        position.row < 1 ||
        position.row > maxRow ||
        position.col < 1 ||
        position.col > maxCol
      ) {
        setError("Invalid position for item size");
        return;
      }

      const formData = new FormData();
      formData.append("name", newItemName);
      formData.append("drawerId", selectedDrawerId.toString());
      formData.append("drawerStartRow", position.row.toString());
      formData.append("drawerStartColumn", position.col.toString());
      formData.append("itemWidth", size.width.toString());
      formData.append("itemDepth", size.depth.toString());
      formData.append("itemHeight", size.height.toString());

      try {
        await addItem(formData);
        setNewItemName("");
        setSelectedDrawerId(null);
        setPosition({ row: 1, col: 1 });
        setSize({ width: 1, depth: 1, height: 1 });
        setError("");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to add item");
      }
    } else {
      setError("Please fill in all fields");
    }
  };

  return (
    <form onSubmit={handleAddItem} className="mb-6 space-y-4">
      <div className="flex flex-wrap gap-4">
        <input
          type="text"
          placeholder="Item Name"
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          className="p-2 rounded bg-[#1a1a1a] text-white border border-gray-700 
          focus:outline-none focus:ring-2 focus:ring-blue-500/50"
        />

        <select
          value={selectedDrawerId || ""}
          onChange={(e) => setSelectedDrawerId(Number(e.target.value))}
          className="p-2 rounded bg-[#1a1a1a] text-white border border-gray-700
          focus:outline-none focus:ring-2 focus:ring-blue-500/50"
        >
          <option value="" disabled>
            Select Drawer
          </option>
          {drawers.map((drawer) => (
            <option key={drawer.id} value={drawer.id}>
              {drawer.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-wrap gap-4">
        <div className="space-y-2">
          <label className="block text-sm text-gray-400">Position</label>
          <div className="flex gap-2">
            <input
              type="number"
              min="1"
              max={selectedDrawer?.drawerDepth || 1}
              value={position.row}
              onChange={(e) =>
                setPosition({ ...position, row: Number(e.target.value) })
              }
              className="w-20 p-2 rounded bg-[#1a1a1a] text-white border border-gray-700
              focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              placeholder="Row"
            />
            <input
              type="number"
              min="1"
              max={selectedDrawer?.drawerWidth || 1}
              value={position.col}
              onChange={(e) =>
                setPosition({ ...position, col: Number(e.target.value) })
              }
              className="w-20 p-2 rounded bg-[#1a1a1a] text-white border border-gray-700
              focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              placeholder="Col"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm text-gray-400">Size</label>
          <div className="flex gap-2">
            <input
              type="number"
              min="1"
              max={selectedDrawer?.drawerWidth || 1}
              value={size.width}
              onChange={(e) =>
                setSize({ ...size, width: Number(e.target.value) })
              }
              className="w-20 p-2 rounded bg-[#1a1a1a] text-white border border-gray-700
              focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              placeholder="Width"
            />
            <input
              type="number"
              min="1"
              max={selectedDrawer?.drawerDepth || 1}
              value={size.depth}
              onChange={(e) =>
                setSize({ ...size, depth: Number(e.target.value) })
              }
              className="w-20 p-2 rounded bg-[#1a1a1a] text-white border border-gray-700
              focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              placeholder="Depth"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm text-gray-400">Height</label>
          <div className="flex gap-2">
            <input
              type="number"
              min="1"
              max={selectedDrawer?.drawerHeight || 1}
              value={size.height}
              onChange={(e) =>
                setSize({ ...size, height: Number(e.target.value) })
              }
              className="w-20 p-2 rounded bg-[#1a1a1a] text-white border border-gray-700
              focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              placeholder="Height"
            />
          </div>
        </div>
      </div>

      <div className="text-sm text-gray-400">
        Size: {size.width}×{size.depth}×{size.height} at position (
        {position.row}, {position.col})
      </div>

      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded
        transition-colors duration-200"
      >
        Add Item
      </button>

      {error && <p className="text-red-500 mt-2">{error}</p>}
    </form>
  );
};

export default ItemForm;
