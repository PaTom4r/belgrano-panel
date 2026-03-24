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

  // In production, this would update the screen's lastSeen in DB
  console.log(`[heartbeat] Screen ${id}`, {
    currentContentId: body.currentContentId ?? null,
    timestamp: body.timestamp ?? new Date().toISOString(),
    userAgent: body.userAgent ?? "unknown",
  });

  return Response.json({
    ok: true,
    commands: [], // Future: remote restart, volume change, refresh, etc.
  });
}
