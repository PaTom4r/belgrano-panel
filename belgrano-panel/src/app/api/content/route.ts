import { db } from "@/lib/db";
import { contentItems } from "@/lib/db/schema";
import { desc } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const items = await db.query.contentItems.findMany({
      orderBy: [desc(contentItems.createdAt)],
    });

    return Response.json({ items });
  } catch (error) {
    console.error("[content] DB error:", error);
    return Response.json({ items: [] });
  }
}
