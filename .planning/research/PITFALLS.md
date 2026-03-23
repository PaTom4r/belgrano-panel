# Pitfalls Research

**Domain:** Digital Signage Management + DOOH Advertising Network (Healthcare, Chile)
**Researched:** 2026-03-23
**Confidence:** MEDIUM-HIGH (technical pitfalls HIGH, Chilean regulatory specifics MEDIUM)

---

## Critical Pitfalls

### Pitfall 1: MagicINFO License Ownership is Tied to the Current Provider

**What goes wrong:**
The existing MagicInfo licenses at CLC were almost certainly purchased and registered under the current provider's account, not CLC's. When Belgrano takes over, you may discover you cannot manage those devices — or worse, the current provider can revoke access by "returning" licenses, which deletes all device configurations and requires starting from scratch. Samsung's license system makes the registering entity the controlling party.

**Why it happens:**
New entrants assume hardware ownership (CLC owns the screens) equals software access. It doesn't. MagicINFO licenses are account-bound. The previous provider likely has admin credentials for the MagicINFO Server instance and owns the license keys that activate the 70 screens.

**How to avoid:**
In the very first technical audit, answer these questions before signing anything:
1. Who owns the MagicINFO Server instance — is it on-premises at CLC or hosted by the provider?
2. Who holds the license keys — CLC or the current provider?
3. What is the Server version (V7/V8/V9)?
4. Does CLC have admin access to the MagicINFO web interface?

If licenses are provider-owned, negotiate a license transfer or budget for purchasing new licenses (one per screen, non-refundable). Factor this cost into the proposal before committing to pricing.

**Warning signs:**
- CLC staff have no login to MagicINFO admin panel
- Provider refuses to share server access details "for security reasons"
- Screen firmware shows a provider-branded splash screen on boot

**Phase to address:** Phase 1 (Technical Audit) — before any commercial agreement is signed.

---

### Pitfall 2: MagicINFO Server Has Active Critical Security Vulnerabilities

**What goes wrong:**
MagicINFO 9 Server has a CVE-2024-7399 vulnerability with a CVSS score of 9.8 (maximum severity) — a pre-authentication remote code execution flaw actively exploited in the wild by botnets. A follow-up CVE-2025-4632 was also patched. If the CLC server is running an unpatched version, it is almost certainly already compromised or will be shortly after any public exposure.

**Why it happens:**
Self-hosted MagicINFO requires the operator to manually download and apply patches. The current provider almost certainly hasn't done this — their value is content management, not security operations. Healthcare networks are prime targets because of their IP value and operational criticality.

**How to avoid:**
- Audit the exact MagicINFO Server version on day one (check Settings > Server Management > License Info)
- Immediately patch to version 21.1050 or later if on V9; follow the mandatory sequential upgrade path (V7 → V8 20.1040 → V9 21.1060) if on older versions
- Consider migrating to Samsung's cloud-hosted VXT platform to shift patching responsibility to Samsung (note: VXT may not yet be available in Chile — verify)
- If staying self-hosted, implement a firewall rule restricting MagicINFO web interface access to trusted IP ranges only

**Warning signs:**
- Server is running MagicINFO V9 below version 21.1050
- MagicINFO web interface is accessible from the public internet without VPN
- No documented maintenance/patching history from current provider

**Phase to address:** Phase 1 (Technical Audit) — security posture must be assessed and remediated before Belgrano assumes operational control.

---

### Pitfall 3: MagicINFO Version Compatibility Creates Surprise Hardware Upgrade Costs

**What goes wrong:**
Not all 70 CLC screens may support the MagicINFO version you need. Older Samsung screens run older Tizen OS versions. Samsung VXT (the modern cloud platform) requires Tizen 4.0+ (Samsung Signage S6 series and newer). MagicINFO V9 requires all devices to be on the latest firmware before server upgrade. If screens are older models, they may be incompatible with the features Belgrano is planning to sell advertisers.

