# Plan: Interactive Terminal + Tinted Glass Theme

**Goal**: Reskin the portfolio with an interactive terminal aesthetic (command prompt, typed output, boot sequence, command navigation) layered over a tinted-glass (glassmorphism) design system — translucent frosted panels, subtle tinted borders, glow accents.

**Scope**: Presentation layer only. Content pipeline (`content/` → `generate-data.ts` → `app/data.ts`) stays untouched. Execute AFTER `plan-cv-v2.md` so content is stable.

**First deliverable**: a root-level `DESIGN.md` — the canonical design brief and design-system spec, authored by/with the design agent (e.g. Sally via `bmad-agent-ux-designer`) BEFORE any code. Every implementation phase consumes it; nothing gets styled from memory.

---

## Design Vision

The site reads like a personal terminal session running on a glass desktop:

```
┌─ phu@portfolio:~ ───────────────────────────┐   ← glass terminal window (frosted, tinted)
│ $ whoami                                     │   ← typed animation
│ Phu Tran — DevOps Engineer                   │
│ $ ls experience/                             │   ← clickable command
│ ...                                          │
│ $ ▊                                          │   ← blinking cursor, accepts input
└──────────────────────────────────────────────┘
```

### Three design ingredients

1. **Terminal shell** — window chrome (title bar, traffic lights), monospace type, prompt lines (`$`, `❯`), typed text, blinking block cursor, command history.
2. **Tinted glass** — panels with `backdrop-filter: blur()` + translucent tint fill (`rgba` background), 1px light borders (`border-white/10`), inner highlights, soft outer glow. NOT flat black terminal — think glass terminal floating over a subtle animated gradient/aurora background.
3. **Interactivity** — a real command layer: visitors can type/click commands (`help`, `about`, `experience`, `skills`, `projects`, `contact`, `clear`, easter eggs like `sudo hire-me`), tab-completion optional.

### Key design decisions (decide before Phase 1)

| Decision | Options | Recommendation |
| --- | --- | --- |
| Accent color | Classic green / cyan / amber / multi | Emerald-cyan on dark glass; `prefers-contrast`-safe |
| Full-terminal vs hybrid | Whole site is one terminal / terminal hero + normal sections below | **Hybrid**: terminal hero (interactive) + sections styled as terminal output blocks. Keeps SEO, scroll, mobile sanity |
| Light mode | Keep / terminal is dark-only | Dark-first; light mode = "light glass" variant. `next-themes` already installed |
| Input mode | Auto-running demo only / real input | Real input with `help` hint + clickable commands for non-terminal users |
| Font | Geist Mono (already loaded) / JetBrains Mono / Fira Code | Keep **Geist Mono** — zero new deps, ligature-free, clean |

Decisions get recorded in `DESIGN.md` (Phase 0), not in chat — the design agent owns this document.

---

## Phase 0 — Author `DESIGN.md` (Design Agent Brief)

Create `DESIGN.md` at the repo root (next to `AGENTS.md` / `CLAUDE.md` so agents find it by convention). This is a design-only phase: CSS/design tokens and specs, no component code.

- [ ] Run the design agent (e.g. `bmad-agent-ux-designer` / Sally) against the vision above + current site for context
- [ ] Design agent resolves the open decisions in the table above and records them with rationale
- [ ] Design agent authors `DESIGN.md` with this structure:

  ```markdown
  # DESIGN.md — Terminal Glass Theme

  1. Vision & Principles          # terminal-meets-glass identity, tone, do/don't rules
  2. Color System                 # exact hex/rgba values, dark + light glass variants,
                                  #   accent, tints, borders, glows, contrast notes
  3. Typography                   # Geist Mono usage, scale, prompt/output/muted text roles
  4. Glass System                 # blur radii, tint opacities, border/highlight specs,
                                  #   elevation/hover states, background requirements
  5. Terminal Language            # prompt symbols, cursor, boot sequence script,
                                  #   output formatting conventions ($, #, +, [...])
  6. Motion                       # typing speeds, cursor blink, reveal animations,
                                  #   reduced-motion fallbacks
  7. Component Specs              # per-component visual spec (terminal-window, glass cards,
                                  #   prompt lines, nav, footer)
  8. Layout & Responsive          # hybrid layout rules, mobile terminal behavior
  9. Accessibility Requirements   # AA contrast pairs, keyboard map, reduced-motion rules
  10. Out of Scope                # backlog items this design does not cover
  ```

