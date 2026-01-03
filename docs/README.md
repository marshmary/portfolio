# Portfolio Documentation

Welcome to the portfolio project documentation. This guide helps AI agents and developers understand the codebase and implement enhancements.

## Quick Start for AI Agents

### 📋 Essential Reading Order

1. **[Quick Reference](#quick-reference)** (this page) - Start here for immediate context
2. **[Brownfield PRD](./brownfield-prd.md)** - What we're building and why
3. **[Brownfield Architecture](./brownfield-architecture.md)** - How the system works

### 🎯 Project Overview

This is a **personal portfolio website** for a DevOps Engineer, built with:

- **Next.js 15** (App Router)
- **React 19**
- **Tailwind CSS v4**
- **Motion** animations
- **MDX** for blog posts

**Current State**: Static portfolio with hardcoded content
**Goal**: Make content easier to update and add more detailed information

### 🔥 Critical Files to Know

| File                              | Purpose                         | When to Modify                      |
| --------------------------------- | ------------------------------- | ----------------------------------- |
| `app/data.ts`                     | **ALL CONTENT LIVES HERE**      | Will be refactored in Phase 1       |
| `app/page.tsx`                    | Main portfolio page (346 lines) | When adding/updating UI sections    |
| `app/layout.tsx`                  | Root layout, theme, fonts       | Rarely; for metadata/global changes |
| `components/ui/*`                 | Reusable animated components    | When creating new UI patterns       |
| `app/globals.css`                 | Global styles, Tailwind config  | For new utility classes             |
| `docs/brownfield-prd.md`          | Enhancement requirements        | **READ THIS to understand goals**   |
| `docs/brownfield-architecture.md` | Technical documentation         | **READ THIS to understand system**  |

### 📁 Project Structure (Simplified)

```
portfolio/
├── app/
│   ├── data.ts           ← 🔴 All content is here
│   ├── page.tsx          ← 🔴 Main portfolio page
│   ├── layout.tsx        ← Root layout
│   ├── blog/             ← MDX blog posts
│   └── globals.css       ← Global styles
├── components/ui/        ← Animated UI components
├── lib/                  ← Utilities (cn function)
├── hooks/                ← Custom React hooks
├── content/              ← 🆕 Will be created in Phase 1
└── docs/                 ← 📄 This documentation
```

### 🎨 Current Content Types

All defined in `app/data.ts`:

| Type                | Count | Key Fields                           |
| ------------------- | ----- | ------------------------------------ |
| **Projects**        | 4     | name, description, link, video, id   |
| **Work Experience** | 3     | company, title, start, end, link, id |
| **Education**       | 1     | school, title, start, end, link, id  |
| **DevOps Skills**   | 6     | title, description, link, uid        |
| **Dev Skills**      | 3     | title, description, link, uid        |
| **Social Links**    | 2     | label, link                          |
| **Email**           | 1     | string                               |

### 🚨 Known Issues (Fix These If You See Them)

1. **Duplicate Project ID**: `app/data.ts:71` - "Neru" has `id: 'project3'` (should be 'project4')
2. **Empty LinkedIn URL**: `app/data.ts:183` - LinkedIn link is empty string
3. **No Type Validation**: Data types are TypeScript only (no runtime validation)

### 🎭 Animation Patterns (Follow These!)

**Consistent patterns used throughout**:

- Stagger animations for lists (0.15s between items)
- Fade + blur entrance effects
- Spring animations with `bounce: 0`
- Magnetic hover effects
- Morphing dialog transitions

**When adding animations**:
✅ Use Motion library
✅ Follow spring pattern with `bounce: 0`
✅ Fade + blur for entrances
❌ Don't mix animation libraries
❌ Don't use linear easing

### 🔧 Development Commands

```bash
npm run dev      # Start dev server (http://localhost:3000)
npm run build    # Production build
npm run lint     # Run ESLint
npm install      # Install dependencies
```

### 🚀 Deployment

- **Platform**: Netlify
- **URL**: https://portfolio.phutran.dev/
- **Trigger**: Automatic on push to `main` branch
- **Config**: `netlify.toml`

## Enhancement Implementation Plan

### Phase 1 - Content Restructuring ✅ COMPLETED

**Status**: ✅ Completed on 2025-11-07
**See**: [Phase 1 Implementation Details](./phase1-implementation.md)

**What Was Done**:

- ✅ Created `content/` directory structure
- ✅ Migrated all data to JSON files
- ✅ Implemented Zod schemas for validation
- ✅ Created build-time data generation script
- ✅ Enhanced all content types with 3-5x more fields
- ✅ Full backward compatibility maintained
- ✅ Build tested and passing

**Result**: Content is now in editable JSON files with validation!

### Phase 2 - UI Enhancements ✅ COMPLETED

**Status**: ✅ Completed on 2025-11-07
**See**: [Phase 2 Implementation Details](./phase2-implementation.md)

**What Was Done**:

- ✅ Created 4 new reusable UI components (TechBadge, ProjectCard, ExperienceCard, SkillCard)
- ✅ Enhanced project cards with technologies and key features
- ✅ Added expandable work experience with responsibilities and achievements
- ✅ Implemented skill proficiency indicators (4-level dot system)
- ✅ Integrated all components into main page
- ✅ Full responsive design maintained
- ✅ Complete dark mode support
- ✅ Zero performance regression

**Result**: Portfolio now displays all rich content interactively!

### Phase 1 - Content Restructuring (Week 1) - ORIGINAL PLAN

**Goal**: Move content from `app/data.ts` to structured files

**Tasks**:

1. Create `content/` directory structure
2. Define enhanced TypeScript types (see PRD)
3. Add Zod schemas for validation
4. Create content loader utilities
5. Migrate existing data to JSON files

**Files to Create**:

```
content/
├── projects/
├── experience/
├── skills/
├── profile/
└── schema/
```

### Phase 2 - UI Enhancements (Weeks 1-2)

**Goal**: Display enhanced content with better UI

**Tasks**:

1. Extend project cards with detailed information
2. Add expandable sections for work experience
3. Create skill proficiency indicators
4. Implement filtering/search functionality

**Components to Create/Update**:

- Project detail modal
- Enhanced experience card
- Skill badge component
- Section filtering

### Phase 3 - Testing & Polish (Weeks 2-3)

**Goal**: Ensure quality and consistency

**Tasks**:

1. Test animations with more content
2. Verify responsive design
3. Accessibility audit
4. Performance testing
5. Documentation updates

## Common Tasks & How to Do Them

### Adding a New Project

**Current Method** (will change in Phase 1):

1. Open `app/data.ts`
2. Add new object to `PROJECTS` array
3. Follow existing structure
4. Ensure unique `id`

**Future Method** (after Phase 1):

1. Create `content/projects/project-name.json`
2. Follow schema in `content/schema/types.ts`
3. Content auto-loaded on build

### Updating Styling

1. **Tailwind Classes**: Add directly to components
2. **Global Styles**: Update `app/globals.css`
3. **Component Styles**: Update `components/ui/styles/`

### Adding a New Section to Main Page

1. Import data from `app/data.ts` (or future content system)
2. Create `motion.section` in `app/page.tsx`
3. Apply animation variants: `VARIANTS_SECTION`
4. Follow existing section pattern
5. Test dark mode and responsive design

### Creating a New UI Component

1. Create file in `components/ui/`
2. Use Motion for animations
3. Support dark mode (`dark:` classes)
4. Make responsive (Tailwind breakpoints)
5. Export and document

## Coding Standards

### TypeScript

- Strict mode enabled
- Use proper types (no `any`)
- Use type inference where appropriate
- Path alias: `@/` for imports

### React

- Use functional components
- Use hooks for state/effects
- Client components: Add `'use client'` directive
- Server components: Default (no directive)

### Styling

- Tailwind utility classes preferred
- Use `cn()` utility for conditional classes
- Dark mode: Use `dark:` variant
- Responsive: Mobile-first approach

### Animation

- Use Motion library only
- Spring animations: `bounce: 0`
- Consistent timing: 0.3s duration typical
- Test performance

## Troubleshooting

### Build Fails

```bash
# Check TypeScript errors
npx tsc --noEmit

# Check ESLint
npm run lint

# Clean and rebuild
rm -rf .next && npm run build
```

### Animations Not Working

- Verify `'use client'` directive
- Check Motion import
- Verify no CSS conflicts

### Theme Not Switching

- Check localStorage (key: "theme")
- Verify ThemeProvider in layout
- Check dark: classes

## Important Links

- **PRD**: [brownfield-prd.md](./brownfield-prd.md) - Detailed requirements
- **Architecture**: [brownfield-architecture.md](./brownfield-architecture.md) - Technical details
- **Next.js Docs**: https://nextjs.org/docs
- **Tailwind v4**: https://tailwindcss.com/docs
- **Motion**: https://motion.dev/docs
- **Motion-Primitives**: https://motion-primitives.com

## Getting Help

### Before Starting a Task

1. ✅ Read the PRD to understand the goal
2. ✅ Read the Architecture doc for technical context
3. ✅ Check this Quick Reference for common patterns
4. ✅ Review existing code for similar patterns

### When Implementing

1. Follow existing animation patterns
2. Maintain type safety
3. Test dark mode and responsive design
4. Keep components reusable

### When Stuck

1. Check the Architecture doc's "Common Issues" section
2. Review similar components for patterns
3. Test in isolation before integrating

## Document Updates

| Date       | Change                         | Author      |
| ---------- | ------------------------------ | ----------- |
| 2025-11-07 | Initial documentation creation | Claude Code |

---

**Ready to start?** Read the [Brownfield PRD](./brownfield-prd.md) first to understand what we're building!
