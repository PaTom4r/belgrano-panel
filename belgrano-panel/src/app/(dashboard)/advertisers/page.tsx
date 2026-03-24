"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";

type Advertiser = {
  id: string;
  name: string;
  company: string;
  category: "ISAPRE" | "Pharma" | "Insurance" | "Wellness" | "Other";
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  contractStartDate: string;
  contractEndDate: string;
  contractValue: number;
  notes: string;
};

const mockAdvertisers: Advertiser[] = [
  {
    id: "adv-001",
    name: "Colmena Golden Cross",
    company: "Colmena",
    category: "ISAPRE",
    contactName: "Carolina Munoz",
    contactEmail: "cmunoz@colmena.cl",
    contactPhone: "+56 9 8765 4321",
    contractStartDate: "2026-01-15",
    contractEndDate: "2026-12-31",
    contractValue: 18500000,
    notes: "Campana institucional + planes de salud",
  },
  {
    id: "adv-002",
    name: "Cruz Blanca",
    company: "Cruz Blanca Salud",
    category: "ISAPRE",
    contactName: "Rodrigo Sepulveda",
    contactEmail: "rsepulveda@cruzblanca.cl",
    contactPhone: "+56 9 7654 3210",
    contractStartDate: "2026-03-01",
    contractEndDate: "2026-08-31",
    contractValue: 12000000,
    notes: "Plan Preferente promocion",
  },
  {
    id: "adv-003",
    name: "Abbott Laboratories",
    company: "Abbott Chile",
    category: "Pharma",
    contactName: "Francisca Torres",
    contactEmail: "ftorres@abbott.com",
    contactPhone: "+56 2 2345 6789",
    contractStartDate: "2026-02-01",
    contractEndDate: "2026-07-31",
    contractValue: 8500000,
    notes: "Linea nutricional Ensure + Pedialyte",
  },
  {
    id: "adv-004",
    name: "Novartis Chile",
    company: "Novartis",
    category: "Pharma",
    contactName: "Andres Figueroa",
    contactEmail: "andres.figueroa@novartis.com",
    contactPhone: "+56 2 3456 7890",
    contractStartDate: "2026-04-01",
    contractEndDate: "2027-03-31",
    contractValue: 22000000,
    notes: "Campana oncologia + cardiologia",
  },
  {
    id: "adv-005",
    name: "MetLife Chile",
    company: "MetLife Seguros",
    category: "Insurance",
    contactName: "Valentina Rojas",
    contactEmail: "vrojas@metlife.cl",
    contactPhone: "+56 9 6543 2109",
    contractStartDate: "2026-01-01",
    contractEndDate: "2026-06-30",
    contractValue: 9800000,
    notes: "Seguros complementarios salud",
  },
  {
    id: "adv-006",
    name: "Bupa Chile",
    company: "Bupa",
    category: "Insurance",
    contactName: "Matias Contreras",
    contactEmail: "mcontreras@bupa.cl",
    contactPhone: "+56 9 5432 1098",
    contractStartDate: "2026-05-01",
    contractEndDate: "2026-11-30",
    contractValue: 15000000,
    notes: "Planes internacionales + Seguro catastrofico",
  },
  {
    id: "adv-007",
    name: "Minsal Prevencion",
    company: "Ministerio de Salud",
    category: "Wellness",
    contactName: "Paula Herrera",
    contactEmail: "pherrera@minsal.cl",
    contactPhone: "+56 2 4567 8901",
    contractStartDate: "2026-03-15",
    contractEndDate: "2026-09-15",
    contractValue: 5000000,
    notes: "Campana prevencion enfermedades respiratorias",
  },
  {
    id: "adv-008",
    name: "Banmedica",
    company: "Banmedica S.A.",
    category: "ISAPRE",
    contactName: "Ignacio Valdes",
    contactEmail: "ivaldes@banmedica.cl",
    contactPhone: "+56 9 4321 0987",
    contractStartDate: "2026-02-15",
    contractEndDate: "2026-12-15",
    contractValue: 20000000,
    notes: "Campana integral -- planes + clinicas",
  },
  {
    id: "adv-009",
    name: "Pfizer Chile",
    company: "Pfizer",
    category: "Pharma",
    contactName: "Sofia Larrain",
    contactEmail: "sofia.larrain@pfizer.com",
    contactPhone: "+56 2 5678 9012",
    contractStartDate: "2025-11-01",
    contractEndDate: "2026-02-28",
    contractValue: 7200000,
    notes: "Vacunacion invierno -- contrato finalizado",
  },
  {
    id: "adv-010",
    name: "Clinica Yoga & Bienestar",
    company: "Yoga CL SpA",
    category: "Wellness",
    contactName: "Camila Bravo",
    contactEmail: "camila@yogacl.com",
    contactPhone: "+56 9 3210 9876",
    contractStartDate: "2026-06-01",
    contractEndDate: "2026-08-31",
    contractValue: 3200000,
    notes: "Talleres mindfulness y bienestar -- contrato futuro",
  },
];

