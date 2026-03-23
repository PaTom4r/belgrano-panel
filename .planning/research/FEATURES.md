# Feature Research

**Domain:** Digital Signage Management + DOOH Advertising Network (Healthcare)
**Researched:** 2026-03-23
**Confidence:** MEDIUM-HIGH — core platform features verified via multiple sources; healthcare-specific nuances and Chile-specific regulations carry MEDIUM confidence

---

## Context

This is not a standard SaaS product. Belgrano Digital operates as a **managed service provider** with three distinct user types:

1. **Belgrano operators** — manage screens, content, advertisers, schedules across all clients
2. **CLC staff** (optional, minimal) — possibly view screen status or submit content requests
3. **Advertisers** (TNT Sport, Warner Bros, etc.) — need proof of delivery and reporting

The feature set must serve all three, but Belgrano operators are the primary user for v1.

---

## Feature Landscape

### Table Stakes (Users Expect These)

Features that any credible digital signage + DOOH operation must have. Missing these signals an amateur operation to advertisers and venue partners.

#### Screen Management

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Centralized screen dashboard | Every serious platform has this; without it, managing 70 screens manually is untenable | LOW | MagicInfo Server already provides this natively; the admin panel wraps it |
| Screen health monitoring (online/offline status) | Operators need to know when a screen goes down immediately | LOW | MagicInfo has built-in monitoring; expose via API or embed in admin panel |
| Remote restart / reboot | Standard remote management capability | LOW | Samsung MagicInfo supports this |
| Screen grouping by location/zone | CLC has multiple buildings/floors; bulk operations require groups | LOW | MagicInfo supports device groups |
| Content push to screen or group | Core functionality — without this, nothing works | LOW | MagicInfo core feature |
| Screen orientation and resolution management | Different screens may have different orientations (portrait/landscape) | LOW | MagicInfo handles this |

#### Content & Playlist Management

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Playlist creation (ordered sequence of content) | Industry standard since 2010; every platform has this | LOW | MagicInfo has drag-and-drop playlist builder |
| Content upload (video, image, HTML) | Without multi-format support, content variety is impossible | LOW | MagicInfo supports MP4, JPG/PNG, HTML5, Office |
| Schedule-based content switching | Play ad A from 9-12, clinic info 12-14, ad B 14-18 | MEDIUM | MagicInfo supports time-based scheduling |
| Loop/duration control per content item | Advertiser A bought 15s slots, advertiser B bought 30s | LOW | Configurable in MagicInfo |
| Content preview before publishing | Operators need to verify before it goes live on 70 screens | LOW | Standard feature in all major platforms |
| Content library / asset management | Reuse assets across campaigns without re-uploading | LOW | MagicInfo has content library |

#### Advertiser-Facing (Proof of Delivery)

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Proof of Play report | **This is what makes advertisers pay.** Shows when, where, how many times their ad ran | MEDIUM | Not native in MagicInfo; needs to be built or extracted from logs |
| Impression count per campaign | Standard DOOH metric; advertisers won't buy without it | MEDIUM | Derived from plays × estimated foot traffic at time of play |
| Campaign date range reporting | Was the ad running during the agreed period? | LOW | Basic date filter on play logs |
| Downloadable report (PDF or CSV) | Advertisers need something to show their boss | LOW | Export functionality on top of the data |

#### Business Operations

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Advertiser contact/account registry | Who is each advertiser, what campaigns do they have | LOW | Simple CRM-like records |
| Campaign definition (advertiser, dates, screens, frequency) | Without this structure, scheduling is chaos | MEDIUM | Links advertisers to their content slots |
| Revenue tracking (what each advertiser owes) | Core business operation | MEDIUM | Track contracted impressions vs. delivered |

---

### Differentiators (Competitive Advantage)

Features the current provider almost certainly does NOT have, and that justify Belgrano's premium and sticky relationships.

#### Analytics That Sell Campaigns

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Audience size by time-of-day | Advertisers can buy prime time (9-11am high traffic) vs. off-peak | HIGH | Requires foot traffic data from CLC or camera-based counting; HIGH confidence this is a deal-maker |
| Zone-specific audience data | Cardiology waiting room vs. main lobby have different demographics | HIGH | Requires CLC cooperation to tag screen locations meaningfully |
| CPM-based pricing calculator | "Your ad ran 12,400 impressions this month at $7.62 CPM = $94.48" — makes ROI tangible | MEDIUM | Formula-driven once you have impression data |
| QR code tracking per campaign | Measure offline-to-online conversion (how many scanned the QR on the ad) | MEDIUM | Generate unique QR per campaign, track scans via redirect |
| Dwell time estimation | How long does the average person sit in front of screen X? | HIGH | Requires either camera sensors or integration with CLC appointment data |

