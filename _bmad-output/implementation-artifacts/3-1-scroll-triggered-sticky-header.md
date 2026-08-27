# Story 3.1: Scroll-Triggered Sticky Header

**Status:** ready-for-dev
**Epic:** Epic 3 - Sticky Name/Title Header -- Persistent Identity
**Story Key:** 3-1-scroll-triggered-sticky-header

---

## Story Statement

**As a** visitor scrolling through the portfolio,
**I want** ThienPhu's name and title to remain visible at the top of the page,
**So that** I always know whose portfolio I'm viewing.

---

## Acceptance Criteria

| # | Given | When | Then |
|---|-------|------|------|
| AC-1 | The hero name/title section is fully in view | The page loads | The sticky header is hidden |
| AC-2 | The user has scrolled past the hero section | The hero exits the viewport | The sticky header appears with an entrance animation |
| AC-3 | The sticky header is visible | The user continues scrolling | The header remains visible and fixed at the top |
| AC-4 | The user scrolls back up to the hero section | The hero comes back into view | The header retracts with an exit animation |
| AC-5 | The sticky header exists | It is rendered | The sticky header sits below the existing progress bar (z-index ordering) |
| AC-6 | The sticky header exists alongside the NavBar | Both are rendered | The existing NavBar (right-side dots, left-side section label) is not obscured |
| AC-7 | The sticky header exists on mobile | Viewport is at mobile breakpoint | The header works responsively on existing mobile breakpoints |

---

## Tasks / Subtasks

### Task 1: Create the StickyHeader component
- [ ] Create `components/ui/sticky-header.tsx`
- [ ] Implement `'use client'` directive (required for hooks)
- [ ] Use `useRef` to attach to the hero section (`#about` element)
- [ ] Use `useIntersectionObserver` or `IntersectionObserver` in a `useEffect` to track hero visibility
- [ ] Manage `isVisible` state based on hero intersection (hidden when hero is in view, shown when hero exits)
- [ ] Import `AnimatePresence` and `motion` from `motion/react`
- [ ] Render `AnimatePresence` wrapping a `motion.header` that conditionally renders based on `isVisible`
- [ ] Display the profile name (`PROFILE.displayName || PROFILE.name`) and title (`PROFILE.title`)
- [ ] Apply fixed positioning, appropriate z-index (below progress bar), and entrance/exit animations
- [ ] Import `PROFILE` from `@/app/data`

### Task 2: Integrate StickyHeader into the layout/page
- [ ] Import `StickyHeader` in the appropriate file
- [ ] Place it in the DOM so it does not interfere with existing layout flow
- [ ] Ensure the hero section (`#about` div) has a `ref` that the StickyHeader can observe, OR use `document.getElementById` in a useEffect
- [ ] Verify no overlap with NavBar elements

### Task 3: Handle z-index layering
- [ ] Ensure sticky header z-index is below progress bar (z-50) and below NavBar (z-50)
- [ ] Use z-40 for the sticky header (sits above page content, below fixed nav elements)

### Task 4: Entrance and exit animations
- [ ] Entrance animation: slide down from top (y: -100% to y: 0) with opacity 0 to 1
- [ ] Exit animation: slide up to top (y: 0 to y: -100%) with opacity 1 to 0
- [ ] Animation duration: ~0.3s, matching existing transition patterns in the codebase
- [ ] Use `AnimatePresence` with `mode="wait"` for clean transitions

### Task 5: Mobile responsiveness
- [ ] Ensure the sticky header does not overlap with the mobile hamburger menu button (fixed `top-6 right-6 z-50`)
- [ ] Adjust padding/positioning for mobile: account for the hamburger button space
- [ ] The sticky header text should be appropriately sized on mobile (use responsive text classes)

### Task 6: Test and verify
- [ ] Test scroll behavior: header hidden on load, appears on scroll past hero, hides on scroll back to hero
- [ ] Test on desktop: no overlap with right-side nav dots or left-side section label
- [ ] Test on mobile: no overlap with hamburger menu button
- [ ] Test in both light and dark themes
- [ ] Verify z-index ordering: progress bar (top) > nav elements > sticky header > page content

---

## Dev Notes

### 1. Hero Section Structure (exact markup)

The hero/about section is the **first `motion.section`** in `app/page.tsx`. Its relevant markup:

```tsx
// app/page.tsx, lines 140-155 (inside the Personal component)
<motion.section
  variants={VARIANTS_SECTION}
  transition={TRANSITION_SECTION}
>
  <div className="flex-1" id="about">
    <div className="space-y-4">
      {/* Name and Role */}
      <div>
        <h1 className="text-3xl font-medium text-black dark:text-white">
          {PROFILE.displayName || PROFILE.name}
        </h1>
        <p className="text-base text-zinc-600 dark:text-zinc-500">
          {PROFILE.title}
        </p>
      </div>
      ...
    </div>
  </div>
</motion.section>
```

