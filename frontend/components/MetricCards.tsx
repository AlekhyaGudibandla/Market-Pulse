import { Layers, Building2, AlertTriangle, Network, TrendingUp } from "lucide-react";

interface Props {
  totalEvents?: number;
  trackedCompanies?: number;
  highImpactAlerts?: number;
  activeEntities?: number;
}

export default function MetricCards({
  totalEvents = 12846,
  trackedCompanies = 421,
  highImpactAlerts = 28,
  activeEntities = 6920,
}: Props) {
  const cards = [
    {
      label: "Total Events",
      value: totalEvents.toLocaleString(),
      change: "+18.4% (7d)",
      isPositive: true,
      icon: Layers,
      iconBg: "bg-[#E8F5E9]",
      iconColor: "text-[#0F5132]",
    },
    {
      label: "Tracked Companies",
      value: trackedCompanies.toLocaleString(),
      change: "+6.2% (7d)",
      isPositive: true,
      icon: Building2,
      iconBg: "bg-[#FEF3C7]",
      iconColor: "text-[#B45309]",
    },
    {
      label: "High Impact Alerts",
      value: highImpactAlerts.toLocaleString(),
      change: "+40% (7d)",
      isAlert: true,
      icon: AlertTriangle,
      iconBg: "bg-[#FEE2E2]",
      iconColor: "text-[#DC2626]",
    },
    {
      label: "Active Entities (Graph)",
      value: activeEntities.toLocaleString(),
      change: "+11.8% (7d)",
      isPositive: true,
      icon: Network,
      iconBg: "bg-[#EDE9FE]",
      iconColor: "text-[#6D28D9]",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((c, i) => {
        const Icon = c.icon;
        return (
          <div
            key={i}
            className="flex items-center gap-4 rounded-xl border border-slate-200/90 bg-white p-4 shadow-sm"
          >
            <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${c.iconBg}`}>
              <Icon className={`h-5 w-5 ${c.iconColor}`} />
            </div>
            <div>
              <span className="text-[11px] font-medium text-slate-500 block">{c.label}</span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-xl font-extrabold text-slate-900 tracking-tight">{c.value}</span>
                <span
                  className={`text-[10px] font-semibold flex items-center gap-0.5 ${
                    c.isAlert ? "text-rose-600" : "text-emerald-700"
                  }`}
                >
                  <TrendingUp className="h-3 w-3 inline" />
                  {c.change}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
