# Plan: Lighthouse Performance, SEO & PII Protection

**Goal**: Fast load (Lighthouse), search-engine-complete metadata, and keep crawlers/scrapers away from personal data (email, phone, location, resume PDF).

**Scope**: Presentation/metadata/infra only — no content changes (content is owned by `plan-cv-v2.md`). Run AFTER the terminal-glass theme and CV v2 land, since both change what gets measured (headings, OG image, PDF path). Independent enough to start earlier if needed — just re-baseline at the end.

**Measurement tooling**: use the configured `chrome-devtools` MCP (`lighthouse_audit` for SEO/best-practices/a11y, `performance_start_trace` for load traces) against the local production build, plus PageSpeed Insights for real-world field data.

---

## Current-State Findings (audited 2026-08-27)

| # | Finding | Severity | Area |
| --- | --- | --- | --- |
| F1 | `lib/constants.ts` `WEBSITE_URL = 'https://github.com/marshmary'` — wrong domain. `robots.ts` sitemap URL points off-site; canonical/OG URLs at risk wherever this constant is used | **Critical** | SEO |
| F2 | `robots.ts` references `/sitemap.xml` but no `app/sitemap.ts` exists → 404 sitemap | High | SEO |
| F3 | No `openGraph` / `twitter` metadata, no OG image (`public/cover.jpg` exists, unused for OG) | High | SEO |
| F4 | No JSON-LD structured data (Person profile) | Medium | SEO |
| F5 | Heading hierarchy skips a level (h1 name → h3 sections) | Low | SEO |
| F6 | Phone + email rendered in static HTML (`about` section, `mailto:`/`tel:` links) — trivially harvestable by scrapers that ignore robots.txt | **Critical** | PII |
| F7 | `robots.ts` `disallow: '/private/'` is a placeholder; no protection for the future resume PDF | Medium | PII |
| F8 | `netlify.toml` has no custom headers (no `X-Robots-Tag` for documents) | Medium | PII |
| F9 | Project images rendered via raw `<img>` (lazy/eager handled manually) instead of `next/image` — no AVIF/WebP variants, no responsive `sizes` | Medium | Perf |
| F10 | `productionBrowserSourceMaps: true` — ships source maps in production | Low | Perf |
| F11 | Videos (Cloudinary MP4) autoplay on cards for projects without images; MorphingDialog loads video eagerly — needs poster + `preload="none"` audit | Medium | Perf |

---

## Phase 0 — Baseline & Tooling

- [ ] Local production build: `npm run build && npm start`
- [ ] Record baseline via chrome-devtools MCP: `lighthouse_audit` (mobile + desktop) — log Performance / SEO / Best Practices / A11y scores to this file's appendix
- [ ] `performance_start_trace` on `/` — identify LCP element, CLS sources, long tasks
- [ ] `view-source:` check — grep rendered HTML for email/phone strings (baseline PII exposure proof)
- [ ] Confirm Netlify production shows same issues (deploy preview or live URL audit)

**Exit criteria**: baseline scores + LCP/CLS numbers recorded; PII exposure confirmed/denied.

## Phase 1 — SEO Foundations

- [ ] **Fix F1**: `WEBSITE_URL` → `https://portfolio.phutran.dev` (verify against `metadataBase` in `app/layout.tsx`); grep for other uses of the constant
- [ ] **Fix F2**: add `app/sitemap.ts` — static routes (`/`, blog posts) + lastModified
- [ ] **Fix F3**: complete metadata in `app/layout.tsx`:
  - `openGraph` (type, url, siteName, title, description, images: 1200×630)
  - `twitter` (summary_large_image)
  - Generate a proper OG image: terminal-themed 1200×630 (matches DESIGN.md aesthetic); stopgap: use `cover.jpg` if dimensions work
- [ ] **Fix F4**: JSON-LD `Person` schema — `name`, `jobTitle`, `url`, `sameAs` (social links). **Exclude email/phone/location** (PII rule from Phase 3 applies to structured data too)
- [ ] **Fix F5**: sections h3 → h2 in `app/page.tsx` (and blog if needed); keep single h1
- [ ] Blog posts: ensure per-post titles/descriptions flow from MDX frontmatter into metadata
- [ ] Validate: `/sitemap.xml` returns entries; Rich Results Test passes for Person schema

**Exit criteria**: Lighthouse SEO = 100; sitemap live; OG preview renders correctly (opengraph.xyz).

## Phase 2 — Lighthouse Performance

Ordered by expected impact; re-measure after each item, drop items that don't move the score.

