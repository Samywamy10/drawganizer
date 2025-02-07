"use client";

import { useState, useRef } from "react";
import type { Drawer } from "@prisma/client";
import type { ItemWithDrawer } from "../types";
import { addItem, deleteItem, updateItem } from "../actions";
import { IconPicker } from "../components/IconPicker";
import { ColorPicker } from "../components/ColorPicker";
import * as icons from "@mdi/js";

interface DrawerGridProps {
  drawer: Drawer;
  items: ItemWithDrawer[];
  searchTerm: string;
}

interface Selection {
  start: { row: number; col: number };
  end: { row: number; col: number };
}

interface EditingItem {
  id: number;
  name: string;
  drawerStartRow: number;
  drawerStartColumn: number;
  itemWidth: number;
  itemDepth: number;
  itemHeight: number;
  startHeight: number;
  icon?: string;
  color?: string;
}

export function DrawerGrid({ drawer, items, searchTerm }: DrawerGridProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selection, setSelection] = useState<Selection | null>(null);
  const [newItemName, setNewItemName] = useState("");
  const [newItemHeight, setNewItemHeight] = useState(1);
  const [currentHeightLevel, setCurrentHeightLevel] = useState(1);
  const [editingItem, setEditingItem] = useState<EditingItem | null>(null);
  const [error, setError] = useState("");
  const [icon, setIcon] = useState<string>();
  const [color, setColor] = useState<string>();
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter items based on height level
  const visibleItems = items.filter((item) => {
    const itemStartHeight = item.startHeight;
    const itemEndHeight = itemStartHeight + item.itemHeight - 1;
    return (
      currentHeightLevel >= itemStartHeight &&
      currentHeightLevel <= itemEndHeight
    );
  });

  // Create a grid representation
  const grid = Array(drawer.drawerDepth)
    .fill(null)
    .map(() => Array(drawer.drawerWidth).fill(null));

  // Track which cells are part of a multi-cell item
  const cellSpans = Array(drawer.drawerDepth)
    .fill(null)
    .map(() => Array(drawer.drawerWidth).fill(false));

  // Place items in the grid and mark spans
  visibleItems.forEach((item) => {
    const startRow = item.drawerStartRow - 1;
    const startCol = item.drawerStartColumn - 1;

    for (let r = 0; r < item.itemDepth; r++) {
      for (let c = 0; c < item.itemWidth; c++) {
        if (grid[startRow + r] && grid[startRow + r][startCol + c] === null) {
          grid[startRow + r][startCol + c] = item;
          cellSpans[startRow + r][startCol + c] =
            r === 0 && c === 0 ? "start" : "span";
        }
      }
    }
  });

  const isHighlighted = (item: ItemWithDrawer | null) => {
    if (!searchTerm || !item) return false;
    return item.name.toLowerCase().includes(searchTerm.toLowerCase());
  };

  const getNormalizedSelection = (selection: Selection) => {
    return {
      startRow: Math.min(selection.start.row, selection.end.row),
      endRow: Math.max(selection.start.row, selection.end.row),
      startCol: Math.min(selection.start.col, selection.end.col),
      endCol: Math.max(selection.start.col, selection.end.col),
    };
  };

  const handleMouseDown = (row: number, col: number) => {
    setIsDragging(true);
    setSelection({
      start: { row, col },
      end: { row, col },
    });
    setNewItemName("");
  };

  const handleMouseMove = (row: number, col: number) => {
    if (!isDragging) return;

    setSelection((prev) =>
      prev
        ? {
            ...prev,
            end: { row, col },
          }
        : null
    );
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (selection) {
      // Focus the input after selection
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  };

  // Add helper function to check for 3D intersection
  const checkHeightIntersection = (
    startRow: number,
    endRow: number,
    startCol: number,
    endCol: number,
    startHeight: number,
    itemHeight: number,
    excludeItemId?: number
  ) => {
    // Get all items that could potentially intersect in x,y plane
    const potentialIntersects = items.filter((item) => {
      // Exclude the item being edited
      if (excludeItemId && item.id === excludeItemId) {
        return false;
      }

      const itemEndRow = item.drawerStartRow - 1 + item.itemDepth - 1;
      const itemEndCol = item.drawerStartColumn - 1 + item.itemWidth - 1;
      const itemStartRow = item.drawerStartRow - 1;
      const itemStartCol = item.drawerStartColumn - 1;

      // Check if items overlap in x,y plane
      return (
        itemStartRow <= endRow &&
        itemEndRow >= startRow &&
        itemStartCol <= endCol &&
        itemEndCol >= startCol
      );
    });

    // For items that intersect in x,y plane, check height intersection
    const intersectingItems = potentialIntersects.filter((item) => {
      const newItemEndHeight = startHeight + itemHeight - 1;
      const existingItemEndHeight = item.startHeight + item.itemHeight - 1;

      // Check if the height ranges overlap
      const heightOverlap = !(
        (
          startHeight > existingItemEndHeight || // New item starts above existing item
          newItemEndHeight < item.startHeight
        ) // New item ends below existing item
      );

      return heightOverlap;
    });

    return intersectingItems;
  };

  // Validate position and dimensions
  const validatePosition = (heightLevel: number, height: number) => {
    if (!selection) return null;

    const { startRow, endRow, startCol, endCol } =
      getNormalizedSelection(selection);

    // Check for intersections with existing items
    const intersectingItems = checkHeightIntersection(
      startRow,
      endRow,
      startCol,
      endCol,
      heightLevel,
      height,
      editingItem?.id
    );

    if (intersectingItems.length > 0) {
      const itemNames = intersectingItems
        .map((item) => `"${item.name}"`)
        .join(", ");
      return `Cannot create item: It would intersect with: ${itemNames}`;
    }

    // Check if the item would exceed drawer height
    if (heightLevel + height - 1 > drawer.drawerHeight) {
      return "Item would exceed drawer height";
    }

    return null;
  };

  // Update height with validation
  const handleHeightChange = (newHeight: number) => {
    const validationError = validatePosition(currentHeightLevel, newHeight);
    setError(validationError || "");
    setNewItemHeight(newHeight);
  };

  // Update start height with validation
  const handleStartHeightChange = (newStartHeight: number) => {
    const validationError = validatePosition(newStartHeight, newItemHeight);
    setError(validationError || "");
    setCurrentHeightLevel(newStartHeight);
  };

  const handleCreateItem = async () => {
    if (!selection || !newItemName.trim()) return;

    const validationError = validatePosition(currentHeightLevel, newItemHeight);
    if (validationError) {
      setError(validationError);
      return;
    }

    const { startRow, endRow, startCol, endCol } =
      getNormalizedSelection(selection);
    const width = endCol - startCol + 1;
    const depth = endRow - startRow + 1;

    try {
      const formData = new FormData();
      formData.append("name", newItemName.trim());
      formData.append("drawerId", drawer.id.toString());
      formData.append("startHeight", currentHeightLevel.toString());
      formData.append("icon", icon ?? "");
      formData.append("color", color ?? "");

      await addItem(
        formData,
        { row: startRow + 1, col: startCol + 1 },
        { width, depth, height: newItemHeight }
      );

      setSelection(null);
      setNewItemName("");
      setNewItemHeight(1);
      setIcon(undefined);
      setColor(undefined);
      setError("");
    } catch (err) {
      console.error("Error creating item:", err);
      setError(err instanceof Error ? err.message : "Failed to create item");
    }
  };

  const handleItemClick = (item: ItemWithDrawer) => {
    setSelection({
      start: { row: item.drawerStartRow - 1, col: item.drawerStartColumn - 1 },
      end: {
        row: item.drawerStartRow - 1 + item.itemDepth - 1,
        col: item.drawerStartColumn - 1 + item.itemWidth - 1,
      },
    });
    setNewItemName(item.name);
    setNewItemHeight(item.itemHeight);
    setCurrentHeightLevel(item.startHeight);
    setIcon(item.icon ?? undefined);
    setColor(item.color ?? undefined);
    setEditingItem({
      id: item.id,
      name: item.name,
      drawerStartRow: item.drawerStartRow,
      drawerStartColumn: item.drawerStartColumn,
      itemWidth: item.itemWidth,
      itemDepth: item.itemDepth,
      itemHeight: item.itemHeight,
      startHeight: item.startHeight,
      icon: item.icon ?? undefined,
      color: item.color ?? undefined,
    });
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleUpdateItem = async () => {
    if (!editingItem || !editingItem.name.trim()) return;

    const validationError = validatePosition(currentHeightLevel, newItemHeight);
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", editingItem.name.trim());
      formData.append("startHeight", currentHeightLevel.toString());
      formData.append("itemHeight", newItemHeight.toString());
      formData.append("icon", icon || "");
      formData.append("color", color || "");

      console.log(
        "Sending update with data:",
        Object.fromEntries(formData.entries())
      );

      await updateItem(editingItem.id, formData);
      setEditingItem(null);
      setSelection(null);
      setIcon(undefined);
      setColor(undefined);
      setError("");
    } catch (err) {
      console.error("Error updating item:", err);
      setError(err instanceof Error ? err.message : "Failed to update item");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (editingItem) {
        handleUpdateItem();
      } else {
        handleCreateItem();
      }
    } else if (e.key === "Escape") {
      setSelection(null);
      setNewItemName("");
      setEditingItem(null);
    }
  };

  // Update the getDialogPosition function
  const getDialogPosition = () => {
    if (!selection) return {};

    const { startRow, endRow, startCol, endCol } =
      getNormalizedSelection(selection);
    const width = endCol - startCol + 1;
    const height = endRow - startRow + 1;

    return {
      gridColumn: `span ${width}`,
      gridRow: `span ${height}`,
      position: "absolute" as const,
      inset: "0",
      margin: "0",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    };
  };

  return (
    <div className="mb-8 max-w-7xl">
      <h2 className="text-xl font-bold mb-4 gradient-text">{drawer.name}</h2>
      <div className="grid grid-cols-[2rem,1fr,16rem] gap-4">
        {/* Height slider */}
        <div className="flex flex-col items-center gap-2">
          <div className="text-sm text-gray-400 mb-1">{currentHeightLevel}</div>
          <div className="flex-1 w-full relative bg-[#1a1a1a] rounded-full">
            <input
              type="range"
              min="1"
              max={drawer.drawerHeight}
              value={currentHeightLevel}
              onChange={(e) => handleStartHeightChange(Number(e.target.value))}
              className="absolute h-full w-2 -rotate-180 appearance-none bg-transparent cursor-pointer"
              style={{
                left: "50%",
                transform: "translateX(-50%) rotate(180deg)",
                WebkitAppearance: "slider-vertical",
              }}
            />
          </div>
          <style jsx>{`
            input[type="range"]::-webkit-slider-thumb {
              -webkit-appearance: none;
              appearance: none;
              width: 16px;
              height: 16px;
              background: #3b82f6;
              border-radius: 50%;
              cursor: pointer;
              transition: background 0.2s;
            }
            input[type="range"]::-webkit-slider-thumb:hover {
              background: #2563eb;
            }
            input[type="range"]::-moz-range-thumb {
              width: 16px;
              height: 16px;
              background: #3b82f6;
              border: none;
              border-radius: 50%;
              cursor: pointer;
              transition: background 0.2s;
            }
            input[type="range"]::-moz-range-thumb:hover {
              background: #2563eb;
            }
          `}</style>
        </div>

        {/* Grid view */}
        <div className="relative">
          {/* Background grid */}
          <div
            className="absolute inset-0 grid gap-px pointer-events-none"
            style={{
              gridTemplateColumns: `repeat(${drawer.drawerWidth}, minmax(0, 1fr))`,
              gridTemplateRows: `repeat(${drawer.drawerDepth}, minmax(0, 1fr))`,
            }}
          >
            {Array(drawer.drawerDepth * drawer.drawerWidth)
              .fill(null)
              .map((_, i) => (
                <div
                  key={`bg-${i}`}
                  className="bg-gray-800/10 border border-gray-800/20"
                />
              ))}
          </div>

          {/* Items grid */}
          <div
            className="grid gap-px relative"
            style={{
              gridTemplateColumns: `repeat(${drawer.drawerWidth}, minmax(0, 1fr))`,
              gridTemplateRows: `repeat(${drawer.drawerDepth}, minmax(0, 1fr))`,
              aspectRatio: `${drawer.drawerWidth} / ${drawer.drawerDepth}`,
            }}
            onMouseLeave={handleMouseUp}
          >
            {grid.map((row, rowIndex) =>
              row.map((cell, colIndex) => {
                if (cellSpans[rowIndex][colIndex] === "span") return null;

                const spanItem = cell as ItemWithDrawer;
                const gridSpan = spanItem
                  ? {
                      gridColumn: `span ${spanItem.itemWidth}`,
                      gridRow: `span ${spanItem.itemDepth}`,
                    }
                  : {};

                const isSelected =
                  selection &&
                  (() => {
                    const { startRow, endRow, startCol, endCol } =
                      getNormalizedSelection(selection);
                    return (
                      rowIndex >= startRow &&
                      rowIndex <= endRow &&
                      colIndex >= startCol &&
                      colIndex <= endCol
                    );
                  })();

                return (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    style={{
                      ...gridSpan,
                      backgroundColor: cell?.color || undefined,
                    }}
                    className={`
                      flex items-center justify-center p-2 text-sm
                      rounded border border-gray-700 select-none
                      transition-colors duration-200 relative group
                      ${!cell ? "cursor-pointer" : "cursor-pointer"}
                      ${cell && !cell.color ? "bg-blue-500/20" : ""}
                      ${isHighlighted(cell) ? "ring-2 ring-blue-500" : ""}
                      ${isSelected ? "bg-blue-500/40 ring-2 ring-blue-500" : ""}
                    `}
                    onClick={() => cell && handleItemClick(cell)}
                    onMouseDown={() =>
                      !cell && handleMouseDown(rowIndex, colIndex)
                    }
                    onMouseMove={() => handleMouseMove(rowIndex, colIndex)}
                    onMouseUp={handleMouseUp}
                  >
                    {/* Show input when editing or creating */}
                    {editingItem && cell?.id === editingItem.id ? (
                      <div
                        style={getDialogPosition()}
                        className="w-full h-full flex items-center justify-center"
                      >
                        <input
                          ref={inputRef}
                          type="text"
                          value={editingItem.name}
                          onChange={(e) =>
                            editingItem
                              ? setEditingItem({
                                  ...editingItem,
                                  name: e.target.value,
                                })
                              : setNewItemName(e.target.value)
                          }
                          onKeyDown={handleKeyDown}
                          onBlur={() => {
                            if (editingItem) {
                              handleUpdateItem();
                            }
                          }}
                          placeholder="Rename item"
                          className="text-center bg-transparent
                          focus:outline-none text-white text-sm
                          animate-pulse w-4/5"
                        />
                      </div>
                    ) : (
                      <>
                        <div
                          className={`flex ${
                            // If item width is 1 and depth is greater than 1, stack vertically
                            spanItem?.itemWidth === 1 && spanItem?.itemDepth > 1
                              ? "flex-col items-center justify-center"
                              : "items-center"
                          } gap-2`}
                        >
                          {cell?.icon && (
                            <svg
                              className="w-5 h-5 flex-shrink-0"
                              viewBox="0 0 24 24"
                            >
                              <path
                                d={icons[cell.icon as keyof typeof icons]}
                                fill="currentColor"
                              />
                            </svg>
                          )}
                          <span className="text-center">{cell?.name}</span>
                        </div>
                        {cell && (
                          <button
                            onClick={async (e) => {
                              e.stopPropagation();
                              await deleteItem(cell.id);
                              // Clear selection if we just deleted the selected item
                              if (editingItem?.id === cell.id) {
                                setEditingItem(null);
                                setSelection(null);
                                setIcon(undefined);
                                setColor(undefined);
                                setError("");
                              }
                            }}
                            className={`absolute top-1 right-1 
                            bg-red-500/90 hover:bg-red-600 text-white rounded-full w-5 h-5
                            flex items-center justify-center text-xs
                            transition-all duration-200
                            ${
                              editingItem?.id === cell.id
                                ? "opacity-100"
                                : "opacity-0 group-hover:opacity-100"
                            }`}
                          >
                            ✕
                          </button>
                        )}
                      </>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Side panel */}
        {selection && (
          <div
            className="bg-[#1a1a1a] rounded-lg p-4"
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            onMouseMove={(e) => e.stopPropagation()}
            onMouseUp={(e) => e.stopPropagation()}
          >
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (editingItem) {
                  handleUpdateItem();
                } else {
                  handleCreateItem();
                }
              }}
            >
              <div className="text-lg font-bold mb-4">
                {editingItem ? "Update Item" : "New Item"}
              </div>
              <input
                ref={inputRef}
                type="text"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter item name"
                className="w-full p-2 mb-2 bg-[#252525] rounded 
                border border-gray-700 text-white
                focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
              <div className="text-sm text-gray-400 mb-2">
                Position: {selection.start.row + 1},{selection.start.col + 1}
              </div>
              <div className="text-sm text-gray-400 mb-4">
                Size: {Math.abs(selection.end.col - selection.start.col) + 1}×
                {Math.abs(selection.end.row - selection.start.row) + 1}
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Start Height
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={drawer.drawerHeight}
                    value={currentHeightLevel}
                    onChange={(e) =>
                      handleStartHeightChange(Number(e.target.value))
                    }
                    className="w-20 p-2 rounded bg-[#1a1a1a] text-white border border-gray-700
                    focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Height
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={drawer.drawerHeight - currentHeightLevel + 1}
                    value={newItemHeight}
                    onChange={(e) => handleHeightChange(Number(e.target.value))}
                    className="w-20 p-2 rounded bg-[#1a1a1a] text-white border border-gray-700
                    focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Style
                  </label>
                  <div className="flex gap-2">
                    <IconPicker value={icon} onChange={setIcon} />
                    <ColorPicker value={color} onChange={setColor} />
                  </div>
                </div>
                {error && (
                  <div className="text-red-500 text-sm mt-2">{error}</div>
                )}
                <button
                  type="submit"
                  disabled={!!error || !newItemName.trim()}
                  className="w-full py-2 px-4 bg-emerald-600 hover:bg-emerald-700 
                  disabled:bg-emerald-600/50 disabled:cursor-not-allowed
                  text-white rounded transition-colors duration-200"
                >
                  {editingItem ? "Update Item" : "Save Item"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
