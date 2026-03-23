# Architecture Research

**Domain:** Digital Signage Management + DOOH Advertising Network
**Researched:** 2026-03-23
**Confidence:** MEDIUM — MagicInfo API surface confirmed via official docs; DOOH operator patterns from industry sources; reporting API gaps are a known unknown.

## Standard Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                     BELGRANO DIGITAL PANEL                          │
│           (Next.js — internal admin for Belgrano team)              │
│                                                                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │   Screens &  │  │   Content &  │  │  Advertisers │              │
│  │   Network    │  │  Scheduling  │  │  & Campaigns │              │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘              │
│         │                │                 │                        │
│  ┌──────┴───────────────────────────────────┴──────┐               │
│  │                  API Layer (Next.js Route Handlers)│             │
│  └──────────────────────┬────────────────────────────┘             │
└─────────────────────────┼───────────────────────────────────────────┘
                          │
         ┌────────────────┼────────────────┐
         │                │                │
         ▼                ▼                ▼
┌─────────────┐  ┌─────────────────┐  ┌──────────────┐
│  MagicInfo  │  │   PostgreSQL    │  │  File Storage│
│   Server    │  │   (own DB)      │  │  (S3/local)  │
│  (on-prem   │  │                 │  │              │
│   at CLC)   │  │ advertisers     │  │ creative     │
│             │  │ campaigns       │  │ assets       │
│ /restapi/   │  │ contracts       │  │ thumbnails   │
│  v1.0/...   │  │ play_log_cache  │  │              │
└──────┬──────┘  └─────────────────┘  └──────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────┐
│               Samsung Screens (70x at CLC)           │
│   MagicInfo Player running on each Samsung TV        │
│   Receives schedules, plays content, reports status  │
└─────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Typical Implementation |
|-----------|----------------|------------------------|
| Belgrano Panel (UI) | Screens dashboard, content upload, schedule builder, advertiser CRM, campaign tracker, reporting | Next.js 15 + Tailwind + shadcn/ui |
| API Layer | Orchestrates calls between panel, MagicInfo API, and own DB | Next.js Route Handlers / Server Actions |
| MagicInfo Server (on-prem CLC) | Ground truth for device state, content library, schedules, play logs | Samsung MagicInfo 8/9 — REST API v1.0 |
| PostgreSQL (own DB) | Belgrano-native data: advertisers, contracts, campaigns, revenue, play log mirror | PostgreSQL + Prisma or Drizzle |
| File Storage | Original creative files (video, image), compressed versions, thumbnails | Cloudflare R2 or local initially |
| MagicInfo Players | Execute playback on each Samsung screen, report uptime/errors back to MagicInfo Server | Samsung Tizen OS — managed by MagicInfo |

---

## Recommended Project Structure

```
src/
├── app/                         # Next.js App Router
│   ├── (auth)/                  # Login/session pages
│   ├── (dashboard)/
│   │   ├── screens/             # Screen list, status, health map
│   │   ├── content/             # Upload, library, approval queue
│   │   ├── schedules/           # Schedule builder, calendar view
│   │   ├── advertisers/         # Client CRM (companies, contacts)
│   │   ├── campaigns/           # Campaign CRUD, flight dates, budget
│   │   └── reports/             # Proof of play, impressions, revenue
│   └── api/
│       ├── magicinfo/           # Proxy + adapter for MagicInfo REST API
│       ├── content/             # Upload handler, file processing
│       ├── campaigns/           # Campaign management endpoints
│       └── reports/             # Report generation, export
│
├── lib/
│   ├── magicinfo/               # MagicInfo API client (typed wrapper)
│   │   ├── auth.ts              # Token management + refresh
│   │   ├── devices.ts           # Device CRUD wrappers
│   │   ├── content.ts           # Content upload/approve wrappers
│   │   ├── schedules.ts         # Schedule CRUD wrappers
│   │   └── types.ts             # MagicInfo response types
│   ├── db/                      # Drizzle/Prisma schema + queries
│   │   ├── schema.ts            # All table definitions
│   │   └── queries/             # Per-domain query functions
│   └── storage/                 # File upload abstraction (R2/local)
│
├── components/
│   ├── ui/                      # shadcn/ui primitives
│   ├── screens/                 # Screen card, status badge, map
│   ├── content/                 # Upload dropzone, preview, timeline
│   ├── campaigns/               # Campaign form, calendar, budget bar
│   └── reports/                 # Chart components, export button
│
└── types/                       # Shared TypeScript types
```

