"use client";

import { Cpu, Box, Code, Cloud, Disc } from "lucide-react";

export default function ImpactRadar() {
  const radarDimensions = [
    { label: "AI Silicon Hardware", level: "CRITICAL", score: 94, icon: Cpu, color: "text-rose-700", bg: "bg-rose-50", border: "border-rose-200", bar: "bg-rose-600" },
    { label: "CoWoS Packaging", level: "HIGH", score: 88, icon: Box, color: "text-amber-800", bg: "bg-amber-50", border: "border-amber-200", bar: "bg-amber-500" },
    { label: "Frontier Foundation Models", level: "HIGH", score: 82, icon: Disc, color: "text-purple-700", bg: "bg-purple-50", border: "border-purple-200", bar: "bg-purple-600" },
    { label: "Developer Agentic IDEs", level: "MEDIUM", score: 76, icon: Code, color: "text-blue-700", bg: "bg-blue-50", border: "border-blue-200", bar: "bg-blue-600" },
    { label: "Cloud Hyperscaler ASICs", level: "HIGH", score: 85, icon: Cloud, color: "text-[#0F5132]", bg: "bg-emerald-50", border: "border-emerald-200", bar: "bg-[#0F5132]" },
  ];

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Competitive Disruption Radar
          </h3>
          <p className="text-xs text-slate-500">Current volatility across AI infrastructure stack</p>
        </div>
        <span className="rounded-full bg-rose-50 border border-rose-200 px-2.5 py-0.5 text-[10px] font-bold text-rose-700 uppercase">
          ELEVATED RISK
        </span>
      </div>

      <div className="space-y-3">
        {radarDimensions.map((dim) => {
          const Icon = dim.icon;
          return (
            <div key={dim.label} className="rounded-xl border border-slate-200/80 bg-slate-50/60 p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-md ${dim.bg} ${dim.border} border`}>
                    <Icon className={`h-4 w-4 ${dim.color}`} />
                  </div>
                  <span className="text-xs font-semibold text-slate-800">{dim.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded border ${dim.bg} ${dim.border} ${dim.color}`}>
                    {dim.level}
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-700">{dim.score}%</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
                <div
                  className={`h-full rounded-full ${dim.bar} transition-all duration-500`}
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
