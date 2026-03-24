"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TemplateRenderer, type TemplateZone } from "@/lib/template-renderer";

// Predefined layouts
interface LayoutPreset {
  id: string;
  name: string;
  icon: string;
  zones: TemplateZone[];
}

const LAYOUT_PRESETS: LayoutPreset[] = [
  {
    id: "full",
    name: "Full Screen",
    icon: "full",
    zones: [
      { id: "z1", name: "Main", x: 0, y: 0, width: 100, height: 100, contentType: "video" },
    ],
  },
  {
    id: "sidebar",
    name: "Side Bar",
    icon: "sidebar",
    zones: [
      { id: "z1", name: "Main", x: 0, y: 0, width: 75, height: 100, contentType: "video" },
      { id: "z2", name: "Sidebar", x: 75, y: 0, width: 25, height: 100, contentType: "text" },
    ],
  },
  {
    id: "lshape",
    name: "L-Shape",
    icon: "lshape",
    zones: [
      { id: "z1", name: "Main", x: 0, y: 0, width: 100, height: 65, contentType: "video" },
      { id: "z2", name: "Bottom Left", x: 0, y: 65, width: 50, height: 35, contentType: "clock" },
      { id: "z3", name: "Bottom Right", x: 50, y: 65, width: 50, height: 35, contentType: "weather" },
    ],
  },
  {
    id: "grid2x2",
    name: "Grid 2x2",
    icon: "grid",
    zones: [
      { id: "z1", name: "Top Left", x: 0, y: 0, width: 50, height: 50, contentType: "video" },
      { id: "z2", name: "Top Right", x: 50, y: 0, width: 50, height: 50, contentType: "image" },
      { id: "z3", name: "Bottom Left", x: 0, y: 50, width: 50, height: 50, contentType: "text" },
      { id: "z4", name: "Bottom Right", x: 50, y: 50, width: 50, height: 50, contentType: "clock" },
    ],
  },
];

const CONTENT_TYPES: { value: TemplateZone["contentType"]; label: string }[] = [
  { value: "video", label: "Video" },
  { value: "image", label: "Image" },
  { value: "text", label: "Text" },
  { value: "html5", label: "HTML5" },
  { value: "clock", label: "Clock" },
  { value: "weather", label: "Weather" },
];

function LayoutIcon({ type }: { type: string }) {
  const cls = "w-full h-full";
  switch (type) {
    case "full":
      return (
        <svg className={cls} viewBox="0 0 40 24" fill="none">
          <rect x="1" y="1" width="38" height="22" rx="2" className="stroke-current" strokeWidth="1.5" />
        </svg>
      );
    case "sidebar":
      return (
        <svg className={cls} viewBox="0 0 40 24" fill="none">
          <rect x="1" y="1" width="38" height="22" rx="2" className="stroke-current" strokeWidth="1.5" />
          <line x1="30" y1="1" x2="30" y2="23" className="stroke-current" strokeWidth="1.5" />
        </svg>
      );
    case "lshape":
      return (
        <svg className={cls} viewBox="0 0 40 24" fill="none">
          <rect x="1" y="1" width="38" height="22" rx="2" className="stroke-current" strokeWidth="1.5" />
          <line x1="1" y1="15" x2="39" y2="15" className="stroke-current" strokeWidth="1.5" />
          <line x1="20" y1="15" x2="20" y2="23" className="stroke-current" strokeWidth="1.5" />
        </svg>
      );
    case "grid":
      return (
        <svg className={cls} viewBox="0 0 40 24" fill="none">
          <rect x="1" y="1" width="38" height="22" rx="2" className="stroke-current" strokeWidth="1.5" />
          <line x1="20" y1="1" x2="20" y2="23" className="stroke-current" strokeWidth="1.5" />
          <line x1="1" y1="12" x2="39" y2="12" className="stroke-current" strokeWidth="1.5" />
        </svg>
      );
    default:
      return null;
  }
}

const inputClass =
  "mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:outline-none transition-colors";
const labelClass = "block text-xs font-medium text-slate-600";

