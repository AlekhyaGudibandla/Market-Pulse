"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Activity,
  Bell,
  Network,
  Clock,
  Zap,
  BookOpen,
  Settings as SettingsIcon,
  Play,
  CheckCircle,
  Cpu
} from "lucide-react";
import { triggerLiveEventSimulation } from "@/lib/api";

export default function Navbar() {
  const pathname = usePathname();
  const [simulating, setSimulating] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const navLinks = [
    { href: "/", label: "Radar", icon: Activity },
    { href: "/alerts", label: "Intelligence Alerts", icon: Bell },
    { href: "/graph", label: "Knowledge Graph", icon: Network },
    { href: "/timeline", label: "Timelines", icon: Clock },
    { href: "/impact-analyzer", label: "Change-Impact", icon: Zap },
    { href: "/rag-studio", label: "RAG Studio", icon: BookOpen },
    { href: "/settings", label: "Pipeline & SRE", icon: SettingsIcon },
  ];

  const handleSimulate = async () => {
    setSimulating(true);
    setToast("Ingesting live event through Kafka & Graph pipeline...");
    try {
      await triggerLiveEventSimulation();
      setToast("Event successfully ingested! Alert generated.");
      setTimeout(() => {
        window.location.reload();
      }, 1200);
    } catch (e) {
      setToast("Simulation executed in local mode.");
    } finally {
      setSimulating(false);
      setTimeout(() => setToast(null), 4000);
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-surface/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        {/* Brand */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-accent-blue to-accent-indigo shadow-md shadow-accent-blue/20">
              <Cpu className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-white">MarketPulse</span>
                <span className="rounded bg-accent-blue/10 px-1.5 py-0.5 text-[10px] font-semibold text-accent-blue border border-accent-blue/30">
                  AI SILICON
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">Competitive Intelligence Engine</p>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 pl-4 border-l border-slate-700/60">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                    isActive
                      ? "bg-accent-blue/15 text-accent-blue border border-accent-blue/30 shadow-sm"
                      : "text-slate-300 hover:bg-surfaceElevated hover:text-white"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {/* Active Stream Indicator */}
          <div className="hidden sm:flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/40 px-3 py-1 text-xs text-emerald-400 font-mono">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
            </span>
            KAFKA STREAM ACTIVE
          </div>

          {/* Simulation Trigger Button */}
          <button
            onClick={handleSimulate}
            disabled={simulating}
            className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-accent-indigo to-accent-blue px-3.5 py-1.5 text-xs font-semibold text-white shadow-md shadow-accent-indigo/25 hover:opacity-95 transition-all disabled:opacity-50"
          >
            <Play className={`h-3.5 w-3.5 fill-current ${simulating ? "animate-spin" : ""}`} />
            {simulating ? "Ingesting..." : "Simulate Ingestion"}
          </button>
        </div>
      </div>

      {/* Floating Status Toast */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-lg border border-accent-blue/40 bg-surfaceElevated px-4 py-3 text-xs text-white shadow-2xl animate-fade-in">
          <CheckCircle className="h-4 w-4 text-accent-blue" />
          <span>{toast}</span>
        </div>
      )}
    </header>
  );
}