- [ ] Values must be concrete and copy-pasteable (exact rgba/hex/px/ms) — implementation phases should never invent values
- [ ] Human review/sign-off on `DESIGN.md` before Phase 1 starts
- [ ] Commit root `DESIGN.md`: `docs(design): add DESIGN.md terminal glass spec`

**Exit criteria**: approved `DESIGN.md` at repo root; design agent's job done; every later phase references it.

---

## Phase 1 — Design Tokens & Glass Foundation (`globals.css`)

Input: sections 2–6 of `DESIGN.md`. Transcribe values verbatim — do not re-derive.

- [ ] Extend the `@theme` block with terminal/glass tokens from `DESIGN.md`:
  - `--color-term-bg`, `--color-term-surface` (translucent tints, e.g. `rgba(16,24,32,0.55)`)
  - `--color-term-accent`, `--color-term-accent-dim`
  - `--color-term-text`, `--color-term-muted`
  - Light-glass variants for light mode
- [ ] Utility classes (or Tailwind v4 `@utility`):
  - `.glass-panel` — `backdrop-blur-xl bg-[tint] border border-white/10 rounded-xl` + optional inner top highlight (`inset shadow`)
  - `.glass-glow` — accent glow shadow on hover/focus
  - `.scanlines` — repeating-linear-gradient overlay, very subtle, `pointer-events-none`
  - `.text-glow` — accent text-shadow for prompts/cursor
- [ ] Replace current `.dark` zinc overrides gradually — keep them until Phase 4 removes the last zinc usages
- [ ] Decide fate of `RainbowGradient` (current WIP): it can stay as the blurred background **behind** glass panels — glass needs something colorful behind it to be visible. Repurpose rather than delete if it fits

**Exit criteria**: tokens + glass utilities in place; existing pages still render.

## Phase 2 — Core Components (`components/ui/`)

New primitives, following existing motion-primitives style:

- [ ] `terminal-window.tsx` — glass panel + title bar (`phu@portfolio: ~`), traffic-light dots, `<TerminalWindow title>` wrapper used everywhere
- [ ] `typed-text.tsx` — typewriter effect using `motion` (respects `prefers-reduced-motion`), onComplete callback, optional caret
- [ ] `prompt-line.tsx` — `$ <command>` line component with accent prompt, optional clickable/keyboard-focusable variant
- [ ] `cursor.tsx` — blinking block cursor (CSS animation)
- [ ] `terminal-output.tsx` — consistent output text block (muted color, mono)
- [ ] `command-link.tsx` — command that scrolls to a section / triggers an action (replaces nav links in terminal context)

**Exit criteria**: primitives demoed on a scratch section; typed text + glass panel working in both themes.

## Phase 3 — Terminal Hero (the centerpiece)

- [ ] Replace the current about section with a terminal hero inside `TerminalWindow`:
  - Boot sequence (fast, skippable, `prefers-reduced-motion` → skip): ` initializing portfolio... ok`
  - Auto-typed: `$ whoami` → name/title; `$ cat tagline.txt` → tagline; `$ contact --info` → email/location/phone
  - Ends with live prompt + blinking cursor **accepting real input**
- [ ] Command engine (`lib/terminal-commands.ts` — pure, testable):
  - Command registry: `{ name, description, aliases, run() }` returning lines/JSX
  - Commands: `help`, `about`, `experience`, `skills`, `projects`, `certs`, `education`, `contact`, `social`, `clear`, `whoami`
  - Unknown input → `command not found: xyz — try 'help'` (keep it friendly)
  - Easter eggs: `sudo hire-me`, `rm -rf /` (joke response), `exit` (wave message)
  - Data source: imports from `app/data.ts` — zero content duplication
- [ ] Clickable command chips below the terminal for non-typing visitors (mobile)

**Exit criteria**: hero terminal fully interactive; all sections reachable via command.

## Phase 4 — Restyle Sections as Terminal Output

Keep scrollable hybrid layout: each section = one glass terminal panel with a header prompt line.

