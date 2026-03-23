# Project Research Summary

**Project:** magicinfo-clc (Belgrano Digital — CLC DOOH Network)
**Domain:** Digital Signage Management + DOOH Advertising Network (Healthcare, Chile)
**Researched:** 2026-03-23
**Confidence:** MEDIUM

## Executive Summary

This project is a two-layer system: Samsung MagicInfo Server already exists at CLC and manages 70 screens — the job is NOT to replace it but to build a custom admin panel on top of it that adds the DOOH business layer MagicInfo doesn't provide. The recommended approach is a Next.js 15 dashboard (the Belgrano Panel) that wraps MagicInfo's REST API and adds advertiser management, campaign scheduling, proof-of-play reporting, and revenue share tracking. The entire commercial model depends on Belgrano flipping CLC from "paying a provider" to "earning ad revenue" — which means the business logic layer is just as important as the technical integration.

The build order is architecturally constrained: MagicInfo API connectivity must be verified first, then the database schema (with multi-tenant location hierarchy built in from day one), then screens dashboard, then content pipeline, then campaigns, then reporting. Proof-of-play reporting comes last because it requires accumulated play log data. The key pattern is a clean separation between MagicInfo (infrastructure: devices, schedules, play logs) and the Belgrano PostgreSQL database (business: advertisers, contracts, campaigns, revenue).

The biggest risk is not technical — it is the provider transition. MagicInfo licenses may be owned by the current provider, the server may be running a critically vulnerable unpatched version (CVE-2024-7399, CVSS 9.8), and screens can go blank if the handover isn't planned carefully. These are Phase 0/1 blockers that must be resolved before any code is written. On the commercial side, the revenue model must be modeled before committing to CLC, and the first advertiser pipeline should target ISAPREs and pharmaceutical companies — not national entertainment brands.

---

## Key Findings

### Recommended Stack

The system has three tiers: MagicInfo Server on-prem at CLC (existing), a custom Next.js 15 admin panel hosted on Vercel (build this), and a separate PostgreSQL database for business data. MagicInfo is the device/schedule/play-log layer; the Belgrano Panel owns all business logic. These two databases must never be mixed.

**Core technologies:**
- **Next.js 15 (App Router):** Full-stack framework for admin dashboard — handles UI and API routes in one codebase, no separate backend needed
- **TypeScript 5.x:** Type safety critical when wrapping MagicInfo's ~590 API endpoints
- **PostgreSQL 16.x + Drizzle ORM:** Relational structure required for advertiser → campaigns → slots → screens → play logs; Drizzle already in Pato's ecosystem
- **MagicInfo Open API v2.0:** ~590 REST endpoints for device management, content upload, scheduling, proof-of-play logs — all access via server-side proxy only
- **shadcn/ui + Tailwind CSS 4.x:** Admin dashboard components — Radix UI based, accessible, fast iteration
- **Recharts 2.x:** Proof-of-play charts, revenue dashboards — already used across Pato's projects
- **Stripe:** B2B advertiser invoicing — better than Mercado Pago for business clients; supports Chile
- **Resend:** Transactional email for advertiser reports and invoice delivery
- **next-auth 5.x (Auth.js):** Dashboard authentication — v5 required for Next.js 15 App Router (v4 is incompatible)

**Critical version requirement:** MagicInfo Server must be on version 21.1050+ (V9) before integration begins — earlier versions have an actively exploited RCE vulnerability.

**Deferred:** Programmatic DOOH / RTB, camera-based audience measurement, advertiser self-service portal, Taggify SSP integration — all out of scope for v1.

### Expected Features

Features are organized around three user types: Belgrano operators (primary v1 users), CLC stakeholders (secondary), and advertisers (passive recipients of reports). The feature dependency chain runs from screen registry → content management → campaign management → proof-of-play → revenue reporting. Every step requires the previous one.

**Must have (table stakes for v1 launch):**
- Screen health dashboard (all 70 screens, online/offline status)
- Content upload + playlist management (MP4, image, HTML5)
- Schedule-based content switching (time-of-day: clinic content vs. ads)
- Screen grouping by zone/location (operate areas, not individual screens)
- Advertiser registry + campaign definition (who runs what, when, on which screens)
- Basic Proof of Play report (plays × timestamp × screen — minimum for any advertiser payment)
- Content approval workflow (flag: pending/approved — brand safety in healthcare context)
- Revenue share statement for CLC (monthly summary — critical for the venue partnership pitch)

**Should have (add after first billing cycle):**
- Impression estimates with CPM calculator — first advertiser will ask "how many people saw my ad?"
- QR code tracking per campaign — offline-to-online conversion measurement
- Automated monthly report generation and email delivery
- Advertiser read-only portal (deferred until manual reporting exceeds ~2-3h/month)
- Emergency alert override via admin panel (CLC compliance requirement)

