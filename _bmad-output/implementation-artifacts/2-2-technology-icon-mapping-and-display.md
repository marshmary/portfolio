# Story 2.2: Technology Icon Mapping and Display

**Status:** ready-for-dev
**Epic:** Epic 2 - Per-Technology Skill Icons — Scannable Tech Stack
**Depends on:** Story 2.1 (skill data parsing — parsed technology entries must exist first)

---

## Story Statement

As a **recruiter**,
I want to see a brand icon next to each technology name in the skills section,
So that I can scan the tech stack at a glance without reading dense text.

---

## Acceptance Criteria

1. **Given** skill data has been parsed into individual technology entries, **When** the SkillCard renders each technology, **Then** a matching brand icon from `react-icons` (simple-icons subset) appears inline next to the technology name.
2. Technologies without a matching icon display a fallback (generic code/gear icon).
3. Icons are appropriately sized and aligned with the text.
4. Icons respect dark/light mode coloring.

---

## Tasks / Subtasks

### Task 1: Install `react-icons` dependency
- Run `npm install react-icons`
- Verify the package is added to `package.json` dependencies

### Task 2: Create the icon lookup module
- Create a new file: `components/ui/technology-icons.ts`
- Define a lookup object mapping normalized technology name strings to their corresponding `react-icons/si` icon components
- Export the lookup object and a helper function `getTechnologyIcon(name: string)` that returns the matching icon component or a fallback

### Task 3: Create a TechnologyIcon display component
- Create `components/ui/technology-icon.tsx`
- This component takes a `name` prop (technology name string)
- Uses the helper from Task 2 to resolve the icon component
- Renders the icon with consistent sizing (`h-4 w-4` or `h-3.5 w-3.5`) and text alignment via `inline-flex items-center`
- Applies dark/light mode-aware coloring via Tailwind classes (e.g., `text-zinc-600 dark:text-zinc-400`)

### Task 4: Integrate icons into the SkillCard component
- Modify `components/ui/skill-card.tsx`
- Parse the `skill.description` string to extract individual technology names
- Render each technology name with its corresponding icon inline (icon + text, comma-separated or inline-flex wrapped)
- Maintain the existing layout and styling of the SkillCard

### Task 5: Verify and test
- Run `npm run build` to confirm no TypeScript or build errors
- Visually verify in `npm run dev` that all technology entries show icons
- Verify the fallback icon appears for technologies without a match
- Verify dark/light mode icon coloring looks correct

---

## Dev Notes

### CRITICAL RULES

- **NEVER edit `app/data.ts` directly** — it is auto-generated from JSON content in `content/`. Edit JSON files, then run `npm run generate-data`.
- Use named exports, `@/` imports, `'use client'` when using hooks.
- Prettier: no semicolons, single quotes, trailing commas, 2-space indent.
- Tailwind CSS 4 — there is no `tailwind.config.js`. Use Tailwind classes directly.
- Dark mode: next-themes class strategy. Existing text color overrides in `globals.css` with `!important`.

### Dependency on Story 2.1

Story 2.1 (skill data parsing) is a **prerequisite**. That story is responsible for parsing the `skill.description` string into individual technology entries. Once Story 2.1 is complete, the SkillCard (or a child component) will receive parsed technology name strings rather than a raw comma-separated description string.

**If Story 2.1 is NOT yet completed**, the dev for this story should:
1. Still create the icon lookup module and TechnologyIcon component (Tasks 2-3 are independent).
2. For Task 4, implement the integration using a simple split-by-comma approach as a temporary bridge, then refactor once Story 2.1's parsed data is available.

### COMPLETE LIST OF ALL TECHNOLOGY NAMES

These are the exact strings extracted from `DEVOPS_SKILLS[].description` and `DEV_SKILLS[].description` in the current data. The icon lookup must cover all of these.

**DevOps Skills — Cloud Computing Platforms:**
- AWS
- Digital Pacific
- Azure
- Firebase

**DevOps Skills — Containerization and Orchestration:**
- Docker
- Kubernetes
- Helm
- Docker Compose

**DevOps Skills — Infrastructure as Code:**
- Terraform
- Ansible
- CloudFormation

**DevOps Skills — CI/CD:**
- Jenkins
- GitHub Actions
- GitLab CI
- CircleCI

**DevOps Skills — Monitoring, Logging, and Observability:**
- Prometheus
- Grafana
- ELK Stack
- CloudWatch

**DevOps Skills — Version Control:**
- Git
- GitHub
- GitLab
- Bitbucket

**DevOps Skills — Scripting:**
- Python
- Bash
- PowerShell

**DevOps Skills — Database:**
- PostgreSQL
- MySQL
- MongoDB

**DevOps Skills — Web Servers:**
- Nginx
- Apache

