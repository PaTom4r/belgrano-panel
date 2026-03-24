import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const org = await db.query.organizations.findFirst();
    return Response.json({ org });
  } catch (error) {
    return Response.json({ org: null });
  }
}
