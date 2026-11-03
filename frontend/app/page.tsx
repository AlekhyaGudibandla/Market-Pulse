"use client";

import { useEffect, useState } from "react";
import HeroBanner from "@/components/HeroBanner";
import MetricCards from "@/components/MetricCards";
import ActivityTrendChart from "@/components/ActivityTrendChart";
import LandscapeHeatmap from "@/components/LandscapeHeatmap";
import IntelligenceCallout from "@/components/IntelligenceCallout";
import KeyIntelligenceFeed from "@/components/KeyIntelligenceFeed";
import RightRail from "@/components/RightRail";
import { fetchAlerts, fetchGraphTopology, fetchCompetitorsMatrix } from "@/lib/api";
import { IntelligenceAlert, GraphTopology, CompetitorCompany } from "@/lib/types";

export default function OverviewPage() {
  const [alerts, setAlerts] = useState<IntelligenceAlert[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const alertsData = await fetchAlerts();
        setAlerts(alertsData);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* 1. Hero Banner with Mountain Graphic */}
      <HeroBanner
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        eventCount={24}
      />

      {/* 2. Top 4 Metric KPI Cards */}
      <MetricCards
        totalEvents={12846}
        trackedCompanies={421}
        highImpactAlerts={alerts.filter((a) => a.impact.severity === "CRITICAL" || a.impact.severity === "HIGH").length || 28}
        activeEntities={6920}
      />

      {/* 3. Mid Section: Trend Chart + Landscape Heatmap + AI Intelligence */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <ActivityTrendChart />
        <LandscapeHeatmap />
        <IntelligenceCallout />
      </div>

      {/* 4. Bottom Section: Key Intelligence Feed (Left 2/3) + Watchlist/Events (Right 1/3) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 items-start">
        <div className="lg:col-span-2">
          <KeyIntelligenceFeed alerts={alerts} />
        </div>
        <div className="lg:col-span-1">
          <RightRail />
        </div>
      </div>
    </div>
  );
}
