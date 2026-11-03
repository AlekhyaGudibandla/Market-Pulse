"use client";

import { useState } from "react";
import { executeRAGQuery } from "@/lib/api";
import { RetrievalStrategy, GroundedSynthesisReport } from "@/lib/types";
import {
  BookOpen,
  Search,
  Sparkles,
  Layers,
  Network,
  Clock,
  AlertTriangle,
  ExternalLink,
  ShieldCheck,
  CheckCircle2
} from "lucide-react";

export default function RAGStudioPage() {
  const [query, setQuery] = useState(
    "How does Cerebras wafer scale engine compare to NVIDIA GPUs for inference?"
  );
  const [strategy, setStrategy] = useState<RetrievalStrategy>("QUERY_ADAPTIVE");
  const [report, setReport] = useState<GroundedSynthesisReport | null>(null);
  const [loading, setLoading] = useState(false);

  const strategies: Array<{ id: RetrievalStrategy; label: string; desc: string }> = [
    { id: "QUERY_ADAPTIVE", label: "Query-Adaptive", desc: "Auto-routes between graph traversal, dense vector, keyword, or temporal state based on query intent" },
    { id: "HYBRID", label: "Hybrid RAG", desc: "Combines exact keyword BM25 and dense semantic vector search via Reciprocal Rank Fusion (RRF)" },
    { id: "GRAPHRAG", label: "GraphRAG", desc: "Discovers indirect multi-hop relationships between companies, chips, packaging, and patents" },
    { id: "TEMPORAL", label: "Temporal RAG", desc: "Reconstructs what was known at a historical point in time, filtering later announcements" },
    { id: "EVENT_CENTRIC", label: "Event-Centric", desc: "Retrieves chronological announcement chains rather than isolated textual documents" },
    { id: "MULTI_HOP", label: "Multi-Hop", desc: "Follows relational dependency chains across multiple entities to test a hypothesis" },
    { id: "CONTRADICTION_AWARE", label: "Contradiction-Aware", desc: "Surfaces conflicting claims, disputed throughput benchmarks, or divergent foundry allocations" },
    { id: "EVIDENCE_GROUNDED", label: "Evidence-Grounded", desc: "Produces structured intelligence dossiers with traceable citation badges and confidence metrics" },
  ];

  const exampleQueries = [
    "How does Cerebras wafer scale engine compare to NVIDIA GPUs for inference?",
    "Is TSMC packaging capacity exclusively booked by NVIDIA or is that a disputed claim?",
    "What was the competitive landscape of AI inference chips prior to 2023?",
    "How is OpenAI dependent on TSMC through multi-hop hardware partnerships?",
  ];

  const handleExecute = async () => {
    setLoading(true);
    try {
      const res = await executeRAGQuery({ query, strategy });
      setReport(res);
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
            <BookOpen className="h-4 w-4 text-accent-blue" />
            <span className="text-xs font-mono font-semibold text-accent-blue uppercase tracking-wider">
              Advanced 8-Strategy Retrieval Architecture
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Intelligence RAG Studio
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Beyond standard vector search: Query-adaptive routing, GraphRAG multi-hop, temporal reconstruction, and contradiction detection.
          </p>
        </div>
      </div>

      {/* Strategy Selector Carousel */}
      <div className="mt-6">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-2">
          Select Retrieval Strategy
        </label>
        <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
          {strategies.map((s) => {
            const isSelected = strategy === s.id;
            return (
              <button
                key={s.id}
                onClick={() => setStrategy(s.id)}
                className={`flex flex-col text-left rounded-xl border p-3.5 transition-all ${
                  isSelected
                    ? "border-accent-blue bg-accent-blue/15 shadow-md shadow-accent-blue/10"
                    : "border-border bg-surface hover:bg-surfaceElevated hover:border-slate-600"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold ${isSelected ? "text-accent-blue" : "text-white"}`}>
                    {s.label}
                  </span>
                  {isSelected && <CheckCircle2 className="h-3.5 w-3.5 text-accent-blue" />}
                </div>
                <p className="mt-1.5 text-[11px] text-slate-400 leading-normal">{s.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Query Bar */}
      <div className="mt-6 rounded-xl border border-border bg-surface p-4 shadow-lg">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className="text-xs text-slate-400 font-semibold">Example Queries:</span>
          {exampleQueries.map((eq, i) => (
            <button
              key={i}
              onClick={() => setQuery(eq)}
              className="rounded bg-surfaceElevated px-2.5 py-1 text-[11px] text-slate-300 hover:text-white transition-all truncate max-w-xs"
            >
              {eq}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask any competitive intelligence question..."
            className="flex-1 rounded-lg border border-slate-700 bg-surfaceElevated p-3 text-xs text-white focus:border-accent-blue focus:outline-none"
          />
          <button
            onClick={handleExecute}
            disabled={loading}
            className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-accent-indigo to-accent-blue px-5 py-3 text-xs font-bold text-white shadow-lg shadow-accent-indigo/25 hover:opacity-95 transition-all disabled:opacity-50"
          >
            <Search className="h-4 w-4" />
            {loading ? "Synthesizing..." : "Investigate"}
          </button>
        </div>
      </div>

      {/* Grounded Dossier Report Output */}
      {report && (
        <div className="mt-8 space-y-6 rounded-xl border border-border bg-surface p-6 shadow-2xl animate-fade-in">
          {/* Header Metadata */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
            <div className="flex items-center gap-2">
              <span className="rounded bg-accent-blue/15 border border-accent-blue/30 px-2.5 py-0.5 text-xs font-mono font-bold text-accent-blue">
                Strategy: {report.selected_strategy}
              </span>
              <span className="text-xs text-slate-400">
                Latency: <strong className="font-mono text-slate-200">{report.latency_ms}ms</strong>
              </span>
              <span className="text-xs text-slate-400">
                Confidence: <strong className="font-mono text-emerald-400">{Math.round(report.confidence_score * 100)}%</strong>
              </span>
            </div>
            <span className="text-xs text-slate-400 italic">{report.strategy_rationale}</span>
          </div>

          {/* Direct Answer */}
          <div className="rounded-lg border border-accent-blue/30 bg-accent-blue/5 p-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-accent-blue mb-1.5">
              Evidence-Grounded Direct Synthesis
            </h3>
            <p className="text-xs text-slate-200 leading-relaxed font-medium">
              {report.direct_answer}
            </p>
          </div>

          {/* Executive Takeaways */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              Key Strategic Takeaways
            </h4>
            <div className="grid gap-2 sm:grid-cols-3">
              {report.executive_takeaways.map((t, idx) => (
                <div key={idx} className="rounded-lg border border-slate-800 bg-surfaceElevated p-3 text-xs text-slate-300">
                  <div className="font-bold text-accent-blue mb-1">Takeaway #{idx + 1}</div>
                  {t}
                </div>
              ))}
            </div>
          </div>

          {/* Contradiction Warning */}
          {report.contradictions && report.contradictions.has_conflicts && (
            <div className="rounded-lg border border-amber-500/40 bg-amber-950/20 p-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400 mb-1.5">
                <AlertTriangle className="h-4 w-4" /> Detected Contradiction / Veracity Dispute
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-semibold">
                Topic: {report.contradictions.topic}
              </p>
              <div className="mt-2 grid gap-3 sm:grid-cols-2 text-xs">
                <div className="rounded border border-slate-800 bg-slate-900/60 p-2.5">
                  <span className="text-amber-400 font-bold block mb-1">Claim A (Official):</span>
                  <span className="text-slate-300">{report.contradictions.claim_a}</span>
                </div>
                <div className="rounded border border-slate-800 bg-slate-900/60 p-2.5">
                  <span className="text-rose-400 font-bold block mb-1">Claim B (Supply Chain Checks):</span>
                  <span className="text-slate-300">{report.contradictions.claim_b}</span>
                </div>
              </div>
            </div>
          )}

          {/* Traceable Citations Drawer */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              Primary Citations &amp; Grounding Evidence ({report.citations.length})
            </h4>
            <div className="space-y-2">
              {report.citations.map((c) => (
                <div
                  key={c.citation_id}
                  className="flex items-start justify-between gap-3 rounded-lg border border-slate-800 bg-surfaceElevated p-3 text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="rounded bg-accent-blue/20 px-1.5 py-0.5 font-mono text-[10px] font-bold text-accent-blue">
                        {c.citation_id}
                      </span>
                      <span className="font-bold text-white">{c.source_title}</span>
                      <span className="text-[11px] text-slate-500">({c.published_date})</span>
                    </div>
                    <p className="mt-1.5 text-xs text-slate-300 italic font-serif">"{c.excerpt}"</p>
                  </div>
                  {c.source_url && (
                    <a
                      href={c.source_url}
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
        </div>
      )}
    </div>
  );
}
