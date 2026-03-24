"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";

interface ContentItem {
  id: string;
  name: string;
  fileName: string;
  type: "video" | "image" | "html5";
  duration: number;
  fileSize: number;
  approvalStatus: "pending" | "approved" | "rejected";
  uploadedBy: string;
  createdAt: string;
}

const mockContent: ContentItem[] = [
  { id: "1", name: "ISAPRE Consalud Spring Promo", fileName: "consalud-spring-2026.mp4", type: "video", duration: 30, fileSize: 12500000, approvalStatus: "approved", uploadedBy: "admin", createdAt: "2026-03-20T10:00:00Z" },
  { id: "2", name: "Pharma Lab Chile - Vitamins", fileName: "labchile-vitamins.mp4", type: "video", duration: 15, fileSize: 6200000, approvalStatus: "approved", uploadedBy: "admin", createdAt: "2026-03-19T14:00:00Z" },
  { id: "3", name: "CLC Health Tips Banner", fileName: "clc-health-tips.png", type: "image", duration: 10, fileSize: 450000, approvalStatus: "approved", uploadedBy: "admin", createdAt: "2026-03-18T09:00:00Z" },
  { id: "4", name: "Emergency Contact Info", fileName: "emergency-info.html", type: "html5", duration: 15, fileSize: 35000, approvalStatus: "approved", uploadedBy: "admin", createdAt: "2026-03-17T16:00:00Z" },
  { id: "5", name: "Seguros Vida Security Ad", fileName: "seguros-vida.mp4", type: "video", duration: 30, fileSize: 18700000, approvalStatus: "pending", uploadedBy: "admin", createdAt: "2026-03-22T11:00:00Z" },
  { id: "6", name: "Waiting Room Guide", fileName: "waiting-guide.png", type: "image", duration: 10, fileSize: 380000, approvalStatus: "approved", uploadedBy: "admin", createdAt: "2026-03-15T08:00:00Z" },
  { id: "7", name: "Pediatria Welcome Screen", fileName: "pediatria-welcome.html", type: "html5", duration: 20, fileSize: 42000, approvalStatus: "approved", uploadedBy: "admin", createdAt: "2026-03-14T12:00:00Z" },
  { id: "8", name: "Cruz Verde Pharmacy", fileName: "cruzverde-march.mp4", type: "video", duration: 15, fileSize: 7800000, approvalStatus: "rejected", uploadedBy: "admin", createdAt: "2026-03-21T15:00:00Z" },
  { id: "9", name: "FONASA Information", fileName: "fonasa-info.png", type: "image", duration: 10, fileSize: 520000, approvalStatus: "approved", uploadedBy: "admin", createdAt: "2026-03-13T10:00:00Z" },
  { id: "10", name: "Colmena Insurance Spot", fileName: "colmena-q1.mp4", type: "video", duration: 30, fileSize: 15400000, approvalStatus: "pending", uploadedBy: "admin", createdAt: "2026-03-22T09:00:00Z" },
  { id: "11", name: "Visitor Map Floor 1", fileName: "floor1-map.html", type: "html5", duration: 30, fileSize: 68000, approvalStatus: "approved", uploadedBy: "admin", createdAt: "2026-03-10T11:00:00Z" },
  { id: "12", name: "Cafeteria Menu Board", fileName: "cafeteria-menu.png", type: "image", duration: 15, fileSize: 890000, approvalStatus: "approved", uploadedBy: "admin", createdAt: "2026-03-16T14:00:00Z" },
  { id: "13", name: "Bupa Health Plan Ad", fileName: "bupa-health-plan.mp4", type: "video", duration: 20, fileSize: 11200000, approvalStatus: "pending", uploadedBy: "admin", createdAt: "2026-03-23T08:00:00Z" },
];

function formatFileSize(bytes: number): string {
  if (bytes >= 1_000_000) return `${(bytes / 1_000_000).toFixed(1)} MB`;
  if (bytes >= 1_000) return `${(bytes / 1_000).toFixed(0)} KB`;
  return `${bytes} B`;
}

const typeLabels: Record<string, string> = {
  video: "Video",
  image: "Image",
  html5: "HTML5",
};

const typeBadgeVariant: Record<string, "info" | "success" | "violet"> = {
  video: "info",
  image: "success",
  html5: "violet",
};

const statusBadgeVariant: Record<string, "success" | "warning" | "error"> = {
  approved: "success",
  pending: "warning",
  rejected: "error",
};

export default function ContentPage() {
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return mockContent.filter((item) => {
      const matchesSearch =
        !search ||
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.fileName.toLowerCase().includes(search.toLowerCase());
      const matchesType = typeFilter === "all" || item.type === typeFilter;
      const matchesStatus =
        statusFilter === "all" || item.approvalStatus === statusFilter;
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [search, typeFilter, statusFilter]);

  return (
    <div>
      <PageHeader
        title="Content Library"
        description="Manage videos, images, and HTML5 content for your displays"
        actions={
          <Link
            href="/content/upload"
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2.5 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          >
            Upload Content
          </Link>
        }
      />

      {/* Filters */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          placeholder="Search content..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-colors"
        />
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-colors"
        >
          <option value="all">All Types</option>
          <option value="video">Video</option>
          <option value="image">Image</option>
          <option value="html5">HTML5</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-colors"
        >
          <option value="all">All Status</option>
          <option value="approved">Approved</option>
          <option value="pending">Pending</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Subnavigation */}
      <div className="mb-6 flex gap-4 border-b border-slate-200">
        <Link
          href="/content"
          className="border-b-2 border-blue-600 px-1 pb-3 text-sm font-medium text-blue-600 transition-colors"
        >
          Library
        </Link>
        <Link
          href="/content/playlists"
          className="border-b-2 border-transparent px-1 pb-3 text-sm font-medium text-slate-500 hover:border-slate-300 hover:text-slate-700 transition-colors"
        >
          Playlists
        </Link>
        <Link
          href="/content/schedules"
          className="border-b-2 border-transparent px-1 pb-3 text-sm font-medium text-slate-500 hover:border-slate-300 hover:text-slate-700 transition-colors"
        >
          Schedules
        </Link>
      </div>

      {/* Content table */}
      <Card padding="p-0">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Duration
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Size
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Uploaded
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {filtered.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      {item.name}
                    </p>
                    <p className="text-xs text-slate-500">{item.fileName}</p>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <Badge variant={typeBadgeVariant[item.type]}>
                    {typeLabels[item.type]}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-sm text-slate-600">
                  {item.duration}s
                </td>
                <td className="px-4 py-3 text-sm text-slate-600">
                  {formatFileSize(item.fileSize)}
                </td>
                <td className="px-4 py-3">
                  <Badge variant={statusBadgeVariant[item.approvalStatus]}>
                    {item.approvalStatus.charAt(0).toUpperCase() + item.approvalStatus.slice(1)}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-sm text-slate-500">
                  {new Date(item.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-slate-500">No content matches your filters.</p>
          </div>
        )}
      </Card>
    </div>
  );
}
