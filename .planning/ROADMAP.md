# Roadmap: MagicInfo CLC — Digital Signage & DOOH Advertising

## Overview

Belgrano Digital takes over CLC's 70-screen MagicInfo infrastructure and transforms it from a monthly cost into an ad revenue stream. The journey has two prerequisite phases (commercial agreement + technical audit) that must complete before any code is written, followed by four build phases that deliver the Belgrano Panel: screen management, content scheduling, campaign management, and proof-of-play reporting. The commercial and infrastructure work is non-negotiable — no line of product code ships until licenses are clear, the server is patched, and the revenue model is signed.

Milestone v1.1 builds the display engine that replaces MagicInfo entirely. Each TV loads a URL, the web app handles playback, scheduling, templates, monitoring, and proof-of-play.

## Phases

**Phase Numbering:**
- Integer phases (0, 1, 2, ...): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

### Milestone v1.0 — Foundation (Complete)

- [x] **Phase 0: Commercial Foundation** - Revenue model, content policy, and advertiser pipeline locked before any technical work
- [x] **Phase 1: Technical Audit & Handover** - MagicInfo server verified, screens catalogued, zero-downtime transition executed
- [x] **Phase 2: Platform Scaffold & Screen Management** - Next.js panel live with authenticated access and full screen health dashboard
- [x] **Phase 3: Content & Scheduling** - Content library and time-of-day scheduling operational via MagicInfo API
- [x] **Phase 4: Advertiser & Campaign Management** - Advertiser CRM, campaign CRUD, and content approval workflow live
- [x] **Phase 5: Reporting & Revenue** - Proof-of-play logging, advertiser reports, and CLC revenue share statements

### Milestone v1.1 — Display Module + Heartbeat

- [x] **Phase 6: Display Engine + Content API** - Screen renders fullscreen content from web URL with playlist, schedule, and fallback
- [x] **Phase 7: Heartbeat + Registration + Hardware Control** - Screens self-register, send heartbeats, and accept remote commands
- [x] **Phase 8: Template Builder / Web Author** - Admin creates multi-zone layouts that screens render with synchronized playback
- [x] **Phase 9: Conditional Scheduling + Smart Playlists** - Rules-based scheduling and advertiser-balanced playlist logic active
- [x] **Phase 10: Proof-of-Play Integration + Real-Time Updates** - Every content play is logged and schedule changes push live to screens

## Phase Details

### Phase 0: Commercial Foundation
**Goal**: Revenue model and legal framework locked before any technical investment begins
**Depends on**: Nothing (first phase)
**Requirements**: COMM-01, COMM-02, COMM-03
**Success Criteria** (what must be TRUE):
  1. Revenue share scenarios at 25%, 50%, and 75% fill rates are modeled in a document Belgrano can present to CLC
  2. CLC has reviewed and agreed to a written content policy defining allowed/blocked ad categories and the approval process
  3. At least 3 potential advertisers (ISAPREs, pharma, insurance) have been contacted and are in a documented pipeline
  4. Belgrano can answer "how much will CLC earn per month?" with a defensible number based on real fill-rate assumptions
**Plans**: 1 (complete)

### Phase 1: Technical Audit & Handover
**Goal**: MagicInfo infrastructure verified, secured, and under Belgrano's operational control
**Depends on**: Phase 0
**Requirements**: AUDIT-01, AUDIT-02, AUDIT-03, AUDIT-04
**Success Criteria** (what must be TRUE):
  1. MagicInfo license ownership is confirmed in writing — either CLC owns them or a transfer/replacement plan is in place
  2. MagicInfo Server version is confirmed at 21.1050+ (CVE-2024-7399 remediated) and Belgrano has admin credentials
  3. All 70 screens are catalogued with model, Tizen version, zone assignment, and operational status
  4. Belgrano manages content on screens without interrupting the existing CLC playback (parallel operation complete)
  5. MagicInfo API connectivity from Belgrano's cloud environment is verified and network path is documented
