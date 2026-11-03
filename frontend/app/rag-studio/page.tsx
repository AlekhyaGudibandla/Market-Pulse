"use client";

import { useState } from "react";
import { executeRAGQuery } from "@/lib/api";
import { RetrievalStrategy, GroundedSynthesisReport } from "@/lib/types";
import {
  BookOpen,
  Search,
  AlertTriangle,
  ExternalLink,
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
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <BookOpen className="h-4 w-4 text-[#0F5132]" />
            <span className="text-xs font-mono font-semibold text-[#0F5132] uppercase tracking-wider">
              Advanced 8-Strategy Retrieval Architecture
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Intelligence RAG Studio
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Beyond standard vector search: Query-adaptive routing, GraphRAG multi-hop, temporal reconstruction, and contradiction detection.
          </p>
        </div>
      </div>

      {/* Strategy Selector Carousel */}
      <div className="mt-6">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-2">
          Select Retrieval Strategy
        </label>
        <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
          {strategies.map((s) => {
            const isSelected = strategy === s.id;
            return (
              <button
                key={s.id}
                onClick={() => setStrategy(s.id)}
                className={`flex flex-col text-left rounded-2xl border p-4 transition-all ${
                  isSelected
                    ? "border-[#0F5132] bg-[#F0FDF4] shadow-sm"
                    : "border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold ${isSelected ? "text-[#0F5132]" : "text-slate-900"}`}>
                    {s.label}
                  </span>
                  {isSelected && <CheckCircle2 className="h-4 w-4 text-[#0F5132]" />}
                </div>
                <p className="mt-1.5 text-[11px] text-slate-600 leading-normal">{s.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Query Bar */}
      <div className="mt-6 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="text-xs text-slate-500 font-medium">Example Queries:</span>
          {exampleQueries.map((eq, i) => (
            <button
              key={i}
              onClick={() => setQuery(eq)}
              className="rounded-lg border border-slate-200 bg-slate-50/70 px-2.5 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-all truncate max-w-xs"
            >
              {eq}
            </button>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask any competitive intelligence question..."
            className="flex-1 rounded-xl border border-slate-200 bg-slate-50/70 p-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#0F5132] focus:bg-white focus:outline-none transition-colors"
          />
          <button
            onClick={handleExecute}
            disabled={loading}
            className="flex items-center justify-center gap-1.5 rounded-xl bg-[#0F5132] px-6 py-3 text-xs font-bold text-white shadow-sm hover:bg-[#0B3D25] transition-all disabled:opacity-50"
          >
            <Search className="h-4 w-4" />
            {loading ? "Synthesizing..." : "Investigate"}
          </button>
        </div>
      </div>

      {/* Grounded Dossier Report Output */}
      {report && (
        <div className="mt-8 space-y-6 rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm">
          {/* Header Metadata */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <span className="rounded-md border border-[#D1E7DD] bg-[#F0FDF4] px-2.5 py-0.5 text-xs font-mono font-bold text-[#0F5132]">
                Strategy: {report.selected_strategy}
              </span>
              <span className="text-xs text-slate-500">
                Latency: <strong className="font-mono text-slate-800">{report.latency_ms}ms</strong>
              </span>
              <span className="text-xs text-slate-500">
                Confidence: <strong className="font-mono text-[#0F5132]">{Math.round(report.confidence_score * 100)}%</strong>
              </span>
            </div>
            <span className="text-xs text-slate-500 italic">{report.strategy_rationale}</span>
          </div>

          {/* Direct Answer */}
          <div className="rounded-xl border border-[#D1E7DD] bg-[#F0FDF4]/70 p-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#0F5132] mb-1.5">
              Evidence-Grounded Direct Synthesis
            </h3>
            <p className="text-xs text-slate-800 leading-relaxed font-medium">
              {report.direct_answer}
            </p>
          </div>

          {/* Executive Takeaways */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Key Strategic Takeaways
            </h4>
            <div className="grid gap-2 sm:grid-cols-3">
              {report.executive_takeaways.map((t, idx) => (
                <div key={idx} className="rounded-xl border border-slate-200 bg-slate-50/70 p-3 text-xs text-slate-700">
                  <div className="font-bold text-[#0F5132] mb-1">Takeaway #{idx + 1}</div>
                  {t}
                </div>
              ))}
            </div>
          </div>

          {/* Contradiction Warning */}
          {report.contradictions && report.contradictions.has_conflicts && (
            <div className="rounded-xl border border-amber-200 bg-[#FEF3C7]/40 p-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-900 mb-1.5">
                <AlertTriangle className="h-4 w-4 text-amber-600" /> Detected Contradiction / Veracity Dispute
              </div>
              <p className="text-xs text-amber-950 leading-relaxed font-semibold">
                Topic: {report.contradictions.topic}
              </p>
              <div className="mt-2 grid gap-3 sm:grid-cols-2 text-xs">
                <div className="rounded-lg border border-amber-200/80 bg-white p-3">
                  <span className="text-amber-800 font-bold block mb-1">Claim A (Official):</span>
                  <span className="text-slate-700">{report.contradictions.claim_a}</span>
                </div>
                <div className="rounded-lg border border-amber-200/80 bg-white p-3">
                  <span className="text-rose-700 font-bold block mb-1">Claim B (Supply Chain Checks):</span>
                  <span className="text-slate-700">{report.contradictions.claim_b}</span>
                </div>
              </div>
            </div>
          )}

          {/* Traceable Citations Drawer */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Primary Citations &amp; Grounding Evidence ({report.citations.length})
            </h4>
            <div className="space-y-2">
              {report.citations.map((c) => (
                <div
                  key={c.citation_id}
                  className="flex items-start justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="rounded bg-[#F0FDF4] border border-[#D1E7DD] px-1.5 py-0.5 font-mono text-[10px] font-bold text-[#0F5132]">
                        {c.citation_id}
                      </span>
                      <span className="font-bold text-slate-900">{c.source_title}</span>
                      <span className="text-[11px] text-slate-400">({c.published_date})</span>
                    </div>
                    <p className="mt-1.5 text-xs text-slate-700 italic font-serif">"{c.excerpt}"</p>
                  </div>
                  {c.source_url && (
                    <a
                      href={c.source_url}
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
        </div>
      )}
    </div>
  );
}
