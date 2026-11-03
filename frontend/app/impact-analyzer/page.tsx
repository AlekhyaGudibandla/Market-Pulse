"use client";

import { useState } from "react";
import { simulateChangeImpact } from "@/lib/api";
import { Zap, ShieldAlert, Sparkles, AlertTriangle, ArrowRight, Layers, FileText } from "lucide-react";

export default function ImpactAnalyzerPage() {
  const [title, setTitle] = useState(
    "OpenAI and Broadcom Partner to Fabricate Dedicated Inference Silicon at TSMC"
  );
  const [content, setContent] = useState(
    "OpenAI has finalized agreements with Broadcom and TSMC to design and manufacture an in-house custom AI ASIC optimized for o1 reasoning and ChatGPT token generation. Production is expected on TSMC's 3nm line, aimed directly at lowering dependence on NVIDIA's high-margin GPU clusters."
  );
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const presets = [
    {
      title: "OpenAI and Broadcom Partner to Fabricate Dedicated Inference Silicon at TSMC",
      content:
        "OpenAI has finalized agreements with Broadcom and TSMC to design and manufacture an in-house custom AI ASIC optimized for o1 reasoning and ChatGPT token generation. Production is expected on TSMC's 3nm line, aimed directly at lowering dependence on NVIDIA's high-margin GPU clusters.",
    },
    {
      title: "Google DeepMind Contracts Cerebras for 10,000 WSE-3 Chip Sovereign AI Datacenter",
      content:
        "Google Cloud entered a multi-year partnership with Cerebras Systems to co-locate wafer-scale CS-3 engines alongside Google TPU v6 Trillium pods, targeting ultra-low latency real-time coding agents.",
    },
    {
      title: "Groq and Microsoft Azure Announce Global LPU Cloud Deployment Pact",
      content:
        "Microsoft Azure will offer Groq Language Processing Units as a managed service within Azure AI Studio, guaranteeing 500 tokens/sec SLA for enterprise customers deploying Llama-3.",
    },
  ];

  const handleSimulate = async () => {
    setLoading(true);
    try {
      const res = await simulateChangeImpact({ title, content });
      setResult(res);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Zap className="h-4 w-4 text-accent-blue fill-current" />
            <span className="text-xs font-mono font-semibold text-accent-blue uppercase tracking-wider">
              Change-Impact Simulator &amp; Ripple Prediction
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Change-Impact Analysis Engine
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Simulate how a hypothetical partnership, chip launch, or acquisition alters the competitive landscape before making strategic commitments.
          </p>
        </div>
      </div>

      {/* Preset Quick Selectors */}
      <div className="mt-6 flex flex-wrap items-center gap-2">
        <span className="text-xs text-slate-400 font-semibold mr-1">Load Preset Scenario:</span>
        {presets.map((p, i) => (
          <button
            key={i}
            onClick={() => {
              setTitle(p.title);
              setContent(p.content);
            }}
            className="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs text-slate-300 hover:text-white hover:border-slate-500 transition-all truncate max-w-xs"
          >
            {p.title.split(":")[0]}
          </button>
        ))}
      </div>

      {/* Input Editor */}
      <div className="mt-4 rounded-xl border border-border bg-surface p-5 shadow-lg space-y-4">
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1">
            Announcement Headline
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-surfaceElevated p-2.5 text-xs text-white focus:border-accent-blue focus:outline-none"
          />
        </div>

        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1">
            Event Description &amp; Technical Disclosures
          </label>
          <textarea
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-surfaceElevated p-2.5 text-xs text-white focus:border-accent-blue focus:outline-none"
          />
        </div>

        <button
          onClick={handleSimulate}
          disabled={loading}
          className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-accent-indigo to-accent-blue px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-accent-indigo/30 hover:opacity-95 transition-all disabled:opacity-50"
        >
          <Zap className="h-4 w-4 fill-current" />
          {loading ? "Computing Graph Ripples & Centrality Shifts..." : "Run Change-Impact Analysis"}
        </button>
      </div>

      {/* Analysis Output Result */}
      {result && (
        <div className="mt-8 rounded-xl border border-accent-blue/30 bg-surface p-6 shadow-2xl animate-fade-in space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
            <div>
              <span className="rounded bg-accent-blue/15 border border-accent-blue/40 px-2.5 py-0.5 text-[10px] font-bold text-accent-blue uppercase tracking-wider">
                Predicted Disruption: {result.impact.market_disruption_potential}
              </span>
              <h2 className="mt-2 text-lg font-bold text-white">{result.event_title}</h2>
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-surfaceElevated px-3 py-1.5 text-xs font-mono">
                <span className="text-slate-400">Novelty: </span>
                <span className="font-bold text-accent-blue">
                  {Math.round(result.novelty.overall_novelty * 100)}%
                </span>
              </div>
              <div className="rounded-lg bg-surfaceElevated px-3 py-1.5 text-xs font-mono">
                <span className="text-slate-400">Impact: </span>
                <span className="font-bold text-accent-rose">
                  {Math.round(result.impact.overall_impact * 100)}%
                </span>
              </div>
            </div>
          </div>

          {/* 5 Crucial Questions Answered */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-slate-800 bg-surfaceElevated p-4">
              <h3 className="text-xs font-bold text-accent-blue uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="h-4 w-4" /> 1. What New Relationship Was Formed?
              </h3>
              <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                Extracted entities: <code className="text-accent-blue">{result.extracted_entities.join(", ")}</code>.
                Established candidate link: PARTNERED_WITH / SUPPLIES_TO between primary entity and semiconductor manufacturing.
              </p>
            </div>

            <div className="rounded-lg border border-slate-800 bg-surfaceElevated p-4">
              <h3 className="text-xs font-bold text-accent-blue uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="h-4 w-4" /> 2. Was It Already Known Or Genuinely New?
              </h3>
              <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                {result.novelty.reasoning || "Genuinely novel edge. Not previously recorded in active temporal graph."}
              </p>
            </div>

            <div className="rounded-lg border border-slate-800 bg-surfaceElevated p-4 md:col-span-2">
              <h3 className="text-xs font-bold text-accent-rose uppercase tracking-wider flex items-center gap-1.5">
                <ShieldAlert className="h-4 w-4" /> 3. Potentially Affected Competitors &amp; Technologies
              </h3>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                {result.affected_competitors.map((c: any, idx: number) => (
                  <div key={idx} className="rounded border border-slate-800 bg-slate-900/60 p-2.5 text-xs">
                    <span className="font-bold text-slate-200 block">{c.competitor_name}</span>
                    <span className="text-[11px] text-slate-400 mt-1 block">{c.why_affected}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