**Defer to v2+:**
- Multi-client architecture (activate when second venue is signed)
- Dynamic content templates (weather, date overlays)
- Zone-specific audience data and dwell time modeling
- Full campaign pacing / frequency capping

**Healthcare-specific non-negotiables:** Pharmaceutical ads require ISP pre-approval before display. Food ads with octagon seals must be blocked from pediatric zones (Ley 20.606). CLC needs a written content policy before any ad campaigns go live. These are legal requirements, not UX suggestions.

### Architecture Approach

The architecture places all MagicInfo API calls behind a server-side proxy layer (`app/api/magicinfo/`) — credentials never reach the browser. A typed MagicInfo client (`lib/magicinfo/`) wraps all external API calls with token management and retry. Own PostgreSQL schema uses an Organization → Location → Zone → Screen hierarchy from day one, even though CLC is the only client at launch. This hierarchy costs nearly nothing upfront and prevents a schema rewrite when a second clinic is added.

**Major components:**
1. **Belgrano Panel (Next.js)** — screens dashboard, content library, schedule builder, advertiser CRM, campaign tracker, reporting UI
2. **API Layer (Next.js Route Handlers / Server Actions)** — orchestrates MagicInfo API calls and own DB queries; sole path for all external integrations
3. **MagicInfo Client (`lib/magicinfo/`)** — typed wrapper around MagicInfo REST v2.0 with token refresh; mockable for local development without VPN
4. **Own PostgreSQL (Drizzle)** — advertisers, contracts, campaigns, revenue, play log cache; entirely separate from MagicInfo's internal PostgreSQL
5. **Play Log Sync (cron)** — daily job exports play statistics from MagicInfo, stores in `play_log_cache` table, feeds advertiser reports
6. **File Storage (Cloudflare R2 or local)** — creative assets upload directly to storage (not through Next.js server), MagicInfo receives the file via its own upload endpoint

**Key patterns to follow:**
- MagicInfo is infrastructure, not a CRM — never store business data inside it
- All 70 screens push content simultaneously will saturate CLC's network — use staged group-based distribution
- Screen status polling every 5 minutes (not real-time) is acceptable for v1; MagicInfo device API supports this

### Critical Pitfalls

1. **MagicInfo license ownership may belong to current provider** — On day one, audit who owns the license keys and who has admin access to MagicInfo Server. If licenses are provider-owned, either negotiate a transfer or budget for new licenses (~€165–446/screen). This gates everything else. Do not sign a commercial agreement with CLC until this is resolved.

2. **CVE-2024-7399: actively exploited RCE on unpatched MagicInfo V9** — Check the exact server version immediately (must be 21.1050+). If below 21.1050, patch before any integration work begins. Hospital networks are prime targets; an unpatched server may already be compromised.

3. **Provider transition can blank all 70 screens simultaneously** — Design a zero-downtime handover plan with a 2-4 week parallel operation period. Pre-load fallback content on local screen storage. Schedule cutover for Sunday 6am minimum. Screens going dark in a clinic waiting room is a clinical environment disruption that will kill the CLC relationship.

4. **Revenue share must be modeled before offering to CLC** — The pitch "you go from paying to receiving money" requires knowing what revenue scenarios actually look like. Commit to a 90-day pilot structure; avoid fixed monthly payment guarantees before any advertiser revenue is proven.

5. **First advertisers are ISAPREs and pharma companies, not national entertainment brands** — TNT Sport and Warner Bros buy at scale via programmatic; a single-clinic 70-screen network doesn't meet their threshold. Healthcare network advertisers are: health insurance companies, pharmaceutical brands (Abbott, Novartis, Roche — they already have reps visiting CLC), and insurance products. Revenue projections must reflect realistic first-year CPM rates.

---

## Implications for Roadmap

Based on research, the project has a clear pre-build phase (commercial/technical validation) and four build phases. The commercial and infrastructure work must complete before a single line of product code is written.

### Phase 0: Commercial Foundation
**Rationale:** Revenue model and legal framework must be locked before technical work begins. Premature commercial commitments are the highest-risk pitfall identified.
**Delivers:** Signed service agreement with CLC (including content policy), modeled revenue scenarios at 3 fill rates, advertiser pipeline with 3+ LOIs
**Addresses:** Advertiser registry requirements, content approval policy, revenue share model
**Avoids:** Pitfall 6 (underselling revenue share), Pitfall 7 (unrealistic advertiser expectations), Chilean regulatory pitfalls (pharmaceutical ISP approvals, food ad zones)