**Why it happens:**
The assumption "CLC already has MagicINFO" conflates "screens are on and showing content" with "screens support advanced CMS features." Basic Lite licenses only do upload-and-play. Premium features like conditional scheduling, rules-based content, and hardware control require Premium licenses AND compatible hardware.

**How to avoid:**
- During audit, catalog every screen: model number, Tizen version, current MagicINFO license tier (Lite vs Premium)
- Map which screens are in high-traffic advertiser-facing locations vs. back-of-house
- If screens are old, scope the cost of firmware updates vs. hardware replacement in the proposal
- Don't promise advertisers scheduling features (e.g., "ads only between 8am-8pm") until you've verified the license tier supports it

**Warning signs:**
- Screens showing a simple looping video without any scheduling — typical of Lite licenses
- Mix of screen generations installed at different times
- No documentation of when screens were purchased or what model they are

**Phase to address:** Phase 1 (Technical Audit) — hardware compatibility gates the entire feature roadmap.

---

### Pitfall 4: MagicINFO 8 is End of Life — Belgrano May Inherit a Dead Platform

**What goes wrong:**
Samsung has deprecated MagicINFO 8 and is pushing users toward MagicINFO 9 or VXT. If CLC is running MagicINFO 8, Belgrano inherits a platform with no future bug fixes, no security patches, and an unclear support window. Migrating is not optional — it is when, not if.

**Why it happens:**
The current provider has no incentive to upgrade CLC's infrastructure. If screens work, they keep billing. Belgrano will discover the end-of-life situation only after assuming responsibility.

**How to avoid:**
- Identify the server version in the initial audit
- If on V8: include a migration to V9 (or VXT) as a defined deliverable with timeline in the service contract
- Budget time for the sequential upgrade path: V8 → V9 requires updating to the latest V8 build first (20.1040), then V9 (21.1060)
- Each screen needs its firmware updated before V9 upgrade — with 70 screens, this is a non-trivial operation

**Warning signs:**
- Provider cannot say which MagicINFO version is running
- Server login page shows "MagicINFO 8" branding
- No upgrade has been done since the original installation

**Phase to address:** Phase 1 (Technical Audit) + Phase 2 (Infrastructure Handover).

---

### Pitfall 5: Provider Transition Blackout — Screens Going Blank During Handover

**What goes wrong:**
During provider transition, screens go dark. This happens when: the old provider revokes server access, license keys change, network credentials change, or the content delivery URL changes without screens being reconfigured. A clinic with 70 blank TVs in waiting rooms and corridors is a clinical environment disruption. CLC will blame Belgrano.

**Why it happens:**
Handover plans focus on commercial and contract terms, not operational continuity. Technical migration is underestimated. No one maps "what needs to stay alive during the cut-over?"

**How to avoid:**
- Design a zero-downtime migration plan before touching any live system
- Negotiate a parallel operation period: Belgrano's system runs alongside the old provider for 2-4 weeks before full cutover
- Have fallback content pre-loaded on every screen's local storage (most Samsung signage screens support USB/local fallback)
- Schedule the actual cutover for a low-risk window (e.g., Sunday 6am, not Monday morning)
- Test every screen after cutover before declaring success

**Warning signs:**
- Current provider is being adversarial about transition timing
- No clear documentation of how screens are currently configured
- Cutover is scheduled during a weekday

**Phase to address:** Phase 2 (Infrastructure Handover) — this phase must include a documented rollback plan.

---

### Pitfall 6: Underselling to CLC Then Getting Squeezed on Revenue Share

**What goes wrong:**
Belgrano agrees to a revenue share structure with CLC before knowing what advertising revenue is actually achievable. If the promised share to CLC is too high (e.g., 50%), Belgrano's margin can't cover operations + sales cost + growth. If it's too low, CLC loses interest and may exit the deal.

**Why it happens:**
Urgency to close the deal ("conversations with CLC are active") drives premature commercial commitments. The revenue model gets set before the audience data, advertiser demand, and operational costs are known.

