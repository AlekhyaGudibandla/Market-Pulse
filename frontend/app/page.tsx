"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchAlerts, fetchCompetitorsMatrix } from "@/lib/api";
import { IntelligenceAlert, CompetitorCompany } from "@/lib/types";
import AlertCard from "@/components/AlertCard";
import ImpactRadar from "@/components/ImpactRadar";
import {
  Activity,
  ShieldAlert,
  Layers,
  ArrowRight,
  TrendingUp,
  Cpu,
  Zap,
  Network
} from "lucide-react";

export default function Dashboard() {
  const [alerts, setAlerts] = useState<IntelligenceAlert[]>([]);
  const [companies, setCompanies] = useState<CompetitorCompany[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [alertsData, companiesData] = await Promise.all([
          fetchAlerts(),
          fetchCompetitorsMatrix(),
        ]);
        setAlerts(alertsData);
        setCompanies(companiesData);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Hero Header */}
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="flex h-2 w-2 rounded-full bg-accent-blue animate-ping" />
            <span className="text-xs font-mono font-semibold text-accent-blue uppercase tracking-wider">
              Continuous Intelligence Engine · AI Infrastructure Vertical
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Competitive Landscape Radar
          </h1>
          <p className="mt-1 text-sm text-slate-400 max-w-2xl">
            Detecting how new silicon announcements, patent publications, and foundry alliances alter market positioning — grounded in traceable evidence.
          </p>
        </div>

        {/* Quick Nav Actions */}
        <div className="flex items-center gap-3">
          <Link
            href="/graph"
            className="flex items-center gap-1.5 rounded-lg border border-border bg-surfaceElevated px-3.5 py-2 text-xs font-medium text-slate-200 hover:text-white hover:border-slate-500 transition-all"
          >
            <Network className="h-4 w-4 text-accent-blue" />
            Explore Graph
          </Link>
          <Link
            href="/impact-analyzer"
            className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-accent-indigo to-accent-blue px-3.5 py-2 text-xs font-semibold text-white shadow-md shadow-accent-indigo/25 hover:opacity-95 transition-all"
          >
            <Zap className="h-4 w-4 fill-current" />
            Simulate Event Shift
          </Link>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-border bg-surface p-4">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Monitoring Pipeline
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-white">Continuous</span>
            <span className="text-xs text-emerald-400 font-semibold font-mono">0.02s lag</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Kafka KRaft Backbone</span>
        </div>

        <div className="rounded-xl border border-border bg-surface p-4">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Active Landscape Entities
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-accent-blue">24 Nodes</span>
            <span className="text-xs text-slate-400 font-mono">38 Edges</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Bi-Temporal Graph</span>
        </div>

        <div className="rounded-xl border border-border bg-surface p-4">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Critical Alerts Emitted
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-rose-400">
              {alerts.filter((a) => a.impact.severity === "CRITICAL").length} High Priority
            </span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Traceable What / Why</span>
        </div>

        <div className="rounded-xl border border-border bg-surface p-4">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Noise Suppression Rate
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-accent-emerald">42.8%</span>
            <span className="text-xs text-emerald-400">Suppressed</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">SHA-256 Idempotency</span>
        </div>
      </div>

      {/* Main Grid: Radar on Left, Alerts on Right */}
      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {/* Left Column: Disruption Radar & Top Competitors */}
        <div className="space-y-6 lg:col-span-1">
          <ImpactRadar />

          {/* Top Competitor Centrality Leaderboard */}
          <div className="rounded-xl border border-border bg-surface p-5 shadow-lg">
            <div className="flex items-center justify-between border-b border-border pb-3 mb-3">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Ecosystem Centrality Ranking
              </h3>
              <Link href="/timeline" className="text-[11px] text-accent-blue hover:underline flex items-center gap-1">
                Matrix <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="space-y-2.5">
              {companies.slice(0, 5).map((comp, idx) => (
                <div
                  key={comp.id}
                  className="flex items-center justify-between rounded-lg border border-slate-800 bg-surfaceElevated p-2.5"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-5 w-5 items-center justify-center rounded bg-slate-800 text-[10px] font-bold font-mono text-slate-400">
                      {idx + 1}
                    </span>
                    <div>
                      <span className="text-xs font-bold text-white block">{comp.name}</span>
                      <span className="text-[10px] text-slate-400">{comp.market_tier}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-accent-blue">
                      {comp.centrality_score}
                    </span>
                    <span className="text-[10px] text-slate-500 block">Centrality</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Live High-Impact Intelligence Alerts Feed */}
        <div className="space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-accent-rose" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200">
                Actionable Intelligence Alerts ({alerts.length})
              </h2>
            </div>
            <Link
              href="/alerts"
              className="text-xs font-semibold text-accent-blue hover:underline flex items-center gap-1"
            >
              Full Feed &amp; Filters <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="p-8 text-center text-slate-400">Loading intelligence stream...</div>
          ) : (
            <div className="space-y-4">
              {alerts.slice(0, 3).map((alert) => (
                <AlertCard key={alert.id} alert={alert} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
