---
stepsCompleted:
  - step-01-validate-prerequisites
  - step-02-design-epics
  - step-03-create-stories
  - step-04-final-validation
inputDocuments:
  - _bmad-output/planning-artifacts/prds/prd-portfolio-2026-06-06/prd.md
---

# Portfolio - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for Portfolio, decomposing the requirements from the PRD into implementable stories.

## Requirements Inventory

### Functional Requirements

FR-1: Animated gradient rendering — The system renders a full-page animated gradient cycling through rainbow hues behind all page content.
- Gradient is visible on the full viewport on initial load.
- Colors shift over time (not static).
- Gradient sits behind all content (z-index layering correct).
- Gradient does not interfere with text readability in either light or dark mode.

FR-2: Dark mode adaptation — In dark mode, the gradient is desaturated and/or reduced in opacity so it complements the existing dark Zinc palette.
- Dark mode gradient is visually muted compared to light mode.
- Existing `!important` dark mode overrides in `globals.css` remain functional.
- Must not conflict with existing `ThemeProvider` class strategy or `bg-white` / `dark:bg-zinc-950` body classes.

FR-3: Technology icon display — Each individual technology name within a skill's description renders with a corresponding brand icon inline.
- Every technology name in skill descriptions has an icon next to it.
- Technologies without a matching icon in the icon library show a fallback (generic code/gear icon).
- Icons are appropriately sized and aligned with the text.
- Icons respect dark/light mode coloring.

FR-4: Skill data restructuring — Skill description strings (e.g., "AWS, Digital Pacific, Azure, Firebase") are parsed into individual technology entries so icons can be mapped per technology.
- Parsing handles comma-separated technology names correctly.
- Trailing periods and whitespace are stripped.
- The existing `SkillCard` component renders the parsed technologies with icons.

FR-5: Scroll-triggered sticky header — The system displays a fixed header bar containing the user's name and title when the user scrolls past the hero section.
- Header is hidden when the hero name/title section is fully in view.
- Header appears (with animation) when the user scrolls past the hero.
- Header remains visible and fixed at the top during continued scrolling.
- Header retracts (with animation) when the user scrolls back to the hero.

FR-6: Glass/blur background — The sticky header uses a backdrop-blur effect with semi-transparent background.
- Content behind the header is visible but blurred.
- Header has sufficient contrast for name/title text readability.
- Works in both light and dark mode.
- The sticky header sits below the existing progress bar (z-index ordering).
- The existing NavBar should not be obscured by the sticky header.

### NonFunctional Requirements

NFR-1: Performance — Rainbow gradient must use CSS animations (not heavy JS animation libraries) to maintain smooth performance and avoid layout thrashing.

NFR-2: Responsiveness — All three features (rainbow background, skill icons, sticky header) must work responsively on existing mobile breakpoints without dedicated mobile-specific layout redesign.

NFR-3: Theme compatibility — All features must work in both light and dark mode without conflicting with the existing `next-themes` class strategy, `globals.css` `!important` overrides, or body classes.

NFR-4: Dependency management — Adding `react-icons` as a new dependency is acceptable; use simple-icons subset for brand coverage.

NFR-5: No regression — Existing sections (projects, experience, education, etc.), NavBar behavior, and content structure must remain unchanged.

### Additional Requirements

- No Architecture document available — technical implementation decisions deferred to development.
- Skill icon mapping requires a lookup object mapping technology names to `react-icons` icon components (e.g., `{ aws: SiAws, docker: SiDocker, ... }`).
- Skill description strings need parsing logic to split comma-separated values and clean whitespace/punctuation.
- Sticky header must coordinate z-index with existing progress bar (header below progress bar).
- Sticky header must not obscure the existing NavBar (right-side dots, left-side section label).

### UX Design Requirements

_No UX Design document available._

### FR Coverage Map

FR-1: Epic 1 - Animated rainbow gradient rendering
FR-2: Epic 1 - Dark mode gradient adaptation
FR-3: Epic 2 - Per-technology brand icon display
FR-4: Epic 2 - Skill data string parsing and restructuring
FR-5: Epic 3 - Scroll-triggered sticky header
FR-6: Epic 3 - Glass/blur background effect

## Epic List

### Epic 1: Rainbow Background — Bold Visual Identity
Visitors land on a striking animated gradient that sets the portfolio apart immediately. The gradient adapts gracefully to dark mode by desaturating and reducing opacity to complement the existing Zinc palette.
**FRs covered:** FR-1, FR-2

### Epic 2: Per-Technology Skill Icons — Scannable Tech Stack
Recruiters can scan skills at a glance with brand icons next to each technology name. Skill data is restructured from comma-separated strings into individual entries with per-item icon mapping via react-icons (simple-icons subset).
**FRs covered:** FR-3, FR-4

