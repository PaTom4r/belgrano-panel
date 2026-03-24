import { ZONES } from "@/lib/constants";

const campaigns = [
  { id: "camp-001", name: "Plan Premium Salud", advertiser: "ISAPRE Colmena" },
  { id: "camp-002", name: "Vitaminas Ensure", advertiser: "Abbott Pharma" },
  { id: "camp-003", name: "Seguro Vida Proteccion", advertiser: "MetLife Seguros" },
  { id: "camp-004", name: "Check-Up Anual", advertiser: "ISAPRE Colmena" },
  { id: "camp-005", name: "Suplemento Omega 3", advertiser: "Abbott Pharma" },
];

const contentNames: Record<string, string> = {
  "camp-001": "plan-premium-salud-spot.mp4",
  "camp-002": "ensure-vitaminas-30s.mp4",
  "camp-003": "metlife-proteccion-familiar.mp4",
  "camp-004": "checkup-anual-banner.mp4",
  "camp-005": "omega3-bienestar-15s.mp4",
};

const screensPerZone: Record<string, string[]> = {};
for (const zone of ZONES) {
  const prefix = zone.replace(/\s/g, "-");
  screensPerZone[zone] = Array.from({ length: 7 }, (_, i) => `CLC-${prefix}-${i + 1}`);
}

function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function generateMockLogs(from: Date, to: Date, campaignFilter?: string, screenFilter?: string) {
  const logs: Array<{
    id: string;
    screenId: string;
    screenName: string;
    contentName: string;
    campaignId: string;
    campaignName: string;
    zone: string;
    playedAt: string;
    durationSeconds: number;
  }> = [];

  const startMs = from.getTime();
  const endMs = to.getTime();
  const rangeMs = endMs - startMs;

  // Generate ~50 entries spread across the time range
  const entryCount = 50;
  let logIndex = 0;

  for (let i = 0; i < entryCount; i++) {
    const seed = Math.floor(startMs / 1000) + i * 137;
    const campIndex = Math.floor(seededRandom(seed) * campaigns.length);
    const campaign = campaigns[campIndex];
    const zoneIndex = Math.floor(seededRandom(seed + 1) * ZONES.length);
    const zone = ZONES[zoneIndex];
    const screens = screensPerZone[zone];
    const screenIndex = Math.floor(seededRandom(seed + 2) * screens.length);
    const screenName = screens[screenIndex];
    const duration = seededRandom(seed + 3) > 0.5 ? 30 : 15;

    // Spread playedAt across the range
    const offset = Math.floor(seededRandom(seed + 4) * rangeMs);
    const playedAt = new Date(startMs + offset);

    if (campaignFilter && campaign.id !== campaignFilter) continue;
    if (screenFilter && screenName !== screenFilter) continue;

    logIndex++;
    logs.push({
      id: `plog-${logIndex.toString().padStart(4, "0")}`,
      screenId: `DEV-${screenIndex.toString().padStart(3, "0")}`,
      screenName,
      contentName: contentNames[campaign.id],
      campaignId: campaign.id,
      campaignName: campaign.name,
      zone,
      playedAt: playedAt.toISOString(),
      durationSeconds: duration,
    });
  }

  // Sort by playedAt descending (most recent first)
  logs.sort((a, b) => new Date(b.playedAt).getTime() - new Date(a.playedAt).getTime());

  return logs;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const fromParam = searchParams.get("from");
  const toParam = searchParams.get("to");
  const campaignId = searchParams.get("campaignId") || undefined;
  const screenId = searchParams.get("screenId") || undefined;

  // Default: last 24 hours
  const now = new Date();
  const from = fromParam ? new Date(`${fromParam}T00:00:00Z`) : new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const to = toParam ? new Date(`${toParam}T23:59:59Z`) : now;

  const logs = generateMockLogs(from, to, campaignId, screenId);

  // Calculate summary
  const totalPlays = logs.length > 0 ? logs.length * 25 : 0; // Scale up for realism
  const uniqueScreens = new Set(logs.map((l) => l.screenName)).size;
  const totalDuration = logs.reduce((sum, l) => sum + l.durationSeconds, 0);

  const byZone: Record<string, number> = {};
  const byCampaign: Record<string, number> = {};

  for (const log of logs) {
    byZone[log.zone] = (byZone[log.zone] || 0) + 1;
    byCampaign[log.campaignId] = (byCampaign[log.campaignId] || 0) + 1;
  }

  // Scale zone/campaign counts for realism
  for (const key of Object.keys(byZone)) {
    byZone[key] = byZone[key] * 25;
  }
  for (const key of Object.keys(byCampaign)) {
    byCampaign[key] = byCampaign[key] * 25;
  }

  return Response.json({
    logs,
    summary: {
      totalPlays: totalPlays || 1247,
      uniqueScreens: uniqueScreens || 67,
      totalDuration: totalDuration || 18705,
      byZone,
      byCampaign,
    },
    lastUpdated: now.toISOString(),
  });
}
