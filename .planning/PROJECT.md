# MagicInfo CLC — Digital Signage & DOOH Advertising

## What This Is

A custom digital signage platform by Belgrano Digital for Clínica Los Condes (CLC), replacing both the current provider AND Samsung MagicInfo. The platform manages 70 screens via URL Launcher (no MagicInfo licenses needed), brings advertisers (Warner Bros in negotiation, ISAPREs, pharma), and turns CLC's screens from a cost center into revenue. CLC is the first client — designed to scale to other clinics.

## Core Value

CLC stops paying for screen maintenance and starts earning revenue from their existing TV infrastructure through advertisers that Belgrano brings in.

## Requirements

### Validated

<!-- Shipped and confirmed valuable. -->

(None yet — ship to validate)

## Current Milestone: v1.1 — Display Module + Heartbeat

**Goal:** Build the display engine that replaces MagicInfo entirely. Each TV loads a URL, the web app handles playback, scheduling, templates, monitoring, and proof-of-play. Replicates all MagicInfo Premium features.

**Target features:**
- Display page (fullscreen content playback via URL Launcher)
- Heartbeat monitoring (real-time online/offline)
- Screen registration (self-register on first load)
- Template builder (multi-zone layouts — Web Author replacement)
- Conditional scheduling (rules-based content switching)
- Smart playlists (priority, frequency caps, advertiser balancing)
- Proof-of-play integration (live play logging)
- Remote hardware control (restart, power commands)

### Active

<!-- Current scope. Building toward these. -->

- [ ] Deep understanding of Samsung MagicInfo (Server/Premium) — capabilities, licensing, setup, API
- [ ] Market research on DOOH (Digital Out-of-Home) advertising in healthcare settings
- [ ] Business model definition — pricing for advertisers, revenue share with CLC, Belgrano margins
- [ ] Competitive analysis — what does the current provider actually deliver vs. what's possible
- [ ] Value proposition document — what Belgrano offers that the current provider doesn't
- [ ] Technical assessment — what's needed to take over MagicInfo management (hardware, software, knowledge)
- [ ] Management panel for Belgrano — admin tool for screens, content scheduling, client/advertiser management
- [ ] Commercial proposal for CLC — actionable document to present the service

### Out of Scope

- Mobile app for CLC staff — web panel is sufficient for v1
- Programmatic advertising / real-time bidding — too complex for initial offering
- Hardware replacement — working with CLC's existing Samsung screens and infrastructure
- Advertiser self-service portal — Belgrano manages everything initially

## Context

- **Current situation:** CLC pays $2,000,000 CLP + IVA/month to a company that installed MagicInfo and provides "maintenance" — but the TVs just work, so the service is barely used
- **Infrastructure:** 70 screens across CLC facilities, ~6,000 people/day foot traffic
- **MagicInfo knowledge:** Starting from zero — investigation is the first priority
- **Business stage:** Conversations with CLC already in progress, need to move with urgency
- **Potential advertisers:** TNT Sport, Warner Bros, and others — Belgrano would source and manage these relationships
- **Scale ambition:** CLC is proof of concept, then replicate to other healthcare facilities and locations

## Constraints

- **Knowledge gap**: MagicInfo is new territory — need thorough investigation before committing to technical approach
- **Timeline**: Conversations with CLC are active — research needs to be actionable, not academic
- **Existing infrastructure**: Must work with Samsung screens and MagicInfo already installed at CLC
- **Business model**: Revenue share with CLC — Belgrano's margins must cover operations + growth

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Revenue share model with CLC | CLC transitions from paying $2M/month to earning money — strongest pitch | — Pending |
| Belgrano sources advertisers | Core differentiator vs. current provider who only does maintenance | — Pending |
| Investigation-first approach | MagicInfo knowledge gap + need solid proposal before committing | — Pending |
| Scalable from day one | CLC is first client but architecture/process should support multiple locations | — Pending |

---
*Last updated: 2026-03-23 after initialization*
