---
title: Portfolio v3 UI Refresh
status: draft
created: 2026-06-06
updated: 2026-06-06
---

# PRD: Portfolio v3 UI Refresh

## 0. Document Purpose

This PRD defines three visual enhancements to ThienPhu's personal portfolio site (Next.js 15, React 19, Tailwind 4). Audience: ThienPhu as builder. The PRD scopes the what; implementation details live in the addendum if needed.

## 1. Vision

Give the portfolio a bolder, more memorable visual identity through a rainbow background, per-technology skill icons, and a sticky name/title header. The site stays a single-page scroll — these changes layer visual polish on the existing structure.

## 2. Target User

### 2.1 Jobs To Be Done

- Recruiters and hiring managers scanning the site need to quickly see who ThienPhu is and what technologies they know.
- ThienPhu wants the portfolio to stand out visually and feel modern.

### 2.2 Key User Journeys

- **UJ-1. A recruiter scrolls through the portfolio.**
  A recruiter lands on the page. The rainbow background creates an immediate visual impression. As they scroll past the hero section, a sticky header appears with ThienPhu's name and title, keeping identity visible throughout. In the skills section, per-technology icons (AWS, Docker, Kubernetes, etc.) make the tech stack scannable at a glance without reading text.

## 3. Glossary

- **Rainbow Background** — An animated gradient covering the full page, cycling through hues with a slow color shift. Desaturated/toned down in dark mode.
- **Per-Technology Icon** — A brand-specific icon for each individual technology listed in a skill category (e.g., a Docker icon next to "Docker", an AWS icon next to "AWS").
- **Sticky Header** — A fixed-position bar that appears after scrolling past the hero name/title section, showing name + title with a glass/blur background.

## 4. Features

### 4.1 Rainbow Background

**Description:** An animated, full-page rainbow gradient that slowly shifts colors over time. The gradient covers the entire page behind all content. In dark mode, the rainbow is desaturated and muted to avoid clashing with the dark theme and existing `!important` Zinc overrides. Realizes UJ-1.

**Functional Requirements:**

#### FR-1: Animated gradient rendering

The system renders a full-page animated gradient cycling through rainbow hues behind all page content.

**Consequences (testable):**
- Gradient is visible on the full viewport on initial load.
- Colors shift over time (not static).
- Gradient sits behind all content (z-index layering correct).
- Gradient does not interfere with text readability in either light or dark mode.

#### FR-2: Dark mode adaptation

In dark mode, the gradient is desaturated and/or reduced in opacity so it complements the existing dark Zinc palette.

**Consequences (testable):**
- Dark mode gradient is visually muted compared to light mode.
- Existing `!important` dark mode overrides in `globals.css` remain functional.

**Notes:**
- `[ASSUMPTION: CSS animation or a subtle canvas/CSS gradient is acceptable — no heavy JS animation library needed.]`
- Must not conflict with existing `ThemeProvider` class strategy or `bg-white` / `dark:bg-zinc-950` body classes.

### 4.2 Per-Technology Skill Icons

**Description:** Each technology listed within a skill category (e.g., "AWS, Azure, Firebase" under "Cloud Computing Platforms") displays its corresponding brand icon next to the technology name. Icons are sourced from `react-icons` (specifically `@react-icons/all-files` or the `simple-icons` subset). Realizes UJ-1.

**Functional Requirements:**

#### FR-3: Technology icon display

Each individual technology name within a skill's description renders with a corresponding brand icon inline.

**Consequences (testable):**
- Every technology name in skill descriptions has an icon next to it.
- Technologies without a matching icon in the icon library show a fallback (generic code/gear icon or no icon — `[ASSUMPTION: generic fallback is acceptable]`).
- Icons are appropriately sized and aligned with the text.
- Icons respect dark/light mode coloring.

#### FR-4: Skill data restructuring

Skill description strings (e.g., "AWS, Digital Pacific, Azure, Firebase") are parsed into individual technology entries so icons can be mapped per technology.

**Consequences (testable):**
- Parsing handles comma-separated technology names correctly.
- Trailing periods and whitespace are stripped.
- The existing `SkillCard` component renders the parsed technologies with icons.

**Notes:**
- `[ASSUMPTION: Using react-icons with simple-icons for brand coverage. Adding react-icons as a dependency is acceptable.]`
- The mapping from technology name to icon component will need a lookup object (e.g., `{ aws: SiAws, docker: SiDocker, ... }`).

### 4.3 Sticky Name/Title Header

**Description:** After the user scrolls past the hero name/title section, a sticky header bar appears at the top of the viewport showing ThienPhu's name and title. The header has a glass/blur background effect. It hides when the user scrolls back up to the hero. Realizes UJ-1.

**Functional Requirements:**

#### FR-5: Scroll-triggered sticky header

The system displays a fixed header bar containing the user's name and title when the user scrolls past the hero section.

**Consequences (testable):**
- Header is hidden when the hero name/title section is fully in view.
- Header appears (with animation) when the user scrolls past the hero.
- Header remains visible and fixed at the top during continued scrolling.
- Header retracts (with animation) when the user scrolls back to the hero.

#### FR-6: Glass/blur background

The sticky header uses a backdrop-blur effect with semi-transparent background.

**Consequences (testable):**
- Content behind the header is visible but blurred.
- Header has sufficient contrast for name/title text readability.
- Works in both light and dark mode.

**Notes:**
- `[ASSUMPTION: The sticky header sits below the existing progress bar (z-index ordering).]`
- The existing NavBar (right-side dots, left-side section label) should not be obscured by the sticky header.

## 5. Non-Goals (Explicit)

- Redesigning or restructuring other sections (projects, experience, education, etc.).
- Adding new portfolio sections or pages.
- Changing the existing NavBar component behavior.
- Adding animations beyond the rainbow gradient shift and header show/hide.
- Mobile-specific layout redesign — all three features should work responsively on existing mobile breakpoints.

## 6. MVP Scope

### 6.1 In Scope

- FR-1 through FR-6 as described above.
- Adding `react-icons` dependency.

### 6.2 Out of Scope for MVP

- Custom icon design — using standard simple-icons only.
- Configurable rainbow speed or colors via UI controls.
- Persistent header settings (e.g., user toggle to pin/unpin).

## 7. Success Metrics

- **SM-1:** The portfolio loads with a visible rainbow gradient that animates. Validates FR-1, FR-2.
- **SM-2:** Every technology in the skills sections displays a brand icon. Validates FR-3, FR-4.
- **SM-3:** Scrolling past the hero triggers the sticky name/title header with blur background. Validates FR-5, FR-6.

## 8. Open Questions

1. Are there any specific technologies in the skill lists that should use a non-obvious icon mapping (e.g., "Digital Pacific" → cloud icon)?

## 9. Assumptions Index

- `[ASSUMPTION: CSS animation or a subtle canvas/CSS gradient is acceptable — no heavy JS animation library needed.]` — FR-1
- `[ASSUMPTION: Generic fallback icon is acceptable for technologies without a matching simple-icon.]` — FR-3
- `[ASSUMPTION: Adding react-icons as a dependency is acceptable.]` — FR-4
- `[ASSUMPTION: The sticky header sits below the existing progress bar (z-index ordering).]` — FR-5
