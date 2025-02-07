"use client";

import { useState } from "react";
import type { Drawer } from "@prisma/client";
import { IconPicker } from "./components/IconPicker";
import { ColorPicker } from "./components/ColorPicker";

interface AddItemLineProps {
  drawer: Drawer;
  onAddPlaceholderItem: (
    drawerId: number,
    name: string,
    position: { row: number; col: number },
    size: { width: number; height: number; depth: number },
    icon?: string,
    color?: string
  ) => void;
}

export const AddItemLine: React.FC<AddItemLineProps> = ({
  drawer,
  onAddPlaceholderItem,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState("");
  const [position, setPosition] = useState({ row: 1, col: 1 });
  const [size, setSize] = useState({ width: 1, height: 1, depth: 1 });
  const [icon, setIcon] = useState<string>();
  const [color, setColor] = useState<string>();

  const handleSubmit = (e?: React.KeyboardEvent) => {
    if (e && e.key !== "Enter") return;

    const maxRow = drawer.drawerHeight - size.height + 1;
    const maxCol = drawer.drawerWidth - size.width + 1;

    if (
      position.row < 1 ||
      position.row > maxRow ||
      position.col < 1 ||
      position.col > maxCol
    ) {
      return; // Invalid position
    }

    if (name.trim()) {
      onAddPlaceholderItem(drawer.id, name, position, size, icon, color);
      setName("");
      setPosition({ row: 1, col: 1 });
      setSize({ width: 1, height: 1, depth: 1 });
      setIcon(undefined);
      setColor(undefined);
      setIsAdding(false);
    }
  };

  if (!isAdding) {
    return (
      <div className="relative group mt-2">
        <div
          className="absolute -left-6 -right-2 h-8 top-1/2 -translate-y-1/2 cursor-pointer z-0"
          onClick={() => setIsAdding(true)}
        ></div>
        <div
          className={`relative h-1 w-full opacity-0 group-hover:opacity-100 
          transition-opacity duration-300 ease-in-out`}
        >
          <div
            className="absolute left-[-24px] top-1/2 transform -translate-y-1/2 
            w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center 
            cursor-pointer hover:scale-110 transition-all z-10"
          >
            <span className="text-white text-xs font-bold">+</span>
          </div>
          <div
            className="absolute inset-0 
            bg-gradient-to-r from-blue-500/20 via-blue-500/50 to-purple-500/50 
            rounded-full h-1 top-1/2 transform -translate-y-1/2"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="mt-2 flex items-center gap-4">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={handleSubmit}
        placeholder="Item name"
        className="flex-1 p-2 bg-[#1e1e1e] rounded-lg 
        border border-transparent 
        focus:outline-none 
        focus:ring-2 focus:ring-blue-500/50
        text-white placeholder-gray-500"
        autoFocus
      />

      <div className="flex items-center gap-4 text-sm">
        <div className="space-y-1">
          <div className="text-gray-400 text-xs">Position</div>
          <div className="flex gap-2">
            <div className="flex flex-col items-center">
              <input
                type="number"
                min="1"
                max={drawer.drawerHeight}
                value={position.row}
                onChange={(e) =>
                  setPosition({ ...position, row: Number(e.target.value) })
                }
                className="w-14 p-1 rounded bg-[#252525] text-white border border-gray-700
                focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
              <label className="text-gray-500 text-xs mt-1">row</label>
            </div>
            <div className="flex flex-col items-center">
              <input
                type="number"
                min="1"
                max={drawer.drawerWidth}
                value={position.col}
                onChange={(e) =>
                  setPosition({ ...position, col: Number(e.target.value) })
                }
                className="w-14 p-1 rounded bg-[#252525] text-white border border-gray-700
                focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
              <label className="text-gray-500 text-xs mt-1">col</label>
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <div className="text-gray-400 text-xs">Size</div>
          <div className="flex gap-2">
            <div className="flex flex-col items-center">
              <input
                type="number"
                min="1"
                max={drawer.drawerWidth}
                value={size.width}
                onChange={(e) =>
                  setSize({ ...size, width: Number(e.target.value) })
                }
                className="w-14 p-1 rounded bg-[#252525] text-white border border-gray-700
                focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
              <label className="text-gray-500 text-xs mt-1">width</label>
            </div>
            <div className="flex flex-col items-center">
              <input
                type="number"
                min="1"
                max={drawer.drawerHeight}
                value={size.height}
                onChange={(e) =>
                  setSize({ ...size, height: Number(e.target.value) })
                }
                className="w-14 p-1 rounded bg-[#252525] text-white border border-gray-700
                focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
              <label className="text-gray-500 text-xs mt-1">height</label>
            </div>
            <div className="flex flex-col items-center">
              <input
                type="number"
                min="1"
                max={drawer.drawerDepth}
                value={size.depth}
                onChange={(e) =>
                  setSize({ ...size, depth: Number(e.target.value) })
                }
                className="w-14 p-1 rounded bg-[#252525] text-white border border-gray-700
                focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
              <label className="text-gray-500 text-xs mt-1">depth</label>
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <div className="text-gray-400 text-xs">Style</div>
          <div className="flex gap-2">
            <IconPicker value={icon} onChange={setIcon} />
            <ColorPicker value={color} onChange={setColor} />
          </div>
        </div>

        <button
          onClick={() => handleSubmit()}
          className="ml-2 px-3 py-1 bg-blue-500 rounded text-white
          hover:bg-blue-600 transition-colors duration-200"
        >
          Add
        </button>
      </div>
    </div>
  );
};
