"use client";

import { useState } from "react";
import { IntelligenceAlert } from "@/lib/types";
import {
  Bookmark,
  MoreHorizontal,
  ChevronDown,
  ChevronUp,
  Cpu,
  Server,
  Layers,
  ArrowRight,
  ExternalLink
} from "lucide-react";

interface Props {
  alerts: IntelligenceAlert[];
}

export default function KeyIntelligenceFeed({ alerts }: Props) {
  const [filter, setFilter] = useState("All Updates");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const subFilters = ["All Updates", "High Impact", "Competitors", "Ideas & Innovations"];

  // Filter alerts based on sub-filters
  const displayedAlerts = alerts.filter((a) => {
    if (filter === "High Impact") return a.impact.severity === "CRITICAL" || a.impact.severity === "HIGH";
    if (filter === "Competitors") return a.affected_competitors.length > 0;
    return true;
  });

  const getThumbnail = (title: string, idx: number) => {
    if (title.toLowerCase().includes("cerebras") || title.toLowerCase().includes("wafer")) {
      return (
        <div className="h-24 w-28 shrink-0 rounded-xl bg-gradient-to-br from-amber-700 via-amber-900 to-black p-2 flex items-center justify-center border border-amber-800/40 shadow-xs">
          <div className="h-16 w-16 rounded border-2 border-amber-400/80 bg-amber-950/80 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:6px_6px] opacity-60"></div>
            <Cpu className="h-7 w-7 text-amber-300 relative z-10" />
          </div>
        </div>
      );
    } else if (title.toLowerCase().includes("nvidia") || title.toLowerCase().includes("cluster")) {
      return (
        <div className="h-24 w-28 shrink-0 rounded-xl bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 p-2 flex items-center justify-center border border-slate-700/50 shadow-xs">
          <div className="h-16 w-16 rounded border border-emerald-500/60 bg-black flex items-center justify-center relative">
            <Server className="h-7 w-7 text-emerald-400" />
          </div>
        </div>
      );
    } else {
      return (
        <div className="h-24 w-28 shrink-0 rounded-xl bg-gradient-to-br from-sky-900 via-indigo-950 to-purple-950 p-2 flex items-center justify-center border border-sky-800/40 shadow-xs">
          <div className="h-16 w-16 rounded-full border border-sky-400/70 bg-sky-950/60 flex items-center justify-center">
            <Layers className="h-7 w-7 text-sky-300" />
          </div>
        </div>
      );
    }
  };

  const getTagColor = (severity: string) => {
    switch (severity) {
      case "CRITICAL":
      case "HIGH":
        return "bg-[#FEE2E2] text-[#DC2626]";
      case "MEDIUM":
        return "bg-[#FEF3C7] text-[#B45309]";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm space-y-4">
      {/* Feed Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-base font-bold text-slate-900 mr-2">Key Intelligence</h2>
          {subFilters.map((sf) => (
            <button
              key={sf}
              onClick={() => setFilter(sf)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                filter === sf
                  ? "bg-[#0F5132] text-white shadow-2xs"
                  : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              {sf}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1 text-xs text-slate-500 font-medium cursor-pointer">
          <span>Sort: Most Relevant</span>
          <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
        </div>
      </div>

      {/* Feed List Items */}
      <div className="space-y-3.5">
        {displayedAlerts.map((alert, idx) => {
          const isExpanded = expandedId === alert.id;
          return (
            <div
              key={alert.id}
              className="rounded-xl border border-slate-200/80 bg-white p-4 transition-all hover:border-slate-300 hover:shadow-xs"
            >
              <div className="flex gap-4 items-start">
                {/* Visual Thumbnail */}
                {getThumbnail(alert.event_title, idx)}

                {/* Content */}
                <div className="flex-1 min-w-0">
                  {/* Top Badges & Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded px-2 py-0.5 text-[10px] font-bold ${getTagColor(
                          alert.impact.severity
                        )}`}
                      >
                        {alert.impact.severity === "CRITICAL"
                          ? "High Impact"
                          : alert.impact.severity === "HIGH"
                          ? "Competitive Move"
                          : "Industry Trend"}
                      </span>
                      <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-700">
                        {alert.primary_entity_name}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-slate-400">
                      <button className="rounded p-1 hover:bg-slate-100 hover:text-slate-600">
                        <Bookmark className="h-4 w-4" />
                      </button>
                      <button className="rounded p-1 hover:bg-slate-100 hover:text-slate-600">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Title */}
                  <h3
                    onClick={() => setExpandedId(isExpanded ? null : alert.id)}
                    className="mt-1.5 text-sm font-bold text-slate-900 hover:text-[#0F5132] cursor-pointer transition-colors leading-snug"
                  >
                    {alert.event_title}
                  </h3>

                  {/* Description */}
                  <p className="mt-1 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {alert.what_changed}
                  </p>

                  {/* Meta Footer */}
                  <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-400">
                    <div className="flex items-center gap-2">
                      <span>
                        {new Date(alert.timestamp).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                      <span>•</span>
                      <span>Product Launch</span>
                      <span>•</span>
                      <span>
                        Impact:{" "}
                        <strong
                          className={
                            alert.impact.severity === "CRITICAL"
                              ? "text-rose-600 font-bold"
                              : "text-amber-600 font-bold"
                          }
                        >
                          {alert.impact.severity === "CRITICAL" ? "High" : "Medium"}
                        </strong>
                      </span>
                    </div>

                    <button
                      onClick={() => setExpandedId(isExpanded ? null : alert.id)}
                      className="flex items-center gap-1 font-semibold text-[#0F5132] hover:underline"
                    >
                      <span>{isExpanded ? "Less" : "Why it matters"}</span>
                      {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Expandable Why It Matters & Evidence Drawer */}
              {isExpanded && (
                <div className="mt-4 border-t border-slate-100 pt-3.5 space-y-3">
                  <div className="rounded-lg bg-[#FEF3C7]/40 border border-[#FDE68A] p-3 text-xs">
                    <strong className="text-amber-900 block mb-1">Strategic Significance:</strong>
                    <span className="text-amber-800 leading-relaxed">{alert.why_it_matters}</span>
                  </div>

                  {alert.affected_competitors.length > 0 && (
                    <div className="text-xs">
                      <strong className="text-slate-800 block mb-1.5">Affected Competitors:</strong>
                      <div className="flex flex-wrap gap-1.5">
                        {alert.affected_competitors.map((c) => (
                          <span
                            key={c.competitor_id}
                            className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-medium text-slate-700"
                          >
                            {c.competitor_name} ({c.threat_level} Threat)
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
