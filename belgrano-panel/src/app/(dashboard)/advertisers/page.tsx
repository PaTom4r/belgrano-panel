"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

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
    contactName: "Carolina Muñoz",
    contactEmail: "cmunoz@colmena.cl",
    contactPhone: "+56 9 8765 4321",
    contractStartDate: "2026-01-15",
    contractEndDate: "2026-12-31",
    contractValue: 18500000,
    notes: "Campaña institucional + planes de salud",
  },
  {
    id: "adv-002",
    name: "Cruz Blanca",
    company: "Cruz Blanca Salud",
    category: "ISAPRE",
    contactName: "Rodrigo Sepúlveda",
    contactEmail: "rsepulveda@cruzblanca.cl",
    contactPhone: "+56 9 7654 3210",
    contractStartDate: "2026-03-01",
    contractEndDate: "2026-08-31",
    contractValue: 12000000,
    notes: "Plan Preferente promoción",
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
    notes: "Línea nutricional Ensure + Pedialyte",
  },
  {
    id: "adv-004",
    name: "Novartis Chile",
    company: "Novartis",
    category: "Pharma",
    contactName: "Andrés Figueroa",
    contactEmail: "andres.figueroa@novartis.com",
    contactPhone: "+56 2 3456 7890",
    contractStartDate: "2026-04-01",
    contractEndDate: "2027-03-31",
    contractValue: 22000000,
    notes: "Campaña oncología + cardiología",
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
    contactName: "Matías Contreras",
    contactEmail: "mcontreras@bupa.cl",
    contactPhone: "+56 9 5432 1098",
    contractStartDate: "2026-05-01",
    contractEndDate: "2026-11-30",
    contractValue: 15000000,
    notes: "Planes internacionales + Seguro catastrófico",
  },
  {
    id: "adv-007",
    name: "Minsal Prevención",
    company: "Ministerio de Salud",
    category: "Wellness",
    contactName: "Paula Herrera",
    contactEmail: "pherrera@minsal.cl",
    contactPhone: "+56 2 4567 8901",
    contractStartDate: "2026-03-15",
    contractEndDate: "2026-09-15",
    contractValue: 5000000,
    notes: "Campaña prevención enfermedades respiratorias",
  },
  {
    id: "adv-008",
    name: "Banmédica",
    company: "Banmédica S.A.",
    category: "ISAPRE",
    contactName: "Ignacio Valdés",
    contactEmail: "ivaldes@banmedica.cl",
    contactPhone: "+56 9 4321 0987",
    contractStartDate: "2026-02-15",
    contractEndDate: "2026-12-15",
    contractValue: 20000000,
    notes: "Campaña integral — planes + clínicas",
  },
  {
    id: "adv-009",
    name: "Pfizer Chile",
    company: "Pfizer",
    category: "Pharma",
    contactName: "Sofía Larraín",
    contactEmail: "sofia.larrain@pfizer.com",
    contactPhone: "+56 2 5678 9012",
    contractStartDate: "2025-11-01",
    contractEndDate: "2026-02-28",
    contractValue: 7200000,
    notes: "Vacunación invierno — contrato finalizado",
  },
  {
    id: "adv-010",
    name: "Clínica Yoga & Bienestar",
    company: "Yoga CL SpA",
    category: "Wellness",
    contactName: "Camila Bravo",
    contactEmail: "camila@yogacl.com",
    contactPhone: "+56 9 3210 9876",
    contractStartDate: "2026-06-01",
    contractEndDate: "2026-08-31",
    contractValue: 3200000,
    notes: "Talleres mindfulness y bienestar — contrato futuro",
  },
];

const categories = ["All", "ISAPRE", "Pharma", "Insurance", "Wellness", "Other"] as const;

const categoryColors: Record<string, string> = {
  ISAPRE: "bg-purple-100 text-purple-800",
  Pharma: "bg-teal-100 text-teal-800",
  Insurance: "bg-blue-100 text-blue-800",
  Wellness: "bg-green-100 text-green-800",
  Other: "bg-gray-100 text-gray-800",
};

const formatCLP = (value: number) =>
  new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" }).format(value);

function getContractStatus(start: string, end: string) {
  const now = new Date();
  const startDate = new Date(start);
  const endDate = new Date(end);
  if (now < startDate) return { label: "Upcoming", color: "text-blue-600 bg-blue-50" };
  if (now > endDate) return { label: "Expired", color: "text-red-600 bg-red-50" };
  return { label: "Active", color: "text-emerald-600 bg-emerald-50" };
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
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Advertisers</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage advertiser accounts and contracts
            </p>
          </div>
          <Link
            href="/advertisers/new"
            className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
          >
            Add Advertiser
          </Link>
        </div>

        {/* Stats Bar */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-200">
            <p className="text-sm font-medium text-gray-500">Total Advertisers</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{mockAdvertisers.length}</p>
          </div>
          <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-200">
            <p className="text-sm font-medium text-gray-500">Active Contracts</p>
            <p className="mt-1 text-2xl font-bold text-emerald-600">{activeContracts}</p>
          </div>
          <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-200">
            <p className="text-sm font-medium text-gray-500">Total Contract Value</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{formatCLP(totalContractValue)}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
          <input
            type="text"
            placeholder="Search by name or company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none sm:max-w-xs"
          />
          <div className="flex gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                  categoryFilter === cat
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-600 ring-1 ring-gray-200 hover:bg-gray-50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Company
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Contact Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Contract Period
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Contract Value
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((adv) => {
                  const status = getContractStatus(adv.contractStartDate, adv.contractEndDate);
                  return (
                    <tr key={adv.id} className="hover:bg-gray-50 transition">
                      <td className="whitespace-nowrap px-6 py-4">
                        <Link
                          href={`/advertisers/${adv.id}`}
                          className="text-sm font-medium text-blue-600 hover:text-blue-800"
                        >
                          {adv.name}
                        </Link>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
                        {adv.company}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${categoryColors[adv.category]}`}
                        >
                          {adv.category}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        {adv.contactEmail}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        {adv.contractStartDate} &mdash; {adv.contractEndDate}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${status.color}`}
                        >
                          {status.label}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium text-gray-900">
                        {formatCLP(adv.contractValue)}
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-sm text-gray-400">
                      No advertisers found matching your criteria
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