### Epic 3: Sticky Name/Title Header — Persistent Identity
As visitors scroll past the hero section, ThienPhu's name and title remain visible in a glass-effect header bar with backdrop blur. The header animates in/out based on scroll position and coordinates z-index with the existing progress bar and NavBar.
**FRs covered:** FR-5, FR-6

## Epic 1: Rainbow Background — Bold Visual Identity

Visitors land on a striking animated gradient that sets the portfolio apart immediately. The gradient adapts gracefully to dark mode by desaturating and reducing opacity to complement the existing Zinc palette.

### Story 1.1: Animated Rainbow Gradient Background

As a **visitor**,
I want to see an animated rainbow gradient covering the full page,
So that the portfolio makes an immediate visual impression.

**Acceptance Criteria:**

**Given** the portfolio page loads
**When** the page renders
**Then** a full-viewport animated gradient is visible behind all content
**And** colors shift over time (not static)
**And** the gradient sits behind all content (z-index layering correct)
**And** the gradient does not interfere with text readability in light mode
**And** the gradient works responsively on existing mobile breakpoints

### Story 1.2: Dark Mode Gradient Adaptation

As a **visitor using dark mode**,
I want the rainbow gradient to appear muted and desaturated,
So that it complements the dark theme without clashing.

**Acceptance Criteria:**

**Given** the user has dark mode enabled
**When** the rainbow gradient renders
**Then** the gradient is visually muted (desaturated/reduced opacity) compared to light mode
**And** existing `!important` dark mode overrides in `globals.css` remain functional
**And** the gradient does not conflict with `ThemeProvider` class strategy or body classes
**And** text readability is maintained in dark mode with the gradient present

## Epic 2: Per-Technology Skill Icons — Scannable Tech Stack

Recruiters can scan skills at a glance with brand icons next to each technology name. Skill data is restructured from comma-separated strings into individual entries with per-item icon mapping via react-icons (simple-icons subset).

### Story 2.1: Skill Data Parsing and Restructuring

As a **developer**,
I want skill description strings parsed into individual technology entries,
So that each technology can be mapped to its brand icon.

**Acceptance Criteria:**

**Given** skill data contains comma-separated technology strings (e.g., "AWS, Digital Pacific, Azure, Firebase")
**When** the SkillCard component renders
**Then** the string is parsed into individual technology names
**And** trailing periods and whitespace are stripped from each entry
**And** the parsed technologies are passed as structured data for icon rendering

### Story 2.2: Technology Icon Mapping and Display

As a **recruiter**,
I want to see a brand icon next to each technology name in the skills section,
So that I can scan the tech stack at a glance without reading dense text.

**Acceptance Criteria:**

**Given** skill data has been parsed into individual technology entries
**When** the SkillCard renders each technology
**Then** a matching brand icon from `react-icons` (simple-icons) appears inline next to the technology name
**And** technologies without a matching icon display a fallback (generic code/gear icon)
**And** icons are appropriately sized and aligned with the text
**And** icons respect dark/light mode coloring

## Epic 3: Sticky Name/Title Header — Persistent Identity

As visitors scroll past the hero section, ThienPhu's name and title remain visible in a glass-effect header bar with backdrop blur. The header animates in/out based on scroll position and coordinates z-index with the existing progress bar and NavBar.

### Story 3.1: Scroll-Triggered Sticky Header

As a **visitor scrolling through the portfolio**,
I want ThienPhu's name and title to remain visible at the top of the page,
So that I always know whose portfolio I'm viewing.

**Acceptance Criteria:**

**Given** the hero name/title section is fully in view
**When** the page loads
**Then** the sticky header is hidden

**Given** the user has scrolled past the hero section
**When** the hero exits the viewport
**Then** the sticky header appears with an entrance animation
**And** the header remains visible and fixed at the top during continued scrolling

**Given** the user scrolls back up to the hero section
**When** the hero comes back into view
**Then** the header retracts with an exit animation

**And** the sticky header sits below the existing progress bar (z-index ordering)
**And** the existing NavBar (right-side dots, left-side section label) is not obscured
**And** the header works responsively on existing mobile breakpoints

### Story 3.2: Glass/Blur Background Effect

As a **visitor**,
I want the sticky header to have a frosted glass appearance,
So that content behind it is subtly visible without reducing text readability.

**Acceptance Criteria:**

**Given** the sticky header is visible
**When** content scrolls behind it
**Then** the content is visible but blurred (backdrop-blur effect)
**And** the header has a semi-transparent background
**And** name/title text has sufficient contrast for readability
**And** the glass effect works in both light and dark mode
