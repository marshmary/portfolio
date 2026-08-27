# Plan: CV Content Migration to v2

**Goal**: Move the current CV (portfolio content) to a newer version — updated experience, skills, certifications, projects, and profile — while keeping the existing JSON → `generate-data.ts` → `app/data.ts` pipeline intact and rollback-safe.

**Scope**: Content + schema only. No visual redesign (that is covered separately in `plan-terminal-glass-theme.md`).

**Recommended order**: Do this plan BEFORE the theme plan. Content first, presentation second — avoids merging conflicts between the two efforts.

---

## Current State (v1)

| Content area | Files | Notes |
| --- | --- | --- |
| Profile | `content/profile/about.json`, `social.json` | Name, title, tagline, contact |
| Experience | `content/experience/*.json` (3 jobs + 1 education) | Sorted by `order` |
| Education | Mixed into `experience/` (detected via `school` field) | Consider splitting in v2 |
| Skills | `content/skills/devops.json`, `development.json` | Grouped, proficiency levels |
| Projects | `content/projects/*.json` (4) | Rich fields (metrics, features, challenges) |
| Certifications | `content/certifications/*.json` | Optional directory |
| Schema | `content/schema/types.ts` (Zod) | Source of truth for validation |
| Output | `app/data.ts` (auto-generated) | Never edit directly |

**Work in progress warning**: `app/data.ts`, `app/globals.css`, `app/layout.tsx` are modified and `components/ui/rainbow-gradient.tsx` is untracked. Phase 0 cleans this up with exact commands — cleanup happens there, then the plan stays focused on the CV upgrade only.

---

## Phase 0 — Baseline, WIP Cleanup & Safety Net

Goal: start the CV upgrade from a clean tree. Deal with the existing WIP now, then focus purely on content — no mixing of cleanup and CV changes in the same commits.

- [ ] Handle current unstaged WIP (audited 2026-08-27):
  - Commit the rainbow gradient feature as one commit — `components/ui/rainbow-gradient.tsx` + `app/globals.css` + `app/layout.tsx`: `feat: add animated rainbow gradient backdrop`
  - Restore `app/data.ts` — verified content-identical to HEAD (only regeneration timestamp + lost Prettier formatting): `git checkout -- app/data.ts`
  - Restore `package-lock.json` (only `"dev": true` flag churn from a reinstall, no dependency changes): `git checkout -- package-lock.json`
  - Commit intentional untracked artifacts: `AGENTS.md`, `CLAUDE.md`, `_bmad/`, `_bmad-output/`, `docs/plan-*.md`, `opencode.json` → `chore: add agent config, bmad setup, and planning docs`
- [ ] Verify `git status` is clean before touching any content
- [ ] Tag the current content state for rollback: `git tag cv-v1-content`
- [ ] Run `npm run build` to confirm a green baseline
- [ ] Snapshot current CV data: rely on the git tag, or copy `content/` → `content-backup-v1/` (local only, gitignored)

**Exit criteria**: clean working tree, green build, v1 recoverable. From here on, all commits are CV-upgrade commits only.

## Phase 1 — Content Audit & v2 Definition

- [ ] Inventory what changed since v1 (per file):
  - New job / role change / end dates that became past ("Present" handling)
  - New certifications earned, expiring ones (add `expirationDate` usage)
  - New projects worth showing; demote/remove outdated ones (`order`, `featured`)
  - Skill shifts: new tools, updated proficiency levels, skills to retire
  - Profile text refresh: `about`, `tagline`, `title` (e.g., seniority change)
  - Social links: fix the known LinkedIn placeholder URL
- [ ] Write a short change list in this file's appendix as you go (source of truth for what v2 means)
- [ ] Decide new fields needed by the UI (candidates):
  - `highlights: string[]` on profile (key selling points)
  - `current: boolean` on work experience (replaces string parsing of `end`)
  - `location` / `remote` on experience
  - `resumeUrl` is already in the schema — decide the v2 resume PDF location now
