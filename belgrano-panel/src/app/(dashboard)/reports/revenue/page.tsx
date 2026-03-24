"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { generatePDFPlaceholder } from "@/lib/export";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardHeader } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { CHART_COLORS, clpFormat } from "@/lib/constants";

// --- Mock Revenue Data ---

interface AdvertiserRevenue {
  advertiser: string;
  campaign: string;
  campaignId: string;
  plays: number;
  impressions: number;
  revenue: number;
}

interface MonthlyData {
  month: string;
  label: string;
  totalRevenue: number;
  clcShare: number;
  belgranoShare: number;
  totalPlays: number;
  totalImpressions: number;
  advertisers: AdvertiserRevenue[];
}

function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function generateMonthlyData(): MonthlyData[] {
  const months: MonthlyData[] = [];
  const now = new Date();

  const advertiserCampaigns = [
    { advertiser: "ISAPRE Colmena", campaign: "Plan Premium Salud", campaignId: "camp-1", basePlays: 28000, cpmRate: 3500 },
    { advertiser: "Abbott Pharma", campaign: "Vitaminas Ensure", campaignId: "camp-2", basePlays: 22000, cpmRate: 4200 },
    { advertiser: "MetLife Seguros", campaign: "Seguro Vida Proteccion", campaignId: "camp-3", basePlays: 18000, cpmRate: 3800 },
    { advertiser: "ISAPRE Colmena", campaign: "Check-Up Anual", campaignId: "camp-4", basePlays: 15000, cpmRate: 3200 },
    { advertiser: "Abbott Pharma", campaign: "Suplemento Omega 3", campaignId: "camp-5", basePlays: 12000, cpmRate: 2900 },
  ];

  for (let m = 5; m >= 0; m--) {
    const date = new Date(now.getFullYear(), now.getMonth() - m, 1);
    const monthStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    const monthLabel = date.toLocaleDateString("es-CL", { month: "long", year: "numeric" });

    const advertisers: AdvertiserRevenue[] = advertiserCampaigns.map((ac, i) => {
      const seed = m * 100 + i;
      const variance = 0.85 + seededRandom(seed) * 0.3;
      const plays = Math.round(ac.basePlays * variance);
      const impressionsPerPlay = 3.5 + seededRandom(seed + 50) * 2;
      const impressions = Math.round(plays * impressionsPerPlay);
      const revenue = Math.round((impressions / 1000) * ac.cpmRate);

      return {
        advertiser: ac.advertiser,
        campaign: ac.campaign,
        campaignId: ac.campaignId,
        plays,
        impressions,
        revenue,
      };
    });

    const totalRevenue = advertisers.reduce((sum, a) => sum + a.revenue, 0);
    const totalPlays = advertisers.reduce((sum, a) => sum + a.plays, 0);
    const totalImpressions = advertisers.reduce((sum, a) => sum + a.impressions, 0);

    months.push({
      month: monthStr,
      label: monthLabel,
      totalRevenue,
      clcShare: Math.round(totalRevenue * 0.3),
      belgranoShare: Math.round(totalRevenue * 0.7),
      totalPlays,
      totalImpressions,
      advertisers,
    });
  }

  return months;
}

