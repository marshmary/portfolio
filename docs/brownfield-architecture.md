# Portfolio Website - Brownfield Architecture Document

## Introduction

This document captures the **CURRENT STATE** of the Personal Portfolio website codebase, including technical patterns, architecture decisions, and real-world implementation details. It serves as a reference for AI agents working on enhancements described in the [Brownfield PRD](./brownfield-prd.md).

### Document Scope

**Focused on areas relevant to**: Portfolio content enhancement, improved content management, and UI extensions for detailed information display.

### Change Log

| Date | Version | Description | Author |
|------|---------|-------------|--------|
| 2025-11-07 | 1.0 | Initial brownfield analysis | Claude Code |

## Quick Reference - Key Files and Entry Points

### Critical Files for Understanding the System

**Core Application**:
- **Main Entry**: `app/page.tsx` - Main portfolio page component
- **Root Layout**: `app/layout.tsx` - App-wide layout, theme provider, fonts
- **Data Source**: `app/data.ts` - **ALL portfolio content lives here** (projects, experience, skills)
- **Styles**: `app/globals.css` - Global styles and Tailwind configuration
- **Configuration**: `next.config.mjs` - Next.js config with MDX support

**Components**:
- **UI Components**: `components/ui/*` - Reusable animated components from Motion-Primitives
- **Header**: `app/header.tsx` - Name and title display
- **Footer**: `app/footer.tsx` - Footer component
- **Navigation**: `components/ui/nav-bar.tsx` - Navigation bar with theme toggle

**Blog**:
- **Blog Layout**: `app/blog/layout.tsx` - Blog post layout with scroll progress
- **Blog Posts**: `app/blog/*/page.mdx` - Individual blog posts in MDX format

**Utilities**:
- **Utils**: `lib/utils.ts` - Utility function (cn for className merging)
- **Constants**: `lib/constants.ts` - Application constants
- **Hooks**: `hooks/useClickOutside.tsx` - Custom React hook

**Configuration Files**:
- **TypeScript**: `tsconfig.json` - TypeScript configuration with path aliases
- **Netlify**: `netlify.toml` - Deployment configuration
- **Package**: `package.json` - Dependencies and scripts

### Enhancement Impact Areas

Based on the PRD, these files/modules will be affected:

**High Impact**:
- `app/data.ts` → Will be refactored into structured content directory
- `app/page.tsx` → Will need updates to display enhanced content
- **New**: `content/` directory structure (to be created)
- **New**: Enhanced TypeScript types for content schemas

**Medium Impact**:
- `components/ui/*` → May need new components for detailed views/modals
- `app/layout.tsx` → Possible metadata updates
- Blog components → Better integration with main portfolio

**Low Impact**:
- `app/header.tsx`, `app/footer.tsx` → Minimal changes
- Styling files → New classes for enhanced content display

## High Level Architecture

### Technical Summary

This is a **modern single-page application** (SPA) portfolio built with Next.js 15's App Router architecture. The application uses server and client components appropriately, with animations handled client-side via Motion library. Content is currently **hardcoded in TypeScript**, which is the primary constraint for easy updates.

**Key Characteristics**:
- Single-page layout with smooth scrolling sections
- Client-side animations using Motion library
- Static content with no backend/database
- Blog posts as MDX files (file-based content)
- Deployed as static site on Netlify

### Actual Tech Stack

