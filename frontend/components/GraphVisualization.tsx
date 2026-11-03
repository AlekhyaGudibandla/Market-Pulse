"use client";

import { useState, useMemo } from "react";
import { GraphTopology, GraphNode } from "@/lib/types";
import { Network, Filter, Info, X, Zap } from "lucide-react";

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

  // Compute radial/circular layout coordinates for nodes
  const nodePositions = useMemo(() => {
    const coords: Record<string, { x: number; y: number }> = {};
    const width = 800;
    const height = 500;
    const centerX = width / 2;
    const centerY = height / 2;
    const count = filteredNodes.length;

    filteredNodes.forEach((node, idx) => {
      // Place high centrality nodes closer to center, others in outer ring
      const radius = node.centrality > 0.35 ? 120 : 210;
      const angle = (idx / count) * 2 * Math.PI;
      coords[node.id] = {
        x: centerX + radius * Math.cos(angle) + (idx % 2 === 0 ? 10 : -10),
        y: centerY + radius * Math.sin(angle),
      };
    });
    return coords;
  }, [filteredNodes]);

  const getNodeColor = (type: string) => {
    switch (type) {
      case "COMPANY":
        return "#38bdf8"; // accent blue
      case "PRODUCT":
        return "#a855f7"; // purple
      case "TECHNOLOGY":
        return "#10b981"; // emerald
      default:
        return "#f59e0b"; // amber
    }
  };

  const handleNodeClick = (node: GraphNode) => {
    setActiveNode(node);
    if (onNodeSelect) onNodeSelect(node);
  };

  return (
    <div className="relative rounded-xl border border-border bg-surface p-4 shadow-xl">
      {/* Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3 mb-3">
        <div className="flex items-center gap-2">
          <Network className="h-4 w-4 text-accent-blue" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Temporal Knowledge Graph Topology
          </span>
          <span className="text-xs text-slate-500 font-mono">
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
              className={`rounded-md px-2.5 py-1 text-[11px] font-semibold transition-all ${
                selectedType === t
                  ? "bg-accent-blue/20 text-accent-blue border border-accent-blue/40"
                  : "bg-surfaceElevated text-slate-400 hover:text-white"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* SVG Canvas Container */}
      <div className="relative flex justify-center overflow-x-auto bg-[#070b12] rounded-lg border border-slate-900 min-h-[480px]">
        <svg viewBox="0 0 800 500" className="w-full max-w-[850px] h-[480px] select-none">
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
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#475569" />
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
              <g key={edge.id} className="transition-all hover:opacity-100 opacity-60">
                <line
                  x1={fromPos.x}
                  y1={fromPos.y}
                  x2={toPos.x}
                  y2={toPos.y}
                  stroke={edge.label === "COMPETES_WITH" ? "#f43f5e" : "#475569"}
                  strokeWidth={edge.label === "COMPETES_WITH" ? 1.5 : 1}
                  strokeDasharray={edge.label === "COMPETES_WITH" ? "3 3" : undefined}
                  markerEnd="url(#arrow)"
                />
                <text
                  x={midX}
                  y={midY - 4}
                  fill="#94a3b8"
                  fontSize="9"
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
                  <circle r="24" fill="none" stroke={color} strokeWidth="2" strokeDasharray="3 3" className="animate-spin" />
                )}
                {/* Node Circle */}
                <circle
                  r={isSelected ? 16 : 13}
                  fill="#0f172a"
                  stroke={color}
                  strokeWidth={isSelected ? 3 : 2}
                  className="transition-all duration-200 group-hover:scale-125"
                />
                {/* Center Core */}
                <circle r="5" fill={color} />
                {/* Label */}
                <text
                  y="24"
                  textAnchor="middle"
                  fill="#f1f5f9"
                  fontSize="10"
                  fontWeight="600"
                  className="pointer-events-none drop-shadow"
                >
                  {node.label}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Selected Node Inspection Drawer */}
        {activeNode && (
          <div className="absolute right-3 top-3 w-72 rounded-lg border border-slate-700 bg-surfaceElevated/95 p-4 shadow-2xl backdrop-blur-md animate-fade-in">
            <div className="flex items-start justify-between">
              <div>
                <span
                  className="rounded px-1.5 py-0.5 text-[10px] font-bold"
                  style={{
                    backgroundColor: `${getNodeColor(activeNode.type)}20`,
                    color: getNodeColor(activeNode.type),
                  }}
                >
                  {activeNode.type}
                </span>
                <h4 className="mt-1 text-sm font-bold text-white">{activeNode.label}</h4>
              </div>
              <button
                onClick={() => setActiveNode(null)}
                className="rounded p-1 text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="mt-2 text-xs text-slate-300 leading-relaxed">{activeNode.description}</p>

            <div className="mt-3 space-y-1.5 border-t border-slate-700/60 pt-2.5 text-[11px]">
              <div className="flex justify-between text-slate-400">
                <span>Sector:</span>
                <span className="font-medium text-slate-200">{activeNode.sector || "AI"}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Graph Centrality:</span>
                <span className="font-bold text-accent-blue">{activeNode.centrality}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="mt-3 flex flex-wrap items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-accent-blue"></span> Company
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-accent-purple"></span> Product
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-accent-emerald"></span> Technology
          </span>
        </div>
        <span className="text-[11px] text-slate-500 font-mono">
          Click nodes to inspect temporal connections &amp; centrality
        </span>
      </div>
    </div>
  );
}
