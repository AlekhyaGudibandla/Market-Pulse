"use client";

import { useEffect, useState } from "react";
import { fetchGraphTopology } from "@/lib/api";
import { GraphTopology } from "@/lib/types";
import GraphVisualization from "@/components/GraphVisualization";
import { Network, Calendar, Info, ShieldCheck } from "lucide-react";

export default function GraphExplorerPage() {
  const [graphData, setGraphData] = useState<GraphTopology>({ nodes: [], edges: [] });
  const [selectedYear, setSelectedYear] = useState<number>(2024);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchGraphTopology();
        setGraphData(data);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Filter edges by valid_since year
  const temporallyFilteredData = {
    ...graphData,
    edges: graphData.edges.filter((e) => {
      const year = new Date(e.valid_since).getFullYear();
      return year <= selectedYear;
    }),
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Network className="h-4 w-4 text-[#0F5132]" />
            <span className="text-xs font-mono font-semibold text-[#0F5132] uppercase tracking-wider">
              Neo4j Bi-Temporal Graph Engine
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Knowledge Graph Explorer
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Interactive multi-hop relationship model tracking partnerships, supply-chain links, and competitor rivalries across time.
          </p>
        </div>
      </div>

      {/* Time-Travel Historical Slider */}
      <div className="mt-6 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-[#0F5132]" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Temporal Time-Travel Scrub
            </span>
            <span className="text-xs text-slate-500">
              (Reconstructs competitive topology active as of year)
            </span>
          </div>

          <div className="flex items-center gap-4 w-full sm:w-80">
            <input
              type="range"
              min="2020"
              max="2024"
              step="1"
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="w-full accent-[#0F5132] cursor-pointer h-1.5 bg-slate-200 rounded-lg appearance-none"
            />
            <span className="rounded-lg bg-[#F0FDF4] border border-[#D1E7DD] px-3 py-1 font-mono text-xs font-bold text-[#0F5132]">
              {selectedYear}
            </span>
          </div>
        </div>
      </div>

      {/* Graph Visualizer Canvas */}
      <div className="mt-6">
        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-16 text-center text-slate-500">
            Initializing Knowledge Graph Topology...
          </div>
        ) : (
          <GraphVisualization data={temporallyFilteredData} />
        )}
      </div>

      {/* Engineering Callout */}
      <div className="mt-6 rounded-2xl border border-slate-200/90 bg-white p-5 text-xs text-slate-600 shadow-sm flex items-start gap-3">
        <Info className="h-5 w-5 text-[#0F5132] shrink-0 mt-0.5" />
        <div>
          <strong className="text-slate-900 block mb-1">
            Bi-Temporal Graph Architecture:
          </strong>
          Relationships in MarketPulse are never hard-deleted or blindly overwritten. Every edge maintains non-destructive
          <code className="mx-1 rounded bg-slate-100 px-1.5 py-0.5 text-slate-800 font-mono text-[11px]">valid_since</code>
          and
          <code className="mx-1 rounded bg-slate-100 px-1.5 py-0.5 text-slate-800 font-mono text-[11px]">valid_until</code>
          intervals alongside cryptographic evidence transaction IDs. Scrubbing the year slider filters the active edges to reconstruct exactly what was valid at that moment in history.
        </div>
      </div>
    </div>
  );
}
