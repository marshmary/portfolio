# Quick Content Update Guide

This is a quick reference for updating your portfolio content. For detailed information, see `content/README.md`.

## How to Update Content

### Update Project Information

1. Open the project file: `content/projects/[project-name].json`
2. Edit the fields you want to change
3. Save the file
4. Run `npm run dev` or `npm run build`
5. The data will be automatically validated and regenerated

**Example - Add technologies to Avis project**:
```json
{
  "id": "avis",
  "name": "Avis",
  ...
  "technologies": ["React", "Next.js", "Machine Learning", "Audio Processing"]
}
```

### Add a New Project

1. Create new file: `content/projects/my-new-project.json`
2. Copy structure from an existing project file
3. Update all fields with your project information
4. Set `"featured": true` if you want it highlighted
5. Set `"order": 4` (or next available number)
6. Save and rebuild

**Minimum required fields**:
```json
{
  "id": "unique-project-id",
  "name": "Project Name",
  "description": "Short description",
  "link": "https://project-url.com",
  "video": "https://video-url.mp4"
}
```

### Update Work Experience

1. Open: `content/experience/[company-name].json`
2. Add to `responsibilities` or `achievements` arrays:
```json
{
  "responsibilities": [
    "New responsibility here"
  ],
  "achievements": [
    "New achievement here"
  ]
}
```

### Update Skills

1. Open: `content/skills/devops.json` or `content/skills/development.json`
2. Edit the `skills` array:
```json
{
  "category": "Cloud Native DevOps Skills",
  "skills": [
    {
      "uid": "skill-id",
      "title": "Skill Title",
      "description": "Technologies: Tool1, Tool2, Tool3",
      "proficiencyLevel": "Advanced"
    }
  ]
}
```

### Update Personal Info

**About text**: `content/profile/about.json`
```json
{
  "name": "Your Name",
  "title": "Your Title",
  "email": "your@email.com",
  "about": "Your about text..."
}
```

**Social links**: `content/profile/social.json`
```json
[
  {
    "label": "LinkedIn",
    "link": "https://linkedin.com/in/your-profile",
    "order": 1
  }
]
```

## Common Tasks

### Fix LinkedIn URL
```bash
# Edit this file:
content/profile/social.json

# Change the link from placeholder to your actual profile:
"link": "https://www.linkedin.com/in/your-actual-profile/"
```

### Make a Project Featured
```bash
# Edit the project file:
content/projects/project-name.json

# Set featured to true:
"featured": true
```

### Reorder Projects
```bash
# Edit each project file and change the order field:
"order": 0  # Shows first
"order": 1  # Shows second
# etc.
```

### Add GitHub Link to Project
```bash
# Edit the project file:
content/projects/project-name.json

# Add githubUrl field:
"githubUrl": "https://github.com/username/repo"
```

## Build Commands

```bash
# Regenerate data from JSON
npm run generate-data

# Start development (auto-generates data)
npm run dev

# Build for production (auto-generates data)
npm run build
```

## Validation

If you see validation errors:
1. Check the error message for the specific field
2. Verify required fields are present
3. Check URLs are valid (start with http:// or https://)
4. Ensure JSON syntax is correct (no trailing commas, proper quotes)

## Project Structure

```
content/
├── projects/          # Your projects
├── experience/        # Work & education
├── skills/            # Your skills
├── profile/           # Personal info
└── schema/            # Type definitions (don't edit)
```

## Tips

- **JSON Syntax**: Use a JSON validator or editor with JSON support
- **URLs**: All URLs must start with `http://` or `https://`
- **Arrays**: Use `[]` for empty arrays, not null
- **Optional Fields**: Can be omitted entirely or set to `null`
- **Order**: Lower numbers appear first (0, 1, 2, 3...)

## Need Help?

- **Full Documentation**: See `content/README.md`
- **Technical Details**: See `docs/brownfield-architecture.md`
- **Phase 1 Summary**: See `docs/phase1-implementation.md`
- **Schemas**: See `content/schema/types.ts`

## Quick Links

- Update projects: `content/projects/`
- Update work experience: `content/experience/`
- Update skills: `content/skills/devops.json` or `development.json`
- Update profile: `content/profile/about.json`
- Update social links: `content/profile/social.json`

---

**Remember**: Changes take effect after running `npm run dev` or `npm run build`
