# Portfolio Content

This directory contains all portfolio content in structured JSON format. All content is validated against TypeScript/Zod schemas defined in `schema/types.ts`.

## Directory Structure

```
content/
├── projects/          # Project showcase
│   ├── avis.json
│   ├── hocsu.json
│   ├── draplus.json
│   └── neru.json
├── experience/        # Work experience and education
│   ├── ptn-global.json
│   ├── biwoco.json
│   ├── fpt-software.json
│   └── fpt-university.json
├── skills/            # Skills organized by category
│   ├── devops.json
│   └── development.json
├── profile/           # Personal information
│   ├── about.json
│   └── social.json
└── schema/            # TypeScript types and Zod schemas
    └── types.ts
```

## Content Types

### Projects (`projects/*.json`)

Each project file contains:
- **Core fields**: id, name, description, link, video
- **Enhanced fields**: longDescription, technologies, keyFeatures, challenges, solutions, duration, teamSize, role, githubUrl, images, metrics, featured, order

Example:
```json
{
  "id": "project-id",
  "name": "Project Name",
  "description": "Short description",
  "link": "https://project-url.com",
  "video": "https://video-url.mp4",
  "longDescription": "Detailed description...",
  "technologies": ["React", "Node.js"],
  "keyFeatures": ["Feature 1", "Feature 2"],
  "featured": true,
  "order": 0
}
```

### Work Experience (`experience/*.json`)

Work experience files contain:
- **Core fields**: id, company, title, start, end, link
- **Enhanced fields**: responsibilities, achievements, technologies, teamSize, location, employmentType, projects, order

Example:
```json
{
  "id": "company-name",
  "company": "Company Name",
  "title": "Job Title",
  "start": "2023",
  "end": "Present",
  "link": "https://company.com",
  "employmentType": "Full-time",
  "responsibilities": ["Responsibility 1", "Responsibility 2"],
  "achievements": ["Achievement 1", "Achievement 2"],
  "technologies": ["AWS", "Docker"],
  "order": 0
}
```

### Education (`experience/*.json`)

Education entries (stored with work experience) contain:
- **Core fields**: id, school, title, start, end, link
- **Enhanced fields**: description, gpa, honors, relevantCourses, order

Example:
```json
{
  "id": "school-name",
  "school": "University Name",
  "title": "Degree Title",
  "start": "2019",
  "end": "2023",
  "link": "https://university.com",
  "description": "Degree description",
  "relevantCourses": ["Course 1", "Course 2"],
  "order": 0
}
```

### Skills (`skills/*.json`)

Skills are organized into groups (devops, development) with multiple skill categories:

Example:
```json
{
  "category": "Skill Category Name",
  "skills": [
    {
      "uid": "skill-id",
      "title": "Skill Title",
      "description": "Skill description",
      "link": "",
      "proficiencyLevel": "Advanced",
      "yearsOfExperience": 3,
      "certifications": ["Cert 1"],
      "relatedProjects": ["project1"],
      "order": 0
    }
  ]
}
```

### Profile (`profile/about.json`)

Personal profile information:
```json
{
  "name": "Full Name",
  "title": "Job Title",
  "email": "email@example.com",
  "about": "About text...",
  "resumeUrl": "https://resume-url.pdf",
  "avatar": "https://avatar-url.jpg",
  "location": "City, Country"
}
```

### Social Links (`profile/social.json`)

Social media links array:
```json
[
  {
    "label": "Platform Name",
    "link": "https://platform.com/username",
    "icon": "icon-name",
    "order": 0
  }
]
```

## Updating Content

### To Add a New Project

1. Create a new JSON file in `content/projects/` (e.g., `my-project.json`)
2. Follow the project schema structure
3. Set a unique `id`
4. Set `order` to control position (lower = appears first)
5. Set `featured: true` to highlight on homepage

### To Update Existing Content

1. Locate the relevant JSON file
2. Edit the fields you want to change
3. Save the file
4. Changes will be reflected after rebuild

### To Add New Fields

1. Update the schema in `content/schema/types.ts`
2. Add the field to relevant Zod schema
3. Update content loader in `lib/content-loader.ts` if needed
4. Add the field to your JSON files

## Validation

All content is automatically validated against Zod schemas when loaded. If validation fails, you'll see detailed error messages in the console.

To manually validate all content:
```typescript
import { validateAllContent } from '@/lib/content-loader'

const result = validateAllContent()
if (!result.valid) {
  console.error('Validation errors:', result.errors)
}
```

## Field Guidelines

### Required Fields

Fields marked as required in the schema will cause validation errors if omitted:
- Project: id, name, description, link, video
- Work Experience: id, company, title, start, end, link
- Skills: uid, title, description

### Optional Fields

Optional fields can be omitted or set to `null`:
- longDescription
- technologies
- keyFeatures
- responsibilities
- achievements

### URL Fields

All URL fields must be valid URLs (http:// or https://):
- link
- video
- githubUrl

Empty strings are accepted for optional URL fields.

### Order Field

The `order` field controls display order:
- Lower numbers appear first
- Default is 0
- Use increments of 10 for easy reordering (0, 10, 20, 30...)

### Featured Projects

Set `featured: true` on projects you want to highlight on the homepage.

## Schema Reference

See `content/schema/types.ts` for complete schema definitions with all available fields and validation rules.

## Troubleshooting

### Validation Errors

If you see validation errors:
1. Check the error message for the specific field
2. Verify the field type (string, number, array)
3. Check required vs optional fields
4. Ensure URLs are properly formatted
5. Review the schema in `types.ts`

### Build Failures

If the build fails after updating content:
1. Validate JSON syntax (use a JSON linter)
2. Check for required fields
3. Verify data types match schema
4. Look for typos in field names

### Missing Content

If content doesn't appear:
1. Verify the file is in the correct directory
2. Check the file extension is `.json`
3. Verify the `order` field (lower = appears first)
4. Check console for loading errors

## Notes

- **LinkedIn URL**: The LinkedIn link in `profile/social.json` is a placeholder. Update it with your actual LinkedIn profile URL.
- **File Naming**: Use kebab-case for file names (e.g., `my-project.json`)
- **IDs**: Keep IDs consistent with file names for easier tracking
- **Content Loader**: Content is loaded at build time via `lib/content-loader.ts`
- **Hot Reload**: In development, changes to JSON files will trigger rebuild

## Future Enhancements

Planned improvements:
- Content management UI
- Image optimization pipeline
- Internationalization support
- Content search and filtering
- RSS feed generation from content
