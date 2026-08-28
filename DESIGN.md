# DESIGN.md — "Ricey CV" (Interactive Desktop-Rice Personal Website)

> The site simulates a Linux desktop rice (à la r/unixporn) as an interactive CV: waybar top
> bar, wallpaper, dock, and draggable/resizable glass windows. Each window maps to a CV
> section. Supersedes the previous terminal-glass theme (plan-terminal-glass-theme.md).
> Rule: values change here FIRST, then in code.

## 1. Concept

A desktop environment, not a scrolling page:

- **Top bar** (waybar-style): workspace indicators (one per window), clock, theme picker
- **Wallpaper**: full-bleed, per-theme, slightly dimmed (`brightness(0.85)`) so glass stays legible
- **App windows** (absolutely positioned in `#desktop`, draggable/resizable):
  - `phu@site: ~/about` — terminal: typed `whoami` bio + working command prompt
  - `neofetch` — info panel: stats-as-facts (OS→Location, Uptime→Years experience, Shell→Role, Packages→# projects)
  - `~/projects` — Nautilus-style file manager: folder-per-project; click opens a detail window
  - `btop — skills` — system monitor: skills as a process table (NAME / CATEGORY / CPU%), **no bars** (owner request)
  - `~/contact.sh` — terminal: contact lines + social links
  - `rofi` launcher (⌘/Ctrl+K) — command palette: jump to sections, email, resume, themes, reset layout
- **Dock / taskbar** (bottom): running app icons; click = focus / restore / reopen
- Glassmorphism panels over the wallpaper; windows cascade-open with staggered animation

Out of scope for v1 (backlog): lock screen splash, `/admin` editor, parallax wallpaper.

## 2. Visual Language

### 2.1 Themes (CSS custom properties, swapped at runtime via `data-theme` on `<html>`)

Ships 3 themes, selectable from the top bar, persisted to localStorage. Default: **nord**.

| Token | Nord | Gruvbox | Sakura |
| --- | --- | --- | --- |
| `--bg` (wallpaper base) | `#2e3440` | `#282828` | `#251d22` |
| `--panel` (glass fill) | `rgba(46,52,64,0.55)` | `rgba(40,40,40,0.60)` | `rgba(37,29,34,0.58)` |
| `--panel-solid` (fallback) | `#2e3440` | `#282828` | `#251d22` |
| `--border` | `rgba(236,239,244,0.12)` | `rgba(235,219,178,0.12)` | `rgba(240,228,234,0.12)` |
| `--text` | `#d8dee9` | `#ebdbb2` | `#f0e4ea` |
| `--heading` | `#eceff4` | `#fbf1c7` | `#f7ecf2` |
| `--muted` | `#4c566a` → use `#aebacf` on glass | `#a89984` | `#b8a2b0` |
| `--faint` | `#7b88a1` | `#928374` | `#9d8796` |
| `--accent` (links/active) | `#88c0d0` | `#8ec07c` | `#ec6a88` |
| `--accent-2` | `#81a1c1` | `#fabd2f` | `#c79bf2` |
| `--red` (close/error) | `#bf616a` | `#fb4934` | `#e06c75` |
| `--yellow` (minimize/warn) | `#ebcb8b` | `#fabd2f` | `#e5c07b` |
| `--green` (success/maximize) | `#a3be8c` | `#b8bb26` | `#9ece6a` |
| `--wallpaper` | `/wallpapers/nord.svg` | `/wallpapers/gruvbox.svg` | `/wallpapers/sakura.svg` |

Contrast on nord glass: `#d8dee9` on `rgba(46,52,64,·)` over wallpaper ≈ ≥9:1 ✅;
muted `#aebacf` ≥ 5:1 ✅; accent `#88c0d0` ≥ 5.5:1 ✅. (Same check passes for the other two.)

### 2.2 Glass panel style

- `background: var(--panel)`
- `backdrop-filter: blur(18px) saturate(140%)` (`blur(10px)` ≤ 768px viewport for GPU budget)
- `border: 1px solid var(--border)`
- `border-radius: 10px` (windows), `8px` (inner rows/badges)
- Outer shadow: `0 10px 30px rgba(0,0,0,0.35)`; **focused window**: `0 16px 48px rgba(0,0,0,0.5)` + `border-color: var(--accent)` at 40% opacity
- Inner top highlight: `inset 0 1px 0 rgba(255,255,255,0.07)`
- `@supports not (backdrop-filter)` → `background: var(--panel-solid)`

### 2.3 Typography

- **JetBrains Mono** (next/font, ligature-ready) for EVERYTHING — terminal bodies, window
  chrome, top bar (decided once, per §2.3 of the brief). Fallback: Geist Mono, monospace.
- Terminal body `13px/1.6`; window titles `12px`; top bar `12–13px`; btop table `12–13px`.

### 2.4 Wallpaper

- Full-bleed `background-size: cover`, dimmed via a `rgba(0,0,0,0.15)` overlay (nord/gruvbox)
  or `rgba(0,0,0,0.25)` (sakura) so glass panels pass contrast.
- SVG scenes in `public/wallpapers/` (nord mountains, gruvbox forest, sakura dusk) — swappable
  per theme; real photos can replace them later at the same paths.
- Parallax: backlogged.

## 3. Layout Structure

- `#desktop` = `position: relative`, `100dvh` minus top bar (`40px`) and dock (`64px`).
- Windows absolutely positioned; default layout is computed at mount from the desktop area:
  - **≥1200px**: cascade — about `24,16 560×440`, neofetch `608,16 420×400`, projects `24,480 620×300`,
    skills `668,440 560×330`, contact `1104,16 300×300` (clamped to viewport; wider screens get more
    breathing room, right-anchored windows shift right)
  - **768–1199px**: tidy 2-column grid (2 rows), 16px gaps
  - **<768px**: card-stack mode (§5.3), no absolute positioning
- First load: staggered open animation (fade + scale `0.96→1`, 150ms each, 100ms stagger).
- Layout (positions/sizes/z-order/minimized/closed) persists to `localStorage`
  (`ricey-desktop-v1`); "reset layout" command restores defaults.

## 4. Window Inventory (CV → App mapping)

| Window | App metaphor | Content (all from `app/data.ts` — no hardcoded copy) |
| --- | --- | --- |
| `phu@site: ~/about` | Terminal | Typed `whoami` (name — title), tagline, bio lines; live prompt (`lib/terminal-commands.ts`) |
| `neofetch` | Info panel | ASCII logo, OS→location, Host→domain, Uptime→years experience (from `2023`), Shell→role, Packages→project count, WM→tagline, palette dots |
| `~/projects` | File manager | Folder-per-project grid; click folder → opens `project-detail` window |
| `btop — skills` | System monitor | Process tree: `devops` / `dev` main processes; each **tool** from the skill descriptions is a thread (docker, k8s, js, terraform, react…) with the parent skill's proficiency as base CPU% — live-jittering, **no bars** (owner request) |
| `~/contact.sh` | Terminal | `$ contact --info` output (email/phone/location) + social chips + `/resume` hint |
| `rofi` launcher | Command palette | Fuzzy search: focus windows, `email me`, `open resume`, socials, `theme: nord/gruvbox/sakura`, `reset layout` |
| project-detail | Viewer window | Project media (video/image), description, `[stack]` tags, `+` features, live/repo links |

Each window: title bar (functional traffic lights: close `--red`, minimize `--yellow`,
maximize `--green`), body, optional footer/status line, resize handle (bottom-right).

## 5. Window Chrome & Interactions

- Drag via title bar only (pointer events; body text stays selectable); clamped to desktop bounds
- Focus: click raises `z-index` to `maxZ + 1`; focused window gets accent-tinted border + bigger shadow
- Resize: bottom-right handle; per-window `minW × minH` (default `340×240`)
- Minimize: fade/scale toward dock; dock icon shows a running-dot; click restores
- Maximize: fill desktop area (minus bars); click again restores prior geometry
- Close: fade out; dock icon dims; click reopens; rofi can reopen too
- Keyboard (title bar is focusable): arrows move (16px, 1px with Shift), `Enter` maximize toggle,
  `Space` minimize toggle, traffic lights are real `<button>`s with `aria-label`s
- ⌘/Ctrl+K opens the run launcher; ⌘/Ctrl+\ opens the **split box** (pick a window →
  the desktop tiles side-by-side: focused window left, picked window right, 12px gap);
  `Esc` closes. The launcher is `role="dialog"` with labelled input, arrow-key navigation
  with scroll-follow (the list scrolls to keep the selected item visible), `Enter` runs.

### 5.3 Mobile / touch (<768px)

No dragging: windows stack as full-width collapsible glass cards in fixed order
(About → neofetch → Projects → Skills → Contact); title bar collapses/expands the card;
dock hidden; blur reduced. Theme picker still available in the top bar.

## 6. Content Editing

- All copy renders from the existing content pipeline (`content/*.json` → `scripts/generate-data.ts`
  → `app/data.ts`). No hardcoded copy in JSX. (The repo already satisfies the `cv.json` goal with
  a typed Zod pipeline; do not duplicate content into a second file.)
- `/admin` edit mode: backlogged (§10).

## 7. Responsive Breakpoints

| Breakpoint | Behavior |
| --- | --- |
| ≥1200px | Full desktop metaphor, free drag/resize, default cascaded layout |
| 768–1199px | Desktop metaphor, tidy 2-column default grid, dragging still allowed |
| <768px | Card-stack mode, glass style retained, no drag, dock hidden |

## 8. Motion & Micro-interactions

- Window open: fade+scale `0.96→1`, 150ms ease-out, 100ms stagger (desktop mode only)
- Minimize: scale `0.9` + fade toward dock; maximize: spring to full area (200ms)
- Typing effect in the about terminal on first load; skipped when
  `localStorage.ricey-visited` is set or `prefers-reduced-motion` is set
- `prefers-reduced-motion`: no cascade/stagger, no typing, no parallax, instant minimize/maximize
- Dock icons: subtle scale on hover (1.1), restrained

## 9. Tech Stack (as-built)

- Next.js 15 App Router + React 19 (repo constraint; Vite recommendation adapted)
- Tailwind v4 utilities + CSS custom properties for theme tokens (`globals.css`)
- `motion/react` for window animations; pointer events for drag/resize
- State: React context + reducer in `components/desktop/desktop.tsx` (windows, z-order,
  minimized/closed, theme, mode); no external store
- Persistence: `localStorage` (layout + theme + visited flag); inline `<head>` script applies the
  saved theme pre-hydration to avoid flash
- No backend; static hosting (Netlify) unchanged

## 10. File/Folder Structure (as-built)

```
app/
  page.tsx                 → renders <Desktop/>
  resume/page.tsx          → plain semantic HTML fallback (ATS/print), same data
  layout.tsx               → fonts (JetBrains Mono + Geist) + theme init script
  globals.css              → theme tokens (nord/gruvbox/sakura) + glass utilities
components/desktop/
  desktop.tsx              → state store + #desktop canvas + card-stack mode
  window.tsx               → generic draggable/resizable glass shell
  top-bar.tsx              → workspaces, clock, theme picker
  dock.tsx                 → taskbar icons
  launcher.tsx             → rofi-style palette (⌘/Ctrl+K)
  windows/
    about-terminal.tsx     → typed bio + command prompt
    neofetch.tsx           → info panel
    projects-files.tsx     → file-manager grid
    project-detail.tsx     → project viewer window
    skills-monitor.tsx     → btop-style process table (no bars)
    contact-terminal.tsx   → contact window
public/wallpapers/         → nord.svg, gruvbox.svg, sakura.svg
lib/terminal-commands.ts   → command engine (reused by about terminal + launcher)
```

## 11. Accessibility

- Windows keyboard-operable: title bar `tabindex=0`, arrows move, `Enter`/`Space` toggles;
  traffic lights + dock + launcher all real buttons with visible focus rings
  (`outline: 2px solid var(--accent)`)
- Contrast per §2.1 verified on glass; wallpaper dim overlay included
- Launcher: `role="dialog"`, labelled input, `aria-activedescendant` list navigation
- `/resume` route: flat semantic HTML (h1→h2→ul), zero window chrome — for ATS, screen readers,
  printing; linked from contact window + launcher
- Windows content is real DOM (SSR-able); nothing hidden behind interaction
- Mobile card-stack keeps the same semantic headings

## 12. Build Milestones (status)

1. ✅ Static layout: top bar, wallpaper, dock, one window rendering bio
2. ✅ Generic `Window`: drag, focus/z, close/minimize/maximize, resize (pointer + keyboard)
3. ✅ Remaining windows (neofetch, projects file-manager + detail, btop skills, contact)
4. ✅ Rofi-style launcher with fuzzy search + ⌘/Ctrl+K
5. ✅ Theme system (nord default + gruvbox + sakura) + per-theme wallpapers
6. ✅ Card-stack mode for mobile (<768px)
7. ✅ localStorage persistence (layout/theme/visited) + reduced-motion handling
8. ✅ `/resume` plain-text fallback route
9. ✅ Polish: open/close animations, typing effect, focus/hover states
