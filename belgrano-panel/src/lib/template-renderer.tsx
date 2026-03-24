"use client";

import { useEffect, useState } from "react";

export interface TemplateZone {
  id: string;
  name: string;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  width: number; // percentage 0-100
  height: number; // percentage 0-100
  contentType: "video" | "image" | "text" | "html5" | "clock" | "weather";
  config?: Record<string, string>;
}

interface TemplateRendererProps {
  zones: TemplateZone[];
  width?: number;
  height?: number;
  scale?: number;
  interactive?: boolean;
  selectedZoneId?: string | null;
  onZoneClick?: (zone: TemplateZone) => void;
}

// Zone colors for visual distinction
const ZONE_COLORS = [
  { bg: "from-blue-500/20 to-blue-600/20", border: "border-blue-500/50", label: "bg-blue-600" },
  { bg: "from-emerald-500/20 to-emerald-600/20", border: "border-emerald-500/50", label: "bg-emerald-600" },
  { bg: "from-violet-500/20 to-violet-600/20", border: "border-violet-500/50", label: "bg-violet-600" },
  { bg: "from-amber-500/20 to-amber-600/20", border: "border-amber-500/50", label: "bg-amber-600" },
  { bg: "from-rose-500/20 to-rose-600/20", border: "border-rose-500/50", label: "bg-rose-600" },
  { bg: "from-cyan-500/20 to-cyan-600/20", border: "border-cyan-500/50", label: "bg-cyan-600" },
];

const CONTENT_TYPE_ICONS: Record<TemplateZone["contentType"], string> = {
  video: "Video",
  image: "Image",
  text: "Text",
  html5: "HTML5",
  clock: "Clock",
  weather: "Weather",
};

// Clock zone renderer
function ClockZone({ config }: { config?: Record<string, string> }) {
  const [time, setTime] = useState("");

  useEffect(() => {
    function updateTime() {
      const now = new Date();
      const is24h = config?.format !== "12h";
      setTime(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: !is24h,
        })
      );
    }
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [config?.format]);

  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
      <p className="text-white font-mono font-bold" style={{ fontSize: "clamp(0.75rem, 3vw, 2.5rem)" }}>
        {time}
      </p>
      <p className="text-slate-400 text-xs mt-1">
        {config?.format === "12h" ? "12h" : "24h"}
      </p>
    </div>
  );
}

// Weather zone renderer
function WeatherZone({ config }: { config?: Record<string, string> }) {
  const city = config?.city || "Santiago";
  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-sky-500 to-blue-600">
      <svg className="h-8 w-8 text-yellow-300 mb-1" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.25a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-1.5 0V3a.75.75 0 0 1 .75-.75ZM7.5 12a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM18.894 6.166a.75.75 0 0 0-1.06-1.06l-1.591 1.59a.75.75 0 1 0 1.06 1.061l1.591-1.59ZM21.75 12a.75.75 0 0 1-.75.75h-2.25a.75.75 0 0 1 0-1.5H21a.75.75 0 0 1 .75.75ZM17.834 18.894a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 1 0-1.061 1.06l1.59 1.591ZM12 18a.75.75 0 0 1 .75.75V21a.75.75 0 0 1-1.5 0v-2.25A.75.75 0 0 1 12 18ZM7.758 17.303a.75.75 0 0 0-1.061-1.06l-1.591 1.59a.75.75 0 0 0 1.06 1.061l1.591-1.59ZM6 12a.75.75 0 0 1-.75.75H3a.75.75 0 0 1 0-1.5h2.25A.75.75 0 0 1 6 12ZM6.697 7.757a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 0 0-1.061 1.06l1.59 1.591Z" />
      </svg>
      <p className="text-white font-bold text-lg">22C</p>
      <p className="text-white/80 text-xs">{city}</p>
    </div>
  );
}

// Text zone renderer
function TextZone({ config }: { config?: Record<string, string> }) {
  const text = config?.text || "Sample Text";
  const fontSize = config?.fontSize || "24";
  const color = config?.color || "#ffffff";

  return (
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-700 to-slate-800 p-2">
      <p style={{ fontSize: `${fontSize}px`, color, lineHeight: 1.3 }} className="font-semibold text-center break-words overflow-hidden">
        {text}
      </p>
    </div>
  );
}