### Structure Rationale

- **`lib/magicinfo/`:** MagicInfo API has its own auth, pagination, and error surface. Wrapping it in a typed client isolates all third-party complexity and makes it mockable for development without VPN to CLC.
- **`app/api/magicinfo/`:** Never expose MagicInfo credentials or internal IP to the browser — all calls go server-side through this proxy layer.
- **Own PostgreSQL:** MagicInfo stores device/schedule/content state, but it knows nothing about advertisers, contracts, revenue, or billing. Our DB owns that domain entirely.
- **`(dashboard)` route group:** All authenticated routes grouped under a single layout with sidebar nav; auth check at layout level via middleware.

---

## Architectural Patterns

### Pattern 1: MagicInfo as Dumb Backend, Panel as Source of Truth for Business Logic

**What:** MagicInfo manages what plays on screens (devices, content, schedules). The Belgrano panel manages why it plays there (advertisers, campaigns, contracts, revenue). These are two separate domains. Never put advertiser logic inside MagicInfo.

**When to use:** Always. MagicInfo is infrastructure, not a CRM.

**Trade-offs:** Requires a sync layer — when a campaign is activated in the panel, the panel must push the schedule to MagicInfo. If MagicInfo is down, scheduling fails. Mitigation: queue schedule pushes with retry.

```typescript
// Activating a campaign slot pushes a schedule to MagicInfo
async function activateCampaignSlot(campaignId: string) {
  const campaign = await db.query.campaigns.findFirst({ where: eq(campaigns.id, campaignId) })
  const schedule = buildMagicInfoSchedule(campaign) // transform our domain → MagicInfo schema
  await magicinfoClient.schedules.create(schedule)
  await db.update(campaigns).set({ status: 'active', magicinfoScheduleId: schedule.id })
    .where(eq(campaigns.id, campaignId))
}
```

### Pattern 2: Play Log Mirroring for Reporting

**What:** MagicInfo's statistics module generates proof-of-play data (timestamped content play events) but doesn't expose it cleanly via API. Export periodically (daily cron) from MagicInfo, store in own DB, compute advertiser-facing reports from there.

**When to use:** Whenever you need to show advertisers "your ad played 847 times this week." Do not rely on MagicInfo's UI for advertiser reporting — it's not their screen to log into.

**Trade-offs:** Reports lag by up to 24h if using daily cron. For v1 this is acceptable; real-time would require MagicInfo webhook or more invasive polling.

```typescript
// Daily cron: fetch play stats from MagicInfo and mirror to own DB
async function syncPlayLogs(date: Date) {
  const logs = await magicinfoClient.statistics.getContentPlays({ date })
  await db.insert(play_log_cache).values(
    logs.map(l => ({ contentId: l.contentId, deviceId: l.deviceId, playedAt: l.timestamp, durationMs: l.duration }))
  ).onConflictDoNothing()
}
```

### Pattern 3: Location Hierarchy for Multi-Clinic Scaling

**What:** Model the world as Organization → Location → Zone → Screen. CLC is the first location. Each advertiser campaign targets one or more zones (e.g., "CLC Lobby" vs "CLC Waiting Rooms").

**When to use:** From day one, even if CLC is the only location. Adding "Clínica Alemana" later is just adding a new Location row, not a schema rewrite.

**Trade-offs:** Adds a small amount of schema complexity upfront. Worth it — without this, multi-location requires a rewrite.

```
organizations (Belgrano Digital clients — e.g., CLC)
  └── locations (physical buildings — e.g., "Torre CLC")
        └── zones (logical areas — e.g., "Lobby Piso 1", "Sala de Espera")
              └── screens (individual devices — mapped to MagicInfo device IDs)
```

---

## Data Flow

### Content Pipeline: Upload → Approval → Schedule → Playback → Report

