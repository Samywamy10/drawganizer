"use client";

import { type Drawer } from "@prisma/client";
import { useState, useRef, useEffect } from "react";

interface DrawerControlsProps {
  drawer: Drawer;
  drawers: Drawer[];
  itemCount: number;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onDrawerChange: (drawerId: number) => void;
}

export function DrawerControls({
  drawer,
  drawers,
  itemCount,
  searchTerm,
  onSearchChange,
  onDrawerChange,
}: DrawerControlsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="absolute top-4 left-4 right-4 z-10 flex items-center gap-4">
      <div className="relative w-48" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-xl font-bold gradient-text flex items-center gap-2 truncate w-full
                   group hover:opacity-80 transition-opacity relative pl-6"
        >
          <svg
            className={`w-4 h-4 transition-transform flex-none text-gray-400 
                       group-hover:text-white
                       absolute left-0 top-1/2 -translate-y-1/2`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
          <span className="truncate">{drawer.name}</span>
        </button>

        {isOpen && (
          <div
            className="absolute top-full left-0 mt-1 bg-[#1a1a1a] border border-gray-700 
                         rounded-lg shadow-lg py-1 min-w-[200px] animate-in fade-in 
                         slide-in-from-top-2 duration-200"
          >
            {drawers.map((d) => (
              <button
                key={d.id}
                onClick={() => {
                  onDrawerChange(d.id);
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-2 text-left hover:bg-gray-800 transition-colors truncate
                           flex items-center gap-2
                           ${
                             d.id === drawer.id ? "text-blue-400" : "text-white"
                           }`}
              >
                <span className="truncate">{d.name}</span>
                {d.id === drawer.id && (
                  <svg
                    className="w-4 h-4 flex-none ml-auto"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      <input
        type="text"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search items..."
        className="flex-1 p-2 bg-[#1a1a1a]/90 backdrop-blur rounded-lg border border-gray-700
                 text-white placeholder-gray-400
                 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
      />

      <div className="text-sm text-gray-400 text-right">
        <div>
          {drawer.drawerWidth}×{drawer.drawerDepth}×{drawer.drawerHeight} drawer
        </div>
        <div>{itemCount} items</div>
      </div>
    </div>
  );
}