#### Content Quality Features

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Multi-zone layout (split-screen) | Show clinic info in one zone + ad in another simultaneously | MEDIUM | MagicInfo supports multi-channel/frame layouts natively |
| Emergency alert override | All 70 screens instantly show evacuation instructions — rare but critical for hospital compliance | MEDIUM | MagicInfo has priority/interrupt scheduling; needs UI in admin panel |
| Content expiration / auto-remove | Campaign ends Jan 31 — ad disappears automatically without manual action | LOW | MagicInfo scheduling handles this; surface clearly in admin UI |
| Dynamic content (date/time/weather overlays) | "Today is Monday March 23 — 24C in Santiago" makes content feel live | MEDIUM | MagicInfo HTML5 supports dynamic templates |

#### Operational Differentiators

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Advertiser report portal (read-only login) | Advertiser self-serves their proof of play without emailing Belgrano every month | HIGH | Saves Belgrano ops time; makes service feel professional; deferred to v1.x |
| Revenue share dashboard for CLC | CLC sees exactly how much they earned this month from their screens | MEDIUM | High trust-building with venue partner; monthly statement view |
| Content approval workflow | Belgrano approves advertiser content before it goes live (brand safety + legal) | MEDIUM | Especially important in healthcare — no competitor drugs on screen |
| Multi-client architecture | Add Hospital Barros Luco as second client in same panel | MEDIUM | Design from day 1; activate when needed |
| Automated monthly report generation | Every 1st of the month, advertiser reports auto-generate and email — zero manual work | MEDIUM | Scheduled job + email delivery |

---

### Anti-Features (Deliberately NOT Build)

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| Programmatic / real-time bidding | Maximizes revenue per impression via open auction | Massive complexity (SSP, DSP, ad exchange integration); out of scope per PROJECT.md; distracts from relationship-based model | Direct sales with CPM pricing; manual campaign management |
| Advertiser self-service ad creation | Reduces Belgrano workload | Advertisers like TNT Sport have agency-produced assets; self-service tools add complexity and create brand safety risks in healthcare | Belgrano receives assets via email/drive, uploads on their behalf |
| Real-time audience measurement cameras | State-of-the-art audience data | Requires camera hardware installation, privacy compliance (Chilean data protection law 19.628), patient consent in a healthcare setting — legal minefield | Use foot traffic estimates from CLC historical data + time-of-day modeling |
| Social media feed integration on screens | Engaging "live" content | In healthcare: uncontrolled content risks (inappropriate posts), brand liability, distraction from clinical environment | Use curated news tickers or manually approved dynamic content |
| Interactive touchscreen features | Engagement metrics, kiosk functions | CLC screens are TV displays, not touchscreens; major hardware change required | Static/video content optimized for passive viewing |
| Open advertiser marketplace | Self-serve booking, like Google Ads for DOOH | Removes Belgrano's control and relationship value; price race to bottom | Belgrano sources and manages all advertiser relationships directly |

---

## Feature Dependencies

```
[Screen Groups]
    └──requires──> [Screen Registry / Health Monitoring]

[Content Scheduling]
    └──requires──> [Playlist Management]
                       └──requires──> [Content Library / Upload]

[Campaign Management]
    └──requires──> [Advertiser Registry]
    └──requires──> [Content Scheduling]
    └──requires──> [Screen Groups]

[Proof of Play Report]
    └──requires──> [Campaign Management]
    └──requires──> [Play Log capture from MagicInfo]

[Impression Metrics / CPM]
    └──requires──> [Proof of Play Report]
    └──requires──> [Audience / foot traffic baseline data]

[Revenue Share Dashboard for CLC]
    └──requires──> [Campaign Management]
    └──requires──> [Impression Metrics]

[Advertiser Report Portal]
    └──requires──> [Proof of Play Report]
    └──requires──> [User auth (advertiser role)]

[Content Approval Workflow]
    └──enhances──> [Campaign Management]

[Emergency Alert Override]
    └──conflicts──> [Normal scheduling] (intentional — override by design)

[Multi-client Architecture]
    └──enhances──> [Screen Groups] (groups scoped to client)
    └──enhances──> [Advertiser Registry] (advertisers scoped to client)
```