- [ ] `experience-card.tsx` — restyle: `$ cat experience/biwoco.log` header, technologies as `[docker] [k8s]` bracket tags, achievements as `+` diff lines (green)
- [ ] `skill-card.tsx` + `AnimatedBackground` — skills as `ls` output or progress bars drawn in block characters (`████████░░`) inside glass rows
- [ ] `project-card.tsx` — glass cards, tech badges as terminal tags, keep MorphingDialog video preview (restyled glass)
- [ ] Education & certifications — glass rows with comment-style headers (`# education`)
- [ ] `nav-bar.tsx` — restyle as terminal tab bar or command links (`:~$ cd /experience`)
- [ ] `footer.tsx` — `exit` status line: `session ended — © 2026 phu tran`
- [ ] Remove dead zinc overrides from `globals.css` once nothing references them
- [ ] Section headers styled as prompt lines (`$ ls ~/skills`)

**Exit criteria**: every section on `app/page.tsx` uses glass + terminal language; no leftover monochrome-zinc-only styling.

## Phase 5 — Micro-interactions & Polish

- [ ] Hover states: glass-glow border on cards; command links underline like hyperlinks in terminals
- [ ] Scroll progress (`scroll-progress.tsx` exists) — restyle as thin accent line
- [ ] Optional CRT touches (subtle!): faint scanlines on terminal windows only, slight text glow on prompt. OFF by default if it hurts readability
- [ ] Command history with ↑/↓ arrows in hero terminal
- [ ] Sound: skip (portfolios should stay silent)

**Exit criteria**: interactions feel alive but restrained.

## Phase 6 — Accessibility, Performance, Mobile

- [ ] All typing/scroll animations gated on `prefers-reduced-motion` (motion + CSS)
- [ ] Real content NOT hidden behind interaction: sections remain scrollable/anchor-linkable (`#experience` etc. must keep working — some visitors/ATS/recruiters never type)
- [ ] `backdrop-blur` performance audit: limit blur layers (each blurred panel is a GPU cost); test low-end + mobile
- [ ] Fallback for browsers without `backdrop-filter`: solid surface color (check `@supports`)
- [ ] Contrast check: terminal-muted text on glass must pass WCAG AA in both themes
- [ ] Mobile: terminal input works with virtual keyboard; command chips prominent; boot sequence shortened
- [ ] Keyboard navigation: command chips focusable, terminal input traps arrow keys only when focused

**Exit criteria**: Lighthouse ≥ 90 all categories; AA contrast; reduced-motion verified.

## Phase 7 — Verify & Ship

- [ ] `npm run lint` + `npm run build` green
- [ ] Full manual matrix: light/dark × mobile/tablet/desktop × reduced-motion on/off
- [ ] Verify all section anchors + nav + social links
- [ ] Sync `DESIGN.md` with as-built values (any token that changed during implementation gets updated — the doc must match the code at ship time)
- [ ] Optional: design agent reviews the shipped UI against `DESIGN.md` and logs deviations
- [ ] Commit strategy: one commit per phase (already granular), final `feat: terminal glass theme`
- [ ] Push → Netlify → production smoke test (check hero terminal, anchors, PDF resume link from CV v2 plan)
- [ ] Screenshots for `docs/` (optional)

---

## Suggested Branch Strategy

- Branch `feat/terminal-glass-theme` off main after CV v2 ships
- Merge per-phase or at the end (phases are designed to leave the site shippable at each step)
- Rollback = revert merge; the old monochrome theme is untouched on main until merge

## Risks & Mitigations

| Risk | Mitigation |
| --- | --- |
| `DESIGN.md` drifts from implementation as values get tweaked in code | Phase 7 sync step; single source rule — values change in `DESIGN.md` first, then code |
| Design agent produces vague spec ("subtle blur", "nice glow") | Phase 0 requires exact rgba/hex/px/ms values; reject the doc in review otherwise |
| Glass looks muddy on plain backgrounds | Keep a colorful blurred backdrop (repurpose `RainbowGradient`) behind glass panels |
| Blur kills scroll perf on mobile | Cap blur layers; use lighter blur on mobile media query |
| Recruiter/ATS can't parse terminal UI | Hybrid layout keeps real HTML sections; semantic headings unchanged; CV PDF from Plan 1 |
| Interactive terminal bugs (input focus, SSR) | Keep command engine pure; client component boundary stays in existing `'use client'` page; test SSR build |
| Scope creep (tab-complete, themes, sound) | Backlog everything not listed above |

## Backlog (explicitly out of scope for v1 of theme)

- Tab-completion for commands
- Multiple terminal color themes (`theme --matrix`)
- ASCII art banner on boot
- Visitor-executed fake `docker ps` demo
- Blog restyle (`app/blog/`) — follow-up pass after main page proves out