- [ ] Decide whether to split education out of `experience/` into `content/education/` (cleaner, but requires `generate-data.ts` changes — see Phase 2)

**Exit criteria**: written change list + approved field additions.

## Phase 2 — Schema Evolution (backward compatible)

- [ ] Update Zod schemas in `content/schema/types.ts`:
  - New fields MUST be optional with sensible defaults (`.optional()`) so old JSON still validates
  - If splitting education: add `EducationSchema` detection removal — instead read from a dedicated directory
- [ ] If education split is approved, update `scripts/generate-data.ts`:
  - Read `content/education/` directly instead of filtering `experience/` by `data.school`
  - Keep the `school`-filter fallback for one release if you want a soft migration
- [ ] Update the generated type block inside `scripts/generate-data.ts` (the template string) to match new fields
- [ ] Run `npm run generate-data` with OLD content — must still pass (backward compat check)

**Exit criteria**: schema accepts v1 content unchanged; new fields available for v2.

## Phase 3 — Content Migration (the actual CV update)

- [ ] `content/profile/about.json` — v2 profile text, title, tagline, `resumeUrl`
- [ ] `content/profile/social.json` — fix/verify links, set `order`
- [ ] `content/experience/` — update existing entries, add the new job file (e.g. `newco.json` with `order: 0`), renumber `order` fields so newest = lowest
- [ ] Education — move to `content/education/` if approved (or leave, if not)
- [ ] `content/skills/` — add/remove/re-level skills; keep groups balanced
- [ ] `content/projects/` — add new projects, update stale ones, adjust `order`/`featured`
- [ ] `content/certifications/` — add new certs with `credentialUrl`, `issueDate`, `skills`
- [ ] Run `npm run generate-data` after each file group — fix validation errors immediately (fail fast)

**Exit criteria**: `npm run generate-data` green; all v2 changes present in `app/data.ts`.

## Phase 4 — Resume PDF (optional but recommended)

- [ ] Produce the v2 resume PDF (ATS-friendly, from the same content where possible)
- [ ] Place at `public/resume-phu-tran-v2.pdf` (or versioned: `resume-2026-08.pdf`)
- [ ] Set `resumeUrl` in `about.json` to `/resume-phu-tran-v2.pdf`
- [ ] Longer term idea (backlog): generate the PDF from the same JSON via script so CV site + PDF never drift

**Exit criteria**: downloadable CV linked from the site.

## Phase 5 — UI Touchpoints for New Fields

Only if Phase 1 added fields the UI should render:

- [ ] Surface new fields in the relevant components (`experience-card.tsx`, `project-card.tsx`, `page.tsx` sections)
- [ ] Keep rendering defensive: `field && ...` so missing data degrades gracefully

**Exit criteria**: new content visible on the site.

## Phase 6 — Verify & Ship

- [ ] `npm run lint` + `npm run build` green
- [ ] Manual pass on dev server: every section, both light/dark modes, mobile viewport
- [ ] Verify section anchors still work (`#about`, `#work`, `#skills`, `#education`, `#certifications`, `#projects`, `#contact`)
- [ ] Commit as `feat: cv content v2` (content + schema + generated data in one commit)
- [ ] Push → Netlify auto-deploy → smoke test production
- [ ] Tag `cv-v2-content`

**Exit criteria**: v2 live in production, tagged.

---

## Risks & Mitigations

| Risk | Mitigation |
| --- | --- |
| Validation blocks build on bad JSON | Run `generate-data` per file group; Zod errors name the exact file/field |
| Education split breaks generator | Keep `school`-filter fallback for one release |
| Generated `app/data.ts` accidentally hand-edited | Regenerate before every build (dev/build scripts already do this) |
| Content typos shipped | Manual pass in Phase 6; content is plain JSON — hotfix is trivial |

## Rollback

`git revert` the v2 commit, or `git checkout cv-v1-content -- content/ && npm run generate-data`.

---

## Appendix: v2 Change List

(Fill in during Phase 1)

- Profile:
- Experience:
- Education:
- Skills:
- Projects:
- Certifications:
- Resume:
