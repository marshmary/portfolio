# Story 2.1: Skill Data Parsing and Restructuring

**Status:** ready-for-dev
**Epic:** Epic 2 - Per-Technology Skill Icons -- Scannable Tech Stack
**Story ID:** 2.1
**Story Key:** 2-1-skill-data-parsing-and-restructuring

---

## Story Statement

As a **developer**,
I want skill description strings parsed into individual technology entries,
So that each technology can be mapped to its brand icon.

---

## Acceptance Criteria

1. **Parsing logic exists** -- Given skill data contains comma-separated technology strings (e.g., `"AWS, Digital Pacific, Azure, Firebase"`), When the SkillCard component renders, Then the string is parsed into individual technology names.
2. **Clean entries** -- Trailing periods and whitespace are stripped from each entry (e.g., `"Figma."` becomes `"Figma"`, `"  Docker "` becomes `"Docker"`).
3. **Structured data output** -- The parsed technologies are passed as structured data (an array of strings) for downstream icon rendering in Story 2.2.

---

## Tasks / Subtasks

### Task 1: Create a parsing utility function
- [ ] Create a new utility function that splits a comma-separated string into an array of clean technology name strings.
- [ ] The function must: split on commas, trim whitespace from each entry, strip trailing periods, filter out empty strings.
- [ ] Place it in a shared utility location (e.g., `lib/utils/skill-parser.ts` or `utils/skill-parser.ts`).

### Task 2: Integrate parsing into SkillCard component
- [ ] In `components/ui/skill-card.tsx`, call the parser on `skill.description` to produce a `technologies: string[]` array.
- [ ] Render each technology name as a distinct element (e.g., wrapped in a `<span>` or similar inline element) instead of the current raw `<p>` text.
- [ ] Preserve the existing visual layout -- technologies should still appear below the title as a list/inline set.
- [ ] Do NOT render the raw unparsed description string anymore.

### Task 3: Export the parsing utility for reuse in Story 2.2
- [ ] Ensure the parser function is exported so Story 2.2 can import it for icon mapping.
- [ ] Add a TypeScript type alias if useful (e.g., `type TechnologyName = string`).

---

## Dev Notes

### CURRENT DATA SHAPE (exact, from `app/data.ts`)

The `Skills` type (used for both `DEVOPS_SKILLS` and `DEV_SKILLS`):

```typescript
type Skills = {
  uid: string
  title: string
  description: string       // <-- THIS is the comma-separated string to parse
  link: string
  proficiencyLevel?: string
  yearsOfExperience?: number
  certifications?: string[]
  relatedProjects?: string[]
  order?: number
}
```

The `description` field currently contains comma-separated technology names. Examples from the actual data:

| uid | title | description (raw) |
|-----|-------|--------------------|
| `devops-cloud` | Cloud Computing Platforms | `"AWS, Digital Pacific, Azure, Firebase"` |
| `devops-containers` | Containerization and Orchestration | `"Docker, Kubernetes, Helm, Docker Compose"` |
| `devops-iac` | Infrastructure as Code | `"Terraform, Ansible, CloudFormation"` |
| `devops-cicd` | Continuous Integration and Continuous Deployment (CI/CD) | `"Jenkins, GitHub Actions, GitLab CI, CircleCI"` |
| `devops-monitoring` | Monitoring, Logging, and Observability | `"Prometheus, Grafana, ELK Stack, CloudWatch"` |
| `devops-vcs` | Version Control | `"Git, GitHub, GitLab, Bitbucket"` |
| `devops-scripting` | Scripting | `"Python, Bash, PowerShell"` |
| `devops-database` | Database | `"PostgreSQL, MySQL, MongoDB"` |
| `devops-web` | Web Servers | `"Nginx, Apache"` |
| `dev-languages` | Languages | `"Python, Groovy, C#, JavaScript, TypeScript"` |
| `dev-frameworks` | Framework | `"FastAPI, Dotnet, React, NextJS, OpenCart, Vue"` |
| `dev-tools` | Other tools | `"Git, Jira, Figma."` |

**NOTE the trailing period on `dev-tools`:** `"Git, Jira, Figma."` -- the parser MUST strip the trailing period from "Figma."

### DATA SOURCE -- JSON FILES

Skills data originates from JSON files:
- `content/skills/devops.json` -- DevOps skills group
- `content/skills/development.json` -- Development skills group

Both files share this structure:
```json
{
  "category": "Cloud Native DevOps Skills",
  "skills": [
    {
      "uid": "devops-cloud",
      "title": "Cloud Computing Platforms",
      "description": "AWS, Digital Pacific, Azure, Firebase",
      "link": "",
      "proficiencyLevel": "Advanced",
      "order": 0
    }
  ]
}
```

The `description` field is validated by `SkillCategorySchema` in `content/schema/types.ts` as `z.string().min(1, 'Skill description is required')`.

### DATA GENERATION PIPELINE

The `generate-data` script (`scripts/generate-data.ts`) reads JSON files, validates via Zod schemas, and generates `app/data.ts`. The schema does NOT parse the description into an array -- it stays a string.

**CRITICAL: NEVER edit `app/data.ts` directly.** It has a `DO NOT EDIT` header and is auto-generated. All changes must happen in:
1. The JSON source files (if restructuring data shape), OR
2. The rendering/utility layer (if only parsing at display time)

### RECOMMENDED APPROACH: Parse at the component level

