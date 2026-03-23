# Roadmap: MagicInfo CLC — Digital Signage & DOOH Advertising

## Overview

Belgrano Digital takes over CLC's 70-screen MagicInfo infrastructure and transforms it from a monthly cost into an ad revenue stream. The journey has two prerequisite phases (commercial agreement + technical audit) that must complete before any code is written, followed by four build phases that deliver the Belgrano Panel: screen management, content scheduling, campaign management, and proof-of-play reporting. The commercial and infrastructure work is non-negotiable — no line of product code ships until licenses are clear, the server is patched, and the revenue model is signed.

## Phases

**Phase Numbering:**
- Integer phases (0, 1, 2, ...): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

- [ ] **Phase 0: Commercial Foundation** - Revenue model, content policy, and advertiser pipeline locked before any technical work
- [ ] **Phase 1: Technical Audit & Handover** - MagicInfo server verified, screens catalogued, zero-downtime transition executed
- [ ] **Phase 2: Platform Scaffold & Screen Management** - Next.js panel live with authenticated access and full screen health dashboard
- [ ] **Phase 3: Content & Scheduling** - Content library and time-of-day scheduling operational via MagicInfo API
- [ ] **Phase 4: Advertiser & Campaign Management** - Advertiser CRM, campaign CRUD, and content approval workflow live
- [ ] **Phase 5: Reporting & Revenue** - Proof-of-play logging, advertiser reports, and CLC revenue share statements

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
**Plans**: TBD

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
**Plans**: TBD

### Phase 2: Platform Scaffold & Screen Management
**Goal**: Belgrano operator can see and control all 70 screens through the Belgrano Panel
**Depends on**: Phase 1
**Requirements**: SCRN-01, SCRN-02, SCRN-03
**Success Criteria** (what must be TRUE):
  1. Belgrano operator can log in to the Belgrano Panel and reach the screen dashboard
  2. All 70 screens appear in the dashboard with real-time online/offline status
  3. Belgrano operator can filter and group screens by zone/location
  4. Belgrano operator can trigger a remote restart on an individual screen or an entire screen group
**Plans**: TBD

### Phase 3: Content & Scheduling
**Goal**: Belgrano operator can upload content and control what plays on screens by time of day
**Depends on**: Phase 2
**Requirements**: CONT-01, CONT-02, CONT-03
**Success Criteria** (what must be TRUE):
  1. Belgrano operator can upload MP4, image, and HTML5 files through the panel and confirm they sync to MagicInfo
  2. Belgrano operator can create a playlist, add items to it, and set per-item durations
  3. Belgrano operator can schedule a time block so clinic content and ad content switch automatically by time of day
**Plans**: TBD

### Phase 4: Advertiser & Campaign Management
**Goal**: Belgrano operator can manage advertisers and their campaigns with healthcare brand safety controls
**Depends on**: Phase 3
**Requirements**: ADV-01, ADV-02, ADV-03
**Success Criteria** (what must be TRUE):
  1. Belgrano operator can create an advertiser record with contact information and contract details
  2. Belgrano operator can define a campaign specifying advertiser, flight dates, target zones, and playback frequency
  3. Belgrano operator can review uploaded advertiser content and approve or reject it before it goes live on screens
  4. A campaign with rejected content cannot be scheduled to play on any screen
**Plans**: TBD

### Phase 5: Reporting & Revenue
**Goal**: Belgrano can prove ad delivery to advertisers and generate the monthly CLC revenue share statement
**Depends on**: Phase 4
**Requirements**: RPT-01, RPT-02, RPT-03
**Success Criteria** (what must be TRUE):
  1. The system records proof-of-play entries capturing plays, timestamp, screen ID, and campaign ID
  2. Belgrano operator can export a campaign report for an advertiser as PDF or CSV
  3. The system generates a monthly revenue share statement for CLC showing total ad plays and the resulting CLC payment
  4. Belgrano operator can deliver an advertiser report without manually assembling data from multiple sources

## Progress

**Execution Order:**
Phases execute in numeric order: 0 → 1 → 2 → 3 → 4 → 5

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 0. Commercial Foundation | 0/TBD | Not started | - |
| 1. Technical Audit & Handover | 0/TBD | Not started | - |
| 2. Platform Scaffold & Screen Management | 0/TBD | Not started | - |
| 3. Content & Scheduling | 0/TBD | Not started | - |
| 4. Advertiser & Campaign Management | 0/TBD | Not started | - |
| 5. Reporting & Revenue | 0/TBD | Not started | - |

---
*Roadmap created: 2026-03-23*
*Requirements covered: 19/19*
