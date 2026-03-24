import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "../src/lib/db/schema";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const db = drizzle(pool, { schema });

const ZONES = [
  { name: "Lobby Principal", description: "Entrada principal y recepción", floor: "1" },
  { name: "Urgencias", description: "Sala de espera urgencias", floor: "1" },
  { name: "Pediatría", description: "Sala de espera pediatría", floor: "2" },
  { name: "Cardiología", description: "Sala de espera cardiología", floor: "3" },
  { name: "Traumatología", description: "Sala de espera traumatología", floor: "3" },
  { name: "Maternidad", description: "Sala de espera maternidad", floor: "2" },
  { name: "Oncología", description: "Sala de espera oncología", floor: "4" },
  { name: "Cafetería", description: "Cafetería principal", floor: "1" },
  { name: "Pasillos Piso 1", description: "Pasillos y circulación piso 1", floor: "1" },
  { name: "Pasillos Piso 2", description: "Pasillos y circulación piso 2", floor: "2" },
];

async function seed() {
  console.log("Seeding database...");

  // 1. Organization
  const [org] = await db.insert(schema.organizations).values({
    name: "Belgrano Digital",
    slug: "belgrano",
  }).returning();
  console.log("Created org:", org.name, org.id);

  // 2. Location
  const [location] = await db.insert(schema.locations).values({
    organizationId: org.id,
    name: "Clínica Las Condes",
    address: "Estoril 450, Las Condes, Santiago, Chile",
    dailyFootTraffic: 6000,
  }).returning();
  console.log("Created location:", location.name, location.id);

  // 3. Zones
  const zones = await db.insert(schema.zones).values(
    ZONES.map((z) => ({
      locationId: location.id,
      name: z.name,
      description: z.description,
      floor: z.floor,
    }))
  ).returning();
  console.log("Created", zones.length, "zones");

  // 4. Screens (70 total, 7 per zone)
  const screenValues = [];
  for (const zone of zones) {
    for (let i = 1; i <= 7; i++) {
      const shortName = zone.name.replace(/\s/g, "-").replace(/í/g, "i").replace(/é/g, "e").replace(/ó/g, "o");
      screenValues.push({
        zoneId: zone.id,
        name: `CLC-${shortName}-${i}`,
        model: ["Samsung QM55R", "Samsung QM43R", "Samsung QH55R"][i % 3],
        tizenVersion: ["6.5", "7.0", "7.5", "8.0"][i % 4],
        resolution: i === 1 ? "1080x1920" : "1920x1080",
        orientation: (i === 1 ? "portrait" : "landscape") as "portrait" | "landscape",
        status: "unknown" as const,
        ipAddress: `192.168.10.${screenValues.length + 100}`,
      });
    }
  }
  const screens = await db.insert(schema.screens).values(screenValues).returning();
  console.log("Created", screens.length, "screens");

  // 5. Sample content items
  const contentItems = await db.insert(schema.contentItems).values([
    { organizationId: org.id, name: "New York 4K", type: "image" as const, fileName: "new-york-4k.jpg", fileSize: 2500000, duration: 15, approvalStatus: "approved" as const, thumbnailUrl: "https://4kmedia.org/wp-content/uploads/2017/10/lg-new-york-1.jpg" },
    { organizationId: org.id, name: "Bienvenida CLC", type: "image" as const, fileName: "bienvenida-clc.jpg", fileSize: 500000, duration: 10, approvalStatus: "approved" as const },
    { organizationId: org.id, name: "Tips Salud Invierno", type: "image" as const, fileName: "tips-salud.jpg", fileSize: 800000, duration: 12, approvalStatus: "approved" as const },
    { organizationId: org.id, name: "Horarios Consultas", type: "image" as const, fileName: "horarios.jpg", fileSize: 400000, duration: 10, approvalStatus: "approved" as const },
  ]).returning();
  console.log("Created", contentItems.length, "content items");

  // 6. Sample playlist
  const [playlist] = await db.insert(schema.playlists).values({
    organizationId: org.id,
    name: "Rotación Principal CLC",
    description: "Playlist principal para todas las zonas",
  }).returning();

  await db.insert(schema.playlistItems).values(
    contentItems.map((item, i) => ({
      playlistId: playlist.id,
      contentItemId: item.id,
      position: i + 1,
      durationOverride: item.duration,
    }))
  );
  console.log("Created playlist:", playlist.name, "with", contentItems.length, "items");

  // 7. Sample schedule
  await db.insert(schema.schedules).values({
    organizationId: org.id,
    name: "Horario Completo",
    playlistId: playlist.id,
    startTime: "07:00",
    endTime: "21:00",
    daysOfWeek: [1, 2, 3, 4, 5, 6, 7],
    isClinicContent: false,
    zoneIds: zones.map((z) => z.id),
  });
  console.log("Created schedule: Horario Completo");

  // 8. Sample advertisers
  const advertisers = await db.insert(schema.advertisers).values([
    { organizationId: org.id, name: "Colmena Golden Cross", company: "Colmena", category: "ISAPRE", contactName: "María González", contactEmail: "marketing@colmena.cl" },
    { organizationId: org.id, name: "Abbott Laboratories", company: "Abbott", category: "Pharma", contactName: "Carlos Ruiz", contactEmail: "carlos.ruiz@abbott.com" },
    { organizationId: org.id, name: "Warner Bros Chile", company: "Warner Bros", category: "Entertainment", contactName: "Andrés Silva", contactEmail: "andres.silva@warnerbros.com" },
  ]).returning();
  console.log("Created", advertisers.length, "advertisers");

  // Summary
  console.log("\n--- SEED COMPLETE ---");
  console.log("Org ID:", org.id);
  console.log("Location ID:", location.id);
  console.log("Zones:", zones.length);
  console.log("Screens:", screens.length);
  console.log("Content Items:", contentItems.length);
  console.log("Playlists: 1");
  console.log("Advertisers:", advertisers.length);
  console.log("\nFirst 3 screen IDs (for display URLs):");
  screens.slice(0, 3).forEach((s) => console.log(`  /display/${s.id} → ${s.name}`));

  await pool.end();
}

seed().catch((e) => {
  console.error("Seed failed:", e);
  process.exit(1);
});