| Category | Technology | Version | Notes |
|----------|------------|---------|-------|
| **Runtime** | Node.js | ^20 | Required for Next.js 15 |
| **Framework** | Next.js | 15.1.1 | Uses App Router (not Pages Router) |
| **UI Library** | React | 19.0.0 | Latest version with new features |
| **Styling** | Tailwind CSS | 4.0.0 | Using new v4 features, PostCSS plugin |
| **Animation** | Motion | 11.15.0 | Modern animation library |
| **Motion Components** | Motion-primitives | Custom components | Spotlight, Magnetic, MorphingDialog, etc. |
| **Content** | MDX | 3.0.1 | For blog posts only |
| **Fonts** | Geist, Geist Mono | Latest | Google Fonts via next/font |
| **Theme** | next-themes | 0.4.4 | Dark/light mode switching |
| **Icons** | lucide-react | 0.468.0 | Icon library |
| **Code Highlighting** | sugar-high | 0.9.3 | Syntax highlighting for code blocks |
| **Utilities** | clsx, tailwind-merge | Latest | ClassName utilities |
| **Deployment** | Netlify | - | With @netlify/plugin-nextjs |
| **Package Manager** | npm | - | Standard npm |

### Repository Structure Reality Check

- **Type**: Single repository (monorepo-style but small project)
- **Package Manager**: npm (package-lock.json present)
- **Build Output**: `.next/` directory (gitignored)
- **Deployment**: Static export via Netlify

## Source Tree and Module Organization

### Project Structure (Actual)

```text
portfolio/
├── app/                          # Next.js App Router directory
│   ├── blog/                     # Blog section
│   │   ├── layout.tsx           # Blog post layout (scroll progress, copy button)
│   │   ├── example-mdx-metadata/
│   │   │   └── page.mdx
│   │   └── exploring-the-intersection-of-design-ai-and-design-engineering/
│   │       └── page.mdx
│   ├── data.ts                   # ⚠️ CRITICAL: All portfolio content defined here
│   ├── favicon.ico
│   ├── footer.tsx               # Footer component
│   ├── globals.css              # Global styles, Tailwind imports, syntax highlighting theme
│   ├── header.tsx               # Header with name and title
│   ├── layout.tsx               # Root layout (theme provider, fonts, structure)
│   ├── page.tsx                 # ⚠️ MAIN PAGE: All portfolio sections defined here
│   └── robots.ts                # Robots.txt generation
│
├── components/
│   └── ui/                       # Reusable UI components (Motion-Primitives)
│       ├── animated-background.tsx
│       ├── magnetic.tsx
│       ├── morphing-dialog.tsx
│       ├── nav-bar.tsx          # Navigation with theme toggle
│       ├── scroll-progress.tsx
│       ├── spotlight.tsx
│       ├── text-effect.tsx
│       ├── text-loop.tsx
│       ├── text-morph.tsx
│       └── styles/
│           └── navBar.css
│
├── hooks/
│   └── useClickOutside.tsx      # Custom hook for click outside detection
│
├── lib/
│   ├── constants.ts             # Application constants
│   └── utils.ts                 # Utility functions (cn for className merging)
│
├── public/                       # Static assets (images, videos, etc.)
│
├── docs/                         # 📄 Documentation (this document)
│   ├── brownfield-prd.md
│   └── brownfield-architecture.md
│
├── .next/                        # Build output (gitignored)
├── node_modules/                 # Dependencies (gitignored)
│
├── .gitignore
├── .prettierrc.json             # Prettier configuration
├── eslint.config.mjs            # ESLint configuration
├── mdx-components.tsx           # MDX components configuration
├── netlify.toml                 # Netlify deployment config
├── next-env.d.ts                # Next.js TypeScript declarations
├── next.config.mjs              # Next.js configuration
├── package.json                 # Dependencies and scripts
├── postcss.config.mjs           # PostCSS configuration
├── README.md                    # Basic project info
└── tsconfig.json                # TypeScript configuration
```

### Key Modules and Their Purpose

#### 1. **Content Module** (`app/data.ts`)
**⚠️ CRITICAL FOR ENHANCEMENTS**

This file contains ALL portfolio content as TypeScript constants:
- `PROJECTS: Project[]` - Array of 4 projects
- `WORK_EXPERIENCE: WorkExperience[]` - Array of 3 work positions
- `EDUCATIONS: Education[]` - Array of 1 education entry
- `DEVOPS_SKILLS: Skills[]` - Array of 6 DevOps skill categories
- `DEV_SKILLS: Skills[]` - Array of 3 development skill categories
- `SOCIAL_LINKS: SocialLink[]` - Array of social media links
- `EMAIL: string` - Contact email

