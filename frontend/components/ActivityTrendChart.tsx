"use client";

import { useState } from "react";
import { Info, ChevronDown } from "lucide-react";

export default function ActivityTrendChart() {
  const [timeRange, setTimeRange] = useState("Last 30 Days");

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
          <span>Market Activity Trend</span>
          <Info className="h-3.5 w-3.5 text-slate-400 cursor-pointer" />
        </div>

        {/* Dropdown */}
        <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-600 shadow-2xs cursor-pointer">
          <span>{timeRange}</span>
          <ChevronDown className="h-3 w-3 text-slate-400" />
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-[11px] text-slate-600 mb-2">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-[#0F5132]" /> Announcements
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-[#86EFAC]" /> Products
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-[#CBD5E1]" /> Patents
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-[#E2E8F0]" /> Others
        </span>
      </div>

      {/* Spline Area Chart */}
      <div className="relative w-full h-36">
        <svg viewBox="0 0 500 140" preserveAspectRatio="none" className="w-full h-full">
          <defs>
            <linearGradient id="areaGradGreen" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0F5132" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#0F5132" stopOpacity="0.05" />
            </linearGradient>
            <linearGradient id="areaGradMint" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#86EFAC" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#86EFAC" stopOpacity="0.1" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line x1="0" y1="110" x2="500" y2="110" stroke="#F1F5F9" strokeWidth="1" />
          <line x1="0" y1="75" x2="500" y2="75" stroke="#F1F5F9" strokeWidth="1" />
          <line x1="0" y1="40" x2="500" y2="40" stroke="#F1F5F9" strokeWidth="1" />

          {/* Mint Wave Area (Products & Patents) */}
          <path
            d="M 0 110 C 60 90, 100 100, 150 70 C 200 40, 250 85, 300 65 C 350 45, 420 30, 500 60 L 500 120 L 0 120 Z"
            fill="url(#areaGradMint)"
          />

          {/* Deep Green Wave Area (Announcements) */}
          <path
            d="M 0 115 C 50 105, 90 85, 140 95 C 190 105, 230 75, 280 90 C 330 105, 380 65, 430 80 C 470 95, 490 85, 500 90 L 500 120 L 0 120 Z"
            fill="url(#areaGradGreen)"
          />

          {/* Top Line Contour */}
          <path
            d="M 0 110 C 60 90, 100 100, 150 70 C 200 40, 250 85, 300 65 C 350 45, 420 30, 500 60"
            fill="none"
            stroke="#22C55E"
            strokeWidth="2"
          />
        </svg>

        {/* X-Axis Labels */}
        <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
          <span>Oct 4</span>
          <span>Oct 8</span>
          <span>Oct 12</span>
          <span>Oct 16</span>
          <span>Oct 20</span>
          <span>Oct 24</span>
          <span>Oct 28</span>
          <span>Nov 1</span>
        </div>
      </div>
    </div>
  );
}
