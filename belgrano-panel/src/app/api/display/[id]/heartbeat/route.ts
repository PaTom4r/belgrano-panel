import { db } from "@/lib/db";
import { heartbeats, screens } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  let body: Record<string, unknown> = {};
  try {
    body = await request.json();
  } catch {
    // Accept empty body
  }

  try {
    await db.insert(heartbeats).values({
      screenId: id,
      currentContentId: (body.currentContentId as string) ?? null,
      ipAddress: request.headers.get("x-forwarded-for") ?? null,
      userAgent: (body.userAgent as string) ?? null,
    });

    await db.update(screens)
      .set({ lastSeen: new Date(), status: "online" })
      .where(eq(screens.id, id));
  } catch (error) {
    console.error("[heartbeat] DB error:", error);
  }

  return Response.json({
    ok: true,
    commands: [],
  });
}