**Current Limitations**:
- Must modify code to update content
- No validation or schema enforcement
- Limited fields for each content type
- No rich text support

**Enhancement Plan**: This will be refactored into a `content/` directory structure with JSON/YAML files.

#### 2. **Main Page Component** (`app/page.tsx`)
**⚠️ WILL REQUIRE UPDATES**

- 346 lines of client-side React code
- Uses `'use client'` directive (animations require client-side)
- Imports all data from `app/data.ts`
- Defines animation variants:
  - `VARIANTS_CONTAINER` - Stagger children animation
  - `VARIANTS_SECTION` - Fade in with blur effect
  - `TRANSITION_SECTION` - 0.3s duration
- Contains helper components:
  - `ProjectVideo` - Video player with morphing dialog zoom
  - `MagneticSocialLink` - Magnetic hover effect for social links
- Main `Personal` component with sections:
  - About section
  - Work Experience (with Spotlight effect)
  - Education (with Spotlight effect)
  - DevOps Skills (with AnimatedBackground)
  - Development Skills (with AnimatedBackground)
  - Projects (grid layout with videos)
  - Connect/Contact section

**Pattern**: Each section uses `motion.section` with stagger animation.

#### 3. **Root Layout** (`app/layout.tsx`)

- Defines page metadata (title, description, canonical URL)
- Loads Geist and Geist Mono fonts
- Sets up `ThemeProvider` from next-themes
- Includes NavBar, Header, main content, and Footer
- Sets viewport configuration

**Notable**:
- Metadata base URL: `https://portfolio.phutran.dev/`
- Theme stored in localStorage with key "theme"

#### 4. **UI Components** (`components/ui/*`)

All components are from Motion-Primitives library, providing:
- **animated-background.tsx** - Animated background effect on hover
- **magnetic.tsx** - Magnetic hover effect
- **morphing-dialog.tsx** - Modal with morphing animation
- **nav-bar.tsx** - Navigation with smooth scrolling and theme toggle
- **scroll-progress.tsx** - Reading progress bar for blog posts
- **spotlight.tsx** - Spotlight hover effect (used in work/education cards)
- **text-effect.tsx** - Text animation effects
- **text-loop.tsx** - Looping text animation
- **text-morph.tsx** - Text morphing animation

**Consistency**: All use Motion library with spring animations (bounce: 0 pattern common).

#### 5. **Blog System** (`app/blog/`)

- Uses MDX for blog posts
- Each post in its own directory with `page.mdx`
- Custom blog layout with:
  - Scroll progress bar
  - Copy URL button
  - Backdrop blur effect
  - Prose styling for typography

**Current State**:
- 2 example blog posts
- Not integrated with main portfolio page
- Accessible via `/blog/[slug]` routes

#### 6. **Styling System** (`app/globals.css`)

- Uses Tailwind CSS v4 with `@import 'tailwindcss'`
- Includes `@tailwindcss/typography` plugin for blog prose
- Custom dark mode variant: `@custom-variant dark (&:is(.dark *))`
- Syntax highlighting theme variables (`:root`)
- Border color compatibility layer for Tailwind v4

**Custom Variables**:
```css
--sh-class, --sh-sign, --sh-string, --sh-keyword, --sh-comment, --sh-jsxliterals, --sh-property, --sh-entity
```
These are for sugar-high syntax highlighting.

#### 7. **Configuration**

**TypeScript (`tsconfig.json`)**:
- Target: ES2017
- Module: esnext with bundler resolution
- Path alias: `@/*` maps to root
- Strict mode enabled

