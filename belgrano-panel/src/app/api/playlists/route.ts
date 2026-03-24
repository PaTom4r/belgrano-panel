import { db } from "@/lib/db";
import { playlists, playlistItems, contentItems } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const allPlaylists = await db.query.playlists.findMany({
      orderBy: [desc(playlists.createdAt)],
    });

    const result = await Promise.all(
      allPlaylists.map(async (pl) => {
        const items = await db.query.playlistItems.findMany({
          where: eq(playlistItems.playlistId, pl.id),
          orderBy: (pi, { asc }) => [asc(pi.position)],
        });

        const itemsWithContent = await Promise.all(
          items.map(async (pi) => {
            const content = await db.query.contentItems.findFirst({
              where: eq(contentItems.id, pi.contentItemId),
            });
            return { ...pi, content };
          })
        );

        return { ...pl, items: itemsWithContent };
      })
    );

    return Response.json({ playlists: result });
  } catch (error) {
    console.error("[playlists] DB error:", error);
    return Response.json({ playlists: [] });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, organizationId, items } = body;

    const [playlist] = await db.insert(playlists).values({
      name,
      description,
      organizationId,
    }).returning();

    if (items?.length) {
      await db.insert(playlistItems).values(
        items.map((item: { contentItemId: string; duration: number }, i: number) => ({
          playlistId: playlist.id,
          contentItemId: item.contentItemId,
          position: i + 1,
          durationOverride: item.duration,
        }))
      );
    }

    return Response.json({ ok: true, playlist });
  } catch (error) {
    console.error("[playlists] Create error:", error);
    return Response.json({ error: "Failed to create playlist" }, { status: 500 });
  }
}
