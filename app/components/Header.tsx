"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Header() {
  const pathname = usePathname();

  return (
    <header className="bg-[#1a1a1a] p-4">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <svg
            width="48"
            height="48"
            viewBox="0 0 100 100"
            className="text-blue-500"
          >
            {/* Gridfinity 2x2 from top view */}
            <defs>
              <linearGradient
                id="logoGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop
                  offset="0%"
                  style={{ stopColor: "#3b82f6", stopOpacity: 1 }}
                />
                <stop
                  offset="100%"
                  style={{ stopColor: "#8b5cf6", stopOpacity: 1 }}
                />
              </linearGradient>
            </defs>

            {/* Grid cells */}
            <rect
              x="15"
              y="15"
              width="30"
              height="30"
              rx="4"
              fill="none"
              stroke="url(#logoGradient)"
              strokeWidth="2"
            />
            <rect
              x="55"
              y="15"
              width="30"
              height="30"
              rx="4"
              fill="none"
              stroke="url(#logoGradient)"
              strokeWidth="2"
            />
            <rect
              x="15"
              y="55"
              width="30"
              height="30"
              rx="4"
              fill="none"
              stroke="url(#logoGradient)"
              strokeWidth="2"
            />
            <rect
              x="55"
              y="55"
              width="30"
              height="30"
              rx="4"
              fill="none"
              stroke="url(#logoGradient)"
              strokeWidth="2"
            />

            {/* Corner radius indicators on main container */}
            <path
              d="M15 19 Q15 15 19 15"
              fill="none"
              stroke="url(#logoGradient)"
              strokeWidth="2"
            />
            <path
              d="M81 15 Q85 15 85 19"
              fill="none"
              stroke="url(#logoGradient)"
              strokeWidth="2"
            />
            <path
              d="M85 81 Q85 85 81 85"
              fill="none"
              stroke="url(#logoGradient)"
              strokeWidth="2"
            />
            <path
              d="M19 85 Q15 85 15 81"
              fill="none"
              stroke="url(#logoGradient)"
              strokeWidth="2"
            />
          </svg>
          <h1 className="text-2xl font-bold gradient-text">Drawganizer</h1>
        </div>

        <nav className="flex gap-6">
          <Link
            href="/"
            className={`text-sm transition-colors duration-200 ${
              pathname === "/"
                ? "text-blue-400"
                : "text-gray-400 hover:text-white"
            }`}
          >
            List View
          </Link>
          <Link
            href="/grid"
            className={`text-sm transition-colors duration-200 ${
              pathname === "/grid"
                ? "text-blue-400"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Grid View
          </Link>
          <Link
            href="/3d"
            className={`text-sm transition-colors duration-200 ${
              pathname === "/3d"
                ? "text-blue-400"
                : "text-gray-400 hover:text-white"
            }`}
          >
            3D View
          </Link>
          <Link
            href="/manage"
            className={`text-sm transition-colors duration-200 ${
              pathname === "/manage"
                ? "text-blue-400"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Manage Drawers
          </Link>
        </nav>
      </div>
    </header>
  );
}
