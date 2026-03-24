"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { clpFormat } from "@/lib/constants";

type Campaign = {
  id: string;
  advertiserId: string;
  advertiserName: string;
  name: string;
  status: "draft" | "active" | "paused" | "completed" | "cancelled";
  startDate: string;
  endDate: string;
  targetZones: string[];
  dailyFrequency: number;
  budgetCLP: number;
  cpmRate: number;
};

const mockCampaigns: Campaign[] = [
  {
    id: "cmp-001",
    advertiserId: "adv-001",
    advertiserName: "Colmena Golden Cross",
    name: "Plan Salud Premium Q1",
    status: "active",
    startDate: "2026-01-15",
    endDate: "2026-04-15",
    targetZones: ["Lobby Principal", "Urgencias", "Pasillos Piso 1"],
    dailyFrequency: 15,
    budgetCLP: 6500000,
    cpmRate: 2500,
  },
  {
    id: "cmp-002",
    advertiserId: "adv-001",
    advertiserName: "Colmena Golden Cross",
    name: "Colmena Verano",
    status: "completed",
    startDate: "2026-01-01",
    endDate: "2026-03-01",
    targetZones: ["Lobby Principal", "Cafetería"],
    dailyFrequency: 10,
    budgetCLP: 4000000,
    cpmRate: 2000,
  },
  {
    id: "cmp-003",
    advertiserId: "adv-002",
    advertiserName: "Cruz Blanca",
    name: "Plan Preferente 2026",
    status: "active",
    startDate: "2026-03-01",
    endDate: "2026-06-30",
    targetZones: ["Lobby Principal", "Pediatría", "Maternidad"],
    dailyFrequency: 12,
    budgetCLP: 5500000,
    cpmRate: 2200,
  },
  {
    id: "cmp-004",
    advertiserId: "adv-003",
    advertiserName: "Abbott Laboratories",
    name: "Ensure Nutrición Adultos",
    status: "active",
    startDate: "2026-02-15",
    endDate: "2026-05-15",
    targetZones: ["Cardiología", "Oncología", "Pasillos Piso 2"],
    dailyFrequency: 8,
    budgetCLP: 4200000,
    cpmRate: 1800,
  },
  {
    id: "cmp-005",
    advertiserId: "adv-003",
    advertiserName: "Abbott Laboratories",
    name: "Pedialyte Invierno",
    status: "draft",
    startDate: "2026-05-01",
    endDate: "2026-08-31",
    targetZones: ["Pediatría", "Urgencias"],
    dailyFrequency: 10,
    budgetCLP: 3000000,
    cpmRate: 1500,
  },
  {
    id: "cmp-006",
    advertiserId: "adv-004",
    advertiserName: "Novartis Chile",
    name: "Oncología Awareness",
    status: "draft",
    startDate: "2026-04-01",
    endDate: "2026-07-31",
    targetZones: ["Oncología", "Lobby Principal", "Pasillos Piso 1", "Pasillos Piso 2"],
    dailyFrequency: 20,
    budgetCLP: 8000000,
    cpmRate: 3000,
  },
  {
    id: "cmp-007",
    advertiserId: "adv-005",
    advertiserName: "MetLife Chile",
    name: "Seguros Complementarios",
    status: "paused",
    startDate: "2026-01-15",
    endDate: "2026-06-30",
    targetZones: ["Lobby Principal", "Cafetería", "Traumatología"],
    dailyFrequency: 6,
    budgetCLP: 4800000,
    cpmRate: 2000,
  },
  {
    id: "cmp-008",
    advertiserId: "adv-008",
    advertiserName: "Banmédica",
    name: "Banmédica Integral",
    status: "active",
    startDate: "2026-03-01",
    endDate: "2026-09-30",
    targetZones: ["Lobby Principal", "Urgencias", "Pediatría", "Cardiología", "Maternidad"],
    dailyFrequency: 18,
    budgetCLP: 10000000,
    cpmRate: 2800,
  },
];

const statuses = ["All", "draft", "active", "paused", "completed", "cancelled"] as const;

const statusBadgeVariant: Record<string, "draft" | "success" | "warning" | "info" | "error"> = {
  draft: "draft",
  active: "success",
  paused: "warning",
  completed: "info",
  cancelled: "error",
};

export default function CampaignsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");

  const filtered = useMemo(() => {
    return mockCampaigns.filter((c) => {
      const matchesSearch =
        !search ||
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.advertiserName.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "All" || c.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter]);

  const totalCampaigns = mockCampaigns.length;
  const activeCampaigns = mockCampaigns.filter((c) => c.status === "active").length;
  const draftCampaigns = mockCampaigns.filter((c) => c.status === "draft").length;
  const completedCampaigns = mockCampaigns.filter((c) => c.status === "completed").length;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <PageHeader
          title="Campaigns"
          description="Manage advertising campaigns and content scheduling"
          actions={
            <Link
              href="/campaigns/new"
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2.5 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            >
              Create Campaign
            </Link>
          }
        />

        {/* Stats Bar */}
        <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard label="Total Campaigns" value={totalCampaigns} color="slate" />
          <StatCard label="Active" value={activeCampaigns} color="emerald" />
          <StatCard label="Draft" value={draftCampaigns} color="slate" />
          <StatCard label="Completed" value={completedCampaigns} color="blue" />
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
          <input
            type="text"
            placeholder="Search by campaign or advertiser..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:outline-none transition-colors sm:max-w-xs"
          />
          <div className="flex flex-wrap gap-2">
            {statuses.map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
                  statusFilter === st
                    ? "bg-blue-600 text-white"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-xl bg-white shadow-sm border border-slate-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Campaign
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Advertiser
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Dates
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Zones
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Daily Freq
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Budget
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((campaign) => (
                  <tr key={campaign.id} className="hover:bg-slate-50 transition-colors">
                    <td className="whitespace-nowrap px-6 py-4">
                      <Link
                        href={`/campaigns/${campaign.id}`}
                        className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        {campaign.name}
                      </Link>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-700">
                      <Link
                        href={`/advertisers/${campaign.advertiserId}`}
                        className="hover:text-blue-600 transition-colors"
                      >
                        {campaign.advertiserName}
                      </Link>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <Badge variant={statusBadgeVariant[campaign.status]}>
                        {campaign.status}
                      </Badge>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">
                      {campaign.startDate} &mdash; {campaign.endDate}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {campaign.targetZones.slice(0, 2).map((zone) => (
                          <span
                            key={zone}
                            className="inline-flex rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-600"
                          >
                            {zone}
                          </span>
                        ))}
                        {campaign.targetZones.length > 2 && (
                          <span className="inline-flex rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-500">
                            +{campaign.targetZones.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-center text-sm font-medium text-slate-900">
                      {campaign.dailyFrequency}x
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium text-slate-900">
                      {clpFormat.format(campaign.budgetCLP)}
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-sm text-slate-400">
                      No campaigns found matching your criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
