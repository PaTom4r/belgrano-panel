"use client";

import Link from "next/link";
import { use } from "react";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardHeader } from "@/components/ui/card";

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
    contactName: "Carolina Munoz",
    contactEmail: "cmunoz@colmena.cl",
    contactPhone: "+56 9 8765 4321",
    contractStartDate: "2026-01-15",
    contractEndDate: "2026-12-31",
    contractValue: 18500000,
    notes: "Campana institucional + planes de salud",
  },
  "adv-002": {
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
    notes: "Linea nutricional Ensure + Pedialyte",
  },
  "adv-004": {
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
    contactName: "Matias Contreras",
    contactEmail: "mcontreras@bupa.cl",
    contactPhone: "+56 9 5432 1098",
    contractStartDate: "2026-05-01",
    contractEndDate: "2026-11-30",
    contractValue: 15000000,
    notes: "Planes internacionales + Seguro catastrofico",
  },
  "adv-007": {
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
  "adv-008": {
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
  "adv-009": {
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
  "adv-010": {
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
    { id: "cmp-004", name: "Ensure Nutricion Adultos", status: "active", startDate: "2026-02-15", endDate: "2026-05-15", budgetCLP: 4200000 },
    { id: "cmp-005", name: "Pedialyte Invierno", status: "draft", startDate: "2026-05-01", endDate: "2026-08-31", budgetCLP: 3000000 },
  ],
  "adv-004": [
    { id: "cmp-006", name: "Oncologia Awareness", status: "draft", startDate: "2026-04-01", endDate: "2026-07-31", budgetCLP: 8000000 },
  ],
  "adv-005": [
    { id: "cmp-007", name: "Seguros Complementarios", status: "active", startDate: "2026-01-15", endDate: "2026-06-30", budgetCLP: 4800000 },
  ],
  "adv-008": [
    { id: "cmp-008", name: "Banmedica Integral", status: "active", startDate: "2026-03-01", endDate: "2026-09-30", budgetCLP: 10000000 },
  ],
};

const categoryBadgeVariant: Record<string, "purple" | "teal" | "info" | "success" | "draft"> = {
  ISAPRE: "purple",
  Pharma: "teal",
  Insurance: "info",
  Wellness: "success",
  Other: "draft",
};

const campaignStatusVariant: Record<string, "draft" | "success" | "warning" | "info" | "error"> = {
  draft: "draft",
  active: "success",
  paused: "warning",
  completed: "info",
  cancelled: "error",
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

export default function AdvertiserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const advertiser = mockAdvertisers[id];

  if (!advertiser) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Advertiser Not Found</h1>
        <p className="mt-2 text-sm text-slate-500">
          The advertiser you are looking for does not exist.
        </p>
        <Link href="/advertisers" className="mt-4 inline-block text-sm text-blue-600 hover:text-blue-800 transition-colors">
          &larr; Back to Advertisers
        </Link>
      </div>
    );
  }

  const campaigns = mockCampaigns[id] || [];
  const contractStatus = getContractStatus(advertiser.contractStartDate, advertiser.contractEndDate);

  return (
    <div>
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/advertisers" className="text-sm text-blue-600 hover:text-blue-800 transition-colors">
            &larr; Back to Advertisers
          </Link>
          <div className="mt-2 flex items-start justify-between">
            <div>
              <PageHeader
                title={advertiser.name}
                actions={
                  <button className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors">
                    Edit
                  </button>
                }
              />
              <div className="flex items-center gap-3 -mt-4 mb-6">
                <Badge variant={categoryBadgeVariant[advertiser.category]}>
                  {advertiser.category}
                </Badge>
                <Badge variant={contractStatus.variant}>
                  {contractStatus.label}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Company Info */}
          <Card>
            <CardHeader title="Company Info" />
            <dl className="space-y-4">
              <div>
                <dt className="text-xs text-slate-400">Company</dt>
                <dd className="mt-0.5 text-sm font-medium text-slate-900">{advertiser.company}</dd>
              </div>
              <div>
                <dt className="text-xs text-slate-400">Category</dt>
                <dd className="mt-0.5 text-sm font-medium text-slate-900">{advertiser.category}</dd>
              </div>
              <div>
                <dt className="text-xs text-slate-400">Notes</dt>
                <dd className="mt-0.5 text-sm text-slate-700">{advertiser.notes || "No notes"}</dd>
              </div>
            </dl>
          </Card>

          {/* Contact Info */}
          <Card>
            <CardHeader title="Contact Info" />
            <dl className="space-y-4">
              <div>
                <dt className="text-xs text-slate-400">Contact Name</dt>
                <dd className="mt-0.5 text-sm font-medium text-slate-900">{advertiser.contactName}</dd>
              </div>
              <div>
                <dt className="text-xs text-slate-400">Email</dt>
                <dd className="mt-0.5 text-sm text-blue-600">{advertiser.contactEmail}</dd>
              </div>
              <div>
                <dt className="text-xs text-slate-400">Phone</dt>
                <dd className="mt-0.5 text-sm font-medium text-slate-900">{advertiser.contactPhone}</dd>
              </div>
            </dl>
          </Card>
        </div>

        {/* Contract Details */}
        <Card className="mb-8">
          <CardHeader title="Contract Details" />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div>
              <dt className="text-xs text-slate-400">Start Date</dt>
              <dd className="mt-0.5 text-sm font-medium text-slate-900">{advertiser.contractStartDate}</dd>
            </div>
            <div>
              <dt className="text-xs text-slate-400">End Date</dt>
              <dd className="mt-0.5 text-sm font-medium text-slate-900">{advertiser.contractEndDate}</dd>
            </div>
            <div>
              <dt className="text-xs text-slate-400">Contract Value</dt>
              <dd className="mt-0.5 text-lg font-bold text-slate-900">{formatCLP(advertiser.contractValue)}</dd>
            </div>
          </div>
        </Card>

        {/* Campaigns */}
        <Card>
          <CardHeader
            title="Campaigns"
            action={
              <Link
                href="/campaigns/new"
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-3 py-1.5 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
              >
                New Campaign
              </Link>
            }
          />
          {campaigns.length === 0 ? (
            <p className="text-center text-sm text-slate-400 py-6">No campaigns yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Name</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Period</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Budget</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {campaigns.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                      <td className="whitespace-nowrap px-4 py-3">
                        <Link href={`/campaigns/${c.id}`} className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors">
                          {c.name}
                        </Link>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <Badge variant={campaignStatusVariant[c.status]}>
                          {c.status.charAt(0).toUpperCase() + c.status.slice(1)}
                        </Badge>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-500">
                        {c.startDate} &mdash; {c.endDate}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-right text-sm font-medium text-slate-900">
                        {formatCLP(c.budgetCLP)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
