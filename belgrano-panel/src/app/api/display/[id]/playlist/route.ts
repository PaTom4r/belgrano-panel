import { db } from "@/lib/db";
import { screens, zones, schedules, playlists, playlistItems, contentItems } from "@/lib/db/schema";
import { eq, and, arrayContains } from "drizzle-orm";

interface PlaylistItemResponse {
  id: string;
  type: "image" | "video" | "html5";
  url: string;
  duration: number;
  name: string;
  campaignId: string | null;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    // Look up screen by ID
    const screen = await db.query.screens.findFirst({
      where: eq(screens.id, id),
    });

    if (!screen) {
      return Response.json({ error: "Screen not found" }, { status: 404 });
    }

    // Get zone info
    const zone = await db.query.zones.findFirst({
      where: eq(zones.id, screen.zoneId),
    });

    const zoneName = zone?.name ?? "Unknown";

    // Find active schedule for this zone right now
    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    const dayOfWeek = now.getDay() === 0 ? 7 : now.getDay();

    const allSchedules = await db.query.schedules.findMany();

    // Filter schedules that match current time, day, and zone
    const activeSchedule = allSchedules.find((s) => {
      const matchesTime = currentTime >= s.startTime && currentTime < s.endTime;
      const matchesDay = s.daysOfWeek.includes(dayOfWeek);
      const matchesZone = s.zoneIds.length === 0 || s.zoneIds.includes(screen.zoneId);
      return matchesTime && matchesDay && matchesZone;
    });

    let items: PlaylistItemResponse[] = [];

    if (activeSchedule) {
      // Get playlist items with content details
      const pItems = await db.query.playlistItems.findMany({
        where: eq(playlistItems.playlistId, activeSchedule.playlistId),
        orderBy: (pi, { asc }) => [asc(pi.position)],
      });

      for (const pi of pItems) {
        const content = await db.query.contentItems.findFirst({
          where: eq(contentItems.id, pi.contentItemId),
        });
        if (content) {
          items.push({
            id: content.id,
            type: content.type,
            url: content.thumbnailUrl || `/api/content/${content.id}/file`,
            duration: pi.durationOverride ?? content.duration ?? 10,
            name: content.name,
            campaignId: null,
          });
        }
      }
    }

    // Fallback if no items
    if (items.length === 0) {
      items = [
        {
          id: "fallback",
          type: "image",
          url: "https://4kmedia.org/wp-content/uploads/2017/10/lg-new-york-1.jpg",
          duration: 15,
          name: "Belgrano Digital - CLC",
          campaignId: null,
        },
      ];
    }

    return Response.json({
      screenId: id,
      screenName: screen.name,
      zone: zoneName,
      currentSchedule: activeSchedule?.name ?? "Default",
      items,
      updatedAt: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}T${String(now.getHours()).padStart(2, "0")}:00:00Z`,
      pollInterval: 60,
    });
  } catch (error) {
    console.error("[playlist] Error:", error);
    // Return fallback on any DB error
    return Response.json({
      screenId: id,
      screenName: `Screen-${id}`,
      zone: "Unknown",
      currentSchedule: "Fallback",
      items: [
        {
          id: "fallback",
          type: "image",
          url: "https://4kmedia.org/wp-content/uploads/2017/10/lg-new-york-1.jpg",
          duration: 15,
          name: "Belgrano Digital - CLC",
          campaignId: null,
        },
      ],
      updatedAt: new Date().toISOString(),
      pollInterval: 60,
    });
  }
}
