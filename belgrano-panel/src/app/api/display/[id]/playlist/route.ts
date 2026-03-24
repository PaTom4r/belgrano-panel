import { getActiveSchedule, getMockScheduleRules } from "@/lib/scheduling-engine";

interface PlaylistItem {
  id: string;
  type: "image" | "video" | "html5";
  url: string;
  duration: number;
  name: string;
  campaignId: string | null;
}

interface PlaylistResponse {
  screenId: string;
  screenName: string;
  zone: string;
  currentSchedule: string;
  items: PlaylistItem[];
  updatedAt: string;
  pollInterval: number;
}

// Mock playlists keyed by schedule playlist IDs
const mockPlaylists: Record<string, PlaylistItem[]> = {
  "pl-ads-peak": [
    { id: "item-1", type: "image", url: "https://4kmedia.org/wp-content/uploads/2017/10/lg-new-york-1.jpg", duration: 15, name: "New York 4K", campaignId: null },
    { id: "item-2", type: "image", url: "/mock/gradient-1", duration: 10, name: "ISAPRE Colmena", campaignId: "camp-001" },
    { id: "item-3", type: "image", url: "/mock/gradient-2", duration: 10, name: "CLC Health Tips", campaignId: null },
    { id: "item-4", type: "image", url: "/mock/gradient-3", duration: 10, name: "Abbott Pharma", campaignId: "camp-002" },
  ],
  "pl-clinic-morning": [
    { id: "item-c1", type: "image", url: "/mock/gradient-clinic-1", duration: 15, name: "Horarios Consultas", campaignId: null },
    { id: "item-c2", type: "image", url: "/mock/gradient-clinic-2", duration: 15, name: "Tips Salud Invierno", campaignId: null },
    { id: "item-c3", type: "video", url: "/mock/video-clinic-1", duration: 20, name: "Bienvenida CLC", campaignId: null },
  ],
  "pl-lobby-premium": [
    { id: "item-lp1", type: "video", url: "/mock/video-premium-1", duration: 15, name: "Colmena Premium Spot", campaignId: "camp-010" },
    { id: "item-lp2", type: "image", url: "/mock/gradient-premium-1", duration: 10, name: "Banmedica Gold", campaignId: "camp-011" },
    { id: "item-lp3", type: "image", url: "/mock/gradient-premium-2", duration: 10, name: "CLC Centro Medico", campaignId: null },
    { id: "item-lp4", type: "video", url: "/mock/video-premium-2", duration: 20, name: "Pfizer Chile", campaignId: "camp-012" },
  ],
  "pl-mix-evening": [
    { id: "item-e1", type: "image", url: "/mock/gradient-evening-1", duration: 10, name: "Farmacias Cruz Verde", campaignId: "camp-020" },
    { id: "item-e2", type: "image", url: "/mock/gradient-evening-2", duration: 12, name: "CLC Urgencias Info", campaignId: null },
    { id: "item-e3", type: "video", url: "/mock/video-evening-1", duration: 15, name: "Seguros SURA", campaignId: "camp-021" },
  ],
  "pl-weekend": [
    { id: "item-w1", type: "image", url: "/mock/gradient-weekend-1", duration: 12, name: "CLC Fin de Semana", campaignId: null },
    { id: "item-w2", type: "image", url: "/mock/gradient-weekend-2", duration: 10, name: "ISAPRE Consalud", campaignId: "camp-030" },
    { id: "item-w3", type: "video", url: "/mock/video-weekend-1", duration: 15, name: "Abbott Weekend", campaignId: "camp-002" },
  ],
  "pl-night": [
    { id: "item-n1", type: "image", url: "/mock/gradient-night-1", duration: 20, name: "CLC Emergencias 24h", campaignId: null },
    { id: "item-n2", type: "image", url: "/mock/gradient-night-2", duration: 20, name: "Belgrano Digital", campaignId: null },
  ],
};

// Default fallback playlist
const fallbackPlaylist: PlaylistItem[] = [
  { id: "item-fb1", type: "image", url: "/mock/gradient-fallback", duration: 15, name: "Belgrano Digital - CLC", campaignId: null },
];

// Mock screen registry
const mockScreens: Record<string, { name: string; zone: string; zoneId: string }> = {
  "DEV-001": { name: "CLC-Lobby-1", zone: "Lobby Principal", zoneId: "zone-lobby" },
  "DEV-002": { name: "CLC-Lobby-2", zone: "Lobby Principal", zoneId: "zone-lobby" },
  "DEV-003": { name: "CLC-Urgencias-1", zone: "Urgencias", zoneId: "zone-urgencias" },
  "DEV-004": { name: "CLC-Pediatria-1", zone: "Pediatria", zoneId: "zone-pediatria" },
  "DEV-005": { name: "CLC-Cafeteria-1", zone: "Cafeteria", zoneId: "zone-cafeteria" },
};

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const screen = mockScreens[id] ?? {
    name: `Screen-${id}`,
    zone: "General",
    zoneId: "zone-general",
  };

  const now = new Date();
  const rules = getMockScheduleRules();
  const activeSchedule = getActiveSchedule(rules, screen.zoneId, now);

  const scheduleName = activeSchedule?.name ?? "Fallback";
  const items = activeSchedule
    ? (mockPlaylists[activeSchedule.playlistId] ?? fallbackPlaylist)
    : fallbackPlaylist;

  const response: PlaylistResponse = {
    screenId: id,
    screenName: screen.name,
    zone: screen.zone,
    currentSchedule: scheduleName,
    items,
    updatedAt: `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}-${String(now.getDate()).padStart(2,"0")}T${String(now.getHours()).padStart(2,"0")}:00:00Z`,
    pollInterval: 60,
  };

  return Response.json(response);
}