### Phase 1: Technical Audit and Infrastructure Handover
**Rationale:** MagicInfo license ownership, server version, hardware compatibility, and security posture all gate the entire feature roadmap. Nothing else can proceed until these are verified.
**Delivers:** MagicInfo Server on V9 21.1050+, all 70 screens catalogued (model, Tizen version, license tier), admin credentials secured, zero-downtime cutover plan executed
**Addresses:** All technical prerequisites for API integration
**Avoids:** Pitfall 1 (license ownership), Pitfall 2 (CVE-2024-7399), Pitfall 3 (hardware incompatibility), Pitfall 4 (V8 EOL), Pitfall 5 (transition blackout)
**Research flag:** Needs `/gsd:research-phase` — MagicInfo API access patterns, exact endpoint availability for play log export, and token refresh behavior need hands-on verification against the real CLC server.

### Phase 2: Core Platform Build (MagicInfo Integration + Screens Dashboard)
**Rationale:** Architecture research dictates building the MagicInfo API client and database schema first — everything else is downstream of these. The screens dashboard is the first working feature and proves the integration.
**Delivers:** Next.js project scaffolded, MagicInfo typed client (`lib/magicinfo/`), PostgreSQL schema with Location hierarchy, screens dashboard (health status, online/offline grid), content upload + MagicInfo sync
**Uses:** Next.js 15, TypeScript, Drizzle ORM, shadcn/ui, PostgreSQL, next-auth 5.x
**Implements:** Belgrano Panel + API Layer + MagicInfo Client components
**Avoids:** Anti-pattern of exposing MagicInfo credentials to browser; anti-pattern of hardcoding CLC as only location

### Phase 3: Campaign and Advertiser Management
**Rationale:** Business logic layer can be built once screens + content pipeline work. Campaign management is the core DOOH business differentiator over the current provider.
**Delivers:** Advertiser registry (CRM), campaign CRUD (flight dates, target zones, budget/CPM), content approval workflow (pending/approved), schedule builder + MagicInfo schedule push, content expiration automation
**Uses:** react-hook-form + Zod for forms, date-fns for scheduling, Drizzle for campaign queries
**Implements:** Campaign → Schedule → MagicInfo push data flow
**Avoids:** Treating MagicInfo as source of truth for advertiser data; verbal agreements on content policy

### Phase 4: Reporting, Proof-of-Play, and Revenue
**Rationale:** Reporting requires accumulated play log data, so it comes last. But it's the feature that makes advertisers pay — must be ready before the first billing cycle.
**Delivers:** Daily play log sync cron (MagicInfo → `play_log_cache`), Proof of Play reports (plays × timestamp × screen × campaign), impression estimates with CPM calculator, revenue share statement for CLC (monthly), PDF/CSV export, Resend email delivery of reports
**Uses:** Recharts for visualizations, Resend for email, Stripe for invoicing
**Implements:** Play Log Mirror pattern, Campaign Revenue Flow
**Research flag:** The exact MagicInfo Statistics API endpoint for play log export is the most uncertain dependency in the whole system. Verify this in Phase 1 technical audit — if logs aren't accessible via API, a fallback scraping strategy may be needed.

### Phase 5: Operations and Growth Features (v1.x)
**Rationale:** Add after first advertiser payment cycle validates the core model. These features reduce manual operational overhead.
**Delivers:** Automated monthly report generation, advertiser read-only portal, QR code campaign tracking, emergency alert override UI, screen uptime alerting (email/Telegram)
**Addresses:** P2 features from prioritization matrix
**Avoids:** Building these before product-market fit is confirmed with at least one paid advertiser

### Phase Ordering Rationale

- Phase 0 and Phase 1 are non-negotiable prerequisites — commercial and infrastructure blocks are higher risk than any technical challenge
- Phase 2 must precede Phase 3 because campaign scheduling requires a working MagicInfo client and screen registry
- Phase 4 depends on Phase 3 (campaigns must exist before play logs can be attributed to campaigns)
- Phase 5 is deliberately deferred to avoid building operational features that may not be needed if the advertiser model evolves
- Multi-client architecture (Location hierarchy) is designed in Phase 2 but not activated until a second venue — costs near zero upfront, prevents rewrite later

### Research Flags

Phases needing deeper research during planning:
- **Phase 1:** MagicInfo API hands-on verification — token refresh behavior, play log export endpoints, device status polling rate limits, content upload format requirements. Official docs have gaps.
- **Phase 4:** Play log export API availability is the single highest-uncertainty item in the entire project. If MagicInfo's Statistics API doesn't expose logs programmatically, the whole proof-of-play architecture needs a rethink. Validate in Phase 1 before committing to Phase 4 design.

