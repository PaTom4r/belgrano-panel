"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { generateCSV, downloadCSV, generatePDFPlaceholder } from "@/lib/export";

// --- Mock Data ---

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

const campaigns = [
  { id: "camp-1", name: "Plan Premium Salud", advertiser: "ISAPRE Colmena" },
  { id: "camp-2", name: "Vitaminas Ensure", advertiser: "Abbott Pharma" },
  { id: "camp-3", name: "Seguro Vida Proteccion", advertiser: "MetLife Seguros" },
  { id: "camp-4", name: "Check-Up Anual", advertiser: "ISAPRE Colmena" },
  { id: "camp-5", name: "Suplemento Omega 3", advertiser: "Abbott Pharma" },
];

const contentNames: Record<string, string> = {
  "camp-1": "plan-premium-salud-spot.mp4",
  "camp-2": "ensure-vitaminas-30s.mp4",
  "camp-3": "metlife-proteccion-familiar.mp4",
  "camp-4": "checkup-anual-banner.mp4",
  "camp-5": "omega3-bienestar-15s.mp4",
};

function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function generatePlayLogData() {
  const logs: Array<{
    date: string;
    screenName: string;
    contentName: string;
    campaign: string;
    campaignId: string;
    zone: string;
    plays: number;
    totalDuration: number;
  }> = [];

  const now = new Date();

  for (let d = 0; d < 7; d++) {
    const date = new Date(now);
    date.setDate(date.getDate() - d);
    const dateStr = date.toISOString().split("T")[0];

    for (let z = 0; z < zones.length; z++) {
      const zone = zones[z];
      const screensInZone = 7;

      for (let s = 0; s < screensInZone; s++) {
        for (let c = 0; c < campaigns.length; c++) {
          const seed = d * 10000 + z * 1000 + s * 100 + c;
          const plays = Math.floor(seededRandom(seed) * 16) + 25;
          const duration = plays * (seededRandom(seed + 1) > 0.5 ? 30 : 15);

          logs.push({
            date: dateStr,
            screenName: `CLC-${zone.replace(/\s/g, "-")}-${s + 1}`,
            contentName: contentNames[campaigns[c].id],
            campaign: campaigns[c].name,
            campaignId: campaigns[c].id,
            zone,
            plays,
            totalDuration: duration,
          });
        }
      }
    }
  }

  return logs;
}

const COLORS = ["#2563eb", "#10b981", "#f59e0b", "#475569", "#ef4444", "#8b5cf6", "#ec4899", "#06b6d4", "#84cc16", "#f97316"];