**How to avoid:**
- Establish a 90-day pilot with CLC before locking in a permanent revenue share percentage
- In the proposal, present a tiered model: "If monthly ad revenue is X, CLC receives Y%. If revenue exceeds Z, share increases." This gives CLC upside and protects Belgrano at lower volumes.
- Model the economics before presenting: operational cost (server hosting, content creation, sales effort) must be subtracted from gross revenue before calculating CLC's share
- The pitch to CLC is "you go from paying $2M/month to receiving money" — even a 20% share to CLC is a $2M+ improvement if Belgrano generates any revenue at all

**Warning signs:**
- Committing to specific revenue share percentages before securing any advertiser commitments
- No written modeling of what revenue at various fill rates looks like
- CLC negotiators pushing for a fixed monthly payment guarantee before the network launches

**Phase to address:** Phase 0 (Commercial Proposal) — revenue model must be modeled before it's offered.

---

### Pitfall 7: Advertiser Acquisition is Harder Than Expected for a Single-Location Network

**What goes wrong:**
National advertisers (TNT Sport, Warner Bros) typically buy at scale across multiple locations or through programmatic platforms. A 70-screen single-clinic network has negligible reach compared to what these buyers are used to. They may not be interested, may demand audience measurement you can't yet provide, or may offer CPM rates so low they don't cover operations.

**Why it happens:**
The assumption is that having a screen in front of sick people is valuable by itself. It is — but for a different type of advertiser than national entertainment brands. The most natural advertisers for a clinic are: health insurance companies (isapres), pharmaceutical brands, medical device manufacturers, complementary health services, and local/regional brands. These are relationship-sale advertisers, not programmatic buyers.

**How to avoid:**
- Don't build the sales pitch around TNT Sport/Warner Bros — these are aspirational examples, not first clients
- Build the initial advertiser book with ISAPREs (Isapre providers actively advertise in healthcare settings), pharmaceutical companies (e.g., Abbott, Novartis, Roche — they already have medical rep teams visiting CLC), and insurance products
- Set realistic revenue targets for Year 1 that work even without national entertainment brands
- Consider a sponsorship model for early advertisers: "Be the exclusive advertiser for the CLC cardiology waiting room" is a simpler sell than CPM

**Warning signs:**
- Revenue projections assume national brand CPM rates from day one
- No advertiser pipeline beyond 2-3 "potential" contacts
- Advertiser contracts are verbal or based on handshakes

**Phase to address:** Phase 0 (Commercial Proposal) and Phase 3 (Advertiser Acquisition).

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Keep existing MagicINFO on-prem without auditing version | Faster handover | Inheriting security vulnerabilities (CVE-2024-7399); potential compliance breach at CLC | Never |
| Use MagicINFO Lite licenses to save cost | Lower upfront license spend | No scheduling, no conditional content, advertisers can't get time-of-day targeting | Only if screens are purely informational, never ad-facing |
| Build advertiser reporting in a spreadsheet initially | No dev time required | Manual effort doesn't scale past 5 advertisers; no credibility with agencies | Acceptable in 90-day pilot only |
| Single MagicINFO server instance for all future clients | Simplest architecture | Tenant isolation failure; one client's outage affects all | Never for multi-client production |
| Verbal revenue share agreement with CLC | Faster deal close | No legal protection if CLC demands changes mid-contract | Never |
| Skip proof-of-play logging in v1 | Simpler system | Cannot invoice advertisers credibly; first dispute will expose this | Never if billing advertisers |