Phases with well-documented patterns (skip research-phase):
- **Phase 2 (Next.js scaffold):** Standard Pato stack — Next.js 15 + Drizzle + shadcn/ui patterns are well-established
- **Phase 3 (Campaign CRUD):** Standard relational data modeling with react-hook-form + Zod — no novel patterns
- **Phase 5 (Cron + email):** Vercel Cron + Resend are well-documented; standard patterns apply

---

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | MagicInfo API is officially documented; Next.js/Drizzle/shadcn stack is well-understood in Pato's ecosystem; version compatibility verified |
| Features | MEDIUM-HIGH | Core platform features verified via multiple DOOH sources; healthcare-specific content rules carry MEDIUM confidence; impression modeling is still an estimate |
| Architecture | MEDIUM | Component boundaries and data flow are well-reasoned; MagicInfo Statistics API availability for play log export is the key unknown; confirmed via official docs that API exists but exact endpoint behavior unverified |
| Pitfalls | MEDIUM-HIGH | Technical pitfalls (CVE, license ownership, hardware compatibility) are HIGH confidence from primary sources; Chilean regulatory specifics (ISP pharma approval, Ley 20.606 in clinic context) are MEDIUM |

**Overall confidence:** MEDIUM

### Gaps to Address

- **MagicInfo play log API:** The Statistics module is documented at a high level but the exact endpoint, response format, and export granularity for play logs need hands-on verification against the real CLC server. This is a Phase 1 deliverable, not something to design around speculatively.
- **Current license tier at CLC:** Whether CLC has MagicInfo Lite or Premium licenses determines which features are available without upgrade. Lite has limited scheduling and API access. Must be verified in the technical audit.
- **MagicInfo Server accessibility from cloud:** If the Belgrano Panel is hosted on Vercel, it needs a network path to the on-prem MagicInfo Server at CLC. VPN or firewall rules must be scoped in Phase 1. If CLC's IT is restrictive, this changes the deployment architecture.
- **Foot traffic data from CLC:** Impression estimates depend on a baseline foot traffic figure (known: ~6,000/day) plus time-of-day distribution. CLC must provide this, or the CPM calculator is an approximation. Get the data formally in Phase 0.
- **Chilean SII invoicing compliance:** Invoices to advertisers must comply with SII boleta/factura requirements. Stripe handles payment but a local e-invoicing provider (Acepta, DTE) may be needed for tax document generation. Validate this requirement before Phase 4.

---

## Sources

### Primary (HIGH confidence)
- [MagicINFO Server 9 Release Notes](https://docs.samsungvx.com/docs/display/MS9/Release+Information) — version 21.1091.1, PostgreSQL 15 support
- [MagicINFO Server 8 Open API Documentation](https://docs.samsungvx.com/docs/display/MSV/Open+API) — ~590 endpoints, authentication, capabilities
- [MagicINFO Insight 9 Documentation](https://docs.samsungvx.com/docs/display/MI9/MagicINFO+Insight) — Proof of Play analytics
- [Samsung CVE-2024-7399](https://www.sixteen-nine.net/2025/05/01/using-magicinfo-server-a-vulnerability-with-maximum-severity-discovered-and-patched/) — CVSS 9.8, pre-auth RCE, actively exploited
- [MagicINFO Server Requirements](https://helpdesk.magicinfoservices.com/server-specifications-/-requirements) — Windows 11 Pro / Server 2019, PostgreSQL 15

### Secondary (MEDIUM confidence)
- [MagicINFO License Pricing](https://www.magicinfoservices.com/magicinfo-licenses) — Lite €165, Premium €446 per device (third-party reseller)
- [OAAA — Proof of Play Measurement Standards](https://oaaa.org/blog-posts/measurement-standards-and-the-current-state-of-proof-of-play-in-dooh/) — DOOH metrics standards
- [Navori — DOOH Operator Software Features](https://navori.com/blog/essential-software-features-for-dooh-operators/) — feature set reference
- [Chambers & Partners — Chile Pharmaceutical Advertising](https://practiceguides.chambers.com/practice-guides/pharmaceutical-advertising-2024/chile) — ISP pre-approval requirements
- [Chile Food Advertising Law (Ley 20.606)](https://en.wikipedia.org/wiki/Food_labelling_and_advertising_law_(Chile)) — octagon seal restrictions

### Tertiary (LOW confidence)
- [Chile DOOH Market Report](https://www.marketreportanalytics.com/reports/chile-ooh-and-dooh-market-91757) — $171.95M market, 4.34% CAGR (market report)
- [Taggify pDOOH Chile](https://www.taggify.net/en) — LATAM programmatic SSP (v3+ consideration only)

---

*Research completed: 2026-03-23*
*Ready for roadmap: yes*
