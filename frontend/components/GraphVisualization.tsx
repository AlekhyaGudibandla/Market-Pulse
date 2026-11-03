"use client";

import { useState, useMemo } from "react";
import { GraphTopology, GraphNode } from "@/lib/types";
import { Network, Filter, X } from "lucide-react";

interface Props {
  data: GraphTopology;
  onNodeSelect?: (node: GraphNode) => void;
}

export default function GraphVisualization({ data, onNodeSelect }: Props) {
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [activeNode, setActiveNode] = useState<GraphNode | null>(null);

  const nodeTypes = ["ALL", "COMPANY", "PRODUCT", "TECHNOLOGY"];

  const filteredNodes = useMemo(() => {
    if (selectedType === "ALL") return data.nodes;
    return data.nodes.filter((n) => n.type === selectedType);
  }, [data.nodes, selectedType]);

  const filteredNodeIds = useMemo(() => new Set(filteredNodes.map((n) => n.id)), [filteredNodes]);

  const filteredEdges = useMemo(() => {
    return data.edges.filter((e) => filteredNodeIds.has(e.from) && filteredNodeIds.has(e.to));
  }, [data.edges, filteredNodeIds]);

  // Compute radial layout coordinates for nodes
  const nodePositions = useMemo(() => {
    const coords: Record<string, { x: number; y: number }> = {};
    const width = 800;
    const height = 480;
    const centerX = width / 2;
    const centerY = height / 2;
    const count = filteredNodes.length;

    filteredNodes.forEach((node, idx) => {
      const radius = node.centrality > 0.35 ? 120 : 200;
      const angle = (idx / count) * 2 * Math.PI;
      coords[node.id] = {
        x: centerX + radius * Math.cos(angle) + (idx % 2 === 0 ? 8 : -8),
        y: centerY + radius * Math.sin(angle),
      };
    });
    return coords;
  }, [filteredNodes]);

  const getNodeColor = (type: string) => {
    switch (type) {
      case "COMPANY":
        return "#0F5132"; // Deep green
      case "PRODUCT":
        return "#4F46E5"; // Indigo
      case "TECHNOLOGY":
        return "#D97706"; // Amber
      default:
        return "#0284C7"; // Sky
    }
  };

  const handleNodeClick = (node: GraphNode) => {
    setActiveNode(node);
    if (onNodeSelect) onNodeSelect(node);
  };

  return (
    <div className="relative rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm">
      {/* Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3 mb-3">
        <div className="flex items-center gap-2">
          <Network className="h-4 w-4 text-[#0F5132]" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
            Temporal Knowledge Graph Topology
          </span>
          <span className="text-xs text-slate-400 font-mono">
            ({filteredNodes.length} nodes · {filteredEdges.length} active edges)
          </span>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5">
          <Filter className="h-3.5 w-3.5 text-slate-400 mr-1" />
          {nodeTypes.map((t) => (
            <button
              key={t}
              onClick={() => setSelectedType(t)}
              className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-all ${
                selectedType === t
                  ? "bg-[#0F5132] text-white shadow-2xs"
                  : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* SVG Canvas Container */}
      <div className="relative flex justify-center overflow-x-auto bg-[#F8FAFC] rounded-xl border border-slate-200/70 min-h-[480px]">
        <svg viewBox="0 0 800 480" className="w-full max-w-[850px] h-[480px] select-none">
          <defs>
            <marker
              id="arrow"
              viewBox="0 0 10 10"
              refX="18"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#94A3B8" />
            </marker>
          </defs>

          {/* Render Edges */}
          {filteredEdges.map((edge) => {
            const fromPos = nodePositions[edge.from];
            const toPos = nodePositions[edge.to];
            if (!fromPos || !toPos) return null;

            const midX = (fromPos.x + toPos.x) / 2;
            const midY = (fromPos.y + toPos.y) / 2;

            return (
              <g key={edge.id} className="transition-all hover:opacity-100 opacity-70">
                <line
                  x1={fromPos.x}
                  y1={fromPos.y}
                  x2={toPos.x}
                  y2={toPos.y}
                  stroke={edge.label === "COMPETES_WITH" ? "#EF4444" : "#CBD5E1"}
                  strokeWidth={edge.label === "COMPETES_WITH" ? 1.5 : 1.2}
                  strokeDasharray={edge.label === "COMPETES_WITH" ? "3 3" : undefined}
                  markerEnd="url(#arrow)"
                />
                <text
                  x={midX}
                  y={midY - 4}
                  fill="#64748B"
                  fontSize="9"
                  fontWeight="500"
                  textAnchor="middle"
                  className="font-mono"
                >
                  {edge.label}
                </text>
              </g>
            );
          })}

          {/* Render Nodes */}
          {filteredNodes.map((node) => {
            const pos = nodePositions[node.id];
            if (!pos) return null;
            const isSelected = activeNode?.id === node.id;
            const color = getNodeColor(node.type);

            return (
              <g
                key={node.id}
                transform={`translate(${pos.x}, ${pos.y})`}
                onClick={() => handleNodeClick(node)}
                className="cursor-pointer group"
              >
                {/* Halo if selected */}
                {isSelected && (
                  <circle r="22" fill="none" stroke={color} strokeWidth="2" strokeDasharray="3 3" />
                )}
                {/* Node Circle */}
                <circle
                  r={isSelected ? 16 : 13}
                  fill="#FFFFFF"
                  stroke={color}
                  strokeWidth={isSelected ? 3.5 : 2.5}
                  className="transition-all duration-200 group-hover:scale-125 shadow-sm"
                />
                {/* Center Core */}
                <circle r="5" fill={color} />
                {/* Label */}
                <text
                  y="24"
                  textAnchor="middle"
                  fill="#0F172A"
                  fontSize="10"
                  fontWeight="700"
                  className="pointer-events-none drop-shadow-xs"
                >
                  {node.label}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Selected Node Inspection Drawer */}
        {activeNode && (
          <div className="absolute right-3 top-3 w-72 rounded-xl border border-slate-200 bg-white p-4 shadow-xl animate-fade-in">
            <div className="flex items-start justify-between">
              <div>
                <span
                  className="rounded px-2 py-0.5 text-[10px] font-bold"
                  style={{
                    backgroundColor: `${getNodeColor(activeNode.type)}15`,
                    color: getNodeColor(activeNode.type),
                  }}
                >
                  {activeNode.type}
                </span>
                <h4 className="mt-1 text-sm font-bold text-slate-900">{activeNode.label}</h4>
              </div>
              <button
                onClick={() => setActiveNode(null)}
                className="rounded p-1 text-slate-400 hover:text-slate-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="mt-2 text-xs text-slate-600 leading-relaxed">{activeNode.description}</p>

            <div className="mt-3 space-y-1.5 border-t border-slate-100 pt-2.5 text-[11px]">
              <div className="flex justify-between text-slate-500">
                <span>Sector:</span>
                <span className="font-semibold text-slate-800">{activeNode.sector || "AI"}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Graph Centrality:</span>
                <span className="font-bold text-[#0F5132] font-mono">{activeNode.centrality}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="mt-3 flex flex-wrap items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 font-medium">
            <span className="h-2.5 w-2.5 rounded-full bg-[#0F5132]"></span> Company
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <span className="h-2.5 w-2.5 rounded-full bg-[#4F46E5]"></span> Product
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <span className="h-2.5 w-2.5 rounded-full bg-[#D97706]"></span> Technology
          </span>
        </div>
        <span className="text-[11px] text-slate-400 font-mono">
          Click nodes to inspect temporal connections &amp; centrality
        </span>
      </div>
    </div>
  );
}
