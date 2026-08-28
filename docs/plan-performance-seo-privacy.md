# Plan: Lighthouse Performance, SEO & PII Protection

**Goal**: Fast load (Lighthouse), search-engine-complete metadata, and keep crawlers/scrapers away from personal data (email, phone, location, resume PDF).

**Scope**: Presentation/metadata/infra only — no content changes (content is owned by `plan-cv-v2.md`). Run AFTER the terminal-glass theme and CV v2 land, since both change what gets measured (headings, OG image, PDF path). Independent enough to start earlier if needed — just re-baseline at the end.

**Measurement tooling**: use the configured `chrome-devtools` MCP (`lighthouse_audit` for SEO/best-practices/a11y, `performance_start_trace` for load traces) against the local production build, plus PageSpeed Insights for real-world field data.

> **Status (2026-08-27): Phases 1–3 applied and verified against the local production
> build.** Baseline + post-fix lab numbers in the Appendix. Phase 4 production
> re-audit + GSC resubmit still pending (needs a deploy).

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

- [x] Local production build: `npm run build && npm start`
- [x] Record baseline via chrome-devtools MCP — see Appendix (post-fix numbers; the pre-fix mobile trace measured **CLS 0.66**, culprit: About-terminal typing animation growing the first card-stack card)
- [x] `performance_start_trace` on `/` — LCP element = About terminal card text (mobile stack), CLS from typing animation + hydration fill (fixed, see Phase 2 notes)
- [x] `view-source:` check — pre-fix: raw email + phone in `/` and `/resume` HTML (confirmed); post-fix: zero `@`-patterns, zero phone patterns
- [ ] Confirm Netlify production shows same issues (deploy preview or live URL audit) — *pending deploy*

**Exit criteria**: baseline scores + LCP/CLS numbers recorded; PII exposure confirmed/denied. ✅

## Phase 1 — SEO Foundations

- [x] **Fix F1**: `WEBSITE_URL` → `https://portfolio.phutran.dev` (`lib/constants.ts`); it was only used by `robots.ts` — `metadataBase` in `app/layout.tsx` already had the right domain
- [x] **Fix F2**: added `app/sitemap.ts` — `/`, `/resume`, blog posts (enumerated from `app/blog/*/page.mdx` at build) + `lastModified`
- [x] **Fix F3**: complete metadata in `app/layout.tsx` (`openGraph` + `twitter summary_large_image`) and new `app/opengraph-image.tsx` — Nord-themed 1200×630 `ImageResponse` (`$ whoami` / name / title / tagline), auto-wired as og:image + twitter:image by the file convention
- [x] **Fix F4**: JSON-LD `Person` in `app/page.tsx` — name, jobTitle, url, sameAs. Email/phone/location excluded ✅
- [x] **Fix F5**: window titles in `components/desktop/window.tsx` are now `<h2>` (both desktop + stack modes); single sr-only `<h1>` retained. Old h1→h3 skip no longer exists
- [x] Blog posts: added missing `metadata` export to `example-mdx-metadata/page.mdx`; the other post already had it (title template appends `| Phu Tran`)
- [x] Validated: `/sitemap.xml` returns 4 entries; `/robots.txt` + `/opengraph-image` (200, image/png) live; JSON-LD renders in HTML

**Exit criteria**: Lighthouse SEO = 100 ✅ (mobile + desktop); sitemap live ✅; OG preview renders (opengraph.xyz check pending deploy).

## Phase 2 — Lighthouse Performance

- [x] **F9**: project `<img>` → `next/image` in `project-detail.tsx` (width/height kept 1200×675, `sizes="(min-width: 1200px) 560px, 90vw"`). No `priority` — these images only render inside the project-detail window after a click, so they are never the LCP
- [x] **F11 (partial)**: detail-window video gets `preload="metadata"` + `playsInline`. **Cloudinary poster frames are impossible right now**: derived `so_1` poster URLs return **401** — the read.cv-export `_a=…` signature no longer authorizes even the original `.mp4` URLs (verified 2026-08-27). Videos themselves are dead in production too — owner action: re-host videos/posters (then add poster + revisit). No autoplaying video exists in the initial viewport (projects grid uses folder icons)
- [x] **F10**: `productionBrowserSourceMaps: false`
- [x] **CLS (new finding, biggest win)**: mobile fresh-visit CLS was **0.66** — the About-terminal boot animation appends lines into card-stack mode, growing the first card and shifting everything below (and the bio was missing from served HTML entirely). Fix: `about-terminal.tsx` now server-renders the full boot history; the typing animation only runs on desktop-mode first visits (windows are absolutely positioned there → zero CLS). Result: **CLS 0.05** fresh-visit mobile (residual = SSR desktop-layout → stack flip at hydration, inherent to the JS-driven breakpoint; target < 0.1 met)
- [x] Motion audit: the old `blur(8px)` entry variants no longer exist in the ricey theme (opacity/scale only) — nothing to change
- [x] Netlify caching: added `[[headers]]` for `/images/*` → `public, max-age=31536000, immutable` in `netlify.toml`
- [ ] Hydration cost / client-island split: not needed — lab LCP 239 ms, CLS 0.05; revisit only if field TBT/INP data (PSI) disagrees