type TabType = "proof-of-play" | "revenue" | "export";

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState<TabType>("proof-of-play");
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 6);
    return d.toISOString().split("T")[0];
  });
  const [endDate, setEndDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [selectedCampaign, setSelectedCampaign] = useState("all");
  const [selectedZone, setSelectedZone] = useState("all");

  const allLogs = useMemo(() => generatePlayLogData(), []);

  const filteredLogs = useMemo(() => {
    return allLogs.filter((log) => {
      if (log.date < startDate || log.date > endDate) return false;
      if (selectedCampaign !== "all" && log.campaignId !== selectedCampaign) return false;
      if (selectedZone !== "all" && log.zone !== selectedZone) return false;
      return true;
    });
  }, [allLogs, startDate, endDate, selectedCampaign, selectedZone]);

  const summaryStats = useMemo(() => {
    const totalPlays = filteredLogs.reduce((sum, l) => sum + l.plays, 0);
    const uniqueScreens = new Set(filteredLogs.map((l) => l.screenName)).size;
    const totalSeconds = filteredLogs.reduce((sum, l) => sum + l.totalDuration, 0);
    const totalHours = (totalSeconds / 3600).toFixed(1);
    return { totalPlays, uniqueScreens, totalHours };
  }, [filteredLogs]);

  const playsPerDay = useMemo(() => {
    const byDate: Record<string, number> = {};
    filteredLogs.forEach((l) => {
      byDate[l.date] = (byDate[l.date] || 0) + l.plays;
    });
    return Object.entries(byDate)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, plays]) => ({
        date: new Date(date + "T12:00:00").toLocaleDateString("es-CL", { weekday: "short", day: "numeric" }),
        plays,
      }));
  }, [filteredLogs]);

  const playsByZone = useMemo(() => {
    const byZone: Record<string, number> = {};
    filteredLogs.forEach((l) => {
      byZone[l.zone] = (byZone[l.zone] || 0) + l.plays;
    });
    return Object.entries(byZone).map(([name, value]) => ({ name, value }));
  }, [filteredLogs]);

  const playsByCampaign = useMemo(() => {
    const byCampaign: Record<string, number> = {};
    filteredLogs.forEach((l) => {
      byCampaign[l.campaign] = (byCampaign[l.campaign] || 0) + l.plays;
    });
    return Object.entries(byCampaign)
      .map(([name, plays]) => ({ name, plays }))
      .sort((a, b) => b.plays - a.plays);
  }, [filteredLogs]);

  // Aggregate table data: group by date + screen + campaign
  const tableData = useMemo(() => {
    const grouped: Record<
      string,
      { date: string; screenName: string; contentName: string; campaign: string; zone: string; plays: number; totalDuration: number }
    > = {};
    filteredLogs.forEach((l) => {
      const key = `${l.date}-${l.screenName}-${l.campaignId}`;
      if (!grouped[key]) {
        grouped[key] = { ...l };
      } else {
        grouped[key].plays += l.plays;
        grouped[key].totalDuration += l.totalDuration;
      }
    });
    return Object.values(grouped).sort((a, b) => b.date.localeCompare(a.date));
  }, [filteredLogs]);

  function handleExportCSV() {
    const headers = ["Date", "Screen", "Content", "Campaign", "Zone", "Plays", "Duration (s)"];
    const rows = tableData.map((r) => [r.date, r.screenName, r.contentName, r.campaign, r.zone, String(r.plays), String(r.totalDuration)]);
    const csv = generateCSV(headers, rows);
    downloadCSV(`proof-of-play-${startDate}-to-${endDate}.csv`, csv);
  }

  const tabs: { key: TabType; label: string }[] = [
    { key: "proof-of-play", label: "Proof of Play" },
    { key: "revenue", label: "Revenue Statements" },
    { key: "export", label: "Export Options" },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
        <p className="mt-1 text-sm text-gray-500">Proof of play, revenue statements, and data exports</p>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex gap-6">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`border-b-2 pb-3 text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Proof of Play Tab */}
      {activeTab === "proof-of-play" && (
        <div className="space-y-6">
          {/* Filters */}
          <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Filters</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Campaign</label>
                <select
                  value={selectedCampaign}
                  onChange={(e) => setSelectedCampaign(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="all">All Campaigns</option>
                  {campaigns.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Zone</label>
                <select
                  value={selectedZone}
                  onChange={(e) => setSelectedZone(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="all">All Zones</option>
                  {zones.map((z) => (
                    <option key={z} value={z}>
                      {z}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
              <p className="text-sm font-medium text-gray-500">Total Plays</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">{summaryStats.totalPlays.toLocaleString("es-CL")}</p>
            </div>
            <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
              <p className="text-sm font-medium text-gray-500">Unique Screens</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">{summaryStats.uniqueScreens}</p>
            </div>
            <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
              <p className="text-sm font-medium text-gray-500">Total Hours Played</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">{summaryStats.totalHours}</p>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Plays per Day */}
            <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Plays per Day</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={playsPerDay}>
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
                  <Pie data={playsByZone} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({ name, percent }: { name?: string; percent?: number }) => `${(name ?? "").split(" ")[0]} ${((percent ?? 0) * 100).toFixed(0)}%`}>
                    {playsByZone.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Plays by Campaign (horizontal bar) */}
          <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Plays by Campaign</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={playsByCampaign} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis type="category" dataKey="name" width={180} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="plays" fill="#10b981" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Export Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleExportCSV}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
            >
              Export CSV
            </button>
            <button
              onClick={generatePDFPlaceholder}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Export PDF
            </button>
          </div>

          {/* Results Table */}
          <div className="rounded-xl bg-white shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">Play Log Details</h3>
              <p className="text-sm text-gray-500 mt-1">Showing {Math.min(tableData.length, 50)} of {tableData.length} entries</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-left">
                    <th className="px-6 py-3 font-medium text-gray-500">Date</th>
                    <th className="px-6 py-3 font-medium text-gray-500">Screen</th>
                    <th className="px-6 py-3 font-medium text-gray-500">Content</th>
                    <th className="px-6 py-3 font-medium text-gray-500">Campaign</th>
                    <th className="px-6 py-3 font-medium text-gray-500 text-right">Plays</th>
                    <th className="px-6 py-3 font-medium text-gray-500 text-right">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.slice(0, 50).map((row, i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}>
                      <td className="px-6 py-3 text-gray-900">{row.date}</td>
                      <td className="px-6 py-3 text-gray-700">{row.screenName}</td>
                      <td className="px-6 py-3 text-gray-700 truncate max-w-[200px]">{row.contentName}</td>
                      <td className="px-6 py-3">
                        <Link href={`/reports/campaign/${campaigns.find((c) => c.name === row.campaign)?.id || "camp-1"}`} className="text-blue-600 hover:underline">
                          {row.campaign}
                        </Link>
                      </td>
                      <td className="px-6 py-3 text-right font-medium text-gray-900">{row.plays.toLocaleString("es-CL")}</td>
                      <td className="px-6 py-3 text-right text-gray-700">{Math.floor(row.totalDuration / 60)}m {row.totalDuration % 60}s</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Revenue Statements Tab */}
      {activeTab === "revenue" && (
        <div className="space-y-6">
          <div className="rounded-xl bg-white p-8 shadow-sm border border-gray-100 text-center">
            <div className="mx-auto h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center mb-4">
              <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Revenue Statements</h3>
            <p className="text-sm text-gray-500 mb-4">View detailed monthly revenue breakdowns, advertiser contributions, and share calculations.</p>
            <Link
              href="/reports/revenue"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
            >
              View Revenue Reports
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        </div>
      )}

      {/* Export Options Tab */}
      {activeTab === "export" && (
        <div className="space-y-4">
          <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Exports</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
                <div>
                  <p className="font-medium text-gray-900">Proof of Play Report</p>
                  <p className="text-sm text-gray-500">Complete play logs with screen and campaign data</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleExportCSV}
                    className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
                  >
                    CSV
                  </button>
                  <button
                    onClick={generatePDFPlaceholder}
                    className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    PDF
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
                <div>
                  <p className="font-medium text-gray-900">Revenue Statement</p>
                  <p className="text-sm text-gray-500">Monthly revenue breakdown by advertiser</p>
                </div>
                <div className="flex gap-2">
                  <Link
                    href="/reports/revenue"
                    className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
                  >
                    View
                  </Link>
                  <button
                    onClick={generatePDFPlaceholder}
                    className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    PDF
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
                <div>
                  <p className="font-medium text-gray-900">Campaign Reports</p>
                  <p className="text-sm text-gray-500">Individual campaign proof-of-play details</p>
                </div>
                <div className="flex gap-2">
                  {campaigns.slice(0, 3).map((c) => (
                    <Link
                      key={c.id}
                      href={`/reports/campaign/${c.id}`}
                      className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 truncate max-w-[120px]"
                      title={c.name}
                    >
                      {c.name.split(" ").slice(0, 2).join(" ")}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
