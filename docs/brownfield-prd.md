# Portfolio Enhancement - Brownfield PRD

## Document Information

| Field | Value |
|-------|-------|
| **Project** | Personal Portfolio Website Enhancement |
| **Document Type** | Brownfield Product Requirements Document |
| **Author** | Portfolio Owner |
| **Status** | Planning |
| **Timeline** | Near Future (Next Few Weeks) |
| **Last Updated** | 2025-11-07 |

## Executive Summary

This PRD outlines multiple enhancements to the existing personal portfolio website built with Next.js 15, React 19, and Motion-Primitives. The primary goals are to make content easier to update, add more detailed information to various sections, and improve the overall maintainability while preserving the existing design aesthetic and CV export functionality.

## Current State Analysis

### Existing System Overview

The portfolio is a single-page application featuring:
- Personal introduction and about section
- Work experience timeline
- Education history
- DevOps and Development skills showcase
- Projects gallery with video previews
- Blog support with MDX
- Dark/light theme toggle
- Animated UI components using Motion-Primitives

### Technology Stack

- **Framework**: Next.js 15 (App Router)
- **UI Library**: React 19
- **Styling**: Tailwind CSS v4
- **Animation**: Motion library (v11.15.0)
- **Content**: MDX for blog posts
- **Typography**: Geist font family
- **Deployment**: Netlify with Next.js plugin

### Current Pain Points

1. **Content Update Friction**: All content is hardcoded in `app/data.ts`, requiring code changes for simple content updates
2. **Limited Details**: Current sections lack depth and detailed information about projects, experience, and skills
3. **Maintainability**: Mixing data with code makes it harder to manage content at scale
4. **Scalability**: Adding new content types or sections requires code modifications

### What's Working Well

- Clean, minimal design aesthetic
- Smooth animations and interactions
- Good performance and responsiveness
- Effective use of Motion-Primitives for visual appeal
- Blog functionality with MDX
- Theme switching capability
- Deployment pipeline (Netlify)

## Problem Statement

The current portfolio requires developer intervention (code changes) for content updates, which creates friction for regular updates and limits the ability to quickly showcase new work, skills, or experiences. Additionally, the content sections lack the depth needed to effectively communicate expertise and project details to potential employers or clients.

## Goals and Objectives

### Primary Goals

1. **Simplify Content Management**: Reduce friction in updating portfolio content without requiring code changes for every update
2. **Enhance Content Depth**: Add more detailed information across all sections (projects, experience, skills)
3. **Improve Maintainability**: Better separate content from presentation logic
4. **Preserve Core Functionality**: Maintain CV export capability and all existing features

### Success Criteria

- Content updates can be made with minimal technical intervention
- Portfolio contains comprehensive details about projects, experience, and skills
- No regression in existing functionality (animations, theme, responsiveness)
- Documentation enables AI agents to make changes confidently
- Codebase remains clean and maintainable

## Proposed Enhancements

### 1. Enhanced Content Structure

**Priority**: High
**Effort**: Medium
**Impact**: High

#### Current State
- Content defined in `app/data.ts` as TypeScript objects
- Limited fields for each content type
- Requires code deployment for updates

#### Proposed Changes

**Option A - Enhanced Data Files (Recommended for Near Term)**
- Expand data structures to include more fields
- Add support for rich text descriptions
- Consider moving to JSON/YAML for easier editing
- Maintain TypeScript types for validation

**Option B - MDX-Based Content (Future Enhancement)**
- Move content to MDX files (similar to blog posts)
- Enable rich formatting and embedded components
- Easier to edit without code knowledge

**New Fields to Add**:

**Projects**:
- Detailed description (multi-paragraph)
- Technologies used (array of tech stack)
- Key features/highlights
- Challenges and solutions
- Project duration/timeline
- Team size and role
- GitHub repository link
- Live demo link
- Screenshots/images gallery (beyond current video)

**Work Experience**:
- Detailed responsibilities (bullet points)
- Key achievements/metrics
- Technologies used
- Team size and structure
- Notable projects during tenure

**Skills**:
- Proficiency level (beginner/intermediate/advanced)
- Years of experience
- Certifications (if applicable)
- Related projects using this skill

### 2. Content Organization Improvements

**Priority**: High
**Effort**: Low-Medium
**Impact**: Medium

- Create a dedicated `content/` directory structure
- Separate content files by type (projects, experience, skills)
- Maintain clear schema documentation
- Add content validation

**Proposed Structure**:
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
└── schema/
    └── types.ts
