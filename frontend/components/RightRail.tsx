import Link from "next/link";
import { ArrowRight, Calendar, TrendingUp, TrendingDown } from "lucide-react";

export default function RightRail() {
  const watchlist = [
    {
      name: "NVIDIA",
      events: "3 new events",
      delta: "+2.8%",
      isPositive: true,
      initials: "NV",
      color: "bg-emerald-100 text-emerald-800",
    },
    {
      name: "AMD",
      events: "2 new events",
      delta: "+1.9%",
      isPositive: true,
      initials: "AMD",
      color: "bg-slate-900 text-white",
    },
    {
      name: "TSMC",
      events: "4 new events",
      delta: "-0.6%",
      isPositive: false,
      initials: "TSM",
      color: "bg-rose-100 text-rose-700",
    },
    {
      name: "Cerebras",
      events: "1 new event",
      delta: "+7.4%",
      isPositive: true,
      initials: "CB",
      color: "bg-orange-100 text-orange-800",
    },
  ];

  const upcomingEvents = [
    {
      title: "SC Conference 2026",
      date: "Nov 17 – Nov 20",
      tag: "Industry",
    },
    {
      title: "NVIDIA GTC",
      date: "Dec 8 – Dec 11",
      tag: "Company",
    },
    {
      title: "Intel Foundry Day",
      date: "Dec 15",
      tag: "Product",
    },
  ];

  return (
    <div className="space-y-4">
      {/* Watchlist Card */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3.5">
          <h3 className="text-sm font-bold text-slate-900">Watchlist</h3>
          <Link
            href="/timeline"
            className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-[#0F5132] transition-colors"
          >
            <span>View All</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="space-y-3">
          {watchlist.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold ${item.color}`}
                >
                  {item.initials}
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-800 block leading-tight">{item.name}</span>
                  <span className="text-[10px] text-slate-400">{item.events}</span>
                </div>
              </div>

              <span
                className={`flex items-center gap-0.5 rounded-md px-2 py-0.5 text-[10px] font-bold font-mono ${
                  item.isPositive
                    ? "bg-[#DCFCE7] text-[#166534]"
                    : "bg-[#FEE2E2] text-[#DC2626]"
                }`}
              >
                {item.isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {item.delta}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Events Card */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3.5">
          <h3 className="text-sm font-bold text-slate-900">Upcoming Events</h3>
          <Link
            href="/timeline"
            className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-[#0F5132] transition-colors"
          >
            <span>View All</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="space-y-3">
          {upcomingEvents.map((evt, idx) => (
            <div key={idx} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 border border-slate-200 text-slate-500">
                  <Calendar className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-800 block leading-tight">{evt.title}</span>
                  <span className="text-[10px] text-slate-400">{evt.date}</span>
                </div>
              </div>

              <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600">
                {evt.tag}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
