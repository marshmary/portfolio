# AGENTS.md — Portfolio ("Ricey CV")

Interactive desktop-rice portfolio of Phu Tran (DevOps Engineer). The site simulates a
Linux desktop: waybar-style top bar, wallpaper, dock, draggable/resizable glass windows,
rofi-style launcher (Ctrl+K). Each window maps to a CV section.

## Stack

- Next.js 15 (App Router) + React 19 + TypeScript
- Tailwind CSS v4 (CSS custom properties for theming, no tailwind.config)
- MDX (`@next/mdx`) for `/blog`
- Zod schemas validating content JSON
- Deployed on Netlify (`netlify.toml`, `@netlify/plugin-nextjs`)

## Commands

```bash
npm run dev                 # generate-data + next dev (http://localhost:3000)
npm run build               # production build
npm run start               # serve production build (needs `build` first)
npm run lint                # ESLint
npm run generate-data       # regenerate app/data.ts from content/*.json
npm run generate-screenshots
npm run optimize-images
```

## Architecture

### Content pipeline (one-way)

```
content/**/*.json  --(scripts/generate-data.ts)-->  app/data.ts  -->  components
```

- **Never edit `app/data.ts` by hand** — it is generated. Edit JSON in `content/` instead
  (see `content/README.md` for schema; Zod schemas in `content/schema/types.ts`).
- `npm run dev` regenerates it automatically; run `npm run generate-data` after content
  edits when the dev server is not running.

### App structure

- `app/page.tsx` — desktop home; renders `<Desktop />` + Person JSON-LD
- `app/layout.tsx` — fonts (Geist, JetBrains Mono), metadata, theme init script
- `app/resume/` — plain-text resume fallback
- `app/blog/` — MDX posts
- `app/opengraph-image.tsx`, `app/sitemap.ts`, `app/robots.ts` — SEO
- `components/desktop/` — desktop shell:
  - `context.tsx` — reducer + persistence (`localStorage` key `ricey-desktop-v2`)
  - `desktop.tsx` — canvas, window definitions, stack mode (mobile) vs desktop mode
  - `window.tsx`, `top-bar.tsx`, `dock.tsx`, `launcher.tsx` (Ctrl+K palette)
  - `windows/*` — one component per CV window
- `lib/terminal-commands.ts` — pure, testable terminal command engine (no React)
- `lib/obfuscate.ts` — ROT13 codec

### Theming

Three themes (nord default, gruvbox, sakura) via CSS custom properties in
`app/globals.css`, swapped at runtime with `data-theme` on `<html>`, persisted in
`localStorage` (`ricey-theme`). Use the CSS vars (`var(--accent)` etc.), never hard-coded
colors in components.

## Conventions & gotchas

- **DESIGN.md is the source of truth for design values** — change values there first,
  then in code.
- **PII / privacy**: the raw email must never appear in served HTML or the JS bundle.
  `EMAIL` in `app/data.ts` is ROT13-obfuscated; always decode with
  `rot13(EMAIL)` from `lib/obfuscate.ts` before displaying or building a `mailto:`.
  No email/phone/location in structured data (JSON-LD).
- No comments in code unless asked; follow existing style (Prettier, sorted Tailwind
  classes).
- Commits use Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`).

## Local dev notes (Windows)

- Do not run `next dev` and `next start` at the same time in this repo — they share
  `.next/` and file-lock contention hangs both servers. Stop one before starting the
  other; wipe `.next/` if a server gets stuck on "Starting...".
- Kill stray `node` processes serving this repo before debugging startup hangs.