**Next.js (`next.config.mjs`)**:
- React strict mode enabled
- Page extensions: `['js', 'jsx', 'ts', 'tsx', 'md', 'mdx']`
- MDX support via `@next/mdx`

**Netlify (`netlify.toml`)**:
- Build command: `next build`
- Publish directory: `.next`
- Uses `@netlify/plugin-nextjs` plugin

## Data Models and APIs

### Current Data Models

Instead of duplicating, reference actual model definitions in `app/data.ts`:

#### Type Definitions (Lines 1-37)

```typescript
// See app/data.ts:1-7
type Project = {
  name: string
  description: string
  link: string
  video: string
  id: string
}

// See app/data.ts:9-16
type WorkExperience = {
  company: string
  title: string
  start: string
  end: string
  link: string
  id: string
}

// See app/data.ts:18-25
type Education = {
  school: string
  title: string
  start: string
  end: string
  link: string
  id: string
}

// See app/data.ts:27-32
type Skills = {
  title: string
  description: string
  link: string
  uid: string
}

// See app/data.ts:34-37
type SocialLink = {
  label: string
  link: string
}
```

#### Data Instances

- **Projects**: 4 projects (Avis, Hoc su, Draplus, Neru) - Lines 39-73
- **Work Experience**: 3 positions (PTN Global, Biwoco, FPT Software) - Lines 75-100
- **Education**: 1 degree (FPT University) - Lines 102-111
- **DevOps Skills**: 6 skill categories - Lines 113-152
- **Dev Skills**: 3 skill categories - Lines 154-174
- **Social Links**: 2 links (GitHub, LinkedIn) - Lines 176-185
- **Email**: Contact email - Line 187

**Issue**: LinkedIn link is empty string (line 183).

### API Specifications

**No External APIs**: This is a static portfolio with no backend API.

**Internal Data Flow**:
1. Data defined in `app/data.ts`
2. Imported into `app/page.tsx`
3. Mapped to UI components
4. Rendered on page

**For Blog Posts**:
- MDX files are parsed by Next.js MDX plugin
- Metadata extracted from file structure
- Rendered with blog layout

### Routing Structure