```
Belgrano uploads creative file
    ↓
File stored in R2/local storage → thumbnail generated
    ↓
Content record created in own DB (status: pending_review)
    ↓
[Internal approval step: Belgrano reviews before sending to MagicInfo]
    ↓
File uploaded to MagicInfo Server via /restapi/v1.0/cms/contents
    ↓
Content approved in MagicInfo (can be triggered via API: /approval endpoint)
    ↓
Campaign schedule created: date range + screens + time slots
    ↓
Schedule pushed to MagicInfo via /restapi/v1.0/dms/schedule/contents
    ↓
MagicInfo distributes to screens → Samsung TVs play content
    ↓
MagicInfo records play events in Statistics module
    ↓
[Cron] Play log exported from MagicInfo → stored in play_log_cache table
    ↓
Report generated: plays × CPM → invoice to advertiser
```

### Screen Health Monitoring Flow

```
MagicInfo Server polls each screen continuously
    ↓
Device status available via /restapi/v1.0/rms/devices/{deviceId}
    ↓
Panel polls MagicInfo device list periodically (every 5min)
    ↓
Screen status stored in own DB (online/offline/error + last_seen)
    ↓
Dashboard shows real-time-ish health grid
    ↓
Alert triggered if screen offline > threshold (email/Telegram notification)
```

### Campaign Revenue Flow

```
Advertiser contract created (own DB: advertisers + contracts tables)
    ↓
Campaign defined: creative + flight dates + target zones + budget/CPM
    ↓
Schedule activated → content pushed to MagicInfo
    ↓
Play logs synced daily
    ↓
Invoice generated: sum(plays) × agreed_cpm
    ↓
Revenue split calculated: Belgrano margin + CLC share
    ↓
Reports exported as PDF/Excel for advertiser and for CLC
```

---

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| MagicInfo Server (on-prem CLC) | REST API v1.0 via HTTPS, token auth, server-to-server | IP/hostname of MagicInfo must be accessible from panel server. VPN or firewall rule needed if panel is cloud-hosted. |
| Samsung Tizen Screens | Managed entirely by MagicInfo — no direct integration needed | Screens are opaque to our system; MagicInfo is the intermediary. |
| File Storage (R2/S3) | Pre-signed upload URLs from browser → storage; panel server manages metadata | Large video files should upload directly to storage, not transit through Next.js server. |
| Email (notifications) | Resend or SMTP for alerts and advertiser reports | Simple transactional only. |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| Panel UI ↔ API Layer | Next.js Server Actions + Route Handlers | Server Actions for mutations; Route Handlers for file upload + streaming. |
| API Layer ↔ MagicInfo | HTTP REST (token in header). Token cached server-side, refresh on 401. | MagicInfo token expires — implement auto-refresh middleware around all calls. |
| API Layer ↔ Own DB | Drizzle ORM over PostgreSQL connection pool | Drizzle preferred for type safety without heavy abstraction. |
| API Layer ↔ File Storage | AWS SDK / Cloudflare SDK | Abstracted behind `lib/storage/` so provider can be swapped. |
| Cron Jobs ↔ MagicInfo | Same API client as main app, triggered by Vercel Cron or node-cron | Play log sync, screen health check, schedule activation checks. |

---

## Scaling Considerations

| Scale | Architecture Adjustments |
|-------|--------------------------|
| 1 clinic, 70 screens | Single Next.js app + single PostgreSQL instance. MagicInfo is on-prem at CLC. Deploy panel on Vercel or Railway. |
| 3-5 clinics, 300 screens | One MagicInfo instance per clinic (each clinic has their own on-prem server). Panel is a single multi-tenant app — Location hierarchy handles this cleanly. Each MagicInfo gets its own credentials config. |
| 10+ clinics | Consider a dedicated sync service (Node.js worker) to aggregate play logs from multiple MagicInfo servers in parallel. Panel stays the same. Add read replica for reports if query load increases. |

### Scaling Priorities

1. **First bottleneck:** MagicInfo API rate limits + VPN/network reliability. MagicInfo is on-prem — if CLC's network is down, panel loses connection. Mitigation: cache device status, queue schedule pushes.
2. **Second bottleneck:** Play log sync latency at 300+ screens. Daily batch export scales well; move to hourly cron if advertisers demand fresher data.

