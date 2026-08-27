---
project_name: 'portfolio'
user_name: 'ThienPhu'
date: '2026-06-06'
sections_completed: ['technology_stack', 'language_rules', 'framework_rules', 'testing_rules', 'code_quality', 'workflow_rules', 'critical_rules']
status: 'complete'
rule_count: 42
optimized_for_llm: true
---

# Project Context for AI Agents

_This file contains critical rules and patterns that AI agents must follow when implementing code in this project. Focus on unobvious details that agents might otherwise miss._

---

## Technology Stack & Versions

| Layer | Tech | Version | Notes |
|---|---|---|---|
| Framework | Next.js (App Router) | 15.5.9 | MDX page extensions, strict mode |
| UI | React | 19 | No `forwardRef` needed — refs as props |
| Language | TypeScript | 5 | `strict: true`, `moduleResolution: "bundler"` |
| Styling | Tailwind CSS | 4 | CSS-first config (`@theme` in globals.css), PostCSS plugin |
| Animation | motion | 11.15 | Import from `motion/react` |
| Validation | Zod | 4.1.12 | Schema validation for all content JSON |
| Dark Mode | next-themes | 0.4.4 | Class strategy, `storageKey: "theme"` |
| Icons | lucide-react | 0.468 | |
| Class utility | clsx + tailwind-merge | — | Composed as `cn()` in `lib/utils.ts` |
| Syntax highlight | sugar-high | 0.9.3 | Blog MDX code blocks |
| Typography | @tailwindcss/typography | 0.5.15 | Prose styling for blog |
| Image processing | sharp | 0.34.5 | DevDependency only |
| Fonts | Geist + Geist Mono | — | Via `next/font/google` |
| Deploy | Netlify | — | `@netlify/plugin-nextjs` 5.11.4 |
| Scripts runner | tsx | 4.20.6 | TypeScript build scripts |

**Version constraints agents must know:**
- React 19 patterns only — no `forwardRef`, no `React.FC`, refs are regular props
- Tailwind CSS 4 uses `@theme` blocks in CSS, not `tailwind.config.js` — do not create one
- Zod 4 API differs from Zod 3 — use `z.object()`, `z.string()`, etc. (current project uses standard patterns)

## Critical Implementation Rules

### Language-Specific Rules

- **TypeScript strict mode** — no implicit any, strict null checks enabled
- **Path alias** — always use `@/` imports (e.g., `@/components/ui/button`), never relative paths across directories
- **Named exports** — use named exports for all components/utilities; default exports only for Next.js pages and layouts
- **`'use client'` directive** — add at file top when component uses hooks, event handlers, or browser APIs; omit for server components
- **Types inline** — define types in the file that uses them; shared schema types live in `content/schema/types.ts`
- **No `enum`** — use union types or Zod enums (`z.enum([...])`)
- **Content validation errors** throw with context strings; optional content returns empty defaults gracefully

### Framework-Specific Rules

- **App Router** — pages/layouts use default exports; metadata exported as `const metadata: Metadata` from server components; viewport exported separately
- **MDX support** — page extensions include `.md` and `.mdx` (configured in `next.config.mjs`)
- **`motion/react`** — import from `motion/react`, not `framer-motion`; use variant objects for staggered section reveals
- **Props pattern** — inline interfaces in the same file; no `React.FC`; plain function declarations
- **Dark mode overrides** — `globals.css` contains `!important` overrides mapping Zinc classes to custom monochromatic palette (`#1a1a1a` / `#242424` / `#333333`). Never remove these.
- **Component placement** — reusable UI primitives in `components/ui/`; page-only helpers can be inline in page files
- **`cn()` utility** — use `cn()` from `@/lib/utils` for conditional class merging, not raw string concatenation

### Testing Rules

No test infrastructure currently in place.

### Code Quality & Style Rules

- **Prettier** — no semicolons, single quotes, trailing commas (`all`), 2-space indent, 80 char width, `prettier-plugin-tailwindcss` auto-sorts classes
- **ESLint** — FlatCompat with `next/core-web-vitals`, `next/typescript`, `plugin:prettier/recommended`
- **Component naming** — PascalCase components, kebab-case filenames (`components/ui/`)
- **Constants** — UPPER_SNAKE_CASE for exported data arrays (`PROJECTS`, `WORK_EXPERIENCE`)
- **Content IDs** — kebab-case (`aws-cloud-practitioner`, `ptn-global`)
- **Auto-generated files** — `app/data.ts` has `⚠️ DO NOT EDIT` header; never modify directly

### Development Workflow Rules

- **Content changes** — edit JSON files in `content/`, then run `npm run generate-data` to rebuild `app/data.ts`; `npm run dev` auto-runs this
- **Commit style** — conventional commits: `feat:`, `fix:` prefixes
- **Build** — `npm run build` runs `next build`; production strips `console.log`
- **Deploy** — Netlify via `netlify.toml` with `@netlify/plugin-nextjs`
- **Images** — project images go in `/images/`; run `npm run optimize-images` to process with sharp

### Critical Don't-Miss Rules

- **Never edit `app/data.ts`** — auto-generated from `content/*.json`; run `npm run generate-data` after JSON changes
- **Never create `tailwind.config.js`** — Tailwind CSS 4 config is in `globals.css` via `@theme` and `@layer base`
- **Never remove `!important` dark mode overrides in `globals.css`** — entire Zinc palette maps to custom monochromatic theme
- **Never import from `framer-motion`** — use `motion/react` (the `motion` package)
- **Never use `React.FC` or `forwardRef`** — React 19 patterns only
- **Experience filtering** — `content/experience/` files with `school` field are education entries; without it = work experience. Follow this convention.
- **Optional content** — `certifications/` and `profile/github-stats.json` have graceful fallbacks; absence won't break build
- **All content arrays need `order` field** — new JSON entries must include it for proper sorting
- **External links** — always use `rel="noopener noreferrer"` and `target="_blank"`
- **Project images** — first uses `loading="eager"` + `fetchPriority="high"`; rest use `loading="lazy"`; grayscale+sepia CSS filter is intentional
- **No secrets in content JSON** — content gets compiled into client-side bundle

---

## Usage Guidelines

**For AI Agents:**
- Read this file before implementing any code
- Follow ALL rules exactly as documented
- When in doubt, prefer the more restrictive option
- Update this file if new patterns emerge

**For Humans:**
- Keep this file lean and focused on agent needs
- Update when technology stack changes
- Review quarterly for outdated rules
- Remove rules that become obvious over time

Last Updated: 2026-06-06
