"use client";

import { useState } from "react";
import { Search, Bell, Sparkles } from "lucide-react";
import Link from "next/link";

export default function Header() {
  const [query, setQuery] = useState("");

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-border bg-white px-8">
      {/* Search Bar */}
      <div className="relative w-full max-w-xl">
        <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search companies, technologies, patents, or events..."
          className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 pl-10 pr-20 text-xs text-slate-800 placeholder-slate-400 transition-all focus:border-[#0F5132] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0F5132]"
        />
        <div className="absolute right-3 top-2.5 flex items-center gap-1 rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-medium text-slate-400 shadow-2xs">
          <span>Ctrl K</span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <Link
          href="/alerts"
          className="relative rounded-full p-2 text-slate-500 hover:bg-slate-100 transition-all"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-rose-500"></span>
          </span>
        </Link>

        {/* User Profile Avatar */}
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E8F5E9] border border-[#D1E7DD] text-xs font-bold text-[#0F5132] shadow-sm cursor-pointer">
          A
        </div>
      </div>
    </header>
  );
}