---

## Anti-Patterns

### Anti-Pattern 1: Treating MagicInfo as the System of Record for Business Data

**What people do:** Store advertiser names, campaign budgets, or revenue splits inside MagicInfo's user/group structure.
**Why it's wrong:** MagicInfo has no concept of "advertiser," "CPM," or "contract." Forcing business data into its org hierarchy makes reporting impossible and ties you to MagicInfo's schema.
**Do this instead:** MagicInfo owns devices + schedules + play logs. Own DB owns everything business — advertisers, campaigns, revenue. The link between them is `magicinfoScheduleId` and `magicinfoContentId` stored as foreign keys in our DB.

### Anti-Pattern 2: Exposing MagicInfo API Directly to Browser

**What people do:** Call MagicInfo REST API from the frontend using credentials stored in env vars prefixed `NEXT_PUBLIC_`.
**Why it's wrong:** Leaks MagicInfo credentials + internal network address. Any user could query or modify all 70 screens directly.
**Do this instead:** All MagicInfo calls go through Next.js API routes or Server Actions. Credentials never reach the browser.

### Anti-Pattern 3: Building Advertiser Self-Service Portal in v1

**What people do:** Scope in an advertiser login to upload their own creatives and set their own schedules.
**Why it's wrong:** Adds auth complexity, content moderation requirements, and support burden before product-market fit is confirmed.
**Do this instead:** Belgrano manages everything. If the business grows to 20+ advertisers, consider a read-only advertiser portal for campaign reports first — not a full self-service tool.

### Anti-Pattern 4: Hardcoding CLC as the Only Location

**What people do:** Skip the Location/Zone hierarchy and refer to "CLC screens" directly in code (e.g., hardcoded device group IDs).
**Why it's wrong:** Adding a second clinic requires schema migration + significant refactor.
**Do this instead:** Every screen belongs to a Zone, every Zone to a Location, every Location to an Organization — even when there's only one of each. The extra join is trivial; the flexibility is valuable.

---

## Build Order Implications

The component dependency graph dictates this sequence:

1. **MagicInfo API client (`lib/magicinfo/`)** — everything downstream depends on this. Must be working before any UI is useful. Verify connectivity to CLC's MagicInfo instance first.
2. **Database schema** — Location hierarchy + screen mirroring must exist before the screens dashboard can be built.
3. **Screens dashboard** — Read-only view of device status. First working feature; proves the integration works.
4. **Content upload + MagicInfo sync** — File pipeline + approval flow. Required before scheduling is useful.
5. **Campaign + advertiser management** — Own-DB business logic. Can be built in parallel with content pipeline once schema is set.
6. **Schedule builder** — Ties campaigns to content + screens. Depends on both content sync and campaign data.
7. **Reporting + proof of play** — Depends on play log sync cron + campaign attribution. Last to build because it requires data to accumulate.

---

## Sources

- Samsung MagicINFO Server Open API documentation: https://docs.samsungvx.com/docs/display/MSV/Open+API
- MagicINFO Statistics and reporting capabilities: https://blog.magicinfoservices.com/blog/magicinfo-explained-how-to-use-digital-signage-statistics-effectively
- Essential DOOH operator software features (Navori): https://navori.com/blog/essential-software-features-for-dooh-operators/
- DOOH proof of play standards (OAAA): https://oaaa.org/blog-posts/measurement-standards-and-the-current-state-of-proof-of-play-in-dooh/
- Content pipeline and approval workflow patterns: https://www.optisigns.com/post/use-digital-signage-with-approval-workflow-for-the-workplace-communication
- MagicINFO content approval setup: https://helpdesk.magicinfoservices.com/how-to-set-up-content-approval-in-magicinfo
- DOOH platform architecture components: https://xenoss.io/blog/programmatic-dooh
- Programmatic DOOH explained: https://blinksigns.com/programmatic-dooh-explained/

---
*Architecture research for: Digital Signage Management + DOOH Advertising (MagicInfo CLC)*
*Researched: 2026-03-23*
