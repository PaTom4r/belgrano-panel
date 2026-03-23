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

const clpFormat = new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" });

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

  const formatTooltipValue = (value: number | string | Array<number | string>) => clpFormat.format(Number(value));

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link href="/reports" className="text-sm text-gray-500 hover:text-gray-700">
              Reports
            </Link>
            <span className="text-sm text-gray-400">/</span>
            <span className="text-sm text-gray-700">Revenue</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Revenue Statements</h1>
          <p className="mt-1 text-sm text-gray-500">Monthly revenue breakdown and share calculations</p>
        </div>
        <button
          onClick={generatePDFPlaceholder}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Export Statement PDF
        </button>
      </div>

      {/* Month Selector */}
      <div className="mb-6">
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
        <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-500">Total Revenue</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">{clpFormat.format(currentMonth.totalRevenue)}</p>
        </div>
        <div className="rounded-xl bg-blue-50 p-6 shadow-sm border border-blue-100">
          <p className="text-sm font-medium text-blue-700">CLC Share (30%)</p>
          <p className="mt-2 text-2xl font-bold text-blue-900">{clpFormat.format(currentMonth.clcShare)}</p>
        </div>
        <div className="rounded-xl bg-emerald-50 p-6 shadow-sm border border-emerald-100">
          <p className="text-sm font-medium text-emerald-700">Belgrano Share (70%)</p>
          <p className="mt-2 text-2xl font-bold text-emerald-900">{clpFormat.format(currentMonth.belgranoShare)}</p>
        </div>
        <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-500">Total Plays</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">{currentMonth.totalPlays.toLocaleString("es-CL")}</p>
        </div>
        <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-500">Total Impressions</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">{currentMonth.totalImpressions.toLocaleString("es-CL")}</p>
        </div>
      </div>

      {/* Revenue by Advertiser Table */}
      <div className="rounded-xl bg-white shadow-sm border border-gray-100 overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Revenue by Advertiser</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="px-6 py-3 font-medium text-gray-500">Advertiser</th>
                <th className="px-6 py-3 font-medium text-gray-500">Campaign</th>
                <th className="px-6 py-3 font-medium text-gray-500 text-right">Plays</th>
                <th className="px-6 py-3 font-medium text-gray-500 text-right">Impressions</th>
                <th className="px-6 py-3 font-medium text-gray-500 text-right">Revenue (CLP)</th>
              </tr>
            </thead>
            <tbody>
              {currentMonth.advertisers.map((adv, i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}>
                  <td className="px-6 py-3 font-medium text-gray-900">{adv.advertiser}</td>
                  <td className="px-6 py-3">
                    <Link href={`/reports/campaign/${adv.campaignId}`} className="text-blue-600 hover:underline">
                      {adv.campaign}
                    </Link>
                  </td>
                  <td className="px-6 py-3 text-right text-gray-700">{adv.plays.toLocaleString("es-CL")}</td>
                  <td className="px-6 py-3 text-right text-gray-700">{adv.impressions.toLocaleString("es-CL")}</td>
                  <td className="px-6 py-3 text-right font-medium text-gray-900">{clpFormat.format(adv.revenue)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-gray-100 font-semibold">
                <td className="px-6 py-3 text-gray-900" colSpan={2}>
                  Total
                </td>
                <td className="px-6 py-3 text-right text-gray-900">{currentMonth.totalPlays.toLocaleString("es-CL")}</td>
                <td className="px-6 py-3 text-right text-gray-900">{currentMonth.totalImpressions.toLocaleString("es-CL")}</td>
                <td className="px-6 py-3 text-right text-gray-900">{clpFormat.format(currentMonth.totalRevenue)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Revenue Trend Chart */}
      <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend (Last 6 Months)</h3>
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
            <Line type="monotone" dataKey="revenue" name="Total Revenue" stroke="#2563eb" strokeWidth={2} dot={{ r: 4 }} />
            <Line type="monotone" dataKey="belgrano" name="Belgrano (70%)" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
            <Line type="monotone" dataKey="clc" name="CLC (30%)" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