**Dev Skills — Languages:**
- Python
- Groovy
- C#
- JavaScript
- TypeScript

**Dev Skills — Framework:**
- FastAPI
- Dotnet
- React
- NextJS
- OpenCart
- Vue

**Dev Skills — Other tools:**
- Git
- Jira
- Figma

### Recommended Icon Mapping

The `react-icons/si` (Simple Icons) subset uses the naming convention `Si<BrandName>`. Below is the recommended mapping for all technology names. Names with no direct Si match should use the fallback.

```
import {
  SiAmazonwebservices,
  SiMicrosoftazure,
  SiFirebase,
  SiDocker,
  SiKubernetes,
  SiHelm,
  SiTerraform,
  SiAnsible,
  SiJenkins,
  SiGithubactions,
  SiGitlab,
  SiCircleci,
  SiPrometheus,
  SiGrafana,
  SiElasticstack,    // for "ELK Stack"
  SiAmazoncloudwatch, // or SiApachesolr — check availability; fallback if not found
  SiGit,
  SiGithub,
  SiBitbucket,
  SiPython,
  SiGnubash,          // or SiShell — check availability
  SiPowershell,
  SiPostgresql,
  SiMysql,
  SiMongodb,
  SiNginx,
  SiApache,
  SiCsharp,
  SiJavascript,
  SiTypescript,
  SiFastapi,
  SiDotnet,
  SiReact,
  SiNextdotjs,
  SiOpencart,
  SiVuedotjs,
  SiJira,
  SiFigma,
} from 'react-icons/si'
```

**Mapping table (technology name → import name):**

| Technology Name    | react-icons/si Import       | Notes                              |
|--------------------|----------------------------|-------------------------------------|
| AWS                | `SiAmazonwebservices`      |                                     |
| Digital Pacific    | —                          | No brand icon; use **fallback**      |
| Azure              | `SiMicrosoftazure`         |                                     |
| Firebase           | `SiFirebase`               |                                     |
| Docker             | `SiDocker`                 |                                     |
| Kubernetes         | `SiKubernetes`             |                                     |
| Helm               | `SiHelm`                   |                                     |
| Docker Compose     | `SiDocker`                 | Reuse Docker icon (same brand)      |
| Terraform          | `SiTerraform`              |                                     |
| Ansible            | `SiAnsible`                |                                     |
| CloudFormation     | `SiAmazonwebservices`      | Reuse AWS icon (same brand)         |
| Jenkins            | `SiJenkins`                |                                     |
| GitHub Actions     | `SiGithubactions`          |                                     |
| GitLab CI          | `SiGitlab`                 | Reuse GitLab icon (same brand)      |
| CircleCI           | `SiCircleci`               |                                     |
| Prometheus         | `SiPrometheus`             |                                     |
| Grafana            | `SiGrafana`                |                                     |
| ELK Stack          | `SiElasticstack`           |                                     |
| CloudWatch         | `SiAmazoncloudwatch`       | May not exist in older versions; fallback if unavailable |
| Git                | `SiGit`                    |                                     |
| GitHub             | `SiGithub`                 |                                     |
| GitLab             | `SiGitlab`                 |                                     |
| Bitbucket          | `SiBitbucket`              |                                     |
| Python             | `SiPython`                 |                                     |
| Bash               | `SiGnubash`                | Check if `SiGnubash` exists; alternatively use `SiShell` or fallback |
| PowerShell         | `SiPowershell`             |                                     |
| PostgreSQL         | `SiPostgresql`             |                                     |
| MySQL              | `SiMysql`                  |                                     |
| MongoDB            | `SiMongodb`                |                                     |
| Nginx              | `SiNginx`                  |                                     |
| Apache             | `SiApache`                 |                                     |
| Groovy             | `SiApachegroovy`           |                                     |
| C#                 | `SiCsharp`                 |                                     |
| JavaScript         | `SiJavascript`             |                                     |
| TypeScript         | `SiTypescript`             |                                     |
| FastAPI            | `SiFastapi`                |                                     |
| Dotnet             | `SiDotnet`                 |                                     |
| React              | `SiReact`                  |                                     |
| NextJS             | `SiNextdotjs`              |                                     |
| OpenCart           | `SiOpencart`               |                                     |
| Vue                | `SiVuedotjs`               |                                     |
| Jira               | `SiJira`                   |                                     |
| Figma              | `SiFigma`                  |                                     |

### Lookup Object Structure