**Plans**: 1 (complete)

### Phase 2: Platform Scaffold & Screen Management
**Goal**: Belgrano operator can see and control all 70 screens through the Belgrano Panel
**Depends on**: Phase 1
**Requirements**: SCRN-01, SCRN-02, SCRN-03
**Success Criteria** (what must be TRUE):
  1. Belgrano operator can log in to the Belgrano Panel and reach the screen dashboard
  2. All 70 screens appear in the dashboard with real-time online/offline status
  3. Belgrano operator can filter and group screens by zone/location
  4. Belgrano operator can trigger a remote restart on an individual screen or an entire screen group
**Plans**: 1 (complete)

### Phase 3: Content & Scheduling
**Goal**: Belgrano operator can upload content and control what plays on screens by time of day
**Depends on**: Phase 2
**Requirements**: CONT-01, CONT-02, CONT-03
**Success Criteria** (what must be TRUE):
  1. Belgrano operator can upload MP4, image, and HTML5 files through the panel and confirm they sync to MagicInfo
  2. Belgrano operator can create a playlist, add items to it, and set per-item durations
  3. Belgrano operator can schedule a time block so clinic content and ad content switch automatically by time of day
**Plans**: 1 (complete)

### Phase 4: Advertiser & Campaign Management
**Goal**: Belgrano operator can manage advertisers and their campaigns with healthcare brand safety controls
**Depends on**: Phase 3
**Requirements**: ADV-01, ADV-02, ADV-03
**Success Criteria** (what must be TRUE):
  1. Belgrano operator can create an advertiser record with contact information and contract details
  2. Belgrano operator can define a campaign specifying advertiser, flight dates, target zones, and playback frequency
  3. Belgrano operator can review uploaded advertiser content and approve or reject it before it goes live on screens
  4. A campaign with rejected content cannot be scheduled to play on any screen
**Plans**: 1 (complete)

### Phase 5: Reporting & Revenue
**Goal**: Belgrano can prove ad delivery to advertisers and generate the monthly CLC revenue share statement
**Depends on**: Phase 4
**Requirements**: RPT-01, RPT-02, RPT-03
**Success Criteria** (what must be TRUE):
  1. The system records proof-of-play entries capturing plays, timestamp, screen ID, and campaign ID
  2. Belgrano operator can export a campaign report for an advertiser as PDF or CSV
  3. The system generates a monthly revenue share statement for CLC showing total ad plays and the resulting CLC payment
  4. Belgrano operator can deliver an advertiser report without manually assembling data from multiple sources

### Phase 6: Display Engine + Content API
**Goal**: A TV screen loading `/display/[id]` plays the right content at the right time with zero manual intervention
**Depends on**: Phase 5
**Requirements**: DISP-01, DISP-02, DISP-03, DISP-04, API-01, API-02
**Success Criteria** (what must be TRUE):
  1. A Samsung TV with URL Launcher loads `/display/[id]` and the browser shows fullscreen content with no address bar, tabs, or OS chrome visible
  2. The screen cycles through all items in its assigned playlist, each playing for the duration configured in the admin panel
  3. The screen switches automatically between clinic content and ad content when a scheduled time block boundary is crossed
  4. When the screen loses network or has no content assigned, it shows the Belgrano/CLC branded fallback screen instead of a blank display
  5. The server API returns the correct playlist for a given screen ID, evaluating zone membership, active schedule, and current time
**Plans**: TBD

### Phase 7: Heartbeat + Registration + Hardware Control
**Goal**: Every screen announces itself on first load, stays monitored in real-time, and accepts remote commands
**Depends on**: Phase 6
**Requirements**: BEAT-01, BEAT-02, BEAT-03, REG-01, REG-02, HW-01, HW-02, HW-03
**Success Criteria** (what must be TRUE):
  1. A screen that has never connected before automatically creates a registration record when it first loads its display URL
  2. Admin can find the newly registered screen in the panel, assign it a display name, and assign it to a zone
  3. The admin dashboard shows each screen as online or offline, updating within 1 minute of the screen going down
  4. A screen that misses 3 consecutive heartbeat cycles (15 minutes) is automatically marked offline and flagged
  5. Admin can send restart and power on/off commands to a single screen or a group, and the screen executes the command
