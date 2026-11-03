import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";

export default function IntelligenceCallout() {
  const shifts = [
    "Cerebras scales CS-3 to 900K cores.",
    "Rising activity in AI packaging (CoWoS).",
    "Increased competition in cloud ASICs.",
  ];

  return (
    <div className="rounded-2xl border border-[#D1E7DD] bg-[#F0FDF4] p-5 shadow-sm flex flex-col justify-between">
      <div>
        {/* Header with Beta Badge */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#0F5132]">
            <Sparkles className="h-4 w-4 text-[#0F5132]" />
            <span>AI Intelligence</span>
          </div>
          <span className="rounded-md bg-[#DCFCE7] px-1.5 py-0.5 text-[10px] font-bold text-[#0F5132]">
            Beta
          </span>
        </div>

        {/* Key Shifts Bullets */}
        <span className="text-xs font-semibold text-slate-800 block mb-2">Key shifts this week:</span>
        <ul className="space-y-1.5 text-xs text-slate-600">
          {shifts.map((s, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="text-slate-400 font-bold">•</span>
              <span className="leading-snug">{s}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Action Button */}
      <Link
        href="/rag-studio"
        className="mt-4 flex items-center justify-center gap-1.5 w-full rounded-xl border border-[#0F5132] bg-white py-2 text-xs font-bold text-[#0F5132] hover:bg-[#E8F5E9] shadow-2xs transition-all"
      >
        <span>Generate detailed report</span>
        <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}
