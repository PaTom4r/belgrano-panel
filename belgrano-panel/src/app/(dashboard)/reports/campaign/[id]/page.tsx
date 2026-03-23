"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { generateCSV, downloadCSV } from "@/lib/export";

// --- Campaign Data ---

const zones = [
  "Lobby Principal",
  "Urgencias",
  "Pediatria",
  "Cardiologia",
  "Traumatologia",
  "Maternidad",
  "Oncologia",
  "Cafeteria",
  "Pasillos Piso 1",
  "Pasillos Piso 2",
];

const campaignData: Record<
  string,
  {
    name: string;
    advertiser: string;
    startDate: string;
    endDate: string;
    status: string;
    cpmRate: number;
    targetZones: string[];
    dailyFrequency: number;
  }
> = {
  "camp-1": {
    name: "Plan Premium Salud",
    advertiser: "ISAPRE Colmena",
    startDate: "2026-03-01",
    endDate: "2026-03-31",
    status: "active",
    cpmRate: 3500,
    targetZones: ["Lobby Principal", "Urgencias", "Cardiologia", "Cafeteria", "Pasillos Piso 1"],
    dailyFrequency: 35,
  },
  "camp-2": {
    name: "Vitaminas Ensure",
    advertiser: "Abbott Pharma",
    startDate: "2026-03-05",
    endDate: "2026-04-05",
    status: "active",
    cpmRate: 4200,
    targetZones: ["Pediatria", "Maternidad", "Cafeteria", "Pasillos Piso 2"],
    dailyFrequency: 30,
  },
  "camp-3": {
    name: "Seguro Vida Proteccion",
    advertiser: "MetLife Seguros",
    startDate: "2026-02-15",
    endDate: "2026-03-15",
    status: "completed",
    cpmRate: 3800,
    targetZones: ["Lobby Principal", "Traumatologia", "Oncologia", "Pasillos Piso 1", "Pasillos Piso 2"],
    dailyFrequency: 25,
  },
  "camp-4": {
    name: "Check-Up Anual",
    advertiser: "ISAPRE Colmena",
    startDate: "2026-03-10",
    endDate: "2026-04-10",
    status: "active",
    cpmRate: 3200,
    targetZones: ["Lobby Principal", "Urgencias", "Pediatria", "Cardiologia"],
    dailyFrequency: 20,
  },
  "camp-5": {
    name: "Suplemento Omega 3",
    advertiser: "Abbott Pharma",
    startDate: "2026-03-15",
    endDate: "2026-04-15",
    status: "active",
    cpmRate: 2900,
    targetZones: ["Cafeteria", "Pasillos Piso 1", "Pasillos Piso 2"],
    dailyFrequency: 18,
  },
};

const COLORS = ["#2563eb", "#10b981", "#f59e0b", "#475569", "#ef4444", "#8b5cf6", "#ec4899", "#06b6d4", "#84cc16", "#f97316"];

const statusColors: Record<string, string> = {
  active: "bg-green-100 text-green-700",
  completed: "bg-gray-100 text-gray-700",
  paused: "bg-amber-100 text-amber-700",
  draft: "bg-blue-100 text-blue-700",
  cancelled: "bg-red-100 text-red-700",
};

function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

interface PlayLogEntry {
  date: string;
  time: string;
  screen: string;
  zone: string;
  duration: number;
  status: string;
}

function generateCampaignPlayLogs(campaignId: string): {
  dailyPlays: { date: string; plays: number }[];
  zoneBreakdown: { name: string; value: number }[];
  playLogs: PlayLogEntry[];
  totalPlays: number;
  uniqueScreens: number;
  estimatedImpressions: number;
  cpmAchieved: number;
} {
  const campaign = campaignData[campaignId];
  if (!campaign) {
    return {
      dailyPlays: [],
      zoneBreakdown: [],
      playLogs: [],
      totalPlays: 0,
      uniqueScreens: 0,
      estimatedImpressions: 0,
      cpmAchieved: 0,
    };
  }

  const dailyMap: Record<string, number> = {};
  const zoneMap: Record<string, number> = {};
  const logs: PlayLogEntry[] = [];
  const screenSet = new Set<string>();
  let totalPlays = 0;

  const now = new Date();

  for (let d = 0; d < 7; d++) {
    const date = new Date(now);
    date.setDate(date.getDate() - d);
    const dateStr = date.toISOString().split("T")[0];

    campaign.targetZones.forEach((zone, zIdx) => {
      const screensInZone = 7;
      for (let s = 0; s < screensInZone; s++) {
        const screenName = `CLC-${zone.replace(/\s/g, "-")}-${s + 1}`;
        const seed = d * 10000 + zIdx * 100 + s + campaignId.charCodeAt(campaignId.length - 1);
        const plays = Math.floor(seededRandom(seed) * 16) + campaign.dailyFrequency - 10;

        if (plays > 0) {
          screenSet.add(screenName);
          totalPlays += plays;
          dailyMap[dateStr] = (dailyMap[dateStr] || 0) + plays;
          zoneMap[zone] = (zoneMap[zone] || 0) + plays;

          // Generate individual play log entries (sample up to 3 per screen per day)
          const sampleCount = Math.min(plays, 3);
          for (let p = 0; p < sampleCount; p++) {
            const hour = 8 + Math.floor(seededRandom(seed + p * 7) * 12);
            const minute = Math.floor(seededRandom(seed + p * 13) * 60);
            const duration = seededRandom(seed + p * 17) > 0.5 ? 30 : 15;
            const logStatus = seededRandom(seed + p * 23) > 0.02 ? "Completed" : "Interrupted";

            logs.push({
              date: dateStr,
              time: `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`,
              screen: screenName,
              zone,
              duration,
              status: logStatus,
            });
          }
        }
      }
    });
  }

  const dailyPlays = Object.entries(dailyMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, plays]) => ({
      date: new Date(date + "T12:00:00").toLocaleDateString("es-CL", { weekday: "short", day: "numeric" }),
      plays,
    }));

  const zoneBreakdown = Object.entries(zoneMap).map(([name, value]) => ({ name, value }));

  const impressionsPerPlay = 4.2;
  const estimatedImpressions = Math.round(totalPlays * impressionsPerPlay);
  const revenue = (estimatedImpressions / 1000) * campaign.cpmRate;
  const cpmAchieved = totalPlays > 0 ? Math.round(revenue / (estimatedImpressions / 1000)) : 0;

  logs.sort((a, b) => {
    const dateComp = b.date.localeCompare(a.date);
    if (dateComp !== 0) return dateComp;
    return a.time.localeCompare(b.time);
  });

  return {
    dailyPlays,
    zoneBreakdown,
    playLogs: logs,
    totalPlays,
    uniqueScreens: screenSet.size,
    estimatedImpressions,
    cpmAchieved,
  };
}