export default function RevenuePage() {
  const allMonths = useMemo(() => generateMonthlyData(), []);
  const [selectedMonth, setSelectedMonth] = useState(allMonths[allMonths.length - 1].month);

  const currentMonth = useMemo(
    () => allMonths.find((m) => m.month === selectedMonth) || allMonths[allMonths.length - 1],
    [allMonths, selectedMonth]
  );

  const trendData = useMemo(
    () =>
      allMonths.map((m) => ({
        month: m.label.split(" ")[0].slice(0, 3),
        revenue: m.totalRevenue,
        clc: m.clcShare,
        belgrano: m.belgranoShare,
      })),
    [allMonths]
  );

  return (
    <div>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-1">
        <Link href="/reports" className="text-sm text-slate-500 hover:text-slate-700 transition-colors">
          Reports
        </Link>
        <span className="text-sm text-slate-400">/</span>
        <span className="text-sm text-slate-700">Revenue</span>
      </div>

      <PageHeader
        title="Revenue Statements"
        description="Monthly revenue breakdown and share calculations"
        actions={
          <button
            onClick={generatePDFPlaceholder}
            className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors"
          >
            Export Statement PDF
          </button>
        }
      />

      {/* Month Selector */}
      <div className="mb-6">
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-900 focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:outline-none transition-colors"
        >
          {allMonths.map((m) => (
            <option key={m.month} value={m.month}>
              {m.label.charAt(0).toUpperCase() + m.label.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Revenue Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5 mb-6">
        <StatCard label="Total Revenue" value={clpFormat.format(currentMonth.totalRevenue)} color="slate" />
        <StatCard label="CLC Share (30%)" value={clpFormat.format(currentMonth.clcShare)} color="blue" />
        <StatCard label="Belgrano Share (70%)" value={clpFormat.format(currentMonth.belgranoShare)} color="emerald" />
        <StatCard label="Total Plays" value={currentMonth.totalPlays.toLocaleString("es-CL")} color="purple" />
        <StatCard label="Total Impressions" value={currentMonth.totalImpressions.toLocaleString("es-CL")} color="amber" />
      </div>

      {/* Revenue by Advertiser Table */}
      <Card padding="p-0" className="mb-6">
        <div className="px-6 py-4 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900">Revenue by Advertiser</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-left">
                <th className="px-6 py-3 font-medium text-slate-500">Advertiser</th>
                <th className="px-6 py-3 font-medium text-slate-500">Campaign</th>
                <th className="px-6 py-3 font-medium text-slate-500 text-right">Plays</th>
                <th className="px-6 py-3 font-medium text-slate-500 text-right">Impressions</th>
                <th className="px-6 py-3 font-medium text-slate-500 text-right">Revenue (CLP)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currentMonth.advertisers.map((adv, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-3 font-medium text-slate-900">{adv.advertiser}</td>
                  <td className="px-6 py-3">
                    <Link href={`/reports/campaign/${adv.campaignId}`} className="text-blue-600 hover:underline transition-colors">
                      {adv.campaign}
                    </Link>
                  </td>
                  <td className="px-6 py-3 text-right text-slate-700">{adv.plays.toLocaleString("es-CL")}</td>
                  <td className="px-6 py-3 text-right text-slate-700">{adv.impressions.toLocaleString("es-CL")}</td>
                  <td className="px-6 py-3 text-right font-medium text-slate-900">{clpFormat.format(adv.revenue)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-slate-100 font-semibold">
                <td className="px-6 py-3 text-slate-900" colSpan={2}>
                  Total
                </td>
                <td className="px-6 py-3 text-right text-slate-900">{currentMonth.totalPlays.toLocaleString("es-CL")}</td>
                <td className="px-6 py-3 text-right text-slate-900">{currentMonth.totalImpressions.toLocaleString("es-CL")}</td>
                <td className="px-6 py-3 text-right text-slate-900">{clpFormat.format(currentMonth.totalRevenue)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </Card>

      {/* Revenue Trend Chart */}
      <Card>
        <CardHeader title="Revenue Trend (Last 6 Months)" />
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
            />
            <Tooltip formatter={(value) => clpFormat.format(Number(value))} />
            <Legend />
            <Line type="monotone" dataKey="revenue" name="Total Revenue" stroke={CHART_COLORS[0]} strokeWidth={2} dot={{ r: 4 }} />
            <Line type="monotone" dataKey="belgrano" name="Belgrano (70%)" stroke={CHART_COLORS[1]} strokeWidth={2} dot={{ r: 4 }} />
            <Line type="monotone" dataKey="clc" name="CLC (30%)" stroke={CHART_COLORS[2]} strokeWidth={2} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
