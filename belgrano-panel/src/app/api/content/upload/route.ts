import { db } from "@/lib/db";
import { contentItems, playlists, playlistItems } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { supabase, getPublicUrl } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const name = formData.get("name") as string | null;
    const type = (formData.get("type") as string) ?? "image";
    const duration = parseInt((formData.get("duration") as string) ?? "10", 10);
    const organizationId = formData.get("organizationId") as string;

    if (!file || !name || !organizationId) {
      return Response.json({ error: "Missing file, name, or organizationId" }, { status: 400 });
    }

    // Upload to Supabase Storage
    const ext = file.name.split(".").pop() ?? "jpg";
    const storagePath = `${organizationId}/${Date.now()}-${file.name}`;

    const { error: uploadError } = await supabase.storage
      .from("content")
      .upload(storagePath, file, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("[upload] Storage error:", uploadError);
      return Response.json({ error: "Upload failed: " + uploadError.message }, { status: 500 });
    }

    const publicUrl = getPublicUrl("content", storagePath);

    // Save to DB
    const [item] = await db.insert(contentItems).values({
      organizationId,
      name,
      type: type as "video" | "image" | "html5",
      fileName: file.name,
      fileSize: file.size,
      duration,
      thumbnailUrl: publicUrl,
      approvalStatus: "approved",
      uploadedBy: "admin",
    }).returning();

    // Auto-add to first playlist so it appears on screens immediately
    try {
      const firstPlaylist = await db.query.playlists.findFirst();
      if (firstPlaylist) {
        const existing = await db.query.playlistItems.findMany({
          where: eq(playlistItems.playlistId, firstPlaylist.id),
        });
        await db.insert(playlistItems).values({
          playlistId: firstPlaylist.id,
          contentItemId: item.id,
          position: existing.length + 1,
          durationOverride: duration,
        });
      }
    } catch (playlistErr) {
      console.error("[upload] Auto-add to playlist failed:", playlistErr);
    }

    return Response.json({ ok: true, item });
  } catch (error) {
    console.error("[upload] Error:", error);
    return Response.json({ error: "Upload failed" }, { status: 500 });
  }
}
