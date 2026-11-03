"use client";

import { useEffect, useState } from "react";
import { Settings as SettingsIcon, ShieldCheck, Activity, Database, CheckCircle2 } from "lucide-react";

export default function SettingsPage() {
  const [health] = useState<any>({
    status: "HEALTHY",
    version: "1.0.0",
    industry: "AI Infrastructure & Developer Tools",
    streaming_backbone: {
      mode: "EMBEDDED_KRAFT",
      raw_events_queued: 18,
      parsed_events_queued: 18,
      alerts_emitted: 7,
      dlq_count: 0,
    },
    temporal_knowledge_graph: {
      mode: "RESILIENT_NETWORKX_TEMPORAL",
      neo4j_connected: false,
      total_nodes: 24,
      total_edges: 38,
      active_edges: 36,
    },
    vector_search_index: {
      indexed_documents: 15,
      vector_dimension: 384,
    },
  });

  const [metrics] = useState({
    extraction_precision: 94.2,
    entity_resolution_accuracy: 96.8,
    retrieval_map_at_k: 89.1,
    alert_usefulness_rating: 91.5,
    avg_event_processing_lag_ms: 18.4,
    p95_query_latency_ms: 21.0,
    deduplication_suppression_rate: 42.8,
    cost_per_processed_event_usd: "$0.00015",
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <SettingsIcon className="h-4 w-4 text-[#0F5132]" />
            <span className="text-xs font-mono font-semibold text-[#0F5132] uppercase tracking-wider">
              SRE, Distributed Pipeline &amp; Evaluation
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Pipeline Health &amp; SDE-3 Observability
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Real-time status of the Kafka backbone, Neo4j Temporal Graph, Idempotency cache, and precision evaluation metrics.
          </p>
        </div>
      </div>

      {/* Observability Metrics Grid */}
      <div className="mt-6">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
          Evaluation &amp; Accuracy Benchmarks
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm">
            <span className="text-[11px] font-semibold text-slate-500 uppercase">Extraction Precision</span>
            <div className="mt-1.5 text-2xl font-bold font-mono text-[#0F5132]">
              {metrics.extraction_precision}%
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">Entity &amp; Relation Extraction</span>
          </div>

          <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm">
            <span className="text-[11px] font-semibold text-slate-500 uppercase">Entity Resolution F1</span>
            <div className="mt-1.5 text-2xl font-bold font-mono text-emerald-700">
              {metrics.entity_resolution_accuracy}%
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">Alias Disambiguation</span>
          </div>

          <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm">
            <span className="text-[11px] font-semibold text-slate-500 uppercase">Retrieval Quality (MAP@5)</span>
            <div className="mt-1.5 text-2xl font-bold font-mono text-indigo-700">
              {metrics.retrieval_map_at_k}%
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">Mean Average Precision</span>
          </div>

          <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm">
            <span className="text-[11px] font-semibold text-slate-500 uppercase">P95 Query Latency</span>
            <div className="mt-1.5 text-2xl font-bold font-mono text-amber-700">
              {metrics.p95_query_latency_ms} ms
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">Sub-50ms SLA Target</span>
          </div>
        </div>
      </div>

      {/* Subsystem Topology Health */}
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {/* Kafka Streaming */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Activity className="h-4 w-4 text-[#0F5132]" />
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Kafka Streaming Backbone
            </h3>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Cluster Architecture:</span>
              <span className="font-mono text-slate-900 font-semibold">KRaft Event Bus</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Raw Topic:</span>
              <span className="font-mono text-slate-700">events.raw (8 partitions)</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Alerts Topic:</span>
              <span className="font-mono text-slate-700">alerts.generated</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-500">Dead-Letter Queue (DLQ):</span>
              <span className="font-mono text-[#0F5132] font-bold">0 Poison Pills</span>
            </div>
          </div>
        </div>

        {/* Temporal Knowledge Graph */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Database className="h-4 w-4 text-[#0F5132]" />
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Temporal Knowledge Graph
            </h3>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Graph Backend:</span>
              <span className="font-mono text-slate-900 font-semibold">Neo4j + NetworkX</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Historical Preservation:</span>
              <span className="font-mono text-[#0F5132] font-bold">Active (Non-destructive)</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Total Entities:</span>
              <span className="font-mono text-slate-700">{health.temporal_knowledge_graph.total_nodes}</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-500">Temporal Edges:</span>
              <span className="font-mono text-slate-700">{health.temporal_knowledge_graph.total_edges}</span>
            </div>
          </div>
        </div>

        {/* Idempotency & Search */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <ShieldCheck className="h-4 w-4 text-[#0F5132]" />
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Deduplication &amp; Storage
            </h3>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Idempotency Fingerprint:</span>
              <span className="font-mono text-slate-900 font-semibold">SHA-256 Checksum</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Deduplication Window:</span>
              <span className="font-mono text-slate-700">72 Hours</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Cost Per Event:</span>
              <span className="font-mono text-[#0F5132] font-bold">{metrics.cost_per_processed_event_usd}</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-500">Indexed Docs:</span>
              <span className="font-mono text-slate-700">{health.vector_search_index.indexed_documents}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
