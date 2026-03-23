# Stack Research

**Domain:** Digital Signage Management + DOOH Advertising Service (Samsung MagicInfo / Healthcare)
**Researched:** 2026-03-23
**Confidence:** MEDIUM — MagicInfo API well-documented via official Samsung docs; DOOH ad-tech stack extrapolated from ecosystem analysis; Chile-specific LATAM data from market reports

---

## Context

This is a **two-layer system**:

1. **Screen Management Layer** — Samsung MagicInfo Server (already installed at CLC) + REST API wrapper for Belgrano's custom dashboard
2. **DOOH Business Layer** — Custom platform for advertiser management, campaign scheduling, proof-of-play reporting, billing, and revenue sharing

Belgrano Digital does NOT need to replace MagicInfo. The goal is to build on top of it.

---

## Recommended Stack

### Layer 1: Samsung MagicInfo (Existing Infrastructure)

| Technology | Version | Purpose | Confidence |
|------------|---------|---------|------------|
| MagicInfo Server 9 | 21.1091.1 (Feb 2026) | Central CMS for 70 Samsung screens at CLC | HIGH — Official Samsung docs |
| MagicInfo Insight 9 | Bundled with Server 9 | Proof of Play analytics and playback reporting | HIGH — Official Samsung docs |
| MagicInfo Open API | v2.0 (~590 endpoints) | REST API for content upload, scheduling, device management | HIGH — docs.samsungvx.com |
| PostgreSQL | 15.x | MagicInfo Server's own database (on-premise) | HIGH — Official install docs |

**MagicInfo API Key Capabilities (verified):**
- Upload, approve, delete content
- Create and deploy content schedules to devices
- Device management: power, display settings, remote control
- Proof of Play log collection → Insight dashboard
- User/group administration
- Authentication via `api_token` header (token-based, expirable, refreshable)

**MagicInfo Server Requirements (on-premise):**
- OS: Windows 11 Professional or Windows Server 2019
- CPU: Dual Core 2.5 GHz+
- RAM: 2GB minimum (4GB+ recommended for 70 screens)
- Storage: 200GB minimum
- DB: PostgreSQL 15 or MS SQL Server 2016+
- Ports: 7001 (HTTP), 7002 (HTTPS), 5432 (PostgreSQL)

**License Model (one-time, non-expiring):**
- MagicInfo Lite: ~€165/device (basic scheduling)
- MagicInfo Premium: ~€446/device (full control, Web Author, templates, smart playlists)
- Samsung Remote Management: ~€65/device (hardware-only control, no CMS)
- CLC likely already has licenses — verify type before adding features

---

### Layer 2: Belgrano Custom Dashboard (Build This)

This is a Next.js admin panel that wraps MagicInfo's API and adds the DOOH business logic that MagicInfo doesn't provide: advertiser management, campaign proposals, billing, and revenue share reporting.

#### Core Framework

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| Next.js | 15.x (App Router) | Full-stack web framework for admin dashboard | Default stack — App Router handles both API routes and UI in one codebase; no need for separate backend |
| TypeScript | 5.x | Language | Type safety critical when wrapping MagicInfo's 590 API endpoints |
| Tailwind CSS | 4.x | Styling | Pato's standard stack; fast iteration on admin UIs |
| PostgreSQL | 16.x | Application database | Stores advertisers, campaigns, bookings, invoices, revenue share — separate from MagicInfo's own DB |
| Drizzle ORM | 0.30+ | Database access | Type-safe, lightweight, no magic — plays well with Next.js App Router; already used in Pato's other projects |

#### Supporting Libraries

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| shadcn/ui | latest | UI component library | Admin dashboards, tables, forms — built on Radix UI, accessible, highly customizable |
| Recharts | 2.x | Charts for analytics | Proof-of-play reports, revenue dashboards — already used in Pato's ecosystem |
| react-hook-form | 7.x | Form management | Advertiser onboarding, campaign creation forms |
| Zod | 3.x | Schema validation | Validate MagicInfo API responses + form inputs — pairs with react-hook-form |
| date-fns | 3.x | Date manipulation | Campaign scheduling (start/end dates, slot calculation) |
| next-auth | 5.x (Auth.js) | Authentication | Secure dashboard access for Belgrano operators |
| Stripe | latest Node SDK | Payment processing | Invoice advertisers; Stripe supports Chile and is easier to integrate than Mercado Pago for B2B |
| node-fetch / undici | built-in Node 18+ | MagicInfo API calls | Wrapping MagicInfo REST calls from Next.js API routes |
| Resend | latest | Transactional email | Invoice delivery, campaign reports to advertisers |

#### Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| npm | Package manager | Consistent with Pato's work projects |
| Biome | Linting + formatting | Faster than ESLint+Prettier, single config file |
| Vercel | Deployment | Zero-config Next.js deploy; low ops overhead for v1 |

---

### Layer 3: Analytics & Reporting

MagicInfo Insight provides basic Proof of Play (PoP) data. For advertiser-facing reporting:

| Technology | Purpose | Confidence |
|------------|---------|------------|
| MagicInfo Insight (native) | Raw PoP logs: playback count, content, device, timestamp | HIGH |
| Custom reporting in Next.js | Transform PoP data into campaign-level reports with Recharts | MEDIUM |
| No third-party analytics tool for v1 | MagicInfo Insight + custom dashboard is sufficient for 70-screen network | MEDIUM |

Note: Advanced audience measurement (AI-based demographic tracking, dwell time cameras) exists as a category (Navori Audience Analytics, ScreenManager AI) but is NOT recommended for v1. The foot traffic number (6,000/day) is known — use it as a static metric in advertiser proposals rather than investing in camera infrastructure upfront.

---

### Layer 4: LATAM / Chile Market Considerations

| Tool/Platform | Role | Notes |
|---------------|------|-------|
| Stripe | B2B advertiser billing | Available in Chile; better for invoicing than Mercado Pago for business clients | MEDIUM |
| Taggify | Future programmatic SSP integration | Argentina-founded pDOOH platform operating in Chile — consider connecting inventory here in Phase 3+ when scaling | LOW confidence (v1 out of scope) |
| Facturación SII | Chilean tax invoicing compliance | All invoices to advertisers must comply with SII boleta/factura requirements — likely need a local e-invoicing provider (e.g., Acepta, DTE) | HIGH importance, MEDIUM confidence |

---

## Installation

```bash
# Create Next.js app
npx create-next-app@latest belgrano-dashboard --typescript --tailwind --app --use-npm

# Core dependencies
npm install drizzle-orm @auth/drizzle-adapter next-auth zod react-hook-form @hookform/resolvers date-fns recharts stripe resend

# shadcn/ui (interactive CLI)
npx shadcn@latest init

# Dev dependencies
npm install -D drizzle-kit @types/node biome

# Database driver (PostgreSQL)
npm install pg @types/pg
```

---

## Alternatives Considered

| Category | Recommended | Alternative | Why Not Alternative |
|----------|-------------|-------------|---------------------|
| CMS/Dashboard | Custom Next.js | Screenly / Navori / Broadsign | These are full signage platforms — replacing MagicInfo, not wrapping it. CLC already has MagicInfo. Switching would require hardware re-configuration across 70 screens |
| CMS/Dashboard | Custom Next.js | DoohClick (SaaS) | Proprietary SaaS, no control over data, poor fit for white-label resale, and likely expensive for a 70-screen network |
| Database | PostgreSQL | SQLite | SQLite is fine for solo dev but advertiser data (campaigns, bookings, invoices) needs concurrent access and proper querying from day one |
| ORM | Drizzle | Prisma | Prisma has higher overhead and slower cold starts in serverless; Drizzle is lighter and already in Pato's ecosystem |
| Payments | Stripe | Mercado Pago | Mercado Pago is better for consumer checkout; Stripe's invoicing and API are better for B2B recurring billing. Healthcare advertisers are businesses, not consumers |
| Analytics | MagicInfo Insight + custom | Third-party DOOH analytics SaaS | Overkill for v1 with a known 70-screen, single-location network |
| Deployment | Vercel | AWS/Railway | Low ops burden for v1; Pato's other projects use Vercel patterns |

