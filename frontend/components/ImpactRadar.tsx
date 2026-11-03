"use client";

import { Cpu, Box, Code, Cloud, Disc } from "lucide-react";

export default function ImpactRadar() {
  const radarDimensions = [
    { label: "AI Silicon Hardware", level: "CRITICAL", score: 94, icon: Cpu, color: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/30" },
    { label: "CoWoS Packaging", level: "HIGH", score: 88, icon: Box, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/30" },
    { label: "Frontier Foundation Models", level: "HIGH", score: 82, icon: Disc, color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/30" },
    { label: "Developer Agentic IDEs", level: "MEDIUM", score: 76, icon: Code, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/30" },
    { label: "Cloud Hyperscaler ASICs", level: "HIGH", score: 85, icon: Cloud, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/30" },
  ];

  return (
    <div className="rounded-xl border border-border bg-surface p-5 shadow-lg">
      <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Competitive Disruption Radar
          </h3>
          <p className="text-xs text-slate-400">Current volatility across AI infrastructure stack</p>
        </div>
        <span className="rounded-full bg-rose-500/15 border border-rose-500/40 px-2.5 py-0.5 text-[10px] font-bold text-rose-400 uppercase">
          ELEVATED RISK
        </span>
      </div>

      <div className="space-y-3">
        {radarDimensions.map((dim) => {
          const Icon = dim.icon;
          return (
            <div key={dim.label} className="rounded-lg border border-slate-800 bg-surfaceElevated p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-md ${dim.bg} ${dim.border} border`}>
                    <Icon className={`h-4 w-4 ${dim.color}`} />
                  </div>
                  <span className="text-xs font-semibold text-slate-200">{dim.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded border ${dim.bg} ${dim.border} ${dim.color}`}>
                    {dim.level}
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-300">{dim.score}%</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-900">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-accent-blue via-accent-indigo to-accent-rose transition-all duration-500"
                  style={{ width: `${dim.score}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
