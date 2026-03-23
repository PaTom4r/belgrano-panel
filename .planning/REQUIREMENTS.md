# Requirements: MagicInfo CLC

**Defined:** 2026-03-23
**Core Value:** CLC stops paying for screen maintenance and starts earning revenue from their existing TV infrastructure through advertisers that Belgrano brings in.

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Commercial Foundation

- [ ] **COMM-01**: Revenue share model documented with scenarios at 3 fill rates (25%, 50%, 75%)
- [ ] **COMM-02**: Content policy agreement signed with CLC (categories allowed/blocked, approval process)
- [ ] **COMM-03**: Advertiser pipeline with 3+ potential advertisers contacted (ISAPREs, pharma, insurance)

### Technical Audit & Handover

- [ ] **AUDIT-01**: MagicInfo license ownership verified (current provider vs. CLC)
- [ ] **AUDIT-02**: MagicInfo Server patched to v21.1050+ (CVE-2024-7399 remediated)
- [ ] **AUDIT-03**: All 70 screens catalogued (model, Tizen version, zone, status)
- [ ] **AUDIT-04**: Zero-downtime transition plan executed (parallel operation period)

### Screen Management

- [ ] **SCRN-01**: Belgrano operator can view all 70 screens in centralized dashboard with online/offline status
- [ ] **SCRN-02**: Belgrano operator can group screens by zone/location and apply bulk operations
- [ ] **SCRN-03**: Belgrano operator can remotely restart individual screens or screen groups

### Content & Scheduling

- [ ] **CONT-01**: Belgrano operator can upload content (video MP4, images, HTML5) to MagicInfo via panel
- [ ] **CONT-02**: Belgrano operator can create and manage playlists with per-item duration control
- [ ] **CONT-03**: Belgrano operator can schedule content by time-of-day (clinic content vs. ads)

### Advertiser & Campaign Management

- [ ] **ADV-01**: Belgrano operator can register advertisers with contact info and contract details
- [ ] **ADV-02**: Belgrano operator can define campaigns (advertiser, dates, target screens/zones, frequency)
- [ ] **ADV-03**: Belgrano operator can approve/reject advertiser content before it goes live (healthcare brand safety)

### Reporting & Revenue

- [ ] **RPT-01**: System captures proof-of-play logs (plays × timestamp × screen × campaign)
- [ ] **RPT-02**: Belgrano operator can export advertiser reports as PDF or CSV
- [ ] **RPT-03**: System generates monthly revenue share statement for CLC

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Analytics & Metrics

- **ANLT-01**: Impression estimates with CPM calculator per campaign
- **ANLT-02**: Audience size estimation by time-of-day
- **ANLT-03**: QR code tracking per campaign (offline-to-online conversion)

### Automation & Operations

- **AUTO-01**: Automated monthly report generation and email delivery
- **AUTO-02**: Screen downtime alerting (email/Telegram)
- **AUTO-03**: Emergency alert override via admin panel

### Advertiser Portal

- **PORT-01**: Advertiser read-only portal with login to view their reports
- **PORT-02**: Advertiser self-service content upload (with approval workflow)

### Growth & Scaling

- **GROW-01**: Multi-client architecture activated (second venue onboarding)
- **GROW-02**: Dynamic content templates (weather, date overlays)
- **GROW-03**: Zone-specific audience data and dwell time modeling
- **GROW-04**: Campaign pacing and frequency capping

## Out of Scope

| Feature | Reason |
|---------|--------|
| Programmatic / real-time bidding (RTB) | Massive complexity; relationship-based model is the strategy |
| Camera-based audience measurement | Privacy law (Ley 19.628) + patient sensitivity in healthcare |
| Advertiser self-service ad creation | Agencies produce assets; self-service adds complexity and brand safety risk |
| Social media feed on screens | Uncontrolled content in healthcare = liability |
| Interactive touchscreen features | CLC screens are TVs, not touchscreens |
| Open advertiser marketplace | Removes Belgrano's control and relationship value |
| Mobile app for CLC staff | Web panel is sufficient |
| Hardware replacement | Working with existing Samsung infrastructure |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| COMM-01 | Phase 0 | Pending |
| COMM-02 | Phase 0 | Pending |
| COMM-03 | Phase 0 | Pending |
| AUDIT-01 | Phase 1 | Pending |
| AUDIT-02 | Phase 1 | Pending |
| AUDIT-03 | Phase 1 | Pending |
| AUDIT-04 | Phase 1 | Pending |
| SCRN-01 | Phase 2 | Pending |
| SCRN-02 | Phase 2 | Pending |
| SCRN-03 | Phase 2 | Pending |
| CONT-01 | Phase 3 | Pending |
| CONT-02 | Phase 3 | Pending |
| CONT-03 | Phase 3 | Pending |
| ADV-01 | Phase 4 | Pending |
| ADV-02 | Phase 4 | Pending |
| ADV-03 | Phase 4 | Pending |
| RPT-01 | Phase 5 | Pending |
| RPT-02 | Phase 5 | Pending |
| RPT-03 | Phase 5 | Pending |

**Coverage:**
- v1 requirements: 19 total
- Mapped to phases: 19
- Unmapped: 0

---
*Requirements defined: 2026-03-23*
*Last updated: 2026-03-23 after roadmap creation*
