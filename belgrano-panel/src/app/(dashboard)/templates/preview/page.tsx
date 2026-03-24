"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { TemplateRenderer, type TemplateZone } from "@/lib/template-renderer";

interface TemplatePreviewData {
  name: string;
  width: number;
  height: number;
  zones: TemplateZone[];
}

// Default template for when no data is in sessionStorage
const DEFAULT_PREVIEW: TemplatePreviewData = {
  name: "L-Shape Demo",
  width: 1920,
  height: 1080,
  zones: [
    { id: "z1", name: "Main", x: 0, y: 0, width: 100, height: 65, contentType: "video" },
    {
      id: "z2",
      name: "Clock",
      x: 0,
      y: 65,
      width: 50,
      height: 35,
      contentType: "clock",
      config: { format: "24h" },
    },
    {
      id: "z3",
      name: "Weather",
      x: 50,
      y: 65,
      width: 50,
      height: 35,
      contentType: "weather",
      config: { city: "Santiago" },
    },
  ],
};

export default function TemplatePreviewPage() {
  const router = useRouter();
  const [template, setTemplate] = useState<TemplatePreviewData | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("templatePreview");
      if (stored) {
        setTemplate(JSON.parse(stored));
      } else {
        setTemplate(DEFAULT_PREVIEW);
      }
    } catch {
      setTemplate(DEFAULT_PREVIEW);
    }
  }, []);

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch(() => {
        // Fullscreen not supported or denied
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      }).catch(() => {});
    }
  }

  useEffect(() => {
    function handleFullscreenChange() {
      setIsFullscreen(!!document.fullscreenElement);
    }
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  if (!template) {
    return (
      <div className="flex h-96 items-center justify-center">
        <p className="text-slate-500">Loading preview...</p>
      </div>
    );
  }

  // Fullscreen mode
  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
        <div className="w-full h-full">
          <TemplateRenderer
            zones={template.zones}
            width={template.width}
            height={template.height}
            scale={1}
            interactive={false}
          />
        </div>
        <button
          onClick={toggleFullscreen}
          className="fixed top-4 right-4 z-50 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors opacity-0 hover:opacity-100"
        >
          Exit Fullscreen
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Top bar */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <button
            onClick={() => router.back()}
            className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
          >
            &larr; Back to Editor
          </button>
          <h1 className="mt-2 text-xl font-bold text-slate-900">
            Preview: {template.name}
          </h1>
          <p className="text-sm text-slate-500">
            {template.width}x{template.height} - {template.zones.length} zones
          </p>
        </div>
        <button
          onClick={toggleFullscreen}
          className="bg-slate-900 hover:bg-slate-800 text-white rounded-lg px-4 py-2.5 text-sm font-medium transition-colors flex items-center gap-2"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
          </svg>
          Fullscreen
        </button>
      </div>

      {/* Preview canvas */}
      <div className="rounded-xl border border-slate-200 bg-slate-100 p-6">
        <div className="mx-auto max-w-5xl">
          <TemplateRenderer
            zones={template.zones}
            width={template.width}
            height={template.height}
            scale={1}
            interactive={false}
          />
        </div>
      </div>

      {/* Zone details */}
      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {template.zones.map((zone) => (
          <div
            key={zone.id}
            className="rounded-lg border border-slate-200 bg-white p-3"
          >
            <p className="text-sm font-medium text-slate-900">{zone.name}</p>
            <p className="text-xs text-slate-500 capitalize">{zone.contentType}</p>
            <div className="mt-2 grid grid-cols-2 gap-1 text-xs text-slate-400">
              <span>X: {zone.x}%</span>
              <span>Y: {zone.y}%</span>
              <span>W: {zone.width}%</span>
              <span>H: {zone.height}%</span>
            </div>
            {zone.config && Object.keys(zone.config).length > 0 && (
              <div className="mt-2 pt-2 border-t border-slate-100">
                {Object.entries(zone.config).map(([key, value]) => (
                  <p key={key} className="text-xs text-slate-400">
                    <span className="text-slate-500">{key}:</span> {value}
                  </p>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