const categories = ["All", "ISAPRE", "Pharma", "Insurance", "Wellness", "Other"] as const;

const categoryBadgeVariant: Record<string, "purple" | "teal" | "info" | "success" | "draft"> = {
  ISAPRE: "purple",
  Pharma: "teal",
  Insurance: "info",
  Wellness: "success",
  Other: "draft",
};

const formatCLP = (value: number) =>
  new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" }).format(value);

function getContractStatus(start: string, end: string) {
  const now = new Date();
  const startDate = new Date(start);
  const endDate = new Date(end);
  if (now < startDate) return { label: "Upcoming", variant: "info" as const };
  if (now > endDate) return { label: "Expired", variant: "error" as const };
  return { label: "Active", variant: "success" as const };
}

export default function AdvertisersPage() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");

  const filtered = useMemo(() => {
    return mockAdvertisers.filter((a) => {
      const matchesSearch =
        !search ||
        a.name.toLowerCase().includes(search.toLowerCase()) ||
        a.company.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = categoryFilter === "All" || a.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [search, categoryFilter]);

  const activeContracts = mockAdvertisers.filter((a) => {
    const now = new Date();
    return new Date(a.contractStartDate) <= now && new Date(a.contractEndDate) >= now;
  }).length;

  const totalContractValue = mockAdvertisers.reduce((sum, a) => sum + a.contractValue, 0);

  return (
    <div>
      <PageHeader
        title="Advertisers"
        description="Manage advertiser accounts and contracts"
        actions={
          <Link
            href="/advertisers/new"
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2.5 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          >
            Add Advertiser
          </Link>
        }
      />

      {/* Stats Bar */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="Total Advertisers"
          value={mockAdvertisers.length}
          color="blue"
        />
        <StatCard
          label="Active Contracts"
          value={activeContracts}
          color="emerald"
        />
        <StatCard
          label="Total Contract Value"
          value={formatCLP(totalContractValue)}
          color="purple"
        />
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <input
          type="text"
          placeholder="Search by name or company..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-colors sm:max-w-xs"
        />
        <div className="flex gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                categoryFilter === cat
                  ? "bg-blue-600 text-white"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <Card padding="p-0">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Company
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Contact Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Contract Period
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Contract Value
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filtered.map((adv) => {
                const status = getContractStatus(adv.contractStartDate, adv.contractEndDate);
                return (
                  <tr key={adv.id} className="hover:bg-slate-50 transition-colors">
                    <td className="whitespace-nowrap px-6 py-4">
                      <Link
                        href={`/advertisers/${adv.id}`}
                        className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        {adv.name}
                      </Link>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-700">
                      {adv.company}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <Badge variant={categoryBadgeVariant[adv.category]}>
                        {adv.category}
                      </Badge>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">
                      {adv.contactEmail}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">
                      {adv.contractStartDate} &mdash; {adv.contractEndDate}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <Badge variant={status.variant}>
                        {status.label}
                      </Badge>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium text-slate-900">
                      {formatCLP(adv.contractValue)}
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-sm text-slate-400">
                    No advertisers found matching your criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