- `/` - Main portfolio page (app/page.tsx)
- `/blog/[slug]` - Individual blog posts (app/blog/*/page.mdx)
- Automatic routes generated by App Router

## Technical Debt and Known Issues

### Current Technical Debt

1. **⚠️ CRITICAL: Content Management**
   - **Location**: `app/data.ts`
   - **Issue**: All content hardcoded in TypeScript
   - **Impact**: Requires code changes and deployment for content updates
   - **Plan**: Refactor to file-based content system (see PRD)

2. **Limited Type Safety**
   - **Location**: `app/data.ts`
   - **Issue**: No runtime validation, just TypeScript compile-time checks
   - **Impact**: Could introduce data errors
   - **Recommendation**: Add Zod or similar for runtime validation

3. **Missing Content Fields**
   - **Location**: All data types in `app/data.ts`
   - **Issue**: Types lack fields for detailed information (see PRD for details)
   - **Impact**: Cannot showcase full project/experience details
   - **Plan**: Extend types with additional fields

4. **Incomplete Social Links**
   - **Location**: `app/data.ts:183`
   - **Issue**: LinkedIn link is empty string
   - **Impact**: Non-functional social link
   - **Fix**: Add LinkedIn URL or remove from display

5. **Blog Integration**
   - **Location**: Blog system and main page are disconnected
   - **Issue**: Blog posts not showcased on main portfolio page
   - **Impact**: Visitors may not discover blog content
   - **Recommendation**: Add blog preview section to main page

6. **Duplicate Project ID**
   - **Location**: `app/data.ts:71`
   - **Issue**: "Neru" project has `id: 'project3'` (duplicate of Draplus)
   - **Impact**: Potential React key conflicts
   - **Fix**: Change to `id: 'project4'`

### Workarounds and Gotchas

1. **Client-Side Animations**
   - **Pattern**: Main page uses `'use client'` directive
   - **Reason**: Motion animations require client-side React
   - **Implication**: Page is not server-rendered, entire component bundle sent to client
   - **Note**: This is acceptable for portfolio, but be aware for performance

2. **Tailwind v4 Border Colors**
   - **Location**: `app/globals.css:13-21`
   - **Reason**: Tailwind v4 changed default border color to `currentColor`
   - **Workaround**: Compatibility layer sets border color globally
   - **Note**: May need updates when applying border utilities

3. **Theme Provider Hydration**
   - **Location**: `app/layout.tsx:43`
   - **Pattern**: `suppressHydrationWarning` on `<html>` tag
   - **Reason**: Theme is applied via JavaScript after initial render
   - **Note**: Required for next-themes to work without hydration errors

4. **Font Loading**
   - **Pattern**: Geist fonts loaded via next/font with CSS variables
   - **Variables**: `--font-geist`, `--font-geist-mono`
   - **Usage**: Applied to body with `className={...}`
   - **Note**: Fonts are optimized and self-hosted by Next.js

5. **Video Autoplay**
   - **Location**: `app/page.tsx:58-63`
   - **Pattern**: Videos are autoplay, loop, muted
   - **Reason**: Allows autoplay without user interaction (browser restriction)
   - **Note**: Keep muted for autoplay to work on all browsers

## Integration Points and External Dependencies

### External Services

| Service | Purpose | Integration Type | Key Files |
|---------|---------|------------------|-----------|
| Google Fonts | Font loading | Next.js `next/font` | `app/layout.tsx` |
| Netlify | Hosting & deployment | Static site hosting | `netlify.toml` |
| Cloudinary | Video hosting | External CDN URLs | `app/data.ts` (video URLs) |
| External websites | Project demos | Direct links | `app/data.ts` (link fields) |

**Note**: No authentication, no databases, no API integrations currently.

### Internal Integration Points

1. **Component to Data Binding**
   - `app/page.tsx` imports from `app/data.ts`
   - Data mapped to components via `.map()` calls
   - Props passed down to child components

2. **Theme System**
   - `next-themes` ThemeProvider in `app/layout.tsx`
   - Theme toggle in `components/ui/nav-bar.tsx`
   - Dark mode styles via Tailwind dark: variant
   - Stored in localStorage with key "theme"

3. **Navigation**
   - Smooth scrolling to sections via anchor links
   - Navigation bar in `components/ui/nav-bar.tsx`
   - Sections have IDs: `#about`, `#projects`, `#contact`

4. **MDX Blog System**
   - MDX files in `app/blog/[slug]/page.mdx`
   - Processed by `@next/mdx` plugin
   - Custom layout in `app/blog/layout.tsx`
   - MDX components configuration in `mdx-components.tsx`

## Development and Deployment

### Local Development Setup

**Prerequisites**:
- Node.js 20 or higher
- npm (comes with Node.js)

**Setup Steps**:
```bash
# 1. Install dependencies
npm install

# 2. Run development server
npm run dev

# 3. Open browser
# Navigate to http://localhost:3000
```

**Development Server**:
- Port: 3000 (default)
- Hot reload enabled
- Fast Refresh for instant feedback

**Known Setup Issues**:
- Ensure Node.js version >= 20 (required for Next.js 15)
- If port 3000 is in use, Next.js will prompt for alternative port

### Build and Deployment Process

**Build Commands** (from `package.json`):
```bash
npm run dev      # Start development server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

**Build Process**:
1. Next.js compiles TypeScript
2. Tailwind CSS processes styles
3. MDX files compiled to React components
4. Static assets optimized
5. Output in `.next/` directory

**Deployment**:
- **Platform**: Netlify
- **Configuration**: `netlify.toml`
- **Build Command**: `next build`
- **Publish Directory**: `.next`
- **Plugin**: `@netlify/plugin-nextjs` for Next.js optimization
- **URL**: https://portfolio.phutran.dev/

**Deployment Trigger**:
- Automatic on git push to main branch
- Manual via Netlify dashboard

**Environment Variables**: None currently required

### Version Control

**Git Status** (as of session start):
- Current branch: `main`
- Recent commits:
  - `fa1cacb` - fix: try changing netlify config
  - `f356822` - fix: deploy nextjs in netlify
  - `5613c71` - feat: portfolio v2

**Untracked Directories**:
- `.bmad-core/`
- `.bmad-infrastructure-devops/`
- `.claude/`
- `.serena/`

**Note**: These are tool-specific directories (BMad, Claude Code, Serena) and should likely be added to `.gitignore` if not needed in repository.

## Testing Reality

### Current Test Coverage

**Unit Tests**: ❌ None
**Integration Tests**: ❌ None
**E2E Tests**: ❌ None
**Manual Testing**: ✅ Primary QA method

### Testing Approach

Currently, testing is done manually:
- Visual inspection during development
- Browser testing (Chrome, Firefox, Safari)
- Mobile responsiveness testing
- Dark/light theme switching
- Animation smoothness

### Recommendations for Future

When implementing enhancements:
1. **Add Type Validation**: Use Zod for content schema validation
2. **Visual Regression Testing**: Consider tools like Playwright for E2E
3. **Accessibility Testing**: Use axe-core or similar for a11y checks
4. **Performance Testing**: Lighthouse CI for performance monitoring

## Animation System and Motion Patterns

### Animation Philosophy

The portfolio uses a **consistent animation language** via Motion library:
- **Stagger animations** for sequential reveals
- **Spring physics** with `bounce: 0` for smooth, natural motion
- **Fade + blur** entrance effects
- **Magnetic interactions** for tactile feedback
- **Morphing transitions** for dialog/modal expansions

### Common Animation Patterns

**1. Section Entrance Animation** (`app/page.tsx:25-42`)
```typescript
const VARIANTS_CONTAINER = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
}

const VARIANTS_SECTION = {
  hidden: { opacity: 0, y: 20, filter: 'blur(8px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)' }
}

const TRANSITION_SECTION = { duration: 0.3 }
```

**Usage**: Applied to `motion.main` and `motion.section` elements.

**2. Text Effects** (`app/header.tsx`)
- Uses `TextEffect` component with `preset="fade"` and `per="char"`
- Animates each character individually
- Delay: 0.5s

**3. Hover Effects**
- **Spotlight**: Light follows cursor on work/education cards
- **Magnetic**: Social links have magnetic hover attraction
- **Animated Background**: Skills sections have animated hover states

**4. Modal/Dialog**
- **MorphingDialog**: Smooth scale + position morphing
- Spring transition with `bounce: 0, duration: 0.3`

### When Adding New Components

**✅ DO**:
- Use spring animations with `bounce: 0`
- Follow stagger pattern for lists
- Use consistent fade + blur entrance
- Test animation performance

**❌ DON'T**:
- Mix different animation libraries
- Use linear easing (breaks spring feel)
- Overload page with too many animations
- Animate expensive properties (use transform and opacity)

## Enhancement Implementation Guide

Based on the PRD, here's guidance for implementing enhancements:

### Phase 1 - Content Restructuring

**Files to Create**:
```
content/
├── projects/
│   ├── avis.json
│   ├── hocsu.json
│   ├── draplus.json
│   └── neru.json
├── experience/
│   ├── ptn-global.json
│   ├── biwoco.json
│   └── fpt-software.json
├── skills/
│   ├── devops.json
│   └── development.json
├── profile/
│   ├── about.json
│   └── social.json
└── schema/
    └── types.ts
```

**Files to Modify**:
- `app/data.ts` → Refactor to read from content files
- TypeScript types → Extend with new fields (see PRD)

**Implementation Approach**:
1. Create content directory structure
2. Define enhanced TypeScript types
3. Create utility functions to read JSON files
4. Add Zod schemas for validation
5. Migrate existing data to new format
6. Update imports in `app/page.tsx`

### Phase 2 - Enhanced UI Components

**New Components to Create**:
- `components/ui/project-detail-modal.tsx` - Detailed project view
- `components/ui/experience-card.tsx` - Enhanced experience card with expandable details
- `components/ui/skill-badge.tsx` - Skill badge with proficiency indicator
- `components/ui/section-heading.tsx` - Consistent section headings

**Existing Components to Extend**:
- Update project cards in `app/page.tsx` to show more fields
- Enhance work experience cards with expandable sections
- Add filtering/search to skills sections

**Design Consistency**:
- Follow existing color scheme (zinc palette)
- Use existing animation patterns
- Maintain responsive grid layouts
- Keep dark mode support

### Phase 3 - Content Update Workflow

**Documentation to Create**:
- `docs/content-guide.md` - Guide for updating content
- `content/README.md` - Content structure explanation
- JSON schema files for validation

**Tooling to Consider**:
- JSON schema validator script
- Content linting/validation in CI
- Template generator for new content entries

### Files That Will Need Modification Summary

**🔴 High Priority** (Significant changes required):
1. `app/data.ts` - Complete refactor to load from content files
2. `app/page.tsx` - Update to handle new data structure and display additional fields
3. **New** `content/` directory - Create entire content structure
4. **New** `lib/content-loader.ts` - Utility to load and validate content

**🟡 Medium Priority** (Moderate updates):
5. `components/ui/*` - Extend or create new components for detailed views
6. `app/layout.tsx` - Update metadata if adding new sections
7. `app/globals.css` - Add new utility classes if needed
8. `tsconfig.json` - May need to include content directory

**🟢 Low Priority** (Minor or no changes):
9. Configuration files - Minimal changes expected
10. `app/header.tsx`, `app/footer.tsx` - Likely no changes needed
11. Blog system - Minor integration updates

### Integration Considerations

**When implementing enhancements**:

1. **Preserve Animation Patterns**
   - Use existing animation variants
   - Follow stagger pattern for new lists
   - Test animation performance with more content

2. **Maintain Theme Support**
   - All new components must support dark mode
   - Use Tailwind dark: variant consistently
   - Test in both themes

3. **Keep Responsive Design**
   - Test all breakpoints (sm, md, lg)
   - Maintain mobile-first approach
   - Use Tailwind responsive utilities

4. **Follow Component Patterns**
   - Keep client/server component boundaries clear
   - Use 'use client' only when necessary (animations, interactions)
   - Extract reusable logic into hooks

5. **Type Safety**
   - Add Zod schemas for runtime validation
   - Keep TypeScript types in sync with schemas
   - Use type inference where possible

## Accessibility Considerations

### Current Accessibility Features

✅ **Good Practices**:
- Semantic HTML structure
- Proper heading hierarchy (h1, h2, h3, h4)
- Keyboard accessible navigation
- Theme toggle accessible via keyboard
- Sufficient color contrast in both themes
- Responsive design for various viewport sizes

⚠️ **Areas to Verify**:
- Alt text for images/videos (currently using videos which may need captions)
- Focus indicators on interactive elements
- Screen reader testing needed
- ARIA labels for icon-only buttons

### Enhancement Accessibility Requirements

When implementing enhancements:
1. **Expandable Content**: Use proper ARIA attributes (aria-expanded, aria-controls)
2. **Modals/Dialogs**: Implement focus trapping and Escape key handling
3. **Filtering**: Announce filter results to screen readers
4. **New Content**: Ensure all content is keyboard accessible

## Performance Considerations

### Current Performance Characteristics

**Good**:
- Next.js optimizations (code splitting, image optimization)
- Font subsetting and optimization via next/font
- Static generation where possible
- Minimal JavaScript bundle for content-focused page

**Watch Out For**:
- Video files hosted on Cloudinary (ensure proper compression)
- Motion animations (generally performant but test with more content)
- Client-side rendering of entire main page (consider partial SSR in future)

### Enhancement Performance Guidelines

1. **Content Loading**:
   - Consider lazy loading for below-fold content
   - Implement pagination or infinite scroll if content grows significantly
   - Cache content in memory during build

2. **Images/Media**:
   - Use Next.js Image component for optimization
   - Implement lazy loading for images
   - Consider video thumbnails instead of autoplay for many projects

3. **Animations**:
   - Use `will-change` sparingly
   - Prefer transform and opacity animations
   - Test with Performance DevTools

## Appendix - Useful Commands and Scripts

### Frequently Used Commands

```bash
# Development
npm run dev              # Start dev server on http://localhost:3000
npm run build            # Production build
npm run start            # Start production server
npm run lint             # Run ESLint

# Package Management
npm install              # Install dependencies
npm update               # Update dependencies
npm outdated             # Check for outdated packages

# Cleaning
rm -rf .next node_modules    # Clean build and dependencies
npm install                  # Reinstall
```

### Debugging and Troubleshooting

**Logs**:
- Development: Console in browser and terminal
- Build: Terminal output during `npm run build`
- Production: Netlify function logs (if applicable)

**Debug Mode**:
- React DevTools: Inspect component tree
- Network tab: Check resource loading
- Lighthouse: Performance audit

**Common Issues**:

1. **Build Fails**:
   - Check TypeScript errors: `npx tsc --noEmit`
   - Check ESLint: `npm run lint`
   - Clear `.next`: `rm -rf .next && npm run build`

2. **Animations Not Working**:
   - Verify component has `'use client'` directive
   - Check Motion library is imported correctly
   - Verify no CSS conflicts

3. **Theme Not Switching**:
   - Check localStorage (key: "theme")
   - Verify ThemeProvider is wrapping app
   - Check dark: variant in Tailwind classes

4. **Hot Reload Issues**:
   - Restart dev server
   - Clear `.next` directory
   - Check file watchers (may hit limit on some systems)

### Git Workflow

```bash
# Check status
git status

# Stage and commit changes
git add .
git commit -m "feat: description of changes"

# Push to remote (triggers Netlify deployment)
git push origin main

# View recent commits
git log --oneline -5
```

### Quick Reference - Path Aliases

- `@/` → Project root
- Example: `import { cn } from '@/lib/utils'`

### Quick Reference - Important URLs

- **Production**: https://portfolio.phutran.dev/
- **Repository**: (Add if public GitHub repo)
- **Design Reference**: https://motion-primitives.com
- **Next.js Docs**: https://nextjs.org/docs

---

## Next Steps for Implementation

Based on the PRD, the recommended implementation order:

1. ✅ **Documentation Complete** (This document)
2. 🔄 **Phase 1**: Content restructuring (Week 1)
   - Create content directory structure
   - Define enhanced TypeScript types and Zod schemas
   - Create content loader utilities
   - Migrate existing data to new format

3. 🔄 **Phase 2**: UI enhancements (Weeks 1-2)
   - Extend project cards with detailed views
   - Enhance work experience timeline
   - Add skill proficiency indicators
   - Implement filtering/categorization

4. 🔄 **Phase 3**: Integration and testing (Weeks 2-3)
   - Test all animations with enhanced content
   - Verify responsive design
   - Accessibility audit
   - Performance testing

5. 🔄 **Phase 4**: Documentation and launch (Week 3-4)
   - Create content update guide
   - Document new patterns
   - Final QA and deployment

---

**Document Status**: ✅ Complete and ready for implementation
**Last Updated**: 2025-11-07
**Next Action**: Begin Phase 1 - Content restructuring with AI assistance