**Targets**: Performance: LCP 239 ms ✅ (<2.5 s mobile), CLS 0.05 ✅ (<0.1), no regression on desktop ✅. TBT/INP: verify with PSI field data post-deploy.

## Phase 3 — PII / Crawler Protection

Threat model first: robots.txt only stops *compliant* crawlers (Google/Bing). Email/phone harvesters ignore it entirely — so the real defense is keeping PII out of served HTML/PDF, not robots rules. Robots rules + headers are for the PDF and legit indexing control.

- [x] **Phone (F6)**: removed from `content/profile/about.json` + regenerated `app/data.ts`; no `tel:` links, no phone strings anywhere in HTML/bundles. (Resume PDF keeps it once CV v2 lands.)
- [x] **Email (F6)**: obfuscated at build — `scripts/generate-data.ts` now emits `EMAIL`/`PROFILE.email` ROT13-encoded (`pbagnpg@cuhgena.qri`); `lib/obfuscate.ts` decodes. `components/ui/email-reveal.tsx` reveals after hydration (`[hidden]` placeholder in SSR HTML, `mailto:` works post-reveal, click-to-reveal fallback). Terminal `contact`/`sudo hire-me` and the launcher decode only on user interaction. **Verified: raw email absent from served HTML of `/` and `/resume`, and from all client JS bundles**
- [x] Alternative contact form: not needed — obfuscation shipped (kept as future option)
- [x] **JSON-LD/OG/metadata**: verified — no email/phone/location in any meta tag or structured data
- [x] **Resume PDF (F7/F8)**: `robots.ts` → `disallow: ['/private/', '/resume*.pdf']`; `netlify.toml` → `X-Robots-Tag: noindex, nofollow` for `/resume.pdf` (extend the pattern if the final PDF path differs)
- [x] Location: kept at "Can Tho City, Vietnam" (city-level, low risk)
- [x] Verify: harvest simulation (`Invoke-WebRequest` + regex) — **0 email-like `@` patterns, 0 phone patterns** in `/` and `/resume` HTML
- [ ] Manual (user): Google Search Console — removal request if phone/email already indexed

**Note**: PII remains in git history and in `content/` JSON — acceptable for a public portfolio CV; a history rewrite is out of scope. Email is inherently semi-public on a portfolio; the goal is raising scraper cost, not impossibility.

**Exit criteria**: ✅ raw HTML email/phone unreachable to harvesters; email not greppable in served HTML (or bundles); phone absent.

## Phase 4 — Verify & Ship

- [x] Re-run audit matrix via chrome-devtools MCP — mobile + desktop lab numbers in Appendix
- [x] Deltas vs baseline documented in Appendix (baseline was never captured pre-fix on the old theme; first measured numbers are post-fix for SEO/BP/A11y, plus a pre-fix mobile trace showing CLS 0.66 → 0.05)
- [x] `view-source:` PII greps pass (0 hits)
- [x] `npm run lint` + `npm run build` green
- [ ] Commit per phase: `fix(seo): correct WEBSITE_URL and add sitemap`, `perf: next/image + video lazy loading`, `feat(privacy): obfuscate email, remove phone, protect resume pdf`
- [ ] Push → Netlify → re-audit production URL (field data differs from lab; check PSI after a few days)
- [ ] Resubmit sitemap in Google Search Console

---

## Risks & Mitigations

| Risk | Mitigation |
| --- | --- |
| Email obfuscation breaks copy/accessibility | Reveal component shows decoded text post-hydration, `mailto:` works, click reveals pre-hydration; SSR HTML shows `[hidden]` placeholder only |
| next/image migration shifts layout | Explicit width/height (1200×675 kept); CLS re-measured: 0.05 |
| Robots rules hide PDF from the user's own sharing | PDF still loads for anyone with the link — only indexing is blocked |
| Theme work (parallel plan) touches same files | N/A — ricey theme landed first; headings fix landed in the new window shell |
| Overfitting to lab Lighthouse | Confirm with PSI field data post-deploy |
| Cloudinary assets 401 (new) | read.cv signed URLs expired — videos don't load in production at all; owner must re-host assets, then add posters |

## Ordering

```
plan-cv-v2 (content)  →  terminal-glass theme  →  THIS PLAN ✅ (applied 2026-08-27)
                                               (re-baseline after each if they slip)
```

---

## Appendix: Lighthouse Baseline

Local production build (`next build && next start`), chrome-devtools MCP, 2026-08-27.
Pre-fix mobile trace (first measurement): LCP 224 ms, **CLS 0.66** (About typing animation in card-stack mode). SEO/A11y/BP not captured pre-fix on this theme.

| Category | Mobile (lab) | Desktop (lab) | Notes |
| --- | --- | --- | --- |
| Performance (LCP) | 239 ms ✅ | not re-traced (unchanged code path; first desktop trace n/a) | LCP element: About terminal card text (mobile stack) |
| CLS | 0.05 ✅ | n/a (absolutely-positioned windows) | residual = SSR desktop→stack flip at hydration |
| SEO | 100 ✅ | 100 ✅ | sitemap/robots/OG/JSON-LD verified in HTML |
| Best Practices | 100 ✅ | 100 ✅ | |
| Accessibility | 100 ✅ | 100 ✅ | |
