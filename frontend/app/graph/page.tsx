"use client";

import { useEffect, useState } from "react";
import { fetchGraphTopology } from "@/lib/api";
import { GraphTopology, GraphNode } from "@/lib/types";
import GraphVisualization from "@/components/GraphVisualization";
import { Network, Calendar, Sliders, Info, ShieldCheck } from "lucide-react";

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
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Network className="h-4 w-4 text-accent-blue" />
            <span className="text-xs font-mono font-semibold text-accent-blue uppercase tracking-wider">
              Neo4j Bi-Temporal Graph Engine
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Knowledge Graph Explorer
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Interactive multi-hop relationship model tracking partnerships, supply-chain links, and competitor rivalries across time.
          </p>
        </div>
      </div>

      {/* Time-Travel Historical Slider */}
      <div className="mt-6 rounded-xl border border-border bg-surface p-4 shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-accent-indigo" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Temporal Time-Travel Scrub
            </span>
            <span className="text-xs text-slate-400">
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
              className="w-full accent-accent-indigo cursor-pointer h-1.5 bg-slate-800 rounded-lg appearance-none"
            />
            <span className="rounded-lg bg-accent-indigo/20 border border-accent-indigo/40 px-3 py-1 font-mono text-xs font-bold text-accent-indigo">
              {selectedYear}
            </span>
          </div>
        </div>
      </div>

      {/* Graph Visualizer Canvas */}
      <div className="mt-6">
        {loading ? (
          <div className="p-16 text-center text-slate-400">Initializing Knowledge Graph Topology...</div>
        ) : (
          <GraphVisualization data={temporallyFilteredData} />
        )}
      </div>

      {/* Engineering Callout */}
      <div className="mt-6 rounded-xl border border-border bg-surface p-4 text-xs text-slate-400 flex items-start gap-3">
        <Info className="h-5 w-5 text-accent-blue shrink-0 mt-0.5" />
        <div>
          <strong className="text-slate-200 block mb-1">
            SDE-3 Bi-Temporal Graph Design:
          </strong>
          Relationships in MarketPulse are never deleted or overwritten when a deal expires or a product changes.
          Instead, <code className="text-accent-blue">valid_until</code> is assigned while preserving historical evidence,
          enabling full time-travel reconstruction for any past snapshot.
        </div>
      </div>
    </div>
  );
}
