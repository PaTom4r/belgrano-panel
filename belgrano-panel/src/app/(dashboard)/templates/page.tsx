"use client";

import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TemplateThumbnail, type TemplateZone } from "@/lib/template-renderer";

interface MockTemplate {
  id: string;
  name: string;
  description: string;
  resolution: string;
  zones: TemplateZone[];
  createdAt: string;
}

const mockTemplates: MockTemplate[] = [
  {
    id: "tpl-001",
    name: "Full Screen",
    description: "Single zone covering the entire display",
    resolution: "1920x1080",
    zones: [
      { id: "z1", name: "Main", x: 0, y: 0, width: 100, height: 100, contentType: "video" },
    ],
    createdAt: "2026-03-20T10:00:00Z",
  },
  {
    id: "tpl-002",
    name: "Side Bar",
    description: "Main content area with a sidebar for info or ads",
    resolution: "1920x1080",
    zones: [
      { id: "z1", name: "Main", x: 0, y: 0, width: 75, height: 100, contentType: "video" },
      { id: "z2", name: "Sidebar", x: 75, y: 0, width: 25, height: 100, contentType: "text" },
    ],
    createdAt: "2026-03-19T14:00:00Z",
  },
  {
    id: "tpl-003",
    name: "L-Shape",
    description: "Main video on top, two info zones at the bottom",
    resolution: "1920x1080",
    zones: [
      { id: "z1", name: "Main", x: 0, y: 0, width: 100, height: 65, contentType: "video" },
      { id: "z2", name: "Bottom Left", x: 0, y: 65, width: 50, height: 35, contentType: "clock" },
      { id: "z3", name: "Bottom Right", x: 50, y: 65, width: 50, height: 35, contentType: "weather" },
    ],
    createdAt: "2026-03-18T09:00:00Z",
  },
  {
    id: "tpl-004",
    name: "Grid 2x2",
    description: "Four equal zones for multi-content displays",
    resolution: "1920x1080",
    zones: [
      { id: "z1", name: "Top Left", x: 0, y: 0, width: 50, height: 50, contentType: "video" },
      { id: "z2", name: "Top Right", x: 50, y: 0, width: 50, height: 50, contentType: "image" },
      { id: "z3", name: "Bottom Left", x: 0, y: 50, width: 50, height: 50, contentType: "text" },
      { id: "z4", name: "Bottom Right", x: 50, y: 50, width: 50, height: 50, contentType: "clock" },
    ],
    createdAt: "2026-03-17T16:00:00Z",
  },
];

export default function TemplatesPage() {
  return (
    <div>
      <PageHeader
        title="Templates"
        description="Multi-zone layout templates for your digital signage displays"
        actions={
          <Link
            href="/templates/new"
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2.5 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          >
            Create Template
          </Link>
        }
      />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {mockTemplates.map((template) => (
          <Link key={template.id} href={`/templates/new?layout=${template.id}`}>
            <Card hover padding="p-0" className="overflow-hidden">
              {/* Visual preview */}
              <div className="p-3 pb-0">
                <TemplateThumbnail zones={template.zones} />
              </div>

              {/* Template info */}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm font-semibold text-slate-900">
                    {template.name}
                  </h3>
                  <Badge variant="info">
                    {template.zones.length} {template.zones.length === 1 ? "zone" : "zones"}
                  </Badge>
                </div>
                <p className="mt-1 text-xs text-slate-500 line-clamp-2">
                  {template.description}
                </p>
                <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                  <span>{template.resolution}</span>
                  <span>{new Date(template.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {/* Empty state — shown when no templates exist */}
      {mockTemplates.length === 0 && (
        <Card>
          <div className="py-12 text-center">
            <svg className="mx-auto h-12 w-12 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h12A2.25 2.25 0 0 1 20.25 6v12A2.25 2.25 0 0 1 18 20.25H6A2.25 2.25 0 0 1 3.75 18V6ZM3.75 9.75h16.5M9.75 9.75V20.25" />
            </svg>
            <h3 className="mt-4 text-sm font-medium text-slate-900">No templates yet</h3>
            <p className="mt-1 text-sm text-slate-500">
              Create your first template to define how content appears on your screens.
            </p>
            <Link
              href="/templates/new"
              className="mt-4 inline-block bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2.5 text-sm font-medium transition-colors"
            >
              Create Template
            </Link>
          </div>
        </Card>
      )}
    </div>
  );
}