---

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| MagicINFO Server → Samsung screens | Assuming port 7001 is open on CLC's hospital network | Verify with CLC's IT that port 7001 (or 7002 SSL) is accessible from screens to server; hospital networks have aggressive firewall policies |
| MagicINFO Server → internet | Exposing admin panel to public internet | Restrict admin access to VPN or IP whitelist; CVE-2024-7399 makes this critical |
| Content delivery → screens | Uploading high-resolution video not pre-encoded for screen specs | Pre-encode all content to H.264/H.265 at screen native resolution; MagicINFO has file format compatibility issues across updates |
| Advertiser content → MagicINFO | Accepting any file format from advertisers | Define a rigid content spec (resolution, duration, format, file size limit) upfront and enforce it before upload |
| Belgrano admin panel → MagicINFO API | Building direct API integration before understanding API stability | MagicINFO API is version-specific and underdocumented; use official SDK patterns, not undocumented endpoints |

---

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| All 70 screens download content simultaneously | Network saturation at CLC; slow content updates | Use MagicINFO's group-based staged distribution; schedule content pushes for off-peak hours | At any significant content update across all screens |
| Storing all content on server with no CDN | Content push takes hours across locations | For multi-location expansion, add a CDN layer; start thinking about this at location 3-4 | 3+ locations, or when content files exceed 50GB total |
| No monitoring on screen uptime | Screens are offline for days before anyone notices | Implement heartbeat monitoring from day 1; MagicINFO has device status dashboards — use them | From day 1 if billing advertisers |
| Single server instance for CLC + future clients | Server overload as clients are added | Design multi-tenant architecture from the start, even if only 1 client on day 1 | Adding 3rd+ client location |

---

## Security Mistakes

| Mistake | Risk | Prevention |
|---------|------|------------|
| Running unpatched MagicINFO Server (below 21.1050) | Remote code execution, botnet infection, data breach in healthcare network | Patch immediately; this is not a "schedule for later" item |
| Storing advertiser contracts and CLC revenue data in the same system as screen management | Data breach exposes commercial terms | Keep business data (contracts, invoices, revenue) separate from the CMS |
| Using default MagicINFO admin credentials | Full system compromise | Change all credentials in first 24 hours of access; audit any credentials the old provider had |
| Displaying patient-adjacent content without content review process | Regulatory/reputational risk at CLC | Implement an approval workflow for all ad content before it goes live on screens in clinical areas |
| No audit log of who changed content | Untraceable errors and disputes | Enable MagicINFO audit logging from day 1; keep logs for 12+ months |

---

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| Building Belgrano admin panel before understanding what operators actually do daily | Tool that doesn't match real workflow, abandoned by team | Shadow the content management workflow for 1 week before writing a line of code |
| Complex scheduling UI for content managers who aren't technical | Operators avoid using the tool; content goes stale | Design for one key task: "put this ad on these screens from this date to this date" — nothing more for v1 |
| No mobile-friendly admin for on-site checks | On-site staff can't verify screen status without a laptop | Ensure admin panel is responsive; operators will check screens from their phone |
| Showing raw MagicINFO data to CLC stakeholders | CLC sees technical noise, loses confidence in the service | Build a simple "screens online today: 68/70, ad revenue this month: $X" summary view for CLC stakeholders |

---

## Chilean/Healthcare Regulatory Pitfalls

### Pharmaceutical Advertising (HIGH relevance for advertisers)

Chile's pharmaceutical advertising is regulated by the Instituto de Salud Pública (ISP). Any pharmaceutical ad must be pre-approved by ISP before broadcast. Displaying a pharmaceutical ad at CLC without ISP pre-approval makes Belgrano, CLC, AND the advertiser liable — the law extends liability to "every person or entity that participates in the diffusion." This is not a technicality: it is an active enforcement area.

**Prevention:** Before accepting any pharmaceutical advertiser, require proof of ISP pre-approval for each creative. Build this into the advertiser onboarding checklist.

### Food Advertising — Ley 20.606 + Ley 20.869

Chile's food labelling and advertising law (Ley 20.606) prohibits marketing of high-calorie/high-sodium/high-sugar foods directed at children under 14. A clinic waiting room may contain children. Displaying ads for foods with octagon seals (snacks, sugary drinks, fast food) in a pediatric or family waiting area creates legal exposure.

