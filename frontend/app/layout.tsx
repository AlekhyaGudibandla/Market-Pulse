import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "MarketPulse — Continuous Competitive Intelligence Engine",
  description:
    "Continuously operating intelligence platform that ingests events, models the competitive landscape in a temporal graph, and explains what changed and why it matters.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-background text-slate-100 antialiased flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-border bg-surface py-6 text-center text-xs text-slate-500">
          <div className="mx-auto max-w-7xl px-4 flex flex-wrap justify-between items-center gap-3">
            <p>
              <strong className="text-slate-300 font-semibold">MarketPulse</strong> · Continuous Competitive Intelligence &amp; Change Impact Engine
            </p>
            <div className="flex items-center gap-4 text-[11px] font-mono text-slate-400">
              <span>Kafka Streaming KRaft</span>
              <span>•</span>
              <span>Neo4j Bi-Temporal Graph</span>
              <span>•</span>
              <span>8-Strategy RAG</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