```

### 3. UI Enhancements for Detailed Content

**Priority**: Medium
**Effort**: Medium
**Impact**: Medium

- Expand project cards to show more information
- Add expandable sections or modals for detailed views
- Implement "Read More" functionality for truncated content
- Add filtering/categorization for projects and skills
- Enhance work experience timeline with expandable details

### 4. Content Update Workflow

**Priority**: Medium
**Effort**: Low
**Impact**: High

- Document clear process for updating content
- Create content templates for new entries
- Add validation to prevent errors
- Consider simple admin interface (future phase)

### 5. CV/Resume Export Enhancement

**Priority**: Medium
**Effort**: Medium
**Impact**: Medium

- Maintain existing PDF export capability
- Ensure new detailed content is included in export
- Add formatting options for CV layout
- Consider multiple CV templates/formats

### 6. Additional Sections

**Priority**: Low-Medium
**Effort**: Variable
**Impact**: Medium

Potential new sections to add:
- **Testimonials/Recommendations**: References from colleagues or clients
- **Certifications**: Professional certifications and credentials
- **Speaking/Writing**: Conference talks, blog posts, articles
- **Open Source Contributions**: GitHub contributions, maintained projects
- **Awards and Recognition**: Professional achievements

### 7. Improved Blog Integration

**Priority**: Low
**Effort**: Low
**Impact**: Low-Medium

- Better integration of blog with portfolio sections
- Add blog post preview on main page
- Tag/category system for blog posts
- Related projects/skills linking

## Technical Implementation Considerations

### Architecture Decisions

1. **Content Storage**:
   - **Near Term**: Enhanced JSON/YAML files in `content/` directory
   - **Future**: Headless CMS integration (Sanity, Contentful, etc.)

2. **Type Safety**:
   - Maintain TypeScript types for all content structures
   - Add runtime validation using Zod or similar

3. **Component Architecture**:
   - Keep existing component structure
   - Extend components to handle additional data fields
   - Create new detail view components as needed

4. **Animation Consistency**:
   - Maintain existing Motion-Primitives patterns
   - Ensure new components follow animation guidelines

### Files That Will Be Impacted

**High Impact** (Significant changes):
- `app/data.ts` - Will be refactored/relocated
- `app/page.tsx` - Will need updates to display additional content
- New files in `content/` directory

**Medium Impact** (Moderate changes):
- `components/ui/*` - May need extensions for detailed views
- `app/layout.tsx` - Possible metadata updates

**Low Impact** (Minor changes):
- `app/header.tsx`, `app/footer.tsx` - Minimal or no changes
- `app/globals.css` - Possible new styles for enhanced content
- Configuration files - Minimal changes

### Migration Strategy

1. **Phase 1 - Data Structure** (Week 1):
   - Create new content directory structure
   - Define enhanced TypeScript types
   - Migrate existing data to new format
   - Add validation

2. **Phase 2 - Enhanced Content** (Week 1-2):
   - Add detailed content for projects
   - Expand work experience details
   - Enhance skills information

3. **Phase 3 - UI Updates** (Week 2-3):
   - Update components to display new fields
   - Add expandable/detailed views
   - Implement filtering/categorization
   - Test responsiveness

4. **Phase 4 - Documentation & Polish** (Week 3-4):
   - Document content update process
   - Create content templates
   - Final testing and refinement
   - Update README and documentation

## Non-Functional Requirements

### Performance
- No degradation in page load time
- Maintain current animation performance
- Efficient content loading

### Accessibility
- Maintain WCAG 2.1 AA compliance
- Keyboard navigation for all new features
- Screen reader compatibility

### Browser Compatibility
- Support modern browsers (Chrome, Firefox, Safari, Edge)
- Responsive design for all screen sizes
- Graceful degradation for older browsers

### SEO
- Maintain or improve current SEO
- Proper meta tags for detailed content
- Structured data for projects and experience

## Dependencies and Constraints

### Technical Dependencies
- Next.js 15 App Router patterns
- React 19 features and limitations
- Tailwind CSS v4 capabilities
- Motion-Primitives animation system

### Constraints
- Must maintain existing deployment on Netlify
- No breaking changes to current URLs
- Preserve existing design aesthetic
- Budget considerations (prefer free/low-cost solutions)

## Success Metrics

1. **Content Update Time**: Reduce time to add/update content by 70%
2. **Content Depth**: Increase average content detail by 3-5x
3. **Maintainability**: Enable non-developer content updates
4. **Performance**: Maintain <3s initial page load
5. **User Engagement**: Track time on page and interactions (if analytics added)

## Future Considerations

Beyond the initial enhancement scope:
- Headless CMS integration for truly code-free updates
- Admin dashboard for content management
- Multi-language support
- Analytics integration
- Contact form functionality
- Newsletter/blog subscription
- Integration with LinkedIn/GitHub APIs for automatic updates

## Appendix

### Content Schema Examples

**Enhanced Project Schema**:
```typescript
interface Project {
  // Existing fields
  id: string
  name: string
  description: string  // Short description
  link: string
  video: string

  // New fields
  longDescription: string  // Detailed multi-paragraph description
  technologies: string[]
  keyFeatures: string[]
  challenges?: string
  solutions?: string
  duration: {
    start: string
    end: string
  }
  teamSize?: number
  role: string
  githubUrl?: string
  images?: string[]
  metrics?: {
    label: string
    value: string
  }[]
}
```

**Enhanced Work Experience Schema**:
```typescript
interface WorkExperience {
  // Existing fields
  id: string
  company: string
  title: string
  start: string
  end: string
  link: string

  // New fields
  responsibilities: string[]
  achievements: string[]
  technologies: string[]
  teamSize?: number
  location?: string
  employmentType: 'Full-time' | 'Part-time' | 'Contract' | 'Internship'
  projects?: string[]  // References to project IDs
}
```

### References
- Current codebase: `C:\Users\marshmary\Documents\portfolio\portfolio`
- Based on Nim template: https://github.com/ibelick/nim
- Motion-Primitives: https://motion-primitives.com
- Next.js 15 Documentation: https://nextjs.org/docs

---

**Document Status**: Ready for Implementation
**Next Steps**: Create brownfield architecture documentation, then begin implementation with AI assistance
