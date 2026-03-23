export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Simulate restart delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return Response.json({
    status: 200,
    message: `Restart command sent to device ${id}`,
    data: {
      deviceId: id,
      action: "restart",
      timestamp: new Date().toISOString(),
    },
  });
}