export default function CampaignReportPage() {
  const params = useParams();
  const campaignId = params.id as string;
  const campaign = campaignData[campaignId];

  const reportData = useMemo(() => generateCampaignPlayLogs(campaignId), [campaignId]);

  if (!campaign) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Campaign not found</h2>
        <p className="text-sm text-gray-500 mb-4">The campaign ID &quot;{campaignId}&quot; does not exist.</p>
        <Link href="/reports" className="text-blue-600 hover:underline text-sm">
          Back to Reports
        </Link>
      </div>
    );
  }

  function handleExportCSV() {
    const headers = ["Date", "Time", "Screen", "Zone", "Duration (s)", "Status"];
    const rows = reportData.playLogs.map((l) => [l.date, l.time, l.screen, l.zone, String(l.duration), l.status]);
    const csv = generateCSV(headers, rows);
    downloadCSV(`campaign-${campaignId}-play-logs.csv`, csv);
  }

  return (
    <div>
      {/* Breadcrumb & Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Link href="/reports" className="text-sm text-gray-500 hover:text-gray-700">
            Reports
          </Link>
          <span className="text-sm text-gray-400">/</span>
          <span className="text-sm text-gray-700">Campaign Report</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{campaign.name}</h1>
            <p className="mt-1 text-sm text-gray-500">{campaign.advertiser}</p>
          </div>
          <button
            onClick={handleExportCSV}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors self-start"
          >
            Export CSV
          </button>
        </div>
      </div>

      {/* Campaign Info Header */}
      <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100 mb-6">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Advertiser</p>
            <p className="mt-1 text-sm font-medium text-gray-900">{campaign.advertiser}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Period</p>
            <p className="mt-1 text-sm font-medium text-gray-900">
              {new Date(campaign.startDate + "T12:00:00").toLocaleDateString("es-CL")} - {new Date(campaign.endDate + "T12:00:00").toLocaleDateString("es-CL")}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Status</p>
            <span className={`mt-1 inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[campaign.status] || "bg-gray-100 text-gray-700"}`}>
              {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
            </span>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Target Zones</p>
            <p className="mt-1 text-sm font-medium text-gray-900">{campaign.targetZones.length} zones</p>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-500">Total Plays</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{reportData.totalPlays.toLocaleString("es-CL")}</p>
        </div>
        <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-500">Unique Screens</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{reportData.uniqueScreens}</p>
        </div>
        <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-500">Est. Impressions</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{reportData.estimatedImpressions.toLocaleString("es-CL")}</p>
        </div>
        <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-500">CPM Achieved</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" }).format(reportData.cpmAchieved)}
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mb-6">
        {/* Daily Plays */}
        <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Plays</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={reportData.dailyPlays}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="plays" fill="#2563eb" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Plays by Zone */}
        <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Plays by Zone</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={reportData.zoneBreakdown}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                label={({ name, percent }: { name?: string; percent?: number }) => `${(name ?? "").split(" ")[0]} ${((percent ?? 0) * 100).toFixed(0)}%`}
              >
                {reportData.zoneBreakdown.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Play Log Table */}
      <div className="rounded-xl bg-white shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Play Log</h3>
          <p className="text-sm text-gray-500 mt-1">
            Showing {Math.min(reportData.playLogs.length, 100)} of {reportData.playLogs.length} sample entries
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="px-6 py-3 font-medium text-gray-500">Date</th>
                <th className="px-6 py-3 font-medium text-gray-500">Time</th>
                <th className="px-6 py-3 font-medium text-gray-500">Screen</th>
                <th className="px-6 py-3 font-medium text-gray-500">Zone</th>
                <th className="px-6 py-3 font-medium text-gray-500 text-right">Duration</th>
                <th className="px-6 py-3 font-medium text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody>
              {reportData.playLogs.slice(0, 100).map((log, i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}>
                  <td className="px-6 py-3 text-gray-900">{log.date}</td>
                  <td className="px-6 py-3 text-gray-700">{log.time}</td>
                  <td className="px-6 py-3 text-gray-700">{log.screen}</td>
                  <td className="px-6 py-3 text-gray-700">{log.zone}</td>
                  <td className="px-6 py-3 text-right text-gray-700">{log.duration}s</td>
                  <td className="px-6 py-3">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                        log.status === "Completed" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