**Key observations:**
- The hero section is wrapped in a `motion.section` (has variants animation) containing a `div#about`
- The element to observe for scroll detection is `div#about` (the one with `id="about"`)
- Profile data comes from `import { PROFILE } from './data'`
- `PROFILE.displayName || PROFILE.name` resolves to `"Phu Tran"` (displayName is set)
- `PROFILE.title` resolves to `"DevOps Engineer"`
- The `h1` uses `text-3xl font-medium text-black dark:text-white`
- The title `p` uses `text-base text-zinc-600 dark:text-zinc-500`

### 2. Z-Index Hierarchy Table

| Layer | Element | Z-Index | Position | Notes |
|-------|---------|---------|----------|-------|
| **Highest** | Progress Bar | `z-50` | `fixed top-0 right-0 left-0 h-1` | In `nav-bar.tsx`, line 177 |
| | NavBar - Desktop right dots | `z-50` | `fixed top-1/2 right-8` | In `nav-bar.tsx`, line 61 |
| | NavBar - Desktop left label | `z-50` | `fixed top-1/2 left-8` | In `nav-bar.tsx`, line 106 |
| | NavBar - Mobile hamburger | `z-50` | `fixed top-6 right-6` | In `nav-bar.tsx`, line 114 |
| **New** | **Sticky Header** | **`z-40`** | **`fixed top-1`** (below progress bar's h-1) | **NEW -- to be created** |
| **Lowest** | Page content | none (static) | normal flow | In `page.tsx` |

**Critical z-index rule:** The sticky header MUST use `z-40` so it sits below ALL existing `z-50` nav elements and the progress bar. This ensures:
- The progress bar (h-1 bar at very top) is always visible above the sticky header
- The desktop nav dots (right side, vertically centered) are never obscured
- The desktop section label (left side, vertically centered) is never obscured
- The mobile hamburger menu (top-right) is never obscured

**Positioning note:** The sticky header should use `fixed` positioning. Since the progress bar is `h-1` (4px) and sits at `top-0`, the sticky header should be positioned at `top-1` (4px from top) to sit directly below the progress bar. On mobile, the hamburger button is at `top-6 right-6` (24px from top, 24px from right). The sticky header must not extend into this area -- keep its height compact (approximately 40-48px) so on mobile the header occupies roughly `top-1` to `top-12` (4px to 48px) which leaves space below the hamburger at `top-6` (24px). **However**, since the hamburger overlaps vertically with the header on mobile, the sticky header text should be left-aligned with adequate padding-right to avoid the hamburger area, OR the sticky header can span full width with the hamburger sitting on top (which is fine since hamburger is z-50 > sticky header z-40).

### 3. Implementation Strategy: IntersectionObserver

**Recommended approach:** Use `IntersectionObserver` (not scroll event listener) for performance.

**Detection logic:**
- Observe the `div#about` element
- Use `rootMargin: '-0px 0px 0px 0px'` (or slightly negative top margin like `-10px 0px 0px 0px` to trigger just before the element fully exits)
- Use `threshold: 0` (fire as soon as any part of the element enters/exits)
- When `entry.isIntersecting` is `false`, the hero has scrolled out of view -- show the sticky header
- When `entry.isIntersecting` is `true`, the hero is (at least partially) in view -- hide the sticky header

**Why IntersectionObserver over scroll events:**
- More performant (no continuous scroll event firing)
- The project already uses IntersectionObserver in `nav-bar.tsx` (line 27-48) for section tracking -- consistent pattern
- Modern API, well-supported

**Implementation in component:**

```tsx
const heroRef = useRef<HTMLDivElement>(null)
const [isHeroVisible, setIsHeroVisible] = useState(true)

useEffect(() => {
  const heroElement = document.getElementById('about')
  if (!heroElement) return

  const observer = new IntersectionObserver(
    ([entry]) => {
      setIsHeroVisible(entry.isIntersecting)
    },
    {
      root: null,
      rootMargin: '-10% 0px 0px 0px', // trigger slightly before fully out of view
      threshold: 0,
    }
  )

  observer.observe(heroElement)
  return () => observer.disconnect()
}, [])
```

**Why `document.getElementById` instead of passing a ref:** The hero `div#about` is inside `page.tsx` and the sticky header component is a separate component. Using `getElementById` avoids needing to thread a ref through the layout tree or use context. This is simpler and works because `#about` is a stable ID.

### 4. Animation Approach (motion/react)

Use `AnimatePresence` + `motion.header` for the show/hide transitions.

```tsx
import { motion, AnimatePresence } from 'motion/react'

// Inside the component's return:
<AnimatePresence>
  {!isHeroVisible && (
    <motion.header
      key="sticky-header"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -20, opacity: 0 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="fixed top-1 right-0 left-0 z-40 ..."
    >
      {/* header content */}
    </motion.header>
  )}
</AnimatePresence>
```

**Animation details:**
- `initial`: Start slightly above final position (`y: -20`), fully transparent
- `animate`: Slide to final position (`y: 0`), fully opaque
- `exit`: Slide up (`y: -20`), fade out
- `transition.duration`: `0.3` -- matches `TRANSITION_SECTION` used throughout `page.tsx`
- `transition.ease`: `'easeInOut'` for smooth feel
- `key="sticky-header"` is required for `AnimatePresence` to track the element

**The `initial` state handles the page-load case:** Since `isHeroVisible` starts as `true`, the `AnimatePresence` will not render the header initially (AC-1 satisfied). The IntersectionObserver will quickly confirm the hero is visible on load, keeping the header hidden.

**Important:** Do NOT set `initial={false}` on `AnimatePresence` -- we want the entrance animation to play each time the hero scrolls out of view, not just on first mount.

### 5. Where to Place the Component

**Recommended: `app/layout.tsx`**, placed inside the main content wrapper, after the `NavBar` and before `{children}`.

**Rationale:**
- The sticky header is a global UI element (persists across the entire page)
- It belongs in the layout, not in the page content, because it overlays the page
- Placing it in `layout.tsx` keeps it independent of the page's scroll container

**In layout.tsx, insert after `<NavBar></NavBar>` (line 64):**

```tsx
// Current layout.tsx structure:
<div className="relative mx-auto w-full max-w-screen-sm flex-1 px-4 pt-20">
  <NavBar></NavBar>
  {/* StickyHeader goes here */}
  {children}
  <Footer />
</div>
```

**Note on container:** The layout wraps content in `max-w-screen-sm` (max-width: 640px). The sticky header should match this width constraint by being a child of this wrapper. It should use `left-0 right-0 w-full` within this container to span the content width. Since the parent has `px-4`, the header inherits that padding naturally.

**Alternative considered: `page.tsx`** -- placing inside `page.tsx` would couple it to the page component and make it harder to reuse or remove. Layout placement is cleaner for a persistent overlay element.

### 6. NavBar Interaction

The NavBar has these fixed elements that MUST NOT be obscured:

| Element | Position | Size | z-index |
|---------|----------|------|---------|
| Desktop right nav dots | `fixed top-1/2 right-8` | 12px dots, spaced 44px apart | z-50 |
| Desktop left section label | `fixed top-1/2 left-8` | text-sm | z-50 |
| Mobile hamburger button | `fixed top-6 right-6` | h-12 w-12 (48px circle) | z-50 |
| Progress bar | `fixed top-0 right-0 left-0` | h-1 (4px) full width | z-50 |

Since the sticky header is `z-40` (below all z-50 elements), these elements will naturally render on top. No special handling needed for the desktop nav dots or left label -- they are vertically centered (`top-1/2`) while the sticky header is at the very top (`top-1`), so there is no vertical overlap.

**Mobile concern:** The hamburger button is at `top-6 right-6` (24px from top-right). The sticky header at `top-1` with a height of ~44px would extend from ~4px to ~48px. The hamburger at 24px from top is within this range. Since the hamburger is z-50 and the header is z-40, the hamburger renders on top -- but the user might accidentally tap the header thinking it's the hamburger. To mitigate:
- Keep the sticky header text left-aligned with padding-left, and avoid placing any interactive elements on the right side where the hamburger sits
- The hamburger button itself has a visible circular background, so it remains visually distinct

### 7. Sticky Header Content and Styling

The sticky header should display:
- **Name:** `PROFILE.displayName || PROFILE.name` (resolves to "Phu Tran")
- **Title:** `PROFILE.title` (resolves to "DevOps Engineer")

**Suggested styling:**

```tsx
<motion.header
  key="sticky-header"
  initial={{ y: -20, opacity: 0 }}
  animate={{ y: 0, opacity: 1 }}
  exit={{ y: -20, opacity: 0 }}
  transition={{ duration: 0.3, ease: 'easeInOut' }}
  className="fixed top-1 right-0 left-0 z-40 border-b border-zinc-200 bg-white/80 px-4 py-2 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-950/80"
>
  <div className="mx-auto max-w-screen-sm">
    <h2 className="text-sm font-medium text-black dark:text-white">
      {PROFILE.displayName || PROFILE.name}
    </h2>
    <p className="text-xs text-zinc-500 dark:text-zinc-400">
      {PROFILE.title}
    </p>
  </div>
</motion.header>
```

**Key styling decisions:**
- `bg-white/80 backdrop-blur-sm` (and dark equivalent) -- translucent with blur, modern glass effect, consistent with the mobile nav dropdown in `nav-bar.tsx` (line 123: `bg-white/95 ... backdrop-blur-sm`)
- `border-b` -- subtle bottom border for visual separation from content below
- `text-sm` for name (smaller than hero's `text-3xl` since it's a compact header) and `text-xs` for title
- `px-4 py-2` for compact padding (the parent layout already has `px-4`, but since this is `fixed` it needs its own padding)
- `h2` semantic element (the hero uses `h1`, so the sticky header uses `h2` -- avoids duplicate h1)
- Dark mode: `dark:bg-zinc-950/80 dark:border-zinc-800` -- matches the dark surface theme

**IMPORTANT about dark mode overrides:** The globals.css has `!important` overrides for `bg-white` and `bg-zinc-950`. Using `bg-white/80` (with opacity) may or may not be caught by the `.dark .bg-white { background-color: #1a1a1a !important; }` override. Since the override targets the literal class `bg-white` and our class is `bg-white/80`, it should NOT be affected by the override. However, if issues arise, use Tailwind's `dark:bg-[#1a1a1a]/80` or use inline style fallback. Test in dark mode.

### 8. Mobile Responsiveness

The layout uses `max-w-screen-sm` (640px) as the main content width. On mobile (< 768px, i.e., below `md` breakpoint):
- The hamburger menu button is at `top-6 right-6` with a 48px circle
- The sticky header text should be left-aligned
- No right-side padding needed to be excessive -- the hamburger overlaps but renders on top due to z-index
- Text sizes (`text-sm`, `text-xs`) are already mobile-appropriate
- The header height is minimal (~44px with py-2 + text)

On desktop (>= 768px):
- The desktop nav dots are on the right side but vertically centered (no vertical overlap with top-fixed header)
- The desktop section label is on the left but vertically centered (no overlap)
- The sticky header spans the content width within `max-w-screen-sm`

**No responsive breakpoints needed for the sticky header itself** -- the same sizing works across all viewports because the parent container constrains width.

### 9. PROFILE Data Import

The `PROFILE` export from `app/data.ts`:

```typescript
export const PROFILE: Profile = {
  name: "Trần Thiện Phú",
  displayName: "Phu Tran",
  title: "DevOps Engineer",
  tagline: "Automate everything. Monitor everything. Improve everything.",
  email: "contact@phutran.dev",
  phone: "(+84) 763 883 037",
  location: "Can Tho City, Vietnam",
  about: "A passionate DevOps engineer..."
}
```

Import path from a component in `components/ui/`: `import { PROFILE } from '@/app/data'`

### 10. Code Style Requirements

- **No semicolons** -- Prettier config requirement
- **Single quotes** -- Prettier config requirement
- **Trailing commas** -- Prettier config requirement
- **2-space indent** -- Prettier config requirement
- **Named exports** -- project convention
- **`'use client'` directive** -- required at top of file since component uses hooks (`useState`, `useEffect`, `useRef`)
- **`@/` imports** -- use path alias for all local imports

### 11. File to Create

**Path:** `components/ui/sticky-header.tsx`

### 12. File to Modify

**Path:** `app/layout.tsx`
- Add import: `import { StickyHeader } from '@/components/ui/sticky-header'`
- Add `<StickyHeader />` after `<NavBar></NavBar>` on line 64 (before `{children}`)

---

## Dev Agent Record

_This section will be filled by the dev agent during implementation._

### Implementation Log

| Date | Action | Notes |
|------|--------|-------|
| | | |

### Decisions Made

| Decision | Rationale |
|----------|-----------|
| | |

### Issues Encountered

| Issue | Resolution |
|-------|-----------|
| | |

### Files Modified

| File | Changes |
|------|---------|
| | |

### Verification

- [ ] AC-1: Header hidden on page load when hero is in view
- [ ] AC-2: Header appears with animation when hero exits viewport
- [ ] AC-3: Header remains visible during continued scrolling
- [ ] AC-4: Header retracts with animation when hero comes back into view
- [ ] AC-5: Header sits below progress bar in z-index
- [ ] AC-6: NavBar elements not obscured
- [ ] AC-7: Works on mobile breakpoints
- [ ] Light theme verified
- [ ] Dark theme verified
