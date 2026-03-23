"use client";

import Link from "next/link";
import { use } from "react";

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

type Campaign = {
  id: string;
  name: string;
  status: "draft" | "active" | "paused" | "completed" | "cancelled";
  startDate: string;
  endDate: string;
  budgetCLP: number;
};

const mockAdvertisers: Record<string, Advertiser> = {
  "adv-001": {
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
  "adv-002": {
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
  "adv-003": {
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
  "adv-004": {
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
  "adv-005": {
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
  "adv-006": {
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
  "adv-007": {
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
  "adv-008": {
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
  "adv-009": {
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
  "adv-010": {
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
};

const mockCampaigns: Record<string, Campaign[]> = {
  "adv-001": [
    { id: "cmp-001", name: "Plan Salud Premium Q1", status: "active", startDate: "2026-01-15", endDate: "2026-04-15", budgetCLP: 6500000 },
    { id: "cmp-002", name: "Colmena Verano", status: "completed", startDate: "2026-01-01", endDate: "2026-03-01", budgetCLP: 4000000 },
  ],
  "adv-002": [
    { id: "cmp-003", name: "Plan Preferente 2026", status: "active", startDate: "2026-03-01", endDate: "2026-06-30", budgetCLP: 5500000 },
  ],
  "adv-003": [
    { id: "cmp-004", name: "Ensure Nutrición Adultos", status: "active", startDate: "2026-02-15", endDate: "2026-05-15", budgetCLP: 4200000 },
    { id: "cmp-005", name: "Pedialyte Invierno", status: "draft", startDate: "2026-05-01", endDate: "2026-08-31", budgetCLP: 3000000 },
  ],
  "adv-004": [
    { id: "cmp-006", name: "Oncología Awareness", status: "draft", startDate: "2026-04-01", endDate: "2026-07-31", budgetCLP: 8000000 },
  ],
  "adv-005": [
    { id: "cmp-007", name: "Seguros Complementarios", status: "active", startDate: "2026-01-15", endDate: "2026-06-30", budgetCLP: 4800000 },
  ],
  "adv-008": [
    { id: "cmp-008", name: "Banmédica Integral", status: "active", startDate: "2026-03-01", endDate: "2026-09-30", budgetCLP: 10000000 },
  ],
};

const categoryColors: Record<string, string> = {
  ISAPRE: "bg-purple-100 text-purple-800",
  Pharma: "bg-teal-100 text-teal-800",
  Insurance: "bg-blue-100 text-blue-800",
  Wellness: "bg-green-100 text-green-800",
  Other: "bg-gray-100 text-gray-800",
};

const statusColors: Record<string, string> = {
  draft: "bg-slate-100 text-slate-700",
  active: "bg-emerald-100 text-emerald-800",
  paused: "bg-amber-100 text-amber-800",
  completed: "bg-blue-100 text-blue-800",
  cancelled: "bg-red-100 text-red-800",
};

const formatCLP = (value: number) =>
  new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" }).format(value);

function getContractStatus(start: string, end: string) {
  const now = new Date();
  const startDate = new Date(start);
  const endDate = new Date(end);
  if (now < startDate) return { label: "Upcoming", color: "text-blue-600 bg-blue-50", icon: "clock" };
  if (now > endDate) return { label: "Expired", color: "text-red-600 bg-red-50", icon: "x" };
  return { label: "Active", color: "text-emerald-600 bg-emerald-50", icon: "check" };
}

export default function AdvertiserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const advertiser = mockAdvertisers[id];

  if (!advertiser) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-slate-900">Advertiser Not Found</h1>
          <p className="mt-2 text-sm text-gray-500">
            The advertiser you are looking for does not exist.
          </p>
          <Link href="/advertisers" className="mt-4 inline-block text-sm text-blue-600 hover:text-blue-800">
            &larr; Back to Advertisers
          </Link>
        </div>
      </div>
    );
  }

  const campaigns = mockCampaigns[id] || [];
  const contractStatus = getContractStatus(advertiser.contractStartDate, advertiser.contractEndDate);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/advertisers" className="text-sm text-blue-600 hover:text-blue-800">
            &larr; Back to Advertisers
          </Link>
          <div className="mt-2 flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{advertiser.name}</h1>
              <div className="mt-2 flex items-center gap-3">
                <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${categoryColors[advertiser.category]}`}>
                  {advertiser.category}
                </span>
                <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${contractStatus.color}`}>
                  {contractStatus.label}
                </span>
              </div>
            </div>
            <button className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-700 ring-1 ring-gray-300 hover:bg-gray-50">
              Edit
            </button>
          </div>
        </div>

        {/* Info Grid */}
        <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Company Info */}
          <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500">Company Info</h2>
            <dl className="mt-4 space-y-4">
              <div>
                <dt className="text-xs text-gray-400">Company</dt>
                <dd className="mt-0.5 text-sm font-medium text-slate-900">{advertiser.company}</dd>
              </div>
              <div>
                <dt className="text-xs text-gray-400">Category</dt>
                <dd className="mt-0.5 text-sm font-medium text-slate-900">{advertiser.category}</dd>
              </div>
              <div>
                <dt className="text-xs text-gray-400">Notes</dt>
                <dd className="mt-0.5 text-sm text-gray-700">{advertiser.notes || "No notes"}</dd>
              </div>
            </dl>
          </div>

          {/* Contact Info */}
          <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500">Contact Info</h2>
            <dl className="mt-4 space-y-4">
              <div>
                <dt className="text-xs text-gray-400">Contact Name</dt>
                <dd className="mt-0.5 text-sm font-medium text-slate-900">{advertiser.contactName}</dd>
              </div>
              <div>
                <dt className="text-xs text-gray-400">Email</dt>
                <dd className="mt-0.5 text-sm text-blue-600">{advertiser.contactEmail}</dd>
              </div>
              <div>
                <dt className="text-xs text-gray-400">Phone</dt>
                <dd className="mt-0.5 text-sm font-medium text-slate-900">{advertiser.contactPhone}</dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Contract Details */}
        <div className="mb-8 rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500">Contract Details</h2>
          <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div>
              <dt className="text-xs text-gray-400">Start Date</dt>
              <dd className="mt-0.5 text-sm font-medium text-slate-900">{advertiser.contractStartDate}</dd>
            </div>
            <div>
              <dt className="text-xs text-gray-400">End Date</dt>
              <dd className="mt-0.5 text-sm font-medium text-slate-900">{advertiser.contractEndDate}</dd>
            </div>
            <div>
              <dt className="text-xs text-gray-400">Contract Value</dt>
              <dd className="mt-0.5 text-lg font-bold text-slate-900">{formatCLP(advertiser.contractValue)}</dd>
            </div>
          </div>
        </div>

        {/* Campaigns */}
        <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500">Campaigns</h2>
            <Link
              href="/campaigns/new"
              className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700"
            >
              New Campaign
            </Link>
          </div>
          {campaigns.length === 0 ? (
            <p className="mt-6 text-center text-sm text-gray-400">No campaigns yet</p>
          ) : (
            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Name</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Status</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Period</th>
                    <th className="px-4 py-2 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">Budget</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {campaigns.map((c) => (
                    <tr key={c.id} className="hover:bg-gray-50 transition">
                      <td className="whitespace-nowrap px-4 py-3">
                        <Link href={`/campaigns/${c.id}`} className="text-sm font-medium text-blue-600 hover:text-blue-800">
                          {c.name}
                        </Link>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[c.status]}`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                        {c.startDate} &mdash; {c.endDate}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-right text-sm font-medium text-gray-900">
                        {formatCLP(c.budgetCLP)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
