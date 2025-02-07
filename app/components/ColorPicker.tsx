"use client";

import { useState, useRef, useEffect } from "react";

interface ColorPickerProps {
  value?: string;
  onChange: (value: string | undefined) => void;
}

const PRESET_COLORS = [
  "rgba(248, 113, 113, 0.2)", // Red
  "rgba(251, 146, 60, 0.2)", // Orange
  "rgba(250, 204, 21, 0.2)", // Yellow
  "rgba(163, 230, 53, 0.2)", // Lime
  "rgba(52, 211, 153, 0.2)", // Green
  "rgba(45, 212, 191, 0.2)", // Teal
  "rgba(56, 189, 248, 0.2)", // Light Blue
  "rgba(59, 130, 246, 0.2)", // Blue
  "rgba(129, 140, 248, 0.2)", // Indigo
  "rgba(168, 85, 247, 0.2)", // Purple
  "rgba(236, 72, 153, 0.2)", // Pink
  "rgba(244, 114, 182, 0.2)", // Rose
];

export function ColorPicker({ value, onChange }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [customColor, setCustomColor] = useState(value || "");
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

  // Helper function to convert hex to rgba
  const hexToRgba = (hex: string, opacity: number = 0.2) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return null;

    const r = parseInt(result[1], 16);
    const g = parseInt(result[2], 16);
    const b = parseInt(result[3], 16);

    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

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
        {value ? (
          <div className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded"
              style={{ backgroundColor: value }}
            />
            <span className="text-sm">{value}</span>
          </div>
        ) : (
          <span className="text-sm text-gray-400">Select color...</span>
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
          <div className="grid grid-cols-6 gap-2 mb-2">
            {PRESET_COLORS.map((color) => (
              <button
                key={color}
                onClick={() => {
                  onChange(color);
                  setIsOpen(false);
                }}
                className="w-8 h-8 rounded-lg border border-gray-700 hover:scale-110
                         transition-transform relative"
                style={{ backgroundColor: color }}
              >
                {value === color && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-white drop-shadow"
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
                  </div>
                )}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={customColor}
              onChange={(e) => setCustomColor(e.target.value)}
              placeholder="#000000"
              className="flex-1 p-2 bg-[#252525] rounded border border-gray-700 
                     text-white placeholder-gray-400
                     focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
            <button
              onClick={() => {
                if (customColor.match(/^#[0-9A-F]{6}$/i)) {
                  const rgbaColor = hexToRgba(customColor);
                  if (rgbaColor) {
                    onChange(rgbaColor);
                    setIsOpen(false);
                  }
                }
              }}
              disabled={!customColor.match(/^#[0-9A-F]{6}$/i)}
              className="px-3 py-1 bg-blue-500 text-white rounded
                       hover:bg-blue-600 transition-colors
                       disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Set
            </button>
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
              Clear color
            </button>
          )}
        </div>
      )}
    </div>
  );
}
