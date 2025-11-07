import fs from 'fs'
import path from 'path'
import {
  ProjectSchema,
  WorkExperienceSchema,
  EducationSchema,
  SkillCategorySchema,
  SkillsGroupSchema,
  SocialLinkSchema,
  ProfileSchema,
  validateData,
  type Project,
  type WorkExperience,
  type Education,
  type SkillCategory,
  type SkillsGroup,
  type SocialLink,
  type Profile,
  type ContentCollection,
} from '@/content/schema/types'

/**
 * Content Loader Utilities
 *
 * These functions load and validate content from JSON files.
 * All content is validated against Zod schemas at load time.
 */

const CONTENT_DIR = path.join(process.cwd(), 'content')

// ============================================================================
// LOW-LEVEL FILE READING
// ============================================================================

/**
 * Reads and parses a JSON file
 */
function readJSONFile<T>(filePath: string): T {
  try {
    const absolutePath = path.isAbsolute(filePath)
      ? filePath
      : path.join(CONTENT_DIR, filePath)

    const fileContent = fs.readFileSync(absolutePath, 'utf-8')
    return JSON.parse(fileContent)
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to read JSON file ${filePath}: ${error.message}`)
    }
    throw error
  }
}

/**
 * Reads all JSON files from a directory
 */
function readJSONDirectory<T>(dirPath: string): T[] {
  try {
    const absolutePath = path.isAbsolute(dirPath)
      ? dirPath
      : path.join(CONTENT_DIR, dirPath)

    const files = fs.readdirSync(absolutePath)
    const jsonFiles = files.filter((file) => file.endsWith('.json'))

    return jsonFiles.map((file) => {
      const filePath = path.join(absolutePath, file)
      const content = fs.readFileSync(filePath, 'utf-8')
      return JSON.parse(content)
    })
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(
        `Failed to read directory ${dirPath}: ${error.message}`
      )
    }
    throw error
  }
}

// ============================================================================
// CONTENT LOADERS
// ============================================================================

/**
 * Loads all projects and validates them
 */
export function loadProjects(): Project[] {
  const projectsData = readJSONDirectory('projects')
  return projectsData
    .map((data, index) =>
      validateData(ProjectSchema, data, `projects[${index}]`)
    )
    .sort((a, b) => (a.order || 0) - (b.order || 0))
}

/**
 * Loads a single project by ID
 */
export function loadProjectById(id: string): Project | null {
  try {
    const data = readJSONFile(`projects/${id}.json`)
    return validateData(ProjectSchema, data, `project:${id}`)
  } catch {
    return null
  }
}

/**
 * Loads all work experiences and validates them
 */
export function loadWorkExperience(): WorkExperience[] {
  const experienceData = readJSONDirectory('experience')
  return experienceData
    .map((data, index) =>
      validateData(WorkExperienceSchema, data, `experience[${index}]`)
    )
    .sort((a, b) => (a.order || 0) - (b.order || 0))
}

/**
 * Loads all education entries and validates them
 */
export function loadEducation(): Education[] {
  const educationData = readJSONDirectory('experience')
    .filter((data: any) => data.school) // Filter for education entries

  return educationData
    .map((data, index) =>
      validateData(EducationSchema, data, `education[${index}]`)
    )
    .sort((a, b) => (a.order || 0) - (b.order || 0))
}

/**
 * Loads DevOps skills and validates them
 */
export function loadDevOpsSkills(): SkillCategory[] {
  const skillsData = readJSONFile<SkillsGroup>('skills/devops.json')
  const validated = validateData(SkillsGroupSchema, skillsData, 'devops-skills')
  return validated.skills.sort((a, b) => (a.order || 0) - (b.order || 0))
}

/**
 * Loads Development skills and validates them
 */
export function loadDevSkills(): SkillCategory[] {
  const skillsData = readJSONFile<SkillsGroup>('skills/development.json')
  const validated = validateData(
    SkillsGroupSchema,
    skillsData,
    'development-skills'
  )
  return validated.skills.sort((a, b) => (a.order || 0) - (b.order || 0))
}

/**
 * Loads social links and validates them
 */
export function loadSocialLinks(): SocialLink[] {
  const socialData = readJSONFile('profile/social.json')
  if (Array.isArray(socialData)) {
    return socialData
      .map((data, index) =>
        validateData(SocialLinkSchema, data, `social-links[${index}]`)
      )
      .sort((a, b) => (a.order || 0) - (b.order || 0))
  }
  throw new Error('Social links data must be an array')
}

/**
 * Loads profile information and validates it
 */
export function loadProfile(): Profile {
  const profileData = readJSONFile('profile/about.json')
  return validateData(ProfileSchema, profileData, 'profile')
}

/**
 * Loads all content at once
 */
export function loadAllContent(): ContentCollection {
  return {
    projects: loadProjects(),
    experience: loadWorkExperience(),
    education: loadEducation(),
    devOpsSkills: loadDevOpsSkills(),
    devSkills: loadDevSkills(),
    socialLinks: loadSocialLinks(),
    profile: loadProfile(),
  }
}

// ============================================================================
// HELPERS
// ============================================================================

/**
 * Gets featured projects (for homepage)
 */
export function getFeaturedProjects(): Project[] {
  return loadProjects().filter((project) => project.featured)
}

/**
 * Gets projects by technology
 */
export function getProjectsByTechnology(tech: string): Project[] {
  return loadProjects().filter((project) =>
    project.technologies?.some(
      (t) => t.toLowerCase() === tech.toLowerCase()
    )
  )
}

/**
 * Gets current work experience (where end === "Present")
 */
export function getCurrentWorkExperience(): WorkExperience | null {
  const experiences = loadWorkExperience()
  return (
    experiences.find(
      (exp) => exp.end.toLowerCase() === 'present'
    ) || null
  )
}

// ============================================================================
// DEV UTILITIES
// ============================================================================

/**
 * Validates all content and reports any errors
 * Useful for CI/CD or pre-build checks
 */
export function validateAllContent(): {
  valid: boolean
  errors: string[]
} {
  const errors: string[] = []

  try {
    loadProjects()
  } catch (error) {
    errors.push(`Projects validation failed: ${error}`)
  }

  try {
    loadWorkExperience()
  } catch (error) {
    errors.push(`Work experience validation failed: ${error}`)
  }

  try {
    loadEducation()
  } catch (error) {
    errors.push(`Education validation failed: ${error}`)
  }

  try {
    loadDevOpsSkills()
  } catch (error) {
    errors.push(`DevOps skills validation failed: ${error}`)
  }

  try {
    loadDevSkills()
  } catch (error) {
    errors.push(`Dev skills validation failed: ${error}`)
  }

  try {
    loadSocialLinks()
  } catch (error) {
    errors.push(`Social links validation failed: ${error}`)
  }

  try {
    loadProfile()
  } catch (error) {
    errors.push(`Profile validation failed: ${error}`)
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}
