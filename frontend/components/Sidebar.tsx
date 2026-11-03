"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Activity,
  Layers,
  Network,
  Calendar,
  Zap,
  BookOpen,
  Sliders,
  Star,
  Bell,
  Bookmark,
  Folder,
  Sparkles,
  ArrowRight
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const mainNav = [
    { href: "/", label: "Overview", icon: Home },
    { href: "/alerts", label: "Intelligence Feed", icon: Activity },
    { href: "/timeline", label: "Companies", icon: Layers },
    { href: "/graph", label: "Knowledge Graph", icon: Network },
    { href: "/timeline", label: "Timelines", icon: Calendar },
    { href: "/impact-analyzer", label: "Change Impact", icon: Zap },
    { href: "/rag-studio", label: "RAG Studio", icon: BookOpen },
    { href: "/settings", label: "Pipelines", icon: Sliders },
  ];

  const workspaceNav = [
    { href: "/timeline", label: "Watchlist", icon: Star, count: 6 },
    { href: "/alerts", label: "Alerts", icon: Bell, count: 3 },
    { href: "/rag-studio", label: "Saved Reports", icon: Bookmark },
    { href: "/graph", label: "Collections", icon: Folder },
  ];

  return (
    <aside className="w-64 shrink-0 border-r border-border bg-white flex flex-col justify-between min-h-screen p-4 sticky top-0 h-screen select-none">
      <div>
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 px-2 py-3 mb-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0F5132] text-white shadow-sm">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-5 w-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900">MarketPulse</span>
        </Link>

        {/* Primary Navigation Links */}
        <nav className="space-y-1">
          {mainNav.map((item, idx) => {
            const Icon = item.icon;
            // Match active based on pathname
            const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href) && item.label !== "Timelines";
            return (
              <Link
                key={idx}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-[#E8F5E9] text-[#0F5132] font-bold"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? "text-[#0F5132]" : "text-slate-400"}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* My Workspace Section */}
        <div className="mt-8">
          <span className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            My Workspace
          </span>
          <div className="mt-2 space-y-1">
            {workspaceNav.map((item, idx) => {
              const Icon = item.icon;
              return (
                <Link
                  key={idx}
                  href={item.href}
                  className="flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-4 w-4 text-slate-400" />
                    <span>{item.label}</span>
                  </div>
                  {item.count && (
                    <span className="rounded-full bg-[#E8F5E9] px-2 py-0.5 text-[10px] font-bold text-[#0F5132]">
                      {item.count}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* AI Research Copilot Callout Card */}
      <div className="rounded-xl border border-[#D1E7DD] bg-[#F0FDF4] p-3.5 shadow-sm mt-4">
        <div className="flex items-center gap-2 text-xs font-bold text-[#0F5132]">
          <Sparkles className="h-4 w-4 text-[#0F5132]" />
          <span>AI Research Copilot</span>
        </div>
        <p className="mt-1 text-[11px] text-slate-600 leading-snug">
          Ask, analyze, and generate competitive intelligence.
        </p>
        <Link
          href="/rag-studio"
          className="mt-3 flex items-center justify-center gap-1.5 w-full rounded-lg bg-[#0F5132] py-2 text-xs font-bold text-white hover:bg-[#0B3D26] shadow-sm transition-all"
        >
          <span>Start a query</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </aside>
  );
}
