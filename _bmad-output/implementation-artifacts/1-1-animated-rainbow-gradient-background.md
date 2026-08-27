# Story 1.1: Animated Rainbow Gradient Background

Status: done

## Story

As a **visitor**,
I want to see an animated rainbow gradient covering the full page,
So that the portfolio makes an immediate visual impression.

## Acceptance Criteria

1. **Full-viewport gradient** — A full-page animated gradient is visible behind all content on initial load.
2. **Animated color shift** — Colors shift continuously over time (not static).
3. **Correct z-layering** — Gradient sits behind all content without obscuring text, images, or interactive elements.
4. **Light mode readability** — Gradient does not interfere with text readability in light mode.
5. **Responsive** — Gradient works on existing mobile breakpoints without layout issues.
6. **Performance** — Uses CSS animations (not heavy JS) to maintain smooth rendering.

## Tasks / Subtasks

- [x] Create the `RainbowGradient` component (AC: #1, #2, #3)
  - [x] Create `components/ui/rainbow-gradient.tsx` as a `'use client'` component
  - [x] Use `fixed inset-0 -z-10` positioning to sit behind all content
  - [x] Implement CSS `@keyframes` for the color shift animation (background-position or hue-rotate)
  - [x] Use inline styles for the gradient container to avoid `!important` dark mode overrides in globals.css
  - [x] Add `pointer-events-none` so it doesn't block clicks
- [x] Add CSS keyframes to `globals.css` (AC: #2, #6)
  - [x] Define `@keyframes gradient-shift` (or similar) after the existing `@layer base` block
  - [x] Use `background-size` larger than viewport + `background-position` animation for smooth hue cycling
- [x] Integrate into `app/layout.tsx` (AC: #1, #3)
  - [x] Place `<RainbowGradient />` as first child inside ThemeProvider, before the flex container div (layout.tsx:62)
  - [x] Keep body `bg-white dark:bg-zinc-950` classes — the gradient is `fixed` with negative z-index, so it renders behind the body background. The body bg must be changed to `transparent` (or a semi-transparent white) for the gradient to show through
  - [x] Change body className from `bg-white dark:bg-zinc-950` to a transparent/semi-transparent approach, OR make the gradient overlay the body bg directly
- [x] Handle light mode readability (AC: #4)
  - [x] Set gradient opacity low enough (start with `opacity: 0.15-0.25`) that text remains readable
  - [x] Test against all text colors: `text-black`, `text-zinc-600`, `text-zinc-500`
- [x] Test responsive behavior (AC: #5)
  - [x] Verify gradient covers full viewport on mobile (320px+) and desktop
  - [x] Confirm no horizontal scroll or layout shift introduced
- [x] Visual QA in browser
  - [x] Light mode: gradient subtle but visible, text fully readable
  - [x] Content cards (bg-white, bg-zinc-100) properly overlay the gradient
  - [x] Nav bar (z-50) unaffected
  - [x] Mobile breakpoints work

## Dev Notes

### Architecture & Constraints

**CRITICAL — Dark mode `!important` overrides (globals.css:60-77):** The project has aggressive `!important` overrides that force `bg-zinc-*` and `bg-white` classes to monochromatic colors in dark mode. The gradient container MUST use inline styles or custom CSS properties — NOT Tailwind bg utilities — or these overrides will destroy the gradient effect.

**CRITICAL — Never remove `!important` overrides in globals.css:** Per project rules, these dark mode overrides must remain untouched.

**CRITICAL — Tailwind CSS 4:** No `tailwind.config.js` exists. Configuration is done via `@theme` blocks and `@layer` in `globals.css`. Do NOT create a tailwind.config file.

### Where to Insert the Component

**File:** `app/layout.tsx`
**Location:** Inside ThemeProvider, as the first child before the flex container (line 62):

```
<ThemeProvider ...>
  <RainbowGradient />
  <div className="flex min-h-screen w-full flex-col ...">
    ...
  </div>
</ThemeProvider>
```

### Body Background Strategy

The body currently has `bg-white dark:bg-zinc-950` (layout.tsx:54). The gradient uses `fixed inset-0 -z-10`, which places it behind the normal flow. Since the body has an opaque background, the gradient won't be visible unless:

**Recommended approach:** Make the body background semi-transparent or transparent, and rely on the gradient + content card backgrounds for the visual layering. Options:

1. **Simplest:** Remove `bg-white dark:bg-zinc-950` from body, set the outer flex div (layout.tsx:62) to `relative` and give it a semi-transparent background. The gradient shows through behind content.
2. **Alternative:** Keep body opaque, place the gradient as a `fixed` overlay with a BLEND MODE (`mix-blend-mode: overlay` or `soft-light`) so it tints the existing background without needing transparency.

Option 2 is safer — it avoids changing the body background and won't cascade into unexpected visual regressions.

### CSS Animation Approach

Use a pure CSS `@keyframes` animation (NOT `motion/react`). Reasons:
- Continuous infinite animation — no state triggers needed
- Runs on compositor thread — better performance
- No JS overhead for a pure visual effect
- Consistent with the PRD requirement for CSS-based animation

**Implementation pattern:**

```css
@keyframes gradient-shift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
```

Use a `linear-gradient` with multiple color stops spanning the rainbow spectrum, a large `background-size` (e.g., `300% 300%`), and `animation: gradient-shift 15s ease infinite`.

### Z-Index Reference

| Layer | Z-Index | Component |
|-------|---------|-----------|
| Gradient | `-z-10` | New RainbowGradient |
| Content | default (0) | All page content |
| AnimatedBackground | `z-10` | Card highlights |
| NavBar | `z-50` | Navigation dots, labels |
| Modal | `z-50` | MorphingDialog |

No existing component uses negative z-index, so `-z-10` is safe and won't conflict.

### Files to Create/Modify

| File | Action | Notes |
|------|--------|-------|
| `components/ui/rainbow-gradient.tsx` | CREATE | New client component |
| `app/globals.css` | UPDATE | Add `@keyframes` animation after `@layer base` block (after line 133) |
| `app/layout.tsx` | UPDATE | Import and place `<RainbowGradient />` inside ThemeProvider |

### Content Cards Overlay Context

Many content sections have semi-transparent or opaque backgrounds that will naturally sit above the gradient:
- Skills/Work cards: `bg-zinc-100 dark:bg-zinc-900/80` via `AnimatedBackground`
- Education/Cert cards: `bg-zinc-300/30` wrapper, `bg-white dark:bg-zinc-950` inner
- Project cards: `bg-zinc-50/40` with `ring-1 ring-zinc-200/50`

These cards will partially or fully occlude the gradient, which is correct — the gradient should be most visible in the margins and between sections.

### Performance Notes

- CSS `background-position` animation on a `fixed` element is GPU-composited — excellent performance.
- Do NOT use `hue-rotate` filter animation as it triggers paint on every frame.
- `will-change: background-position` can be added but is usually unnecessary for composited animations.

### Project Structure Notes

- Component goes in `components/ui/` per project convention (reusable UI primitive).
- Use named export (not default) per project rules.
- Use `cn()` from `@/lib/utils` if conditional classes are needed.
- Import path must use `@/` alias, not relative paths.

### References

- [Source: app/layout.tsx — root layout structure, body classes, ThemeProvider placement]
- [Source: app/globals.css:2 — @custom-variant dark strategy]
- [Source: app/globals.css:60-77 — !important dark mode overrides that must be avoided]
- [Source: app/globals.css:18-34 — @theme block for custom properties]
- [Source: components/ui/animated-background.tsx — existing animation pattern reference]
- [Source: components/ui/nav-bar.tsx — z-50 navigation elements]
- [Source: _bmad-output/planning-artifacts/epics.md — Story 1.1 acceptance criteria]

## Dev Agent Record

### Agent Model Used

glm-5-turbo

### Debug Log References

None.

### Completion Notes List

- Created `components/ui/rainbow-gradient.tsx` as a `'use client'` component using inline styles for the gradient (avoids `!important` dark mode overrides).
- Rainbow gradient uses 7 color stops (red, yellow, cyan, pink, blue, purple, back to red) at 135deg with `background-size: 300% 300%`.
- Opacity set to 0.2 for subtle effect that doesn't interfere with text readability.
- Added `@keyframes gradient-shift` to `globals.css` after the `@layer base` block (line 133), before the `:root` block -- 15s ease infinite background-position animation.
- Modified `app/layout.tsx`: removed `bg-white dark:bg-zinc-950` from body, added `RainbowGradient` as first child of ThemeProvider, and changed outer flex div to `relative bg-white/80 dark:bg-zinc-950/80` for semi-transparent layering.
- The `bg-white/80` and `dark:bg-zinc-950/80` classes use slash-opacity variants which generate different class names (`bg-white\/80`) than the plain `bg-white` / `bg-zinc-950` targeted by the `!important` overrides, so they won't be affected.
- Pure CSS animation approach (no JS/React animation) for optimal performance -- runs on compositor thread.

### File List

- `components/ui/rainbow-gradient.tsx` (CREATED)
- `app/globals.css` (MODIFIED -- added @keyframes gradient-shift)
- `app/layout.tsx` (MODIFIED -- added RainbowGradient import and component, adjusted body and div backgrounds)

### Review Follow-ups (AI)

- [x] [Review][Patch] Add `prefers-reduced-motion` media query to disable gradient animation [app/globals.css:135]
- [x] [Review][Patch] Restore `bg-white` on body tag for light mode background [app/layout.tsx:55]
- [x] [Review][Defer] Dark mode CSS `filter` on animated element causes continuous paint in dark mode — pre-existing perf concern for low-end mobile, requires significant refactor to pre-multiply gradient colors
- [x] [Review][Defer] MorphingDialog backdrop `bg-white/40` may show rainbow tint — pre-existing dialog component, not introduced by this diff
- [x] [Review][Defer] Blog layout top bar may show rainbow tint via `backdrop-blur-xl` — pre-existing blog layout, not introduced by this diff
- [x] [Review][Defer] `themeColor` meta tag hardcoded to `#ffffff` — pre-existing issue, not introduced by this diff

## Change Log

- 2026-06-06: Code review — 2 patch items (prefers-reduced-motion, body background), 4 deferred (pre-existing issues), 3 dismissed as noise
- 2026-06-06: Implemented Story 1.1 -- created RainbowGradient component, added CSS keyframes animation, integrated into root layout with semi-transparent background layering.
