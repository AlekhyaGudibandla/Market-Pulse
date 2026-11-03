"use client";

import { useEffect, useState } from "react";
import { fetchAlerts } from "@/lib/api";
import { IntelligenceAlert } from "@/lib/types";
import AlertCard from "@/components/AlertCard";
import { Bell, Search, ShieldAlert, Sparkles } from "lucide-react";

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
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Bell className="h-4 w-4 text-[#0F5132]" />
            <span className="text-xs font-mono font-semibold text-[#0F5132] uppercase tracking-wider">
              Traceable Intelligence Feed
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Competitive Shift Alerts
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Synthesized alerts explaining what changed, why it matters, affected competitors, and traceable source proof.
          </p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="mt-6 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm">
        <div className="grid gap-4 md:grid-cols-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by company, chip, patent, or topic..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2 pl-9 pr-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#0F5132] focus:bg-white focus:outline-none transition-colors"
            />
          </div>

          {/* Severity Pills */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-500 mr-1 flex items-center gap-1 font-medium">
              <ShieldAlert className="h-3.5 w-3.5 text-rose-600" /> Disruption:
            </span>
            {["ALL", "CRITICAL", "HIGH", "MEDIUM"].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setSeverity(lvl)}
                className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-all ${
                  severity === lvl
                    ? "bg-[#0F5132] text-white shadow-2xs"
                    : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>

          {/* Novelty Slider */}
          <div className="flex items-center gap-3">
            <Sparkles className="h-4 w-4 text-[#0F5132]" />
            <div className="flex-1">
              <div className="flex justify-between text-xs text-slate-600 mb-1">
                <span>Min Novelty:</span>
                <span className="font-mono font-bold text-[#0F5132]">{minNovelty}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="90"
                step="5"
                value={minNovelty}
                onChange={(e) => setMinNovelty(Number(e.target.value))}
                className="w-full accent-[#0F5132] cursor-pointer h-1.5 bg-slate-200 rounded-lg appearance-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Alerts List */}
      <div className="mt-6 space-y-4">
        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-slate-500">
            Loading intelligence alerts feed...
          </div>
        ) : filteredAlerts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center text-slate-500">
            No intelligence alerts matched current filter parameters.
          </div>
        ) : (
          filteredAlerts.map((alert) => <AlertCard key={alert.id} alert={alert} />)
        )}
      </div>
    </div>
  );
}
