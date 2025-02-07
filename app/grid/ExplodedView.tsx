"use client";

import { useMemo, useState, useEffect } from "react";
import type { Drawer } from "@prisma/client";
import type { ItemWithDrawer } from "../types";
import { DrawerControls } from "../components/DrawerControls";
import * as icons from "@mdi/js";

interface ExplodedViewProps {
  drawer: Drawer;
  drawers: Drawer[];
  items: ItemWithDrawer[];
  onDrawerChange: (drawerId: number) => void;
}

export function ExplodedView({
  drawer,
  drawers,
  items,
  onDrawerChange,
}: ExplodedViewProps) {
  // Add search state
  const [searchTerm, setSearchTerm] = useState("");

  // Sort items by height for proper layering
  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => a.startHeight - b.startHeight);
  }, [items]);

  // Add rotation and zoom state
  const [rotation, setRotation] = useState({ x: 60, z: -45 });
  const [zoom, setZoom] = useState(0.9);
  const [isDragging, setIsDragging] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });

  // Handle mouse events for rotation
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setLastMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;

    const deltaX = e.clientX - lastMousePos.x;
    const deltaY = e.clientY - lastMousePos.y;

    setRotation((prev) => ({
      x: (prev.x - deltaY * 0.5) % 360, // Allow full rotation
      z: (prev.z - deltaX * 0.5) % 360,
    }));

    setLastMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Handle scroll wheel for zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    setZoom((prev) => {
      const newZoom = prev - e.deltaY * 0.001;
      return Math.min(Math.max(newZoom, 0.3), 2.0); // Limit zoom between 0.3x and 2.0x
    });
  };

  // Add event cleanup
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setIsDragging(false);
    };

    window.addEventListener("mouseup", handleGlobalMouseUp);
    return () => {
      window.removeEventListener("mouseup", handleGlobalMouseUp);
    };
  }, []);

  // Calculate max height needed based on items
  const maxHeight = useMemo(() => {
    if (items.length === 0) return 1;
    return Math.max(...items.map((item) => item.startHeight + item.itemHeight));
  }, [items]);

  // Calculate responsive scales based on container size and number of layers
  const getResponsiveScales = () => {
    const baseHeightScale = 80;
    const scaleFactor = Math.max(1, maxHeight / 3);

    return {
      heightScale: baseHeightScale / scaleFactor,
    };
  };

  const { heightScale } = getResponsiveScales();

  return (
    <div className="relative">
      <DrawerControls
        drawer={drawer}
        drawers={drawers}
        itemCount={items.length}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onDrawerChange={onDrawerChange}
      />

      {/* 3D View - now full size */}
      <div
        className="w-full aspect-square relative cursor-move"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        {/* Perspective container */}
        <div
          className="w-full h-full"
          style={{
            perspective: "2000px",
            perspectiveOrigin: "center center",
          }}
        >
          {/* 3D Scene */}
          <div
            className="w-full h-full relative flex items-center justify-center"
            style={{
              transformStyle: "preserve-3d",
            }}
          >
            {/* Isometric container */}
            <div
              className="relative"
              style={{
                width: "min(90%, 1200px)",
                height: "min(90%, 1200px)",
                transform: `rotateX(${rotation.x}deg) rotateZ(${rotation.z}deg) scale(${zoom})`,
                transformStyle: "preserve-3d",
                transition: isDragging ? "none" : "transform 0.3s ease-out",
              }}
            >
              {/* Drawer base */}
              <div
                className="absolute inset-0 bg-gray-800/20 border border-gray-700"
                style={{
                  transform: "translateZ(0)",
                  transformStyle: "preserve-3d",
                }}
              >
                {/* Grid lines */}
                <div
                  className="w-full h-full grid gap-px"
                  style={{
                    gridTemplateColumns: `repeat(${drawer.drawerWidth}, 1fr)`,
                    gridTemplateRows: `repeat(${drawer.drawerDepth}, 1fr)`,
                  }}
                >
                  {Array(drawer.drawerWidth * drawer.drawerDepth)
                    .fill(null)
                    .map((_, i) => (
                      <div key={i} className="border border-gray-700/20" />
                    ))}
                </div>
              </div>

              {/* Items */}
              {sortedItems.map((item) => {
                const widthPercent =
                  (item.itemWidth / drawer.drawerWidth) * 100;
                const depthPercent =
                  (item.itemDepth / drawer.drawerDepth) * 100;
                const leftPercent =
                  ((item.drawerStartColumn - 1) / drawer.drawerWidth) * 100;
                const topPercent =
                  ((item.drawerStartRow - 1) / drawer.drawerDepth) * 100;

                const isHighlighted =
                  searchTerm &&
                  item.name.toLowerCase().includes(searchTerm.toLowerCase());

                const itemColor = item.color || "rgba(59, 130, 246, 0.2)";
                const highlightColor = isHighlighted
                  ? "rgba(16, 185, 129, 0.5)"
                  : itemColor;

                // Convert rgba color to a border color with higher opacity
                const getBorderColor = (color: string) => {
                  const match = color.match(
                    /rgba\((\d+),\s*(\d+),\s*(\d+),\s*[\d.]+\)/
                  );
                  if (match) {
                    const [, r, g, b] = match; // Using , instead of _ to skip first match
                    return `rgba(${r}, ${g}, ${b}, 0.4)`;
                  }
                  return "rgba(59, 130, 246, 0.4)"; // Default blue border
                };

                return (
                  <div
                    key={item.id}
                    className={`absolute transition-all duration-300 ${
                      isHighlighted ? "z-10" : ""
                    }`}
                    style={{
                      width: `${widthPercent}%`,
                      height: `${depthPercent}%`,
                      left: `${leftPercent}%`,
                      top: `${topPercent}%`,
                      transform: `translateZ(${
                        (item.startHeight + item.itemHeight - 1) * heightScale
                      }px)`,
                      transformStyle: "preserve-3d",
                    }}
                  >
                    {/* Top face */}
                    <div
                      className="absolute inset-0 border transition-all duration-500"
                      style={{
                        transformStyle: "preserve-3d",
                        transform: "translateZ(0)",
                        background: highlightColor,
                        borderColor: getBorderColor(itemColor),
                      }}
                    >
                      <div
                        className={`absolute inset-0 flex items-center justify-center text-2xl md:text-3xl lg:text-4xl
                                   font-semibold p-1 text-center select-none transition-all duration-500 ${
                                     isHighlighted
                                       ? "text-white scale-110"
                                       : "text-white/90 scale-100"
                                   }`}
                        style={{
                          textShadow: "0 2px 4px rgba(0,0,0,0.4)",
                        }}
                      >
                        <div
                          className={`flex ${
                            // If item width is 1 and depth is greater than 1, stack vertically
                            item.itemWidth === 1 && item.itemDepth > 1
                              ? "flex-col items-center justify-center"
                              : "items-center"
                          } gap-2`}
                        >
                          {item.icon && (
                            <svg
                              className="w-8 h-8 flex-shrink-0"
                              viewBox="0 0 24 24"
                            >
                              <path
                                d={icons[item.icon as keyof typeof icons]}
                                fill="currentColor"
                              />
                            </svg>
                          )}
                          <span>{item.name}</span>
                        </div>
                      </div>
                    </div>

                    {/* Front face */}
                    <div
                      className="absolute border transition-all duration-500"
                      style={{
                        width: "100%",
                        height: `${item.itemHeight * heightScale}px`,
                        transform: "rotateX(-90deg)",
                        transformOrigin: "top",
                        top: "100%",
                        transformStyle: "preserve-3d",
                        background: isHighlighted
                          ? "rgba(5, 150, 105, 0.5)"
                          : itemColor,
                        opacity: 0.8,
                        borderColor: getBorderColor(itemColor),
                      }}
                    />

                    {/* Right face */}
                    <div
                      className="absolute border transition-all duration-500"
                      style={{
                        width: `${item.itemHeight * heightScale}px`,
                        height: "100%",
                        transform: "rotateY(90deg)",
                        transformOrigin: "left",
                        left: "100%",
                        transformStyle: "preserve-3d",
                        background: isHighlighted
                          ? "rgba(4, 120, 87, 0.5)"
                          : itemColor,
                        opacity: 0.6,
                        borderColor: getBorderColor(itemColor),
                      }}
                    />

                    {/* Left face */}
                    <div
                      className="absolute border transition-all duration-500"
                      style={{
                        width: `${item.itemHeight * heightScale}px`,
                        height: "100%",
                        transform: "rotateY(-90deg)",
                        transformOrigin: "right",
                        right: "100%",
                        transformStyle: "preserve-3d",
                        background: isHighlighted
                          ? "rgba(4, 120, 87, 0.5)"
                          : itemColor,
                        opacity: 0.6,
                        borderColor: getBorderColor(itemColor),
                      }}
                    />

                    {/* Back face */}
                    <div
                      className="absolute border transition-all duration-500"
                      style={{
                        width: "100%",
                        height: `${item.itemHeight * heightScale}px`,
                        transform: "rotateX(90deg)",
                        transformOrigin: "bottom",
                        bottom: "100%",
                        transformStyle: "preserve-3d",
                        background: isHighlighted
                          ? "rgba(5, 150, 105, 0.5)"
                          : itemColor,
                        opacity: 0.8,
                        borderColor: getBorderColor(itemColor),
                      }}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
