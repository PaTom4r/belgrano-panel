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

  // In production, this would insert into play_logs table
  console.log(`[play-log] Screen ${id}`, {
    contentItemId: body.contentItemId,
    campaignId: body.campaignId ?? null,
    playedAt: body.playedAt ?? new Date().toISOString(),
    durationSeconds: body.durationSeconds,
    zone: body.zone,
  });

  return Response.json({ ok: true });
}