---

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| Programmatic DOOH / RTB (OpenRTB, XANDR, etc.) | Real-time bidding requires SSP/DSP infrastructure — massive complexity, out of scope per PROJECT.md | Direct advertiser management via custom dashboard |
| Camera-based audience measurement (Quividi, Videometrix) | Requires hardware installation, consent/GDPR considerations, high cost — overkill for v1 | Use known foot traffic (6,000/day) as static metric in proposals |
| MagicInfo Cloud (Samsung SaaS version) | No API access for custom integration, subscription cost, data outside CLC control | MagicInfo Server on-premise (what CLC has) |
| Broadsign / Navori as replacement | Replacing MagicInfo would require device re-provisioning on all 70 screens — high risk, high cost, unnecessary | Build on top of existing MagicInfo via Open API |
| Advertiser self-service portal (v1) | PROJECT.md explicitly marks this out of scope — Belgrano manages everything manually first | Operator-only dashboard |
| MongoDB / NoSQL | Ad campaign data has relational structure (advertiser → campaigns → slots → screens → play logs) — SQL is the right fit | PostgreSQL |

---

## Stack Patterns by Variant

**If CLC already has MagicInfo Premium licenses:**
- Use MagicInfo Server as-is, connect via Open API v2.0
- Focus build effort entirely on the Belgrano custom dashboard layer

**If CLC only has MagicInfo Lite licenses:**
- Premium upgrade cost ~€446/device × 70 screens = ~€31,220 one-time
- Include this in the cost-vs-savings analysis for the CLC proposal
- Lite has limited API access — verify before committing to API-first architecture

**If MagicInfo Server is NOT running on-premise at CLC (only client apps on TVs):**
- Need to install MagicInfo Server on a dedicated Windows machine at CLC
- This is a prerequisite for any API integration
- Clarify this during technical assessment phase

**If scaling to multiple clinic locations (Phase 3+):**
- Add Taggify SSP integration to expose inventory programmatically
- Consider multi-tenant architecture in the PostgreSQL schema from day one

---

## Version Compatibility

| Package | Compatible With | Notes |
|---------|-----------------|-------|
| Next.js 15.x | Node.js 18.17+ | Use Node 20 LTS |
| Drizzle ORM 0.30+ | PostgreSQL 14/15/16 | Use `pg` driver, not `postgres.js`, for better connection pooling |
| MagicInfo Server 9 | Open API v2.0 | Swagger UI available at `/MagicInfo/restapi/swagger` on the server |
| MagicInfo Insight 9 | MagicInfo Server 9 | Must be same major version; Insight is a separate install |
| next-auth 5.x (Auth.js) | Next.js 15 App Router | v4 is incompatible with App Router — use v5 |

---

## Sources

- [MagicINFO Server 9 Release Notes (21.1091.1)](https://docs.samsungvx.com/docs/display/MS9/Release+Information) — Current version, PostgreSQL 15 support — HIGH confidence
- [MagicINFO Server 8 Open API Documentation](https://docs.samsungvx.com/docs/display/MSV/Open+API) — API v2.0 capabilities, ~590 endpoints — HIGH confidence
- [MagicINFO Insight 9 Documentation](https://docs.samsungvx.com/docs/display/MI9/MagicINFO+Insight) — Proof of Play analytics — HIGH confidence
- [MagicInfo License Pricing](https://www.magicinfoservices.com/magicinfo-licenses) — Lite €165, Premium €446 per device, one-time — MEDIUM confidence (third-party reseller pricing)
- [MagicInfo Server Requirements](https://helpdesk.magicinfoservices.com/server-specifications-/-requirements) — Windows 11 Pro / Server 2019, PostgreSQL 15 — HIGH confidence
- [DoohClick Product Overview](https://doohclick.com/products/) — Ad management workflow reference — MEDIUM confidence
- [Taggify pDOOH Chile](https://www.taggify.net/en) — LATAM programmatic SSP — MEDIUM confidence
- [Chile DOOH Market Report](https://www.marketreportanalytics.com/reports/chile-ooh-and-dooh-market-91757) — $171.95M market, 4.34% CAGR, healthcare segment active — LOW confidence (market report, not primary source)
- [Samsung SSSP/Tizen Developer Docs](https://developer.samsung.com/smarttv/signage) — Custom app capability on Samsung displays — HIGH confidence

---

*Stack research for: Digital Signage Management + DOOH Advertising (magicinfo-clc)*
*Researched: 2026-03-23*
