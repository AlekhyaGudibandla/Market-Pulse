import { Info } from "lucide-react";

export default function LandscapeHeatmap() {
  const blocks = [
    { label: "AI Hardware", percentage: "32%", bg: "bg-[#0F5132] text-white", colSpan: "col-span-2" },
    { label: "Cloud & Infra", percentage: "20%", bg: "bg-[#DCFCE7] text-[#0F5132]", colSpan: "col-span-1" },
    { label: "Semiconductors", percentage: "18%", bg: "bg-[#E8F5E9] text-[#166534]", colSpan: "col-span-1" },
    { label: "Foundation Models", percentage: "14%", bg: "bg-[#F3F4F6] text-slate-800", colSpan: "col-span-2" },
    { label: "Packaging", percentage: "9%", bg: "bg-[#F3F4F6] text-slate-800", colSpan: "col-span-1" },
    { label: "Others", percentage: "7%", bg: "bg-[#F3F4F6] text-slate-800", colSpan: "col-span-1" },
  ];

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 mb-3">
        <span>Landscape Heatmap</span>
        <Info className="h-3.5 w-3.5 text-slate-400 cursor-pointer" />
      </div>

      {/* Grid of Proportional Blocks */}
      <div className="grid grid-cols-4 gap-2 h-36">
        {blocks.map((b, i) => (
          <div
            key={i}
            className={`${b.colSpan} ${b.bg} rounded-xl p-3 flex flex-col justify-between transition-transform hover:scale-[1.02] cursor-pointer shadow-2xs`}
          >
            <span className="text-[11px] font-semibold leading-tight">{b.label}</span>
            <span className="text-sm font-bold font-mono">{b.percentage}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