```ts
// components/ui/technology-icons.ts
import type { IconType } from 'react-icons'
import { Code2 } from 'lucide-react' // fallback from already-installed lucide-react
import {
  SiAmazonwebservices,
  SiMicrosoftazure,
  // ... all other imports
} from 'react-icons/si'

type TechnologyIconMap = {
  [key: string]: IconType
}

const technologyIconMap: TechnologyIconMap = {
  aws: SiAmazonwebservices,
  azure: SiMicrosoftazure,
  firebase: SiFirebase,
  docker: SiDocker,
  kubernetes: SiKubernetes,
  helm: SiHelm,
  'docker compose': SiDocker,
  terraform: SiTerraform,
  ansible: SiAnsible,
  cloudformation: SiAmazonwebservices,
  jenkins: SiJenkins,
  'github actions': SiGithubactions,
  'gitlab ci': SiGitlab,
  circleci: SiCircleci,
  prometheus: SiPrometheus,
  grafana: SiGrafana,
  'elk stack': SiElasticstack,
  cloudwatch: SiAmazoncloudwatch,
  git: SiGit,
  github: SiGithub,
  gitlab: SiGitlab,
  bitbucket: SiBitbucket,
  python: SiPython,
  bash: SiGnubash,
  powershell: SiPowershell,
  postgresql: SiPostgresql,
  mysql: SiMysql,
  mongodb: SiMongodb,
  nginx: SiNginx,
  apache: SiApache,
  groovy: SiApachegroovy,
  'c#': SiCsharp,
  javascript: SiJavascript,
  typescript: SiTypescript,
  fastapi: SiFastapi,
  dotnet: SiDotnet,
  react: SiReact,
  nextjs: SiNextdotjs,
  opencart: SiOpencart,
  vue: SiVuedotjs,
  jira: SiJira,
  figma: SiFigma,
}

export function getTechnologyIcon(name: string): IconType {
  const normalized = name.trim().toLowerCase()
  return technologyIconMap[normalized] ?? Code2
}
```

**Key design decisions for the lookup:**
- Keys are **lowercased and trimmed** versions of the technology names
- The `getTechnologyIcon` function normalizes the input to lowercase+trim before lookup
- Fallback is `Code2` from `lucide-react` (already installed — no extra dependency needed for the fallback)
- Compound names like "Docker Compose", "GitHub Actions", "GitLab CI", "ELK Stack" use space-separated lowercase keys
- "CloudFormation" and "AWS" both map to the AWS icon (same brand)
- "Docker Compose" reuses the Docker icon

### Fallback Icon

Use `Code2` from `lucide-react` as the fallback icon. It is already installed, renders cleanly at small sizes, and semantically represents "code/technology" without being misleading for any specific brand.

Alternative fallbacks from lucide-react: `Cog`, `Wrench`, `Terminal`. `Code2` is the best choice.

### Icon Sizing and Text Alignment

Recommended Tailwind classes for inline icon display:

```
<Icon className="h-3.5 w-3.5 shrink-0" />
```

- `h-3.5 w-3.5` (14px) pairs well with `text-sm` (14px) text
- `shrink-0` prevents the icon from being squished in flex containers
- Wrap icon + name in: `<span className="inline-flex items-center gap-1">`

For the description line rendering pattern:

```tsx
<span className="inline-flex items-center gap-1">
  <TechnologyIcon name={tech} />
  <span>{tech}</span>
</span>
```

### Dark/Light Mode Icon Coloring Strategy

The `react-icons` SVG icons inherit `currentColor`. Use Tailwind text color classes on the icon or its parent container:

```
className="text-zinc-600 dark:text-zinc-400"
```

This matches the existing text coloring pattern used throughout the SkillCard and the rest of the portfolio (see `skill-card.tsx` line 34: `text-sm text-zinc-500 dark:text-zinc-400`).

**Important:** The existing `globals.css` has `!important` overrides for dark mode colors. Test that icon colors render correctly in both light and dark themes after integration.

### Install Instruction

```bash
npm install react-icons
```

This adds `react-icons` to `dependencies` in `package.json`. The `react-icons/si` import tree is tree-shakeable, so only the icons actually imported will be included in the bundle.

### Existing SkillCard Component Reference

File: `components/ui/skill-card.tsx`

Current structure:
- Props: `skill: SkillCategory` with `uid`, `title`, `description`, `link`, `proficiencyLevel`, `yearsOfExperience`, `certifications`, `relatedProjects`, `order`
- Renders `skill.title` as an `<h4>`
- Renders `skill.description` as a plain `<p>` with `text-sm text-zinc-500 dark:text-zinc-400`
- The description field currently contains comma-separated technology names (e.g., "Docker, Kubernetes, Helm, Docker Compose")

The integration point is replacing (or augmenting) the plain text description rendering with icon+text pairs.

### Existing Data Import Pattern

From `app/page.tsx`:
```tsx
import { DEVOPS_SKILLS, DEV_SKILLS } from './data'
```

Usage:
```tsx
{DEVOPS_SKILLS.map((skill) => (
  <SkillCard key={skill.uid} skill={skill} data-id={skill.uid} />
))}
```

---

## Dev Agent Record

_This section will be filled by the dev agent during implementation._
