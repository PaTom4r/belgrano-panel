import { db } from "@/lib/db";
import { playLogs } from "@/lib/db/schema";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  let body: Record<string, unknown> = {};
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid JSON body" }, { status: 400 });
  }

  try {
    await db.insert(playLogs).values({
      screenId: id,
      contentItemId: (body.contentItemId as string) ?? null,
      campaignId: (body.campaignId as string) ?? null,
      playedAt: new Date((body.playedAt as string) ?? Date.now()),
      durationSeconds: (body.durationSeconds as number) ?? null,
    });
  } catch (error) {
    console.error("[play-log] DB error:", error);
  }

  return Response.json({ ok: true });
}