The parsing should happen in the **rendering layer** (SkillCard component or a utility it calls), NOT in the data generation pipeline. Reasons:
- Keeps the JSON source files simple and human-editable.
- The `description` field might contain freeform text in edge cases; parsing is a display concern.
- Story 2.2 will need the parsed array for icon mapping, so the utility must be importable.

### PARSER FUNCTION -- Exact Specification

Create this function:

```typescript
/**
 * Parses a comma-separated skill description string into individual technology names.
 * Splits on commas, trims whitespace, strips trailing periods, filters empty strings.
 */
export function parseSkillDescription(description: string): string[] {
  return description
    .split(',')
    .map((entry) => entry.trim().replace(/\.$/, ''))  // trim whitespace + strip trailing period
    .filter((entry) => entry.length > 0)               // remove any empty entries
}
```

**Behavior examples:**
- `"AWS, Digital Pacific, Azure, Firebase"` --> `["AWS", "Digital Pacific", "Azure", "Firebase"]`
- `"Git, Jira, Figma."` --> `["Git", "Jira", "Figma"]`
- `"Docker, Kubernetes, Helm, Docker Compose"` --> `["Docker", "Kubernetes", "Helm", "Docker Compose"]`
- `"  Python  ,  Bash  "` --> `["Python", "Bash"]`

**File location:** Place at `lib/skill-parser.ts` (create `lib/` directory if needed). This keeps utilities separate from components and makes them easy to import in Story 2.2.

### CURRENT SkillCard COMPONENT

File: `components/ui/skill-card.tsx`

The component currently renders `skill.description` as a raw `<p>` tag:

```tsx
// Current code (lines 33-36):
<p className="text-sm text-zinc-500 dark:text-zinc-400">
  {skill.description}
</p>
```

The component receives this interface:
```typescript
interface SkillCategory {
  uid: string
  title: string
  description: string
  link: string
  proficiencyLevel?: string
  yearsOfExperience?: number
  certifications?: string[]
  relatedProjects?: string[]
  order?: number
}
```

**What to change in SkillCard:**
1. Import `parseSkillDescription` from `@/lib/skill-parser`.
2. Replace the raw `<p>` rendering with parsed technology entries.
3. Render each technology as a styled `<span>` element -- use a layout similar to the certifications section above it (inline flex-wrap with small badges/pills).
4. Each technology `<span>` should have a `data-technology` attribute for Story 2.2 to use for icon mapping (e.g., `data-technology="AWS"`).
5. Keep the same visual style (text-sm, zinc-500 color).

### HANDOFF TO STORY 2.2

Story 2.2 will need to:
- Map each technology name string to a brand icon (SVG or image).
- The `parseSkillDescription` function will be reused.
- The `data-technology` attribute on each `<span>` will serve as the selector for icon replacement/insertion.
- Consider giving each technology span a unique class or a `data-technology` attribute normalized to lowercase-with-dashes (e.g., `"NextJS"` --> `"nextjs"`, `"Docker Compose"` --> `"docker-compose"`) -- but that normalization is Story 2.2's concern.

### FILE REFERENCES (absolute paths)

| File | Role |
|------|------|
| `C:/Data/work/personal/portfolio/content/skills/devops.json` | DevOps skills JSON source (DO NOT restructure -- keep `description` as string) |
| `C:/Data/work/personal/portfolio/content/skills/development.json` | Development skills JSON source (DO NOT restructure) |
| `C:/Data/work/personal/portfolio/content/schema/types.ts` | Zod schemas for validation (line 107-131 for skills) |
| `C:/Data/work/personal/portfolio/scripts/generate-data.ts` | Data generation script (DO NOT modify for this story) |
| `C:/Data/work/personal/portfolio/app/data.ts` | Auto-generated data file (NEVER edit directly) |
| `C:/Data/work/personal/portfolio/components/ui/skill-card.tsx` | SkillCard component to modify (THIS is the primary edit target) |
| `C:/Data/work/personal/portfolio/app/page.tsx` | Page that renders skills (lines 239-278, uses `<SkillCard>`) |
| `C:/Data/work/personal/portfolio/lib/skill-parser.ts` | NEW FILE -- parsing utility to create |

### CODING CONVENTIONS (project rules)

- TypeScript strict mode.
- Prettier: **no semicolons**, single quotes, trailing commas, 2-space indent.
- `'use client'` directive required in SkillCard (it already has one).
- Use `@/` imports for project-relative paths.
- Named exports only (no default exports).
- Tailwind CSS 4 -- no `tailwind.config.js` file exists.

### EDGE CASES TO HANDLE

1. **Trailing period:** `"Git, Jira, Figma."` -- period after last comma entry must be stripped.
2. **Leading/trailing whitespace on entries:** Already handled by `.trim()`.
3. **Double spaces inside entry names:** `"Digital  Pacific"` should become `"Digital Pacific"` -- consider using `.replace(/\s+/g, ' ')` after trim.
4. **Empty description or malformed input:** The `.filter(entry => entry.length > 0)` handles empty strings. If description is entirely empty, the parser returns `[]` and nothing renders (graceful degradation).

---

## Dev Agent Record

<!-- Dev agent fills this in during implementation -->

### Implementation Log
- _Date/Time started:_
- _Date/Time completed:_

### Files Created
- _list files created_

### Files Modified
- _list files modified_

### Notes
- _any notes, deviations, or discoveries during implementation_
