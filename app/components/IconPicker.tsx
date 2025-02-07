"use client";

import { useState, useRef, useEffect } from "react";
import * as icons from "@mdi/js";

interface IconPickerProps {
  value?: string;
  onChange: (value: string | undefined) => void;
}

// Convert mdi/js icons object to a searchable array
const iconList = Object.entries(icons).map(([key, path]) => ({
  name: key
    .replace(/^mdi/, "")
    .replace(/([A-Z])/g, " $1")
    .trim(), // Convert camelCase to words
  id: key,
  path,
}));

export function IconPicker({ value, onChange }: IconPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter icons based on search
  const filteredIcons = search
    ? iconList
        .filter((icon) =>
          icon.name.toLowerCase().includes(search.toLowerCase())
        )
        .slice(0, 20)
    : iconList.slice(0, 20);

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

  const selectedIcon = value
    ? iconList.find((icon) => icon.id === value)
    : undefined;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        className="p-2 bg-[#1a1a1a] rounded-lg border border-gray-700 text-white
                 hover:bg-gray-800 transition-colors flex items-center gap-2 w-full"
      >
        {selectedIcon ? (
          <>
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d={selectedIcon.path} fill="currentColor" />
            </svg>
            <span className="text-sm truncate">{selectedIcon.name}</span>
          </>
        ) : (
          <span className="text-sm text-gray-400">Select icon...</span>
        )}
      </button>

      {isOpen && (
        <div
          className="absolute top-full left-0 mt-1 w-64 bg-[#1a1a1a] border border-gray-700 
                     rounded-lg shadow-lg p-2 z-50"
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search icons..."
            className="w-full p-2 bg-[#252525] rounded border border-gray-700 
                     text-white placeholder-gray-400 mb-2
                     focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            autoFocus
          />

          <div className="max-h-64 overflow-y-auto">
            <div className="space-y-1">
              {filteredIcons.map((icon) => (
                <button
                  key={icon.id}
                  onClick={() => {
                    onChange(icon.id);
                    setIsOpen(false);
                  }}
                  className="w-full p-2 rounded hover:bg-blue-500/20 transition-colors
                           flex items-center gap-3 text-left"
                >
                  <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                    <path d={icon.path} fill="currentColor" />
                  </svg>
                  <span className="text-sm text-gray-300">{icon.name}</span>
                </button>
              ))}
            </div>
          </div>

          {value && (
            <button
              onClick={() => {
                onChange(undefined);
                setIsOpen(false);
              }}
              className="w-full mt-2 p-2 text-sm text-red-400 hover:bg-red-500/10
                       rounded transition-colors"
            >
              Clear icon
            </button>
          )}
        </div>
      )}
    </div>
  );
}
