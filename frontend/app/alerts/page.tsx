"use client";

import { useEffect, useState } from "react";
import { fetchAlerts } from "@/lib/api";
import { IntelligenceAlert, SeverityLevel } from "@/lib/types";
import AlertCard from "@/components/AlertCard";
import { Bell, Filter, Search, ShieldAlert, Sparkles } from "lucide-react";

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<IntelligenceAlert[]>([]);
  const [filteredAlerts, setFilteredAlerts] = useState<IntelligenceAlert[]>([]);
  const [search, setSearch] = useState("");
  const [severity, setSeverity] = useState<string>("ALL");
  const [minNovelty, setMinNovelty] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAlerts() {
      try {
        const data = await fetchAlerts();
        setAlerts(data);
        setFilteredAlerts(data);
      } finally {
        setLoading(false);
      }
    }
    loadAlerts();
  }, []);

  useEffect(() => {
    let res = alerts;

    if (severity !== "ALL") {
      res = res.filter((a) => a.impact.severity === severity);
    }
    if (minNovelty > 0) {
      res = res.filter((a) => a.novelty.overall_novelty >= minNovelty / 100);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      res = res.filter(
        (a) =>
          a.event_title.toLowerCase().includes(q) ||
          a.primary_entity_name.toLowerCase().includes(q) ||
          a.what_changed.toLowerCase().includes(q)
      );
    }

    setFilteredAlerts(res);
  }, [search, severity, minNovelty, alerts]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Bell className="h-4 w-4 text-accent-blue" />
            <span className="text-xs font-mono font-semibold text-accent-blue uppercase tracking-wider">
              Traceable Intelligence Feed
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Competitive Shift Alerts
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Synthesized alerts explaining what changed, why it matters, affected competitors, and traceable source proof.
          </p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="mt-6 rounded-xl border border-border bg-surface p-4 shadow-md">
        <div className="grid gap-4 md:grid-cols-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by company, chip, patent, or topic..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-surfaceElevated py-2 pl-9 pr-3 text-xs text-white placeholder-slate-400 focus:border-accent-blue focus:outline-none"
            />
          </div>

          {/* Severity Pills */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-400 mr-1 flex items-center gap-1">
              <ShieldAlert className="h-3.5 w-3.5 text-accent-rose" /> Disruption:
            </span>
            {["ALL", "CRITICAL", "HIGH", "MEDIUM"].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setSeverity(lvl)}
                className={`rounded px-2.5 py-1 text-[11px] font-semibold transition-all ${
                  severity === lvl
                    ? "bg-accent-blue/20 text-accent-blue border border-accent-blue/40"
                    : "bg-surfaceElevated text-slate-400 hover:text-white"
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>

          {/* Novelty Slider */}
          <div className="flex items-center gap-3">
            <Sparkles className="h-4 w-4 text-accent-blue" />
            <div className="flex-1">
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>Min Novelty:</span>
                <span className="font-mono font-bold text-accent-blue">{minNovelty}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="90"
                step="5"
                value={minNovelty}
                onChange={(e) => setMinNovelty(Number(e.target.value))}
                className="w-full accent-accent-blue cursor-pointer h-1.5 bg-slate-800 rounded-lg appearance-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Alerts List */}
      <div className="mt-6 space-y-4">
        {loading ? (
          <div className="p-12 text-center text-slate-400">Loading intelligence alerts feed...</div>
        ) : filteredAlerts.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-800 p-12 text-center text-slate-400">
            No intelligence alerts matched current filter parameters.
          </div>
        ) : (
          filteredAlerts.map((alert) => <AlertCard key={alert.id} alert={alert} />)
        )}
      </div>
    </div>
  );
}
