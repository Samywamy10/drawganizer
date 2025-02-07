"use client";

import { useState, useRef } from "react";
import type { Drawer } from "@prisma/client";
import { addDrawer, deleteDrawer, updateDrawer } from "../actions";

interface DrawerManagerProps {
  drawers: Drawer[];
}

export function DrawerManager({ drawers }: DrawerManagerProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newDrawer, setNewDrawer] = useState({
    name: "",
    width: 8,
    depth: 8,
    height: 4,
  });
  const inputRef = useRef<HTMLInputElement>(null);
  const [editingDrawer, setEditingDrawer] = useState<{
    id: number;
    name: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", newDrawer.name);
    formData.append("width", newDrawer.width.toString());
    formData.append("depth", newDrawer.depth.toString());
    formData.append("height", newDrawer.height.toString());
    await addDrawer(formData);
    setIsAdding(false);
    setNewDrawer({ name: "", width: 8, depth: 8, height: 4 });
  };

  const handleUpdateDrawer = async () => {
    if (!editingDrawer || !editingDrawer.name.trim()) return;
    await updateDrawer(editingDrawer.id, editingDrawer.name);
    setEditingDrawer(null);
  };

  const GridPreview = ({ width, depth }: { width: number; depth: number }) => (
    <div
      className="grid gap-px bg-[#1a1a1a] p-2 rounded-lg"
      style={{
        gridTemplateColumns: `repeat(${width}, minmax(0, 1fr))`,
        gridTemplateRows: `repeat(${depth}, minmax(0, 1fr))`,
        aspectRatio: `${width} / ${depth}`,
      }}
    >
      {Array(width * depth)
        .fill(null)
        .map((_, i) => (
          <div
            key={i}
            className="bg-gray-800/20 border border-gray-700/20 aspect-square"
          />
        ))}
    </div>
  );

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold gradient-text">Manage Drawers</h2>
        <button
          onClick={() => {
            setIsAdding(true);
            setTimeout(() => inputRef.current?.focus(), 0);
          }}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg
          hover:bg-blue-600 transition-colors duration-200"
        >
          Add Drawer
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {drawers.map((drawer) => (
          <div
            key={drawer.id}
            className="bg-[#1a1a1a] rounded-lg p-4 group relative"
          >
            <div className="mb-2 flex items-center justify-between">
              {editingDrawer?.id === drawer.id ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleUpdateDrawer();
                  }}
                  className="flex-1 flex items-center gap-2 relative"
                >
                  <input
                    autoFocus
                    type="text"
                    value={editingDrawer.name}
                    onChange={(e) =>
                      setEditingDrawer({
                        ...editingDrawer,
                        name: e.target.value,
                      })
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Escape") setEditingDrawer(null);
                    }}
                    className="flex-1 p-1 bg-[#252525] rounded 
                    border border-gray-700 text-white text-sm
                    focus:outline-none focus:ring-2 focus:ring-blue-500/50
                    pr-8"
                  />
                  <button
                    type="button"
                    onClick={() => setEditingDrawer(null)}
                    className="absolute right-2 top-1/2 -translate-y-1/2
                    text-gray-400 hover:text-white transition-colors"
                  >
                    ✕
                  </button>
                </form>
              ) : (
                <>
                  <h3
                    className="font-medium text-white cursor-pointer hover:text-blue-400 transition-colors"
                    onClick={() =>
                      setEditingDrawer({ id: drawer.id, name: drawer.name })
                    }
                  >
                    {drawer.name}
                  </h3>
                  <button
                    onClick={() => deleteDrawer(drawer.id)}
                    className="opacity-0 group-hover:opacity-100 
                    bg-red-500/90 hover:bg-red-600 text-white rounded-full 
                    w-6 h-6 flex items-center justify-center text-sm
                    transition-all duration-200"
                  >
                    ✕
                  </button>
                </>
              )}
            </div>
            <GridPreview
              width={drawer.drawerWidth}
              depth={drawer.drawerDepth}
            />
            <div className="mt-2 text-sm text-gray-400">
              {drawer.drawerWidth}×{drawer.drawerDepth}×{drawer.drawerHeight}{" "}
              grid
            </div>
          </div>
        ))}
      </div>

      {isAdding && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-[#1a1a1a] rounded-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">Add New Drawer</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Drawer Name
                </label>
                <input
                  ref={inputRef}
                  type="text"
                  value={newDrawer.name}
                  onChange={(e) =>
                    setNewDrawer({ ...newDrawer, name: e.target.value })
                  }
                  className="w-full p-2 bg-[#252525] rounded 
                  border border-gray-700 text-white
                  focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  placeholder="e.g., Electronics Drawer"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Width (cells)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="24"
                    value={newDrawer.width}
                    onChange={(e) =>
                      setNewDrawer({
                        ...newDrawer,
                        width: Number(e.target.value),
                      })
                    }
                    className="w-full p-2 bg-[#252525] rounded 
                    border border-gray-700 text-white
                    focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Depth (cells)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="24"
                    value={newDrawer.depth}
                    onChange={(e) =>
                      setNewDrawer({
                        ...newDrawer,
                        depth: Number(e.target.value),
                      })
                    }
                    className="w-full p-2 bg-[#252525] rounded 
                    border border-gray-700 text-white
                    focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Height (cells)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="24"
                    value={newDrawer.height}
                    onChange={(e) =>
                      setNewDrawer({
                        ...newDrawer,
                        height: Number(e.target.value),
                      })
                    }
                    className="w-full p-2 bg-[#252525] rounded 
                    border border-gray-700 text-white
                    focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm text-gray-400 mb-2">
                  Preview
                </label>
                <GridPreview width={newDrawer.width} depth={newDrawer.depth} />
                <div className="mt-2 text-sm text-gray-400">
                  {newDrawer.width}×{newDrawer.depth}×{newDrawer.height} grid
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-4 py-2 text-gray-400 hover:text-white
                  transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg
                  hover:bg-blue-600 transition-colors duration-200"
                >
                  Add Drawer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
