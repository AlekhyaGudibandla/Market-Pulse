"use client";

import { useState } from "react";
import {
  Layers,
  Megaphone,
  Box,
  FileText,
  FlaskConical,
  Handshake,
  DollarSign
} from "lucide-react";

interface Props {
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  eventCount?: number;
}

export default function HeroBanner({ selectedCategory, onSelectCategory, eventCount = 24 }: Props) {
  const categories = [
    { id: "All", label: "All", icon: Layers },
    { id: "Announcements", label: "Announcements", icon: Megaphone },
    { id: "Products", label: "Products", icon: Box },
    { id: "Patents", label: "Patents", icon: FileText },
    { id: "Research", label: "Research", icon: FlaskConical },
    { id: "Partnerships", label: "Partnerships", icon: Handshake },
    { id: "Funding", label: "Funding", icon: DollarSign },
  ];

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
      {/* Background Mountain Panorama Graphic on Right */}
      <div className="absolute right-0 top-0 bottom-0 w-1/2 overflow-hidden pointer-events-none hidden md:block">
        <svg
          viewBox="0 0 700 240"
          preserveAspectRatio="xMaxYMid slice"
          className="h-full w-full opacity-95"
        >
          <defs>
            <linearGradient id="skyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffeedd" />
              <stop offset="40%" stopColor="#f8c9a8" />
              <stop offset="70%" stopColor="#d5e4f2" />
              <stop offset="100%" stopColor="#b4cde6" />
            </linearGradient>
            <linearGradient id="mountain1" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
              <stop offset="35%" stopColor="#d8845c" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#4a3b32" stopOpacity="0.85" />
            </linearGradient>
            <linearGradient id="mountain2" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
              <stop offset="45%" stopColor="#e89874" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#2d2a2e" stopOpacity="0.8" />
            </linearGradient>
          </defs>

          {/* Sky Backdrop */}
          <rect width="700" height="240" fill="url(#skyGrad)" />

          {/* Sun Glow Behind Peaks */}
          <circle cx="280" cy="110" r="90" fill="#fff5ea" opacity="0.6" />

          {/* Distant Mountain Layer */}
          <polygon
            points="0,240 80,140 180,95 240,130 340,75 420,110 520,60 620,130 700,90 700,240"
            fill="url(#mountain2)"
          />

          {/* Mid Ridge Peaks with Snow Caps */}
          <polygon
            points="50,240 140,115 220,170 310,85 410,145 490,95 590,165 700,105 700,240"
            fill="url(#mountain1)"
          />

          {/* Foreground Dark Ridge & Pine silhouettes */}
          <polygon
            points="0,240 100,190 200,210 320,175 460,205 600,170 700,200 700,240"
            fill="#1c2420"
            opacity="0.85"
          />
        </svg>

        {/* Live Indicator Pill in Mountain Sky */}
        <div className="absolute right-5 bottom-4 flex items-center gap-2 rounded-full bg-[#08351F] px-3.5 py-1 text-xs font-semibold text-white shadow-md border border-[#166534]">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400"></span>
          </span>
          <span>{eventCount} new events in the last 6 hours</span>
        </div>
      </div>

      {/* Left Text Content */}
      <div className="relative z-10 max-w-xl">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
          Competitive Intelligence
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-slate-500 font-medium">
          Track market moves, decode signals, and stay ahead.
        </p>

        {/* Category Filter Pills */}
        <div className="mt-5 flex flex-wrap items-center gap-1.5">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                  isSelected
                    ? "bg-[#0F5132] text-white shadow-sm"
                    : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${isSelected ? "text-white" : "text-slate-400"}`} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
