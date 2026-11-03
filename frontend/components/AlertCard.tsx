"use client";

import { useState } from "react";
import { IntelligenceAlert, SeverityLevel } from "@/lib/types";
import {
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  ShieldAlert,
  Sparkles,
  Layers,
  ArrowRight,
  HelpCircle,
  FileText
} from "lucide-react";

interface Props {
  alert: IntelligenceAlert;
  compact?: boolean;
}

export default function AlertCard({ alert, compact = false }: Props) {
  const [expanded, setExpanded] = useState(!compact);

  const getSeverityBadge = (level: SeverityLevel) => {
    switch (level) {
      case "CRITICAL":
        return "bg-rose-500/15 text-rose-400 border-rose-500/40";
      case "HIGH":
        return "bg-amber-500/15 text-amber-400 border-amber-500/40";
      case "MEDIUM":
        return "bg-blue-500/15 text-blue-400 border-blue-500/40";
      default:
        return "bg-slate-500/15 text-slate-400 border-slate-500/40";
    }
  };

  return (
    <div className="rounded-xl border border-border bg-surface p-5 shadow-lg transition-all hover:border-slate-600/70">
      {/* Top Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`rounded-md border px-2.5 py-0.5 text-[11px] font-bold tracking-wide uppercase ${getSeverityBadge(
              alert.impact.severity
            )}`}
          >
            {alert.impact.severity} DISRUPTION
          </span>
          <span className="rounded bg-surfaceElevated px-2 py-0.5 text-xs text-slate-300 font-medium">
            {alert.primary_entity_name}
          </span>
          <span className="text-[11px] text-slate-500 font-mono">
            {new Date(alert.timestamp).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>

        {/* Novelty & Impact Metrics */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 rounded-lg bg-surfaceElevated px-2.5 py-1 text-xs">
            <Sparkles className="h-3 w-3 text-accent-blue" />
            <span className="text-slate-400">Novelty:</span>
            <span className="font-bold text-accent-blue">
              {Math.round(alert.novelty.overall_novelty * 100)}%
            </span>
          </div>
          <div className="flex items-center gap-1.5 rounded-lg bg-surfaceElevated px-2.5 py-1 text-xs">
            <ShieldAlert className="h-3 w-3 text-accent-rose" />
            <span className="text-slate-400">Impact:</span>
            <span className="font-bold text-accent-rose">
              {Math.round(alert.impact.overall_impact * 100)}%
            </span>
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="rounded p-1 text-slate-400 hover:bg-surfaceElevated hover:text-white"
          >
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Headline */}
      <h3 className="mt-3 text-base font-bold text-slate-100 hover:text-accent-blue transition-colors">
        {alert.event_title}
      </h3>

      {/* WHAT CHANGED */}
      <div className="mt-3 rounded-lg border border-slate-800 bg-slate-900/60 p-3.5">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-accent-blue uppercase tracking-wider">
          <Layers className="h-3.5 w-3.5" />
          What Changed (Competitive Landscape Shift)
        </div>
        <p className="mt-1.5 text-xs leading-relaxed text-slate-300">{alert.what_changed}</p>
      </div>

      {/* EXPANDED DEEP-DIVE DETAILS */}
      {expanded && (
        <div className="mt-4 space-y-3.5 border-t border-slate-800/80 pt-4 animate-fade-in">
          {/* WHY IT MATTERS */}
          <div className="rounded-lg border border-amber-950/40 bg-amber-950/15 p-3.5">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-400 uppercase tracking-wider">
              <AlertTriangle className="h-3.5 w-3.5" />
              Why It Matters (Strategic Business Significance)
            </div>
            <p className="mt-1.5 text-xs leading-relaxed text-slate-300">{alert.why_it_matters}</p>
          </div>

          {/* AFFECTED COMPETITORS */}
          {alert.affected_competitors.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Potentially Affected Competitors &amp; Threat Level
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                {alert.affected_competitors.map((comp) => (
                  <div
                    key={comp.competitor_id}
                    className="flex flex-col justify-between rounded-lg border border-slate-800 bg-surfaceElevated p-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-200">{comp.competitor_name}</span>
                      <span
                        className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${getSeverityBadge(
                          comp.threat_level
                        )}`}
                      >
                        {comp.threat_level} THREAT
                      </span>
                    </div>
                    <p className="mt-1.5 text-[11px] text-slate-400 leading-normal">{comp.why_affected}</p>
                    <div className="mt-2 text-[10px] font-mono text-slate-500">
                      Graph Distance: {comp.graph_distance} Hop{comp.graph_distance > 1 ? "s" : ""}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* HISTORICAL CONTEXT */}
          <div className="rounded-lg bg-surfaceElevated p-3 text-xs">
            <span className="font-semibold text-slate-300">Historical Lineage: </span>
            <span className="text-slate-400 leading-relaxed">{alert.historical_context}</span>
          </div>

          {/* TRACEABLE EVIDENCE CHAIN */}
          {alert.evidence_chain.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Traceable Evidence &amp; Verification Sources
              </div>
              <div className="space-y-1.5">
                {alert.evidence_chain.map((ev, i) => (
                  <div
                    key={i}
                    className="flex items-start justify-between gap-3 rounded border border-slate-800/80 bg-slate-900/40 p-2 text-xs"
                  >
                    <div>
                      <p className="italic text-slate-300 font-serif">"{ev.statement}"</p>
                      <span className="text-[11px] text-slate-500 mt-1 block">
                        Source: {ev.source_title} ({ev.published_at})
                      </span>
                    </div>
                    {ev.source_url && (
                      <a
                        href={ev.source_url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 text-[11px] text-accent-blue hover:underline whitespace-nowrap"
                      >
                        Source <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* REMAINING UNCERTAINTIES & STRATEGIC ACTIONS */}
          <div className="grid gap-3 sm:grid-cols-2 pt-1">
            {alert.remaining_uncertainties.length > 0 && (
              <div className="rounded-lg border border-slate-800/80 bg-slate-900/30 p-3">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 uppercase">
                  <HelpCircle className="h-3.5 w-3.5 text-amber-400" />
                  Remaining Uncertainties
                </div>
                <ul className="mt-1.5 space-y-1 text-[11px] text-slate-400 list-disc list-inside">
                  {alert.remaining_uncertainties.map((u, i) => (
                    <li key={i}>{u}</li>
                  ))}
                </ul>
              </div>
            )}

            {alert.recommended_strategic_actions.length > 0 && (
              <div className="rounded-lg border border-slate-800/80 bg-slate-900/30 p-3">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 uppercase">
                  <ArrowRight className="h-3.5 w-3.5 text-accent-emerald" />
                  Recommended Actions
                </div>
                <ul className="mt-1.5 space-y-1 text-[11px] text-slate-300 list-disc list-inside">
                  {alert.recommended_strategic_actions.map((act, i) => (
                    <li key={i}>{act}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
