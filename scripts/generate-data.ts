/**
 * Build Script: Generate Data from JSON
 *
 * This script reads content from JSON files and generates app/data.ts
 * Run this before building to ensure latest content is included.
 */

import fs from 'fs'
import path from 'path'
import {
  ProjectSchema,
  WorkExperienceSchema,
  EducationSchema,
  SkillsGroupSchema,
  SocialLinkSchema,
  ProfileSchema,
  CertificationSchema,
  GitHubStatsSchema,
  validateData,
} from '../content/schema/types'

const CONTENT_DIR = path.join(process.cwd(), 'content')
const OUTPUT_FILE = path.join(process.cwd(), 'app', 'data.ts')

// Read JSON file
function readJSONFile<T>(filePath: string): T {
  const content = fs.readFileSync(filePath, 'utf-8')
  return JSON.parse(content)
}

// Read all JSON files from directory
function readJSONDirectory<T>(dirPath: string): T[] {
  const files = fs.readdirSync(dirPath)
  return files
    .filter((file) => file.endsWith('.json'))
    .map((file) => {
      const filePath = path.join(dirPath, file)
      const content = fs.readFileSync(filePath, 'utf-8')
      return JSON.parse(content)
    })
}

// Main generation function
function generateDataFile() {
  console.log('📦 Generating data.ts from JSON content...')

  try {
    // Load and validate all content
    const projectsData = readJSONDirectory(path.join(CONTENT_DIR, 'projects'))
    const projects = projectsData
      .map((data, index) =>
        validateData(ProjectSchema, data, `projects[${index}]`),
      )
      .sort((a, b) => (a.order || 0) - (b.order || 0))

    const experienceData = readJSONDirectory(
      path.join(CONTENT_DIR, 'experience'),
    ).filter((data: any) => !data.school) // Exclude education

    const workExperience = experienceData
      .map((data, index) =>
        validateData(WorkExperienceSchema, data, `experience[${index}]`),
      )
      .sort((a, b) => (a.order || 0) - (b.order || 0))

    const educationData = readJSONDirectory(
      path.join(CONTENT_DIR, 'experience'),
    ).filter((data: any) => data.school) // Only education

    const education = educationData
      .map((data, index) =>
        validateData(EducationSchema, data, `education[${index}]`),
      )
      .sort((a, b) => (a.order || 0) - (b.order || 0))

    const devOpsSkillsData = readJSONFile(
      path.join(CONTENT_DIR, 'skills', 'devops.json'),
    )
    const devOpsGroup = validateData(
      SkillsGroupSchema,
      devOpsSkillsData,
      'devops-skills',
    )
    const devOpsSkills = devOpsGroup.skills.sort(
      (a, b) => (a.order || 0) - (b.order || 0),
    )

    const devSkillsData = readJSONFile(
      path.join(CONTENT_DIR, 'skills', 'development.json'),
    )
    const devGroup = validateData(
      SkillsGroupSchema,
      devSkillsData,
      'development-skills',
    )
    const devSkills = devGroup.skills.sort(
      (a, b) => (a.order || 0) - (b.order || 0),
    )

    const socialLinksData = readJSONFile(
      path.join(CONTENT_DIR, 'profile', 'social.json'),
    )
    const socialLinks = (socialLinksData as any[])
      .map((data, index) =>
        validateData(SocialLinkSchema, data, `social-links[${index}]`),
      )
      .sort((a, b) => (a.order || 0) - (b.order || 0))

    const profileData = readJSONFile(
      path.join(CONTENT_DIR, 'profile', 'about.json'),
    )
    const profile = validateData(ProfileSchema, profileData, 'profile')

    // Load certifications (optional - may not exist)
    let certifications: any[] = []
    const certificationsPath = path.join(CONTENT_DIR, 'certifications')
    if (fs.existsSync(certificationsPath)) {
      const certificationsData = readJSONDirectory(certificationsPath)
      certifications = certificationsData
        .map((data, index) =>
          validateData(CertificationSchema, data, `certifications[${index}]`),
        )
        .sort((a, b) => (a.order || 0) - (b.order || 0))
    }

    // Load GitHub stats (optional - may not exist)
    let githubStats: any = {}
    const githubStatsPath = path.join(
      CONTENT_DIR,
      'profile',
      'github-stats.json',
    )
    if (fs.existsSync(githubStatsPath)) {
      const githubStatsData = readJSONFile(githubStatsPath)
      githubStats = validateData(
        GitHubStatsSchema,
        githubStatsData,
        'github-stats',
      )
    }

    // Generate TypeScript file
    const output = `/**
 * Portfolio Data
 *
 * ⚠️ AUTO-GENERATED FILE - DO NOT EDIT DIRECTLY
 * This file is generated from JSON content in the content/ directory.
 * To update content, edit the JSON files and run: npm run generate-data
 *
 * Generated: ${new Date().toISOString()}
 */

// ============================================================================
// TYPES
// ============================================================================

type Project = {
  id: string
  name: string
  description: string
  link: string
  video: string
  longDescription?: string
  technologies?: string[]
  keyFeatures?: string[]
  challenges?: string
  solutions?: string
  duration?: {
    start: string
    end?: string
  }
  teamSize?: number
  role?: string
  githubUrl?: string
  images?: string[]
  metrics?: {
    label: string
    value: string
  }[]
  featured?: boolean
  order?: number
}

type WorkExperience = {
  id: string
  company: string
  title: string
  start: string
  end: string
  link: string
  responsibilities?: string[]
  achievements?: string[]
  technologies?: string[]
  teamSize?: number
  location?: string
  employmentType?: string
  projects?: string[]
  order?: number
}

type Education = {
  id: string
  school: string
  title: string
  start: string
  end: string
  link: string
  description?: string
  gpa?: string
  honors?: string[]
  relevantCourses?: string[]
  order?: number
}

type Skills = {
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

type SocialLink = {
  label: string
  link: string
  icon?: string
  order?: number
}

type Certification = {
  id: string
  name: string
  issuer: string
  credentialUrl?: string
  credentialId?: string
  issueDate?: string
  expirationDate?: string
  description?: string
  skills?: string[]
  icon?: string
  order?: number
}

type GitHubStats = {
  stars?: number
  repositories?: number
  followers?: number
  following?: number
  contributions?: number
  achievements?: string[]
  topLanguages?: string[]
}

type Profile = {
  name: string
  displayName?: string
  title: string
  tagline?: string
  email: string
  phone?: string
  location?: string
  about: string
  resumeUrl?: string
  avatar?: string
}

// ============================================================================
// DATA
// ============================================================================

export const PROJECTS: Project[] = ${JSON.stringify(projects, null, 2)}

export const WORK_EXPERIENCE: WorkExperience[] = ${JSON.stringify(workExperience, null, 2)}

export const EDUCATIONS: Education[] = ${JSON.stringify(education, null, 2)}

export const DEVOPS_SKILLS: Skills[] = ${JSON.stringify(devOpsSkills, null, 2)}

export const DEV_SKILLS: Skills[] = ${JSON.stringify(devSkills, null, 2)}

export const SOCIAL_LINKS: SocialLink[] = ${JSON.stringify(socialLinks, null, 2)}

export const CERTIFICATIONS: Certification[] = ${JSON.stringify(certifications, null, 2)}

export const GITHUB_STATS: GitHubStats = ${JSON.stringify(githubStats, null, 2)}

export const PROFILE: Profile = ${JSON.stringify(profile, null, 2)}

export const EMAIL = ${JSON.stringify(profile.email)}
`

    // Write file
    fs.writeFileSync(OUTPUT_FILE, output, 'utf-8')

    console.log('✅ Successfully generated app/data.ts')
    console.log(`   - ${projects.length} projects`)
    console.log(`   - ${workExperience.length} work experiences`)
    console.log(`   - ${education.length} education entries`)
    console.log(`   - ${devOpsSkills.length} DevOps skills`)
    console.log(`   - ${devSkills.length} Development skills`)
    console.log(`   - ${socialLinks.length} social links`)
    console.log(`   - ${certifications.length} certifications`)
    if (githubStats && Object.keys(githubStats).length > 0) {
      console.log('   - GitHub stats included')
    }
  } catch (error) {
    console.error('❌ Error generating data file:', error)
    process.exit(1)
  }
}

// Run the generator
generateDataFile()
