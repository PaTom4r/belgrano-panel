# Requirements: MagicInfo CLC — Milestone v1.1

**Defined:** 2026-03-24
**Core Value:** CLC stops paying for screen maintenance and starts earning revenue through advertisers.

## v1.1 Requirements — Display Module + Heartbeat

Replaces MagicInfo Premium entirely. 27 requirements across 8 categories.

### Display Playback

- [ ] **DISP-01**: Screen loads `/display/[id]` fullscreen with no browser chrome
- [ ] **DISP-02**: Display rotates through assigned playlist items with correct durations
- [ ] **DISP-03**: Display switches content by time-of-day schedule (clinic vs ads)
- [ ] **DISP-04**: Display shows branded fallback screen when no content or no network

### Remote Hardware Control

- [ ] **HW-01**: Admin can send restart command to individual screen or group
- [ ] **HW-02**: Admin can send power on/off command to screen
- [ ] **HW-03**: Display page executes hardware commands received from server

### Heartbeat & Monitoring

- [ ] **BEAT-01**: Display sends heartbeat every 5 minutes (screen ID, status, current content)
- [ ] **BEAT-02**: Admin dashboard shows real-time online/offline based on heartbeats
- [ ] **BEAT-03**: Screen marked offline after 3 missed heartbeats (15 min)

### Web Author & Templates

- [ ] **TMPL-01**: Admin can create multi-zone templates (split screen into regions)
- [ ] **TMPL-02**: Each zone in a template can show different content (video, image, text, HTML, clock, weather)
- [ ] **TMPL-03**: Admin can preview template before deploying to screens
- [ ] **TMPL-04**: Display page renders multi-zone templates with synchronized playback

### Conditional Scheduling

- [ ] **COND-01**: Schedule can have conditions: specific days of week, date ranges, time blocks
- [ ] **COND-02**: Schedule can target specific zones, screens, or screen groups
- [ ] **COND-03**: Higher-priority schedules override lower-priority ones (emergency > campaign > default)

### Smart Playlists

- [ ] **SMART-01**: Playlist supports priority-based item ordering (high priority plays more often)
- [ ] **SMART-02**: Playlist supports frequency caps (advertiser X max 20 plays/day)
- [ ] **SMART-03**: Playlist auto-balances between advertisers based on campaign weight

### Proof-of-Play

- [ ] **PLAY-01**: Display reports each content play (content ID, timestamp, duration, zone) to server
- [ ] **PLAY-02**: Play logs feed into existing reports/proof-of-play pages in real-time

### Screen Registration & Content API

- [ ] **REG-01**: New screen self-registers when loading display URL for first time
- [ ] **REG-02**: Admin can assign registered screen to a zone and configure display name
- [ ] **API-01**: Server returns current playlist for screen based on zone + schedule + conditions
- [ ] **API-02**: Server evaluates smart playlist rules and returns next content item
- [ ] **API-03**: Server pushes schedule updates to connected displays in real-time

## v1.0 Requirements (Previous Milestone — Complete)

All 19 requirements from v1.0 are complete. See MILESTONES.md for details.

## Out of Scope

| Feature | Reason |
|---------|--------|
| Programmatic / real-time bidding | Relationship-based model for now |
| Camera-based audience measurement | Privacy law (Ley 19.628) |
| Advertiser self-service portal | Belgrano manages everything in v1.1 |
| Mobile app | Web panel is sufficient |
| Offline content caching on device | Requires native app — URL Launcher is web-only |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| DISP-01 | Phase 6 | Pending |
| DISP-02 | Phase 6 | Pending |
| DISP-03 | Phase 6 | Pending |
| DISP-04 | Phase 6 | Pending |
| API-01 | Phase 6 | Pending |
| API-02 | Phase 6 | Pending |
| BEAT-01 | Phase 7 | Pending |
| BEAT-02 | Phase 7 | Pending |
| BEAT-03 | Phase 7 | Pending |
| REG-01 | Phase 7 | Pending |
| REG-02 | Phase 7 | Pending |
| HW-01 | Phase 7 | Pending |
| HW-02 | Phase 7 | Pending |
| HW-03 | Phase 7 | Pending |
| TMPL-01 | Phase 8 | Pending |
| TMPL-02 | Phase 8 | Pending |
| TMPL-03 | Phase 8 | Pending |
| TMPL-04 | Phase 8 | Pending |
| COND-01 | Phase 9 | Pending |
| COND-02 | Phase 9 | Pending |
| COND-03 | Phase 9 | Pending |
| SMART-01 | Phase 9 | Pending |
| SMART-02 | Phase 9 | Pending |
| SMART-03 | Phase 9 | Pending |
| PLAY-01 | Phase 10 | Pending |
| PLAY-02 | Phase 10 | Pending |
| API-03 | Phase 10 | Pending |

**Coverage:**
- v1.1 requirements: 27 total
- Mapped to phases: 27
- Unmapped: 0

---
*Requirements defined: 2026-03-24*
*Last updated: 2026-03-24 — traceability mapped to phases 6-10*
