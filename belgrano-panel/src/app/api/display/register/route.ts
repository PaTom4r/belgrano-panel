import { randomUUID } from "crypto";

export const dynamic = "force-dynamic";

// In-memory store for mock — will be replaced with DB in production
const registeredScreens = new Map<string, { screenId: string; registeredAt: string }>();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { displayId, userAgent, resolution, ipAddress } = body;

    if (!displayId || typeof displayId !== "string") {
      return Response.json(
        { ok: false, error: "displayId is required" },
        { status: 400 },
      );
    }

    // Check if already registered
    const existing = registeredScreens.get(displayId);
    if (existing) {
      return Response.json({
        ok: true,
        registered: false,
        screenId: existing.screenId,
        message: "Screen already registered",
      });
    }

    // Register new screen
    const screenId = randomUUID();
    registeredScreens.set(displayId, {
      screenId,
      registeredAt: new Date().toISOString(),
    });

    return Response.json({
      ok: true,
      registered: true,
      screenId,
      displayId,
      userAgent: userAgent || null,
      resolution: resolution || null,
      ipAddress: ipAddress || null,
    });
  } catch {
    return Response.json(
      { ok: false, error: "Invalid request body" },
      { status: 400 },
    );
  }
}