### Dependency Notes

- **Proof of Play requires MagicInfo play log access:** This is the most technically uncertain dependency. MagicInfo Server has logging — but the API access and log format need to be verified in the MagicInfo research phase. If logs aren't accessible via API, a workaround (screen-level log scraping) may be needed.
- **Impression metrics require foot traffic baseline:** Without real camera counting, this is an estimate. CLC can provide daily attendance figures; Belgrano applies a time-of-day distribution model. Flag as LOW confidence until validated with CLC ops data.
- **Multi-client architecture enhances everything:** Designing the data model with `client_id` from day 1 costs near-zero overhead and enables scaling without rewrite.

---

## MVP Definition

### Launch With (v1)

Minimum needed to replace the current provider and sign the first advertiser.

- [ ] Screen dashboard with health status — Belgrano needs to see all 70 screens and know what's running
- [ ] Content upload + playlist management — basic operational capability
- [ ] Schedule-based content switching — clinic content vs. ads by time of day
- [ ] Screen grouping by location — operate zones, not individual screens
- [ ] Advertiser registry + campaign definition — who is running what, when, on which screens
- [ ] Basic Proof of Play report (plays × timestamp × screen) — minimum required for any advertiser payment
- [ ] Content approval workflow (simple flag: approved/pending) — brand safety in healthcare context
- [ ] Revenue share statement for CLC (monthly summary) — critical for the venue partnership pitch

### Add After Validation (v1.x)

Add once first advertiser is signed and first payment cycle completes.

- [ ] Impression estimates with CPM calculator — trigger: first advertiser asks "how many people saw my ad?"
- [ ] QR code tracking — trigger: advertiser wants to measure engagement
- [ ] Automated monthly report generation and email delivery — trigger: manual reporting becomes a bottleneck
- [ ] Advertiser read-only portal — trigger: managing report requests manually exceeds 2-3 hours/month
- [ ] Emergency alert override via admin panel — trigger: CLC requests this for compliance

### Future Consideration (v2+)

Defer until scaling to second client or significant advertiser volume.

- [ ] Multi-client architecture (activated) — trigger: second venue signed
- [ ] Dynamic content templates (weather, date overlays) — trigger: advertiser asks for dynamic creatives
- [ ] Zone-specific audience data / dwell time modeling — trigger: advertiser wants to pay premium for location targeting
- [ ] Full campaign pacing / frequency capping — trigger: multiple advertisers competing for same screens

---

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| Screen health dashboard | HIGH | LOW | P1 |
| Content upload + playlist | HIGH | LOW | P1 |
| Schedule-based switching | HIGH | MEDIUM | P1 |
| Screen grouping | HIGH | LOW | P1 |
| Advertiser registry | HIGH | LOW | P1 |
| Campaign definition | HIGH | MEDIUM | P1 |
| Proof of Play report | HIGH | MEDIUM | P1 |
| Content approval workflow | HIGH | LOW | P1 |
| Revenue share statement for CLC | HIGH | LOW | P1 |
| Impression / CPM metrics | HIGH | MEDIUM | P2 |
| QR tracking | MEDIUM | MEDIUM | P2 |
| Automated monthly reports | MEDIUM | LOW | P2 |
| Advertiser portal (read-only) | MEDIUM | MEDIUM | P2 |
| Emergency alert override | MEDIUM | MEDIUM | P2 |
| Multi-zone split-screen | LOW | LOW | P2 |
| Multi-client architecture | HIGH (future) | LOW (if designed early) | P2 |
| Dynamic content templates | LOW | MEDIUM | P3 |
| Dwell time / audience modeling | MEDIUM | HIGH | P3 |
| Advertiser self-serve portal | LOW | HIGH | P3 |

**Priority key:**
- P1: Must have for v1 launch (replace current provider + sign first advertiser)
- P2: Should have, add in v1.x after first billing cycle
- P3: Future consideration, v2+

---

## Competitor Feature Analysis

The current provider at CLC appears to be a maintenance-only operator — the intel from PROJECT.md is that "the TVs just work, so the service is barely used." This is the baseline to beat.