**Plans**: TBD

### Phase 8: Template Builder / Web Author
**Goal**: Admin can compose multi-zone screen layouts and deploy them to screens that render every zone in sync
**Depends on**: Phase 6
**Requirements**: TMPL-01, TMPL-02, TMPL-03, TMPL-04
**Success Criteria** (what must be TRUE):
  1. Admin can create a template by defining two or more screen regions (zones) with position and size
  2. Each zone in the template can be configured to show a different content type: video, image, text ticker, HTML embed, live clock, or weather widget
  3. Admin can preview the template in the panel before pushing it to any screen, seeing an accurate representation of the final layout
  4. A screen assigned a multi-zone template renders all zones simultaneously with synchronized playback transitions
**Plans**: TBD

### Phase 9: Conditional Scheduling + Smart Playlists
**Goal**: Content plays based on when, where, and to whom it should be shown — with advertiser caps enforced automatically
**Depends on**: Phase 8
**Requirements**: COND-01, COND-02, COND-03, SMART-01, SMART-02, SMART-03
**Success Criteria** (what must be TRUE):
  1. Admin can create a schedule with conditions for day-of-week, date range, and time block, and content only plays when all conditions match
  2. Admin can target a schedule to specific zones, individual screens, or screen groups — content plays only on the targeted subset
  3. An emergency alert schedule immediately overrides any campaign or default schedule on the affected screens
  4. A high-priority playlist item plays proportionally more often than low-priority items across the same playlist cycle
  5. When an advertiser hits their daily frequency cap, their content stops playing for that day without any manual intervention
  6. Over a full day, advertiser play counts reflect their relative campaign weights automatically
**Plans**: TBD

### Phase 10: Proof-of-Play Integration + Real-Time Updates
**Goal**: Every content play is recorded and auditable, and schedule changes reach screens within seconds
**Depends on**: Phase 9
**Requirements**: PLAY-01, PLAY-02, API-03
**Success Criteria** (what must be TRUE):
  1. Every time a content item completes playback on a screen, a play log entry is recorded with content ID, zone, screen ID, timestamp, and actual duration
  2. Play log entries appear in the existing proof-of-play and reporting pages without requiring a page refresh
  3. When admin publishes a schedule change in the panel, connected screens receive and apply the new schedule within 10 seconds

## Progress

**Execution Order:**
Phases execute in numeric order: 0 → 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9 → 10

### Milestone v1.0 — Foundation

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 0. Commercial Foundation | 1/1 | Complete | 2026-03-23 |
| 1. Technical Audit & Handover | 1/1 | Complete | 2026-03-23 |
| 2. Platform Scaffold & Screen Management | 1/1 | Complete | 2026-03-23 |
| 3. Content & Scheduling | 1/1 | Complete | 2026-03-23 |
| 4. Advertiser & Campaign Management | 1/1 | Complete | 2026-03-23 |
| 5. Reporting & Revenue | 1/1 | Complete | 2026-03-23 |

### Milestone v1.1 — Display Module + Heartbeat

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 6. Display Engine + Content API | 1/1 | Complete | 2026-03-24 |
| 7. Heartbeat + Registration + Hardware Control | 1/1 | Complete | 2026-03-24 |
| 8. Template Builder / Web Author | 1/1 | Complete | 2026-03-24 |
| 9. Conditional Scheduling + Smart Playlists | 1/1 | Complete | 2026-03-24 |
| 10. Proof-of-Play Integration + Real-Time Updates | 1/1 | Complete | 2026-03-24 |

---
*Roadmap created: 2026-03-23*
*Milestone v1.1 phases added: 2026-03-24*
*Requirements covered: 19/19 (v1.0) + 27/27 (v1.1)*