// Video zone placeholder
function VideoZone() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-purple-600 to-indigo-700">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm mb-1">
        <svg className="ml-0.5 h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M8 5v14l11-7z" />
        </svg>
      </div>
      <p className="text-white/70 text-xs">Video</p>
    </div>
  );
}

// Image zone placeholder
function ImageZone() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-emerald-500 to-teal-600">
      <svg className="h-8 w-8 text-white/60 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z" />
      </svg>
      <p className="text-white/70 text-xs">Image</p>
    </div>
  );
}

// HTML5 zone placeholder
function Html5Zone() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-orange-500 to-red-500">
      <svg className="h-8 w-8 text-white/60 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
      </svg>
      <p className="text-white/70 text-xs">HTML5</p>
    </div>
  );
}

// Content renderer by type
function ZoneContent({ zone }: { zone: TemplateZone }) {
  switch (zone.contentType) {
    case "clock":
      return <ClockZone config={zone.config} />;
    case "weather":
      return <WeatherZone config={zone.config} />;
    case "text":
      return <TextZone config={zone.config} />;
    case "video":
      return <VideoZone />;
    case "image":
      return <ImageZone />;
    case "html5":
      return <Html5Zone />;
    default:
      return (
        <div className="flex h-full w-full items-center justify-center bg-slate-800">
          <p className="text-white/50 text-xs">Unknown</p>
        </div>
      );
  }
}

export function TemplateRenderer({
  zones,
  width = 1920,
  height = 1080,
  scale = 1,
  interactive = false,
  selectedZoneId = null,
  onZoneClick,
}: TemplateRendererProps) {
  const aspect = width / height;

  return (
    <div
      className="relative bg-[#1a1a1a] overflow-hidden rounded-lg"
      style={{
        width: `${100 * scale}%`,
        aspectRatio: `${aspect}`,
      }}
    >
      {zones.map((zone, index) => {
        const colorSet = ZONE_COLORS[index % ZONE_COLORS.length];
        const isSelected = selectedZoneId === zone.id;

        return (
          <div
            key={zone.id}
            className={`absolute overflow-hidden transition-all duration-200 ${
              interactive ? "cursor-pointer" : ""
            } ${
              isSelected
                ? "ring-2 ring-blue-500 ring-offset-1 ring-offset-[#1a1a1a] z-10"
                : `border ${colorSet.border}`
            }`}
            style={{
              left: `${zone.x}%`,
              top: `${zone.y}%`,
              width: `${zone.width}%`,
              height: `${zone.height}%`,
            }}
            onClick={() => {
              if (interactive && onZoneClick) {
                onZoneClick(zone);
              }
            }}
          >
            <ZoneContent zone={zone} />

            {/* Zone label overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-black/50 backdrop-blur-sm px-2 py-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-medium text-white truncate">
                  {zone.name}
                </span>
                <span className={`text-[9px] text-white/70 ml-1 flex-shrink-0`}>
                  {CONTENT_TYPE_ICONS[zone.contentType]}
                </span>
              </div>
            </div>

            {/* Interactive hover effect */}
            {interactive && !isSelected && (
              <div className="absolute inset-0 bg-white/0 hover:bg-white/10 transition-colors" />
            )}
          </div>
        );
      })}

      {zones.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-slate-500 text-sm">No zones defined</p>
        </div>
      )}
    </div>
  );
}

// Miniature renderer for cards/thumbnails (simplified, no interactivity)
export function TemplateThumbnail({
  zones,
  className = "",
}: {
  zones: TemplateZone[];
  className?: string;
}) {
  return (
    <div className={`relative bg-[#1a1a1a] overflow-hidden rounded-md aspect-video ${className}`}>
      {zones.map((zone, index) => {
        const colorSet = ZONE_COLORS[index % ZONE_COLORS.length];
        return (
          <div
            key={zone.id}
            className={`absolute bg-gradient-to-br ${colorSet.bg} border ${colorSet.border}`}
            style={{
              left: `${zone.x}%`,
              top: `${zone.y}%`,
              width: `${zone.width}%`,
              height: `${zone.height}%`,
            }}
          >
            <div className="flex h-full w-full items-center justify-center">
              <span className="text-[8px] text-white/60 font-medium truncate px-0.5">
                {zone.name}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