- [ ] **F9**: migrate project `<img>` → `next/image` with `sizes`, `priority` on the first (LCP candidate), `quality` tuned; keep manual lazy/eager logic via `priority` prop
- [ ] **F11**: videos — add Cloudinary-derived poster frames (`so_1` transform), `preload="none"` on dialog videos, load video only when MorphingDialog opens; ensure zero autoplaying video in the initial viewport
- [ ] **F10**: `productionBrowserSourceMaps: false` (re-enable locally when debugging)
- [ ] Audit motion costs: entry animations use blur filters (`VARIANTS_SECTION` has `filter: 'blur(8px)'`) — blur animations are paint-heavy; consider transform/opacity-only variant on mobile
- [ ] Check hydration cost: page is one large client component — if TBT/INP fails, split static sections from interactive islands (last resort, measure first)
- [ ] Netlify caching: verify `_next/static/*` serves `immutable` (plugin default); add `[[headers]]` for `/images/*` with `Cache-Control: public, max-age=31536000, immutable` (filenames are stable) — only if audit shows cache misses
- [ ] Iterate: `performance_start_trace` until targets hit

**Targets**: Performance ≥ 90 (mobile), LCP < 2.5s (mobile), CLS < 0.1, TBT < 200ms; no regression on desktop.

## Phase 3 — PII / Crawler Protection

Threat model first: robots.txt only stops *compliant* crawlers (Google/Bing). Email/phone harvesters ignore it entirely — so the real defense is keeping PII out of served HTML/PDF, not robots rules. Robots rules + headers are for the PDF and legit indexing control.

- [ ] **Phone (F6)**: remove from the rendered page entirely — keep it in the resume PDF only. Drop `phone` from `about.json` (or stop rendering it); `tel:` link goes away. This is the single highest-value fix
- [ ] **Email (F6)**: obfuscate in served HTML — encode at build (`rot13`/char-codes like Cloudflare email protection), decode on click/hover via client JS; `mailto:` still works, copy-to-clipboard fallback. No raw `contact@…` string anywhere in initial HTML
- [ ] Alternative (decide in review): replace email display with a Netlify Forms contact form — removes PII entirely; keep as option, obfuscation is lighter
- [ ] **JSON-LD/OG/metadata**: confirm no email/phone/location leaks into any meta tags (Phase 1 built this in — verify)
- [ ] **Resume PDF (F7/F8)**: once `plan-cv-v2.md` adds the PDF:
  - `robots.ts`: `disallow: ['/private/', '/resume*.pdf']`
  - `netlify.toml` `[[headers]]`: `X-Robots-Tag: noindex, nofollow` for `/resume*.pdf`
  - Optionally serve PDF via noindex route instead of `public/`
- [ ] Location: keep "Can Tho City, Vietnam" (city-level, low risk) — revisit only if user objects
- [ ] Verify: `view-source:` on `/` contains neither email nor phone; harvest simulation (`curl` the page, grep for `@` + digit patterns)
- [ ] Manual (user): Google Search Console — removal request if phone/email already indexed

**Note**: PII remains in git history and in `content/` JSON — acceptable for a public portfolio CV; a history rewrite is out of scope. Email is inherently semi-public on a portfolio; the goal is raising scraper cost, not impossibility.

**Exit criteria**: raw HTML/PDF unreachable to compliant crawlers; email not greppable in served HTML; phone absent.

## Phase 4 — Verify & Ship

- [ ] Re-run full audit matrix via chrome-devtools MCP: mobile + desktop, all four Lighthouse categories
- [ ] Compare against Phase 0 baseline in appendix — document deltas
- [ ] `view-source:` PII greps pass
- [ ] `npm run lint` + `npm run build` green
- [ ] Commit per phase: `fix(seo): correct WEBSITE_URL and add sitemap`, `perf: next/image + video lazy loading`, `feat(privacy): obfuscate email, remove phone, protect resume pdf`
- [ ] Push → Netlify → re-audit production URL (field data differs from lab; check PSI after a few days)
- [ ] Resubmit sitemap in Google Search Console

---

## Risks & Mitigations

| Risk | Mitigation |
| --- | --- |
| Email obfuscation breaks copy/accessibility | Keep visible (decoded) text for humans, encode only in HTML source; test with JS disabled |
| next/image migration shifts layout | Explicit width/height (1200×675 already set); CLS re-checked in trace |
| Robots rules hide PDF from the user's own sharing | PDF still loads for anyone with the link — only indexing is blocked |
| Theme work (parallel plan) touches same files | Sequence after theme merge; conflicts limited to page.tsx/section headings |
| Overfitting to lab Lighthouse | Confirm with PSI field data post-deploy |

## Ordering

```
plan-cv-v2 (content)  →  terminal-glass theme  →  THIS PLAN
                                              (re-baseline after each if they slip)
```

---

## Appendix: Lighthouse Baseline

(Fill from Phase 0)

| Category | Mobile (lab) | Desktop (lab) | Notes |
| --- | --- | --- | --- |
| Performance | | | LCP element: |
| SEO | | | |
| Best Practices | | | |
| Accessibility | | | |
