# Story 3.2: Glass/Blur Background Effect

Status: ready-for-dev

## Story

As a **visitor**,
I want the sticky header to have a frosted glass appearance,
So that content behind it is subtly visible without reducing text readability.

## Acceptance Criteria

1. **Backdrop blur** — Given the sticky header is visible, when content scrolls behind it, then the content is visible but blurred (backdrop-blur effect).
2. **Semi-transparent background** — The header has a semi-transparent background that allows the blurred content to show through.
3. **Text contrast** — Name/title text has sufficient contrast for readability against the semi-transparent background in both light and dark modes.
4. **Dark mode support** — The glass effect works in both light and dark mode, maintaining the frosted appearance in each theme.

## Prerequisite

**Story 3.1 (Scroll-Triggered Sticky Header)** must be completed first. This story adds a visual enhancement to the existing sticky header component created in Story 3.1. The glass effect is applied to the component that Story 3.1 produces.

## Tasks / Subtasks

- [ ] Add backdrop blur to the sticky header component (AC: #1)
  - [ ] Add Tailwind class `backdrop-blur-md` (or `backdrop-blur-lg`) to the sticky header's outer container
  - [ ] Verify the blur effect is visible when content scrolls behind the header
  - [ ] Note: `backdrop-blur-*` classes are safe to use — the `!important` overrides in globals.css only target `background-color`, NOT `backdrop-filter`, so these Tailwind utilities will not be overridden
- [ ] Add semi-transparent background with inline styles (AC: #2, #4)
  - [ ] Use `useTheme()` from `next-themes` to detect the current theme
  - [ ] Apply inline `style` to set `backgroundColor` conditionally:
    - Light mode: `rgba(255, 255, 255, 0.7)` (white with 70% opacity)
    - Dark mode: `rgba(26, 26, 26, 0.7)` (#1a1a1a with 70% opacity — matches the project's dark background `--color-dark-background`)
  - [ ] Do NOT use Tailwind `bg-white/70` or `bg-zinc-950/70` — these will be destroyed by `!important` overrides in dark mode
- [ ] Ensure text readability (AC: #3)
  - [ ] Verify the header text (name/title) maintains sufficient contrast in light mode (dark text on frosted white)
  - [ ] Verify the header text maintains sufficient contrast in dark mode (light/white text on frosted dark)
  - [ ] If needed, add a subtle `border-b` or bottom shadow for extra visual separation between the header and content below
- [ ] Add subtle bottom border for depth (optional enhancement)
  - [ ] Consider adding `border-b border-white/20 dark:border-white/10` using inline styles for the border color (to avoid `!important` override issues)
  - [ ] Or use a subtle `box-shadow` via inline style for a clean edge
- [ ] Visual QA in browser
  - [ ] Light mode: frosted glass look, content behind header is blurred, text readable
  - [ ] Dark mode: frosted glass look with dark monochromatic tint, content behind header is blurred, text readable
  - [ ] Scroll through multiple sections to verify the blur effect looks consistent
  - [ ] Check that the header still animates in/out correctly (Story 3.1 behavior preserved)
  - [ ] Verify z-index ordering: progress bar (z-50) > sticky header (below progress bar) > content > NavBar (z-50, positioned at right/left sides, should not overlap)

## Dev Notes

### CRITICAL WARNING: `!important` Dark Mode Overrides

The project has aggressive `!important` overrides in `app/globals.css` (lines 60-77) that force Tailwind background classes to opaque monochromatic colors in dark mode:

```css
/* These will destroy any transparency in dark mode: */
.dark .bg-white       { background-color: #1a1a1a !important; }
.dark .bg-zinc-950    { background-color: #1a1a1a !important; }
.dark .bg-zinc-900    { background-color: #1a1a1a !important; }
```

**If you use `bg-white/70`, `bg-zinc-950/70`, or any Tailwind bg utility with alpha, the `!important` rule will override it to `#1a1a1a` (fully opaque) in dark mode. The glass effect will completely break.**

### Bypass Strategy: Inline Styles

Use the same approach documented in Story 1.1: bypass `!important` overrides by using inline `style` attributes, which have higher specificity than `!important` class rules.

**Recommended implementation pattern:**

```tsx
'use client'

import { useTheme } from 'next-themes'

export function StickyHeader() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <motion.header
      className="fixed top-1 inset-x-0 z-40 backdrop-blur-md" // z-40 sits below progress bar z-50
      style={{
        backgroundColor: isDark
          ? 'rgba(26, 26, 26, 0.7)'   // #1a1a1a at 70% — matches --color-dark-background
          : 'rgba(255, 255, 255, 0.7)', // white at 70%
      }}
    >
      {/* name/title content */}
    </motion.header>
  )
}
```

**Why this works:**
- Inline `style` has higher specificity than `.dark .bg-white { ... !important }` — the inline style wins
- `backdrop-blur-md` is safe because the `!important` rules only override `background-color`, NOT `backdrop-filter`
- The rgba values align with the project's color palette: light mode uses `#ffffff` (standard white), dark mode uses `#1a1a1a` (the project's `--color-dark-background`)

### Why Not CSS Custom Properties?

You could define a CSS variable and set it conditionally, but inline styles are simpler for a single-component effect and match the established pattern from Story 1.1. If you prefer CSS variables, define them in globals.css:

```css
:root {
  --glass-bg: rgba(255, 255, 255, 0.7);
}
.dark {
  --glass-bg: rgba(26, 26, 26, 0.7);
}
```

Then use `style={{ backgroundColor: 'var(--glass-bg)' }}`. Both approaches work; inline is more explicit.

### Backdrop Blur Class Safety

The `!important` overrides in globals.css target these CSS properties only:
- `background-color` (lines 60-77)
- `color` (lines 80-96)
- `border-color` (lines 99-107)
- CSS gradient custom properties (lines 110-132)

They do NOT touch `backdrop-filter` or `-webkit-backdrop-filter`. Therefore, Tailwind's `backdrop-blur-sm`, `backdrop-blur-md`, `backdrop-blur-lg`, and `backdrop-blur-xl` classes are all safe to use without any bypass.

### Text Contrast Guidelines

For the glass effect header:

| Mode | Background | Text Color | Contrast |
|------|-----------|------------|----------|
| Light | `rgba(255, 255, 255, 0.7)` over blurred content | `text-zinc-900` or `text-black` (#18181b) | High contrast — dark text on near-white frosted bg |
| Dark | `rgba(26, 26, 26, 0.7)` over blurred content | `text-white` or `text-zinc-100` (#ffffff) | High contrast — white text on near-dark frosted bg |

If the Story 3.1 header already has text color classes, verify they provide sufficient contrast. If not, adjust to the values above.

### Z-Index Ordering

The existing z-index layers in the project:

| Layer | Z-Index | Component | Notes |
|-------|---------|-----------|-------|
| Progress bar | `z-50` | NavBar progress bar (nav-bar.tsx:177) | Top-most horizontal bar |
| NavBar dots/labels | `z-50` | NavBar (nav-bar.tsx:61, 106) | Right-side dots, left-side label |
| Mobile menu toggle | `z-50` | NavBar (nav-bar.tsx:114) | Hamburger button |
| **Sticky header** | **`z-40`** | **This component** | **Below progress bar, above content** |
| Content | default (0) | Page sections | |

The sticky header should use `z-40` so it sits below the progress bar (`z-50`) but above page content. The NavBar dots are positioned at `top-1/2` (vertically centered on screen) so they should not overlap with the sticky header at the top.

### Optional Enhancements

- **Bottom border/shadow:** Add a subtle bottom edge for visual separation:
  ```tsx
  style={{
    backgroundColor: isDark ? 'rgba(26, 26, 26, 0.7)' : 'rgba(255, 255, 255, 0.7)',
    borderBottom: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.05)',
  }}
  ```
  Note: Do NOT use Tailwind `border-b border-zinc-200` because border color classes are also overridden by `!important` rules in dark mode. Use inline styles for the border.

- **Transition on theme change:** The inline style will update immediately when the theme changes. If you want a smooth transition, add `transition-colors duration-300` to the className (this transitions the backdrop-blur context smoothly).

### Files to Modify

| File | Action | Notes |
|------|--------|-------|
| Sticky header component (created in Story 3.1) | MODIFY | Add `backdrop-blur-md` class, inline `backgroundColor` style, and `useTheme()` hook. The exact file path depends on where Story 3.1 places the component (likely `components/ui/sticky-header.tsx` or similar) |

No new files need to be created for this story. It is purely a visual enhancement to the existing sticky header.

### Theme Detection Pattern

Follow the existing pattern from `app/footer.tsx`:

```tsx
'use client'
import { useTheme } from 'next-themes'
import { useState, useEffect } from 'react'

function Component() {
  const [mounted, setMounted] = useState(false)
  const { theme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Avoid hydration mismatch — render without theme-dependent styles until mounted
  if (!mounted) {
    return <header className="...">...</header> // fallback without inline bg
  }

  const isDark = theme === 'dark'
  // ...
}
```

The `mounted` guard prevents hydration mismatches between server-rendered HTML (no theme known) and client-rendered HTML (theme detected). If the sticky header from Story 3.1 already has a mounted guard, reuse it.

### References

- [Source: app/globals.css:60-77 — !important dark mode overrides that destroy bg-* transparency]
- [Source: app/globals.css:28 — --color-dark-background: #1a1a1a (the dark mode base color)]
- [Source: app/globals.css:20 — --color-background: #ffffff (the light mode base color)]
- [Source: app/footer.tsx:5,28 — useTheme() pattern with mounted guard]
- [Source: components/ui/nav-bar.tsx:122 — existing backdrop-blur usage in mobile menu: `backdrop-blur-sm` with `bg-white/95 dark:bg-zinc-900/95` (NOTE: this mobile menu pattern has the same !important vulnerability in dark mode — the `bg-zinc-900/95` will be overridden to opaque `#1a1a1a`)]
- [Source: _bmad-output/implementation-artifacts/1-1-animated-rainbow-gradient-background.md — inline style bypass strategy for !important overrides]
- [Source: _bmad-output/planning-artifacts/epics.md:200-213 — Story 3.2 acceptance criteria]

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List
