import { generateMockDevices } from "@/lib/magicinfo/mock";

export const dynamic = "force-dynamic";

export async function GET() {
  const devices = generateMockDevices(70);
  return Response.json({
    status: 200,
    message: "OK",
    data: devices,
    totalCount: devices.length,
  });
}
