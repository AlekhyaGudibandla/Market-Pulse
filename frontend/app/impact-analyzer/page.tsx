"use client";

import { useState } from "react";
import { simulateChangeImpact } from "@/lib/api";
import { Zap, ShieldAlert, Sparkles, Layers } from "lucide-react";

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
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Zap className="h-4 w-4 text-[#0F5132]" />
            <span className="text-xs font-mono font-semibold text-[#0F5132] uppercase tracking-wider">
              Change-Impact Simulator &amp; Ripple Prediction
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Change-Impact Analysis Engine
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Simulate how a hypothetical partnership, chip launch, or acquisition alters the competitive landscape before making strategic commitments.
          </p>
        </div>
      </div>

      {/* Preset Quick Selectors */}
      <div className="mt-6 flex flex-wrap items-center gap-2">
        <span className="text-xs text-slate-500 font-medium mr-1">Load Preset Scenario:</span>
        {presets.map((p, i) => (
          <button
            key={i}
            onClick={() => {
              setTitle(p.title);
              setContent(p.content);
            }}
            className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:border-[#0F5132] hover:text-[#0F5132] transition-all truncate max-w-xs shadow-2xs"
          >
            {p.title.split(":")[0]}
          </button>
        ))}
      </div>

      {/* Input Editor */}
      <div className="mt-4 rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm space-y-4">
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">
            Announcement Headline
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/70 p-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#0F5132] focus:bg-white focus:outline-none transition-colors"
          />
        </div>

        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">
            Event Description &amp; Technical Disclosures
          </label>
          <textarea
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/70 p-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#0F5132] focus:bg-white focus:outline-none transition-colors"
          />
        </div>

        <button
          onClick={handleSimulate}
          disabled={loading}
          className="flex items-center gap-2 rounded-xl bg-[#0F5132] px-6 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#0B3D25] transition-all disabled:opacity-50"
        >
          <Zap className="h-4 w-4 fill-current" />
          {loading ? "Computing Graph Ripples & Centrality Shifts..." : "Run Change-Impact Analysis"}
        </button>
      </div>

      {/* Analysis Output Result */}
      {result && (
        <div className="mt-8 rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <span className="rounded-md border border-[#D1E7DD] bg-[#F0FDF4] px-2.5 py-0.5 text-[10px] font-bold text-[#0F5132] uppercase tracking-wider">
                Predicted Disruption: {result.impact.market_disruption_potential}
              </span>
              <h2 className="mt-2 text-lg font-bold text-slate-900">{result.event_title}</h2>
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-mono">
                <span className="text-slate-500">Novelty: </span>
                <span className="font-bold text-[#0F5132]">
                  {Math.round(result.novelty.overall_novelty * 100)}%
                </span>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-mono">
                <span className="text-slate-500">Impact: </span>
                <span className="font-bold text-rose-600">
                  {Math.round(result.impact.overall_impact * 100)}%
                </span>
              </div>
            </div>
          </div>

          {/* 5 Crucial Questions Answered */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-4">
              <h3 className="text-xs font-bold text-[#0F5132] uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="h-4 w-4" /> 1. What New Relationship Was Formed?
              </h3>
              <p className="mt-2 text-xs text-slate-700 leading-relaxed">
                Extracted entities: <code className="text-[#0F5132] font-semibold">{result.extracted_entities.join(", ")}</code>.
                Established candidate link: PARTNERED_WITH / SUPPLIES_TO between primary entity and semiconductor manufacturing.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-4">
              <h3 className="text-xs font-bold text-[#0F5132] uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="h-4 w-4" /> 2. Was It Already Known Or Genuinely New?
              </h3>
              <p className="mt-2 text-xs text-slate-700 leading-relaxed">
                {result.novelty.reasoning || "Genuinely novel edge. Not previously recorded in active temporal graph."}
              </p>
            </div>

            <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-4 md:col-span-2">
              <h3 className="text-xs font-bold text-rose-700 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldAlert className="h-4 w-4" /> 3. Potentially Affected Competitors &amp; Technologies
              </h3>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                {result.affected_competitors.map((c: any, idx: number) => (
                  <div key={idx} className="rounded-xl border border-slate-200 bg-white p-3 text-xs shadow-2xs">
                    <span className="font-bold text-slate-900 block">{c.competitor_name}</span>
                    <span className="text-[11px] text-slate-600 mt-1 block">{c.why_affected}</span>
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