export default function NewTemplatePage() {
  const router = useRouter();
  const [templateName, setTemplateName] = useState("");
  const [selectedLayout, setSelectedLayout] = useState<string | null>(null);
  const [zones, setZones] = useState<TemplateZone[]>([]);
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const selectedZone = zones.find((z) => z.id === selectedZoneId) || null;

  const selectLayout = useCallback((preset: LayoutPreset) => {
    setSelectedLayout(preset.id);
    setZones(preset.zones.map((z) => ({ ...z })));
    setSelectedZoneId(null);
  }, []);

  const updateZone = useCallback((zoneId: string, updates: Partial<TemplateZone>) => {
    setZones((prev) =>
      prev.map((z) => (z.id === zoneId ? { ...z, ...updates } : z))
    );
  }, []);

  const updateZoneConfig = useCallback((zoneId: string, key: string, value: string) => {
    setZones((prev) =>
      prev.map((z) =>
        z.id === zoneId
          ? { ...z, config: { ...z.config, [key]: value } }
          : z
      )
    );
  }, []);

  function handleSave() {
    const templateData = {
      name: templateName || "Untitled Template",
      width: 1920,
      height: 1080,
      zones,
    };
    console.log("Template saved (mock):", templateData);
    alert("Template saved (mock). Check console for data.");
  }

  function handlePreview() {
    // Store template data in sessionStorage for the preview page
    const templateData = {
      name: templateName || "Untitled Template",
      width: 1920,
      height: 1080,
      zones,
    };
    sessionStorage.setItem("templatePreview", JSON.stringify(templateData));
    setShowPreview(true);
  }

  return (
    <div>
      <div className="mb-2">
        <Link href="/templates" className="text-sm text-blue-600 hover:text-blue-800 transition-colors">
          &larr; Back to Templates
        </Link>
      </div>

      <PageHeader
        title="Template Editor"
        description="Design multi-zone layouts for your digital signage displays"
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={handlePreview}
              disabled={zones.length === 0}
              className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Preview
            </button>
            <button
              onClick={handleSave}
              disabled={zones.length === 0}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2.5 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Save Template
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        {/* Left column: canvas area */}
        <div className="space-y-4">
          {/* Template name */}
          <Card padding="p-4">
            <label htmlFor="templateName" className="block text-sm font-medium text-slate-700">
              Template Name
            </label>
            <input
              id="templateName"
              type="text"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              placeholder="e.g. Lobby Display Layout"
              className={inputClass}
            />
          </Card>

          {/* Layout presets */}
          <Card padding="p-4">
            <p className="text-sm font-medium text-slate-700 mb-3">Choose a Layout</p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {LAYOUT_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => selectLayout(preset)}
                  className={`flex flex-col items-center gap-2 rounded-lg p-3 text-sm font-medium transition-all ${
                    selectedLayout === preset.id
                      ? "bg-blue-50 text-blue-700 ring-2 ring-blue-500"
                      : "bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  <div className="w-10 h-6">
                    <LayoutIcon type={preset.icon} />
                  </div>
                  <span className="text-xs">{preset.name}</span>
                </button>
              ))}
            </div>
          </Card>

          {/* Canvas */}
          <Card padding="p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-slate-700">Canvas</p>
              <span className="text-xs text-slate-400">1920 x 1080</span>
            </div>
            <div className="flex justify-center">
              <div className="w-full max-w-3xl">
                <TemplateRenderer
                  zones={zones}
                  width={1920}
                  height={1080}
                  scale={1}
                  interactive
                  selectedZoneId={selectedZoneId}
                  onZoneClick={(zone) => setSelectedZoneId(zone.id)}
                />
              </div>
            </div>
            {zones.length > 0 && (
              <p className="mt-2 text-center text-xs text-slate-400">
                Click a zone to configure its content
              </p>
            )}
          </Card>
        </div>

        {/* Right column: zone configuration panel */}
        <div className="space-y-4">
          {/* Zone list */}
          <Card padding="p-4">
            <p className="text-sm font-medium text-slate-700 mb-3">Zones</p>
            {zones.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">
                Select a layout to add zones
              </p>
            ) : (
              <ul className="space-y-1">
                {zones.map((zone, index) => (
                  <li key={zone.id}>
                    <button
                      onClick={() => setSelectedZoneId(zone.id)}
                      className={`w-full flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors text-left ${
                        selectedZoneId === zone.id
                          ? "bg-blue-50 text-blue-700"
                          : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <span className="font-medium truncate">{zone.name}</span>
                      <Badge
                        variant={
                          zone.contentType === "video"
                            ? "info"
                            : zone.contentType === "text"
                            ? "purple"
                            : zone.contentType === "clock"
                            ? "teal"
                            : zone.contentType === "weather"
                            ? "cyan"
                            : zone.contentType === "image"
                            ? "success"
                            : "violet"
                        }
                      >
                        {zone.contentType}
                      </Badge>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          {/* Selected zone configuration */}
          {selectedZone && (
            <Card padding="p-4">
              <p className="text-sm font-semibold text-slate-900 mb-4">
                Configure: {selectedZone.name}
              </p>

              <div className="space-y-4">
                {/* Zone name */}
                <div>
                  <label className={labelClass}>Zone Name</label>
                  <input
                    type="text"
                    value={selectedZone.name}
                    onChange={(e) => updateZone(selectedZone.id, { name: e.target.value })}
                    className={inputClass}
                  />
                </div>

                {/* Content type */}
                <div>
                  <label className={labelClass}>Content Type</label>
                  <select
                    value={selectedZone.contentType}
                    onChange={(e) =>
                      updateZone(selectedZone.id, {
                        contentType: e.target.value as TemplateZone["contentType"],
                        config: {},
                      })
                    }
                    className={inputClass}
                  >
                    {CONTENT_TYPES.map((ct) => (
                      <option key={ct.value} value={ct.value}>
                        {ct.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Type-specific config */}
                {selectedZone.contentType === "text" && (
                  <>
                    <div>
                      <label className={labelClass}>Text Content</label>
                      <textarea
                        rows={3}
                        value={selectedZone.config?.text || ""}
                        onChange={(e) => updateZoneConfig(selectedZone.id, "text", e.target.value)}
                        placeholder="Enter display text..."
                        className={inputClass}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className={labelClass}>Font Size (px)</label>
                        <input
                          type="number"
                          min={8}
                          max={200}
                          value={selectedZone.config?.fontSize || "24"}
                          onChange={(e) => updateZoneConfig(selectedZone.id, "fontSize", e.target.value)}
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Text Color</label>
                        <div className="flex items-center gap-2 mt-1">
                          <input
                            type="color"
                            value={selectedZone.config?.color || "#ffffff"}
                            onChange={(e) => updateZoneConfig(selectedZone.id, "color", e.target.value)}
                            className="h-9 w-9 rounded border border-slate-300 cursor-pointer"
                          />
                          <input
                            type="text"
                            value={selectedZone.config?.color || "#ffffff"}
                            onChange={(e) => updateZoneConfig(selectedZone.id, "color", e.target.value)}
                            className="flex-1 rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-xs text-slate-700 font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {selectedZone.contentType === "clock" && (
                  <div>
                    <label className={labelClass}>Clock Format</label>
                    <select
                      value={selectedZone.config?.format || "24h"}
                      onChange={(e) => updateZoneConfig(selectedZone.id, "format", e.target.value)}
                      className={inputClass}
                    >
                      <option value="24h">24-hour</option>
                      <option value="12h">12-hour</option>
                    </select>
                  </div>
                )}

                {selectedZone.contentType === "weather" && (
                  <div>
                    <label className={labelClass}>City</label>
                    <input
                      type="text"
                      value={selectedZone.config?.city || ""}
                      onChange={(e) => updateZoneConfig(selectedZone.id, "city", e.target.value)}
                      placeholder="Santiago"
                      className={inputClass}
                    />
                  </div>
                )}

                {(selectedZone.contentType === "video" || selectedZone.contentType === "image") && (
                  <div className="rounded-lg bg-slate-50 border border-slate-200 p-3">
                    <p className="text-xs text-slate-500">
                      Content source selection will be available once the content library integration is complete.
                      For now, placeholder content will be displayed.
                    </p>
                  </div>
                )}

                {selectedZone.contentType === "html5" && (
                  <div className="rounded-lg bg-slate-50 border border-slate-200 p-3">
                    <p className="text-xs text-slate-500">
                      HTML5 widget configuration will be available in a future update.
                      You can embed custom widgets, feeds, and interactive content.
                    </p>
                  </div>
                )}

                {/* Zone position info */}
                <div className="pt-2 border-t border-slate-100">
                  <p className="text-xs text-slate-400 mb-2">Zone Position</p>
                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-500">
                    <div className="bg-slate-50 rounded px-2 py-1.5">
                      <span className="text-slate-400">X:</span> {selectedZone.x}%
                    </div>
                    <div className="bg-slate-50 rounded px-2 py-1.5">
                      <span className="text-slate-400">Y:</span> {selectedZone.y}%
                    </div>
                    <div className="bg-slate-50 rounded px-2 py-1.5">
                      <span className="text-slate-400">W:</span> {selectedZone.width}%
                    </div>
                    <div className="bg-slate-50 rounded px-2 py-1.5">
                      <span className="text-slate-400">H:</span> {selectedZone.height}%
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {!selectedZone && zones.length > 0 && (
            <Card padding="p-4">
              <div className="py-6 text-center">
                <svg className="mx-auto h-8 w-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672 13.684 16.6m0 0-2.51 2.225.569-9.47 5.227 7.917-3.286-.672ZM12 2.25V4.5m5.834.166-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243-1.59-1.59" />
                </svg>
                <p className="mt-2 text-xs text-slate-500">
                  Click on a zone in the canvas or list to configure it
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Fullscreen preview modal */}
      {showPreview && (
        <div className="fixed inset-0 z-50 bg-black">
          <div className="flex h-full w-full items-center justify-center p-4">
            <div className="w-full max-w-6xl">
              <TemplateRenderer
                zones={zones}
                width={1920}
                height={1080}
                scale={1}
                interactive={false}
              />
            </div>
          </div>
          <button
            onClick={() => setShowPreview(false)}
            className="fixed top-4 right-4 z-50 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors"
          >
            Close Preview
          </button>
          <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-white/10 backdrop-blur-sm text-white rounded-lg px-4 py-2 text-xs">
            {templateName || "Untitled Template"} - 1920x1080 - {zones.length} zones
          </div>
        </div>
      )}
    </div>
  );
}
