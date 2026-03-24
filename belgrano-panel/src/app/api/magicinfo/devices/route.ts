import { db } from "@/lib/db";
import { screens, zones } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const allScreens = await db.query.screens.findMany();
    const allZones = await db.query.zones.findMany();

    const zoneMap = new Map(allZones.map((z) => [z.id, z.name]));

    const devices = allScreens.map((s) => ({
      deviceId: s.id,
      deviceName: s.name,
      deviceModelName: s.model ?? "Unknown",
      deviceType: "SMART_SIGNAGE",
      ipAddress: s.ipAddress ?? "",
      macAddress: "",
      firmwareVersion: s.tizenVersion ?? "",
      status: s.status === "online" ? "CONNECTED" : "DISCONNECTED",
      resolution: s.resolution ?? "1920x1080",
      displayOrientation: s.orientation === "portrait" ? "PORTRAIT" : "LANDSCAPE",
      lastConnectionTime: s.lastSeen?.toISOString() ?? "",
      groupId: s.zoneId,
      groupName: zoneMap.get(s.zoneId) ?? "Unknown",
    }));

    return Response.json({
      status: 200,
      message: "OK",
      data: devices,
      totalCount: devices.length,
    });
  } catch (error) {
    console.error("[devices] DB error:", error);
    // Fallback to mock if DB fails
    const { generateMockDevices } = await import("@/lib/magicinfo/mock");
    const devices = generateMockDevices(70);
    return Response.json({ status: 200, message: "OK", data: devices, totalCount: devices.length });
  }
}