| Feature | Current CLC Provider | Broadsign / Navori (enterprise) | Belgrano v1 Approach |
|---------|----------------------|--------------------------------|----------------------|
| Screen health monitoring | Unknown / minimal | Full fleet monitoring | Full (via MagicInfo + admin panel) |
| Content scheduling | Basic (likely manual) | Advanced conditional scheduling | Time-based schedules, zone groups |
| Advertiser management | None | Full (SSP, DSP, programmatic) | Direct relationships, manual campaigns |
| Proof of Play reporting | None | Automated, certified | Built from MagicInfo logs |
| Revenue share with venue | No (venue pays them) | Varies | Core model — CLC earns, not pays |
| Multi-client | Unknown | Yes | Architected for it, deferred |
| Healthcare content controls | Unknown | Basic | Content approval workflow |

---

## Healthcare-Specific Considerations

These apply specifically to the CLC context and don't appear in generic digital signage research.

### What to Show (Content Guidelines)
- Pharmaceutical advertising is acceptable in Chilean clinical settings (unlike some countries) — but requires CLC legal sign-off per brand
- Competitor clinic advertising must be blocked — define explicitly in content policy
- Content that might cause patient anxiety (graphic medical procedures, alarming statistics) should be reviewed
- Waiting room content should avoid loud audio — screens at CLC are likely muted or low volume

### Regulatory Context (Chile-specific)
- Chilean data protection law Ley 19.628 governs collection of audience data (face detection, mobile tracking) — this is why camera-based audience measurement is an anti-feature for v1
- Healthcare advertising in Chile is regulated by ISP (Instituto de Salud Pública) for pharmaceutical products — Belgrano should establish a brief approval checklist
- No HIPAA equivalent in Chile, but CLC will have internal patient privacy policies that screen content must not violate

### Patient Experience
- Content approved by CLC clinical staff for waiting rooms (health tips, appointment reminders, clinic services) must coexist with ads without friction
- A content ratio guideline (e.g., 70% clinic content / 30% advertising) may be required by CLC — make this configurable
- Emergency evacuation and codes must be able to override all content instantly

---

## Sources

- [ScreenCloud — Digital Signage Software](https://screencloud.com/)
- [Wallboard — Best Digital Signage Software 2025](https://www.wallboard.us/blog/best-digital-signage-software)
- [Samsung MagicINFO Features Overview](https://displaysolutions.samsung.com/solutions/signage-solution/magicinfo)
- [MagicINFO — Playlist Management Guide](https://blog.magicinfoservices.com/blog/magicinfo-explained-how-to-create-and-manage-playlists)
- [OAAA — Proof of Play Measurement Standards](https://oaaa.org/blog-posts/measurement-standards-and-the-current-state-of-proof-of-play-in-dooh/)
- [Confirm Media — Proof of Play Reporting](https://www.confirm.media/understanding-the-importance-of-proof-of-play-reporting-in-dooh-advertising/)
- [Broadsign — DOOH Metrics](https://broadsign.com/blog/dooh-metrics/)
- [StackAdapt — DOOH Measurement Methods](https://www.stackadapt.com/resources/blog/dooh-measurement-methods-performance-metrics)
- [Vistar Media — DOOH Measurement Solutions](https://www.vistarmedia.com/blog/dooh-measurement-solutions)
- [Poppulo — Healthcare Signage Standards](https://www.poppulo.com/blog/an-inside-look-at-hospital-signage-standards-and-requirements)
- [TelemetryTV — Healthcare Digital Signage](https://www.telemetrytv.com/posts/healthcare-digital-signage-transforming-hospitals/)
- [Scala — Secure Digital Signage Healthcare](https://scala.com/en/resources/blogs/secure-digital-signage-healthcare/)
- [Vistar Media — Digital Signage Advertising Networks](https://www.vistarmedia.com/blog/digital-signage-advertising-network)
- [Navori — Monetize Digital Signage DOOH](https://navori.com/blog/monetize-digital-signage-dooh/)
- [Broadsign acquires Navori](https://www.signageinfo.com/news/7/broadsign-acquires-navori-digital-signage-network/)
- [Terraboost — DOOH Advertising Rates Guide](https://www.terraboost.com/blog/dooh-advertising-rates/)
- [Indoor DOOH — Dolphin Digital](https://dolphin-digital.com/blogs/indoor-dooh-advertising-the-essential-strategy-for-2025-success)

---

*Feature research for: Digital Signage Management + DOOH Advertising Network (Healthcare / CLC)*
*Researched: 2026-03-23*
