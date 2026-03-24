# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-03-24)

**Core value:** CLC stops paying for screen maintenance and starts earning revenue through advertisers.
**Current focus:** Debug display pipeline — content upload → playlist → TV

## Current Position

Phase: Post-milestone v1.1 — Production integration
Status: DB connected, display works partially, upload pipeline has bug
Last activity: 2026-03-24 — DB connected to Supabase, display shows first image but doesn't rotate to new uploads

Progress: v1.0 [██████████] 100% | v1.1 [██████████] 100% | Production [████░░░░░░] 40%

## What Works
- Supabase DB connected (18 tables, RLS enabled, 70 screens seeded)
- Display page shows content from real DB ✓
- First image (New York 4K) displays on AOC TV ✓
- Heartbeat writes to DB ✓
- Play-log writes to DB ✓
- Content upload saves to Supabase Storage ✓
- Auto-add to playlist on upload ✓
- Vercel deploy with env vars configured ✓
- panel.belgrano.cl domain configured (DNS via Cloudflare CNAME)

## Bug to Fix Next Session
**Display not rotating to new images after upload.**

Symptoms:
- First image shows fine
- Transition animation fires (brief fade)
- But new uploaded images don't appear in rotation

Likely causes to investigate:
1. Playlist polling (every 60s) may detect "same playlist" and skip update even when items changed — the comparison uses item IDs, but the poll might not be refetching properly
2. The display page's `advanceToNext` may have a stale closure over the playlist state
3. Content items may have correct DB entry but the thumbnail_url may not be publicly accessible from Supabase Storage
4. Check if the Supabase Storage bucket "content" is truly public (test the URL directly in browser)

Debug steps for next session:
1. Hit `/api/display/dbe3349c-69b1-477c-8a23-6820f143a887/playlist` directly in browser — see what items are returned
2. Check each thumbnail_url is accessible (open in browser)
3. Check browser console on display page for errors
4. Test with `?debug=1` parameter on display page

## Infrastructure
- **GitHub:** github.com/PaTom4r/belgrano-panel (public)
- **Vercel:** belgrano-panel project, production deploy
- **Domain:** panel.belgrano.cl (CNAME → cname.vercel-dns.com via Cloudflare)
- **Supabase:** project jtumriuyllcueywbgcgv (US West 2)
- **DB URL:** postgresql://postgres.jtumriuyllcueywbgcgv:BelgranoPanel2026@aws-0-us-west-2.pooler.supabase.com:5432/postgres
- **Deployment Protection:** Needs to be disabled in Vercel dashboard (Settings → Deployment Protection → Disabled)

## Key Screen IDs for Testing
- `dbe3349c-69b1-477c-8a23-6820f143a887` → CLC-Lobby-Principal-1
- Display URL: `panel.belgrano.cl/display/dbe3349c-69b1-477c-8a23-6820f143a887`

## Accumulated Context

### Decisions
- Revenue share: 70% CLC / 30% Belgrano
- Plans: Starter $5M, Intermedio $7M, Business $10M CLP/mes
- Warner Bros in active negotiation
- Custom solution replaces MagicInfo (URL Launcher, saves ~$33K USD)
- Supabase for DB + Storage
- Vercel for hosting
- Auto-add to playlist on content upload

## Session Continuity

Last session: 2026-03-24
Stopped at: Display pipeline bug — images upload OK but don't appear in TV rotation
Resume: Fix display rotation bug, then test full upload→TV pipeline
