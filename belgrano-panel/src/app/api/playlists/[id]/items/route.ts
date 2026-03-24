import { db } from "@/lib/db";
import { playlistItems } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const body = await request.json();
    const { contentItemId, duration } = body;

    // Get current max position
    const existing = await db.query.playlistItems.findMany({
      where: eq(playlistItems.playlistId, id),
    });
    const nextPosition = existing.length + 1;

    const [item] = await db.insert(playlistItems).values({
      playlistId: id,
      contentItemId,
      position: nextPosition,
      durationOverride: duration ?? 10,
    }).returning();

    return Response.json({ ok: true, item });
  } catch (error) {
    console.error("[playlist-items] Error:", error);
    return Response.json({ error: "Failed to add item" }, { status: 500 });
  }
}
