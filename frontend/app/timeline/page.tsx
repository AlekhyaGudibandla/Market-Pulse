"use client";

import { useEffect, useState } from "react";
import { fetchCompetitorsMatrix } from "@/lib/api";
import { CompetitorCompany } from "@/lib/types";
import { Clock, ShieldAlert, Cpu, Box, CheckCircle2, ArrowRight } from "lucide-react";

export default function TimelinePage() {
  const [companies, setCompanies] = useState<CompetitorCompany[]>([]);
  const [activeCompany, setActiveCompany] = useState<string>("company_nvidia");

  useEffect(() => {
    async function load() {
      const data = await fetchCompetitorsMatrix();
      setCompanies(data);
    }
    load();
  }, []);

  const timelineMilestones: Record<string, Array<{ date: string; title: string; significance: string; threat: string }>> = {
    company_nvidia: [
      { date: "March 2024", title: "Blackwell Architecture Unveiled", significance: "208B dual-die GPU with 5th Gen NVLink for 20 PFLOPS compute.", threat: "HIGH" },
      { date: "June 2024", title: "Blackwell Ultra B300 Announced", significance: "Expanded 288GB HBM3e memory to neutralize AMD MI300X capacity edge.", threat: "CRITICAL" },
      { date: "October 2024", title: "US Patent 11,894,302 Published", significance: "Direct wafer-substrate optical interconnect patent removing electrical copper retimers.", threat: "HIGH" },
    ],
    company_cerebras: [
      { date: "March 2024", title: "CS-3 Wafer Scale Engine Launched", significance: "4 trillion transistors, 900,000 cores, 44GB on-chip SRAM fabricated on TSMC 5nm.", threat: "CRITICAL" },
      { date: "August 2024", title: "Cerebras Inference Cloud Public Beta", significance: "Real-time token generation for Llama-3 at 1,800 tokens/sec, setting new world record.", threat: "CRITICAL" },
    ],
    company_groq: [
      { date: "September 2023", title: "First LPU Deterministic Architecture Shipped", significance: "Single-core deterministic tensor streaming processor eliminating external DRAM walls.", threat: "HIGH" },
      { date: "May 2024", title: "Aramco Digital Multi-Megawatt Datacenter Pact", significance: "Secures first large-scale sovereign enterprise cloud contract outside North America.", threat: "HIGH" },
    ],
    company_amd: [
      { date: "December 2023", title: "Instinct MI300X Commercial Release", significance: "192GB HBM3 generative AI accelerator competing with NVIDIA H100.", threat: "HIGH" },
      { date: "June 2024", title: "Instinct MI325X Counter-Strike", significance: "256GB HBM3e accelerator offering 6.0 TB/s bandwidth.", threat: "HIGH" },
    ],
  };

  const selectedMilestones = timelineMilestones[activeCompany] || timelineMilestones["company_nvidia"];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Clock className="h-4 w-4 text-accent-blue" />
            <span className="text-xs font-mono font-semibold text-accent-blue uppercase tracking-wider">
              Chronological Competitive Linage
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Competitor Timelines &amp; Milestone Shifts
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Reconstructing evolutionary milestone trajectories to forecast future counter-responses.
          </p>
        </div>
      </div>

      {/* Company Selector Tabs */}
      <div className="mt-6 flex flex-wrap gap-2">
        {companies.map((c) => (
          <button
            key={c.id}
            onClick={() => setActiveCompany(c.id)}
            className={`flex items-center gap-2 rounded-lg border px-4 py-2.5 text-xs font-bold transition-all ${
              activeCompany === c.id
                ? "border-accent-blue bg-accent-blue/15 text-accent-blue shadow-md"
                : "border-border bg-surface text-slate-400 hover:text-white hover:bg-surfaceElevated"
            }`}
          >
            <Cpu className="h-3.5 w-3.5" />
            {c.name}
          </button>
        ))}
      </div>

      {/* Timeline Stream */}
      <div className="mt-8 relative border-l-2 border-slate-800 ml-4 pl-6 space-y-8">
        {selectedMilestones.map((ms, idx) => (
          <div key={idx} className="relative group">
            {/* Timeline Dot */}
            <div className="absolute -left-[31px] top-1.5 h-3.5 w-3.5 rounded-full border-2 border-accent-blue bg-[#090d16] group-hover:bg-accent-blue transition-colors" />

            {/* Milestone Card */}
            <div className="rounded-xl border border-border bg-surface p-5 shadow-lg">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="rounded bg-accent-blue/10 border border-accent-blue/30 px-2 py-0.5 font-mono text-[11px] font-bold text-accent-blue">
                  {ms.date}
                </span>
                <span className="rounded bg-rose-500/15 border border-rose-500/40 px-2 py-0.5 text-[10px] font-bold text-rose-400">
                  {ms.threat} IMPACT
                </span>
              </div>

              <h3 className="mt-2 text-base font-bold text-white">{ms.title}</h3>
              <p className="mt-1 text-xs text-slate-300 leading-relaxed">{ms.significance}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
