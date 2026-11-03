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
  HelpCircle
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
        return "bg-rose-50 text-rose-700 border-rose-200";
      case "HIGH":
        return "bg-amber-50 text-amber-800 border-amber-200";
      case "MEDIUM":
        return "bg-blue-50 text-blue-700 border-blue-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm transition-all hover:border-slate-300">
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
          <span className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-700 font-semibold">
            {alert.primary_entity_name}
          </span>
          <span className="text-[11px] text-slate-400 font-mono">
            {new Date(alert.timestamp).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>

        {/* Novelty & Impact Metrics */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 rounded-lg bg-slate-50 px-2.5 py-1 text-xs border border-slate-100">
            <Sparkles className="h-3.5 w-3.5 text-[#0F5132]" />
            <span className="text-slate-500">Novelty:</span>
            <span className="font-bold text-[#0F5132]">
              {Math.round(alert.novelty.overall_novelty * 100)}%
            </span>
          </div>
          <div className="flex items-center gap-1.5 rounded-lg bg-slate-50 px-2.5 py-1 text-xs border border-slate-100">
            <ShieldAlert className="h-3.5 w-3.5 text-rose-600" />
            <span className="text-slate-500">Impact:</span>
            <span className="font-bold text-rose-600">
              {Math.round(alert.impact.overall_impact * 100)}%
            </span>
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Headline */}
      <h3 className="mt-3 text-base font-bold text-slate-900 hover:text-[#0F5132] transition-colors leading-snug">
        {alert.event_title}
      </h3>

      {/* WHAT CHANGED */}
      <div className="mt-3 rounded-xl border border-slate-200/80 bg-slate-50/70 p-4">
        <div className="flex items-center gap-1.5 text-xs font-bold text-[#0F5132] uppercase tracking-wider">
          <Layers className="h-3.5 w-3.5" />
          What Changed (Competitive Landscape Shift)
        </div>
        <p className="mt-1.5 text-xs leading-relaxed text-slate-700">{alert.what_changed}</p>
      </div>

      {/* EXPANDED DEEP-DIVE DETAILS */}
      {expanded && (
        <div className="mt-4 space-y-3.5 border-t border-slate-100 pt-4">
          {/* WHY IT MATTERS */}
          <div className="rounded-xl border border-amber-200 bg-[#FEF3C7]/40 p-4">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 uppercase tracking-wider">
              <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
              Why It Matters (Strategic Business Significance)
            </div>
            <p className="mt-1.5 text-xs leading-relaxed text-amber-950">{alert.why_it_matters}</p>
          </div>

          {/* AFFECTED COMPETITORS */}
          {alert.affected_competitors.length > 0 && (
            <div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Potentially Affected Competitors &amp; Threat Level
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                {alert.affected_competitors.map((comp) => (
                  <div
                    key={comp.competitor_id}
                    className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">{comp.competitor_name}</span>
                      <span
                        className={`rounded px-1.5 py-0.5 text-[10px] font-bold border ${getSeverityBadge(
                          comp.threat_level
                        )}`}
                      >
                        {comp.threat_level} THREAT
                      </span>
                    </div>
                    <p className="mt-1.5 text-[11px] text-slate-600 leading-normal">{comp.why_affected}</p>
                    <div className="mt-2 text-[10px] font-mono text-slate-400">
                      Graph Distance: {comp.graph_distance} Hop{comp.graph_distance > 1 ? "s" : ""}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* HISTORICAL CONTEXT */}
          <div className="rounded-xl bg-slate-50 border border-slate-200/80 p-3.5 text-xs">
            <span className="font-bold text-slate-800">Historical Lineage: </span>
            <span className="text-slate-600 leading-relaxed">{alert.historical_context}</span>
          </div>

          {/* TRACEABLE EVIDENCE CHAIN */}
          {alert.evidence_chain.length > 0 && (
            <div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Traceable Evidence &amp; Verification Sources
              </div>
              <div className="space-y-1.5">
                {alert.evidence_chain.map((ev, i) => (
                  <div
                    key={i}
                    className="flex items-start justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50/50 p-2.5 text-xs"
                  >
                    <div>
                      <p className="italic text-slate-700 font-serif">"{ev.statement}"</p>
                      <span className="text-[11px] text-slate-400 mt-1 block">
                        Source: {ev.source_title} ({ev.published_at})
                      </span>
                    </div>
                    {ev.source_url && (
                      <a
                        href={ev.source_url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 text-[11px] font-medium text-[#0F5132] hover:underline whitespace-nowrap"
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
              <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700 uppercase">
                  <HelpCircle className="h-3.5 w-3.5 text-amber-500" />
                  Remaining Uncertainties
                </div>
                <ul className="mt-1.5 space-y-1 text-[11px] text-slate-600 list-disc list-inside">
                  {alert.remaining_uncertainties.map((u, i) => (
                    <li key={i}>{u}</li>
                  ))}
                </ul>
              </div>
            )}

            {alert.recommended_strategic_actions.length > 0 && (
              <div className="rounded-xl border border-[#D1E7DD] bg-[#F0FDF4] p-3.5">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#0F5132] uppercase">
                  <ArrowRight className="h-3.5 w-3.5 text-[#0F5132]" />
                  Recommended Actions
                </div>
                <ul className="mt-1.5 space-y-1 text-[11px] text-slate-700 list-disc list-inside">
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