**Prevention:** Categorize screens by area (pediatric, adult, general, reception) and apply content restrictions per zone. No food ads with octagon seals in pediatric zones.

### CLC's Own Clinical Brand Guidelines

As a prestigious private clinic, CLC will have implicit (and possibly explicit) standards about what appears on their screens. Ads for competing clinics, controversial health products (supplements, alternative medicine), or graphic medical imagery will damage the relationship with CLC even if they're not legally restricted.

**Prevention:** During the commercial agreement, negotiate and document a Content Policy with CLC — a list of prohibited categories (competitors, controversial health claims, graphic content, etc.). Get it in writing before the first advertiser is sold.

### Outdoor Advertising Law (Ley 21.473 — LOW relevance for indoor)

This law restricts digital screens visible from public roads. Since CLC screens are indoors, it doesn't directly apply. But Belgrano's scale ambition (other locations) may include semi-outdoor or lobby-facing screens. Flag this for future locations.

---

## "Looks Done But Isn't" Checklist

- [ ] **License audit:** "We have access to MagicINFO" — verify you have ADMIN access with license management rights, not just a viewer login
- [ ] **Content is playing:** Screens showing content doesn't mean the CMS is actually managing them — verify devices appear as "connected" in MagicINFO, not just playing local storage fallback
- [ ] **Revenue share model is agreed:** Verbal understanding with CLC is not an agreement — requires a signed service contract with explicit revenue share percentages and payment terms
- [ ] **Advertiser campaign is live:** Advertiser has signed a contract and paid doesn't mean their content is actually playing — require proof-of-play report before invoicing
- [ ] **Security patched:** Upgrading to MagicINFO V9 is not sufficient — verify exact version is 21.1050 or later (CVE-2024-7399 affects all V9 below 21.1050)
- [ ] **Screen uptime monitored:** MagicINFO dashboard shows device status — verify monitoring sends alerts when a device goes offline, not just passive display
- [ ] **CLC content policy agreed:** Belgrano can sell ads in CLC's building doesn't mean CLC has approved what categories of ads can run — get written content policy
- [ ] **Multi-tenant architecture:** Management panel works for CLC doesn't mean it's ready for the second client — verify tenant isolation before onboarding client 2

---

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Discover licenses are provider-owned post-handover | HIGH | Negotiate with provider for license transfer; if refused, purchase new per-screen licenses (price varies, ~$150-400/screen for Premium); reconfigure all 70 screens |
| Server compromised via CVE-2024-7399 | HIGH | Isolate server from network, restore from clean backup (if exists), patch to 21.1050+, reset all credentials, audit logs for data exfiltration |
| Screens go blank during provider transition | MEDIUM | Activate local storage fallback content (USB), restore previous provider access temporarily if negotiable, execute cutover plan from clean state |
| CLC exit due to poor revenue in year 1 | HIGH | Before exit, demonstrate pipeline; offer guaranteed minimum for 6 months to maintain relationship; this is why the commercial model must be validated before commitment |
| Advertiser dispute over proof-of-play | MEDIUM | If no logs exist, this case is lost — offer credit or refund; implement proof-of-play logging immediately |
| MagicINFO V8 EOL forces unplanned migration | MEDIUM | Prioritize upgrade to V9; follow sequential path; test on 2-3 screens before full rollout; schedule during off-hours |

