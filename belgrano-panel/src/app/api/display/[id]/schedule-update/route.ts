export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      // Send initial connection event
      controller.enqueue(
        encoder.encode(
          `data: ${JSON.stringify({
            type: "connected",
            screenId: id,
            timestamp: new Date().toISOString(),
          })}\n\n`
        )
      );

      // Send mock schedule update after 30 seconds (simulates admin change)
      const timeout = setTimeout(() => {
        try {
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                type: "schedule_update",
                screenId: id,
                message: "Playlist updated",
                timestamp: new Date().toISOString(),
              })}\n\n`
            )
          );
        } catch {
          // Stream already closed
        }
      }, 30000);

      // Keep alive every 15 seconds
      const keepAlive = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(`: keepalive\n\n`));
        } catch {
          clearInterval(keepAlive);
        }
      }, 15000);

      // Cleanup on close
      request.signal.addEventListener("abort", () => {
        clearTimeout(timeout);
        clearInterval(keepAlive);
        try {
          controller.close();
        } catch {
          // Already closed
        }
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