---

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| License ownership unclear | Phase 1: Technical Audit | Admin login confirmed + license keys documented |
| CVE-2024-7399 vulnerability | Phase 1: Technical Audit | Version confirmed as 21.1050+ |
| Hardware compatibility gaps | Phase 1: Technical Audit | All 70 screens catalogued with model, Tizen version, license tier |
| MagicINFO V8 end of life | Phase 1: Technical Audit + Phase 2: Handover | Running V9 21.1050+ confirmed |
| Provider transition blackout | Phase 2: Infrastructure Handover | Zero-downtime cutover plan documented + tested |
| Revenue share premature commitment | Phase 0: Commercial Proposal | Economics modeled at 3 revenue scenarios before signing |
| Advertiser acquisition harder than expected | Phase 0: Proposal + Phase 3: Advertiser Sales | Advertiser pipeline has 3+ signed LOIs before CLC contract signed |
| Pharmaceutical ads without ISP approval | Phase 3: Advertiser Onboarding | Advertiser checklist includes ISP pre-approval requirement |
| Food ads in pediatric zones (Ley 20.606) | Phase 2: Content Policy | Zone map with content restrictions documented and implemented |
| CLC brand/content conflicts | Phase 0-1: Commercial Agreement | Written content policy signed by CLC |
| Proof-of-play missing when billing | Phase 2: Technical Setup | Proof-of-play logging active before first ad campaign launches |
| Multi-tenant failure at scale | Phase 3-4: Platform Build | Architecture review confirms tenant isolation before client 2 |

---

## Sources

- Samsung MagicINFO CVE-2024-7399: [Sixteen:Nine](https://www.sixteen-nine.net/2025/05/01/using-magicinfo-server-a-vulnerability-with-maximum-severity-discovered-and-patched/) | [SecurityWeek](https://www.securityweek.com/improperly-patched-samsung-magicinfo-vulnerability-exploited-by-botnet/) | [Huntress](https://www.huntress.com/blog/rapid-response-samsung-magicinfo9-server-flaw)
- MagicINFO licensing: [MagicINFO Services FAQ](https://www.magicinfoservices.com/faq) | [License plans](https://www.magicinfoservices.com/magicinfo-licenses)
- MagicINFO V9 update procedure: [Samsung Community](https://eu.community.samsung.com/t5/samsung-solutions/update-magicinfo-server-v9-update-procedure-for-v7-v8-and-v9/ta-p/11374265)
- MagicINFO vs VXT comparison: [MagicINFO Services Blog](https://blog.magicinfoservices.com/blog/magicinfo-or-vxt-which-is-better)
- Digital signage provider migration pitfalls: [Crown TV](https://www.crowntv-us.com/blog/why-digital-signage-installs-fail/) | [Navori](https://navori.com/blog/common-digital-signage-mistakes-and-how-to-avoid-them/)
- Digital signage operations at scale: [Screenfluence](https://www.screenfluence.com/implementing-a-digital-signage-network-across-multiple-office-locations/) | [Crown TV multi-location](https://www.crowntv-us.com/blog/multi-location-digital-signage-deployment-guide/)
- Healthcare signage compliance: [Poppulo](https://www.poppulo.com/blog/an-inside-look-at-hospital-signage-standards-and-requirements) | [Scala](https://scala.com/en/resources/blogs/secure-digital-signage-healthcare/)
- Chile pharmaceutical advertising: [Chambers & Partners (archived)](https://practiceguides.chambers.com/practice-guides/pharmaceutical-advertising-2024/chile) | Mondaq Chile pharma ad restrictions
- Chile food advertising law (Ley 20.606 + 20.869): [Wikipedia](https://en.wikipedia.org/wiki/Food_labelling_and_advertising_law_(Chile)) | [Carey Law](https://www.carey.cl/en/law-n-20869-on-foods-products-advertisement/)
- Chile outdoor advertising (Ley 21.473): [Garrigues](https://www.garrigues.com/es_ES/noticia/chile-publica-ley-publicidad-visible-caminos-vias-o-espacios-publicos)
- DOOH advertiser measurement challenges: [Knowledge Nile](https://www.knowledgenile.com/blogs/7-challenges-and-solutions-in-dooh-advertising) | [Confirm.media proof-of-play](https://www.confirm.media/understanding-the-importance-of-digital-signage-proof-of-play/)
- DOOH LATAM market: [Vistar + PRODOOH](https://www.vistarmedia.com/news/prodooh-latin-america)

---
*Pitfalls research for: Digital Signage Management + DOOH Advertising Network (Healthcare, Chile)*
*Researched: 2026-03-23*
