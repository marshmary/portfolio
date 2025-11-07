import { z } from 'zod'

/**
 * Enhanced Content Schemas for Portfolio
 *
 * This file defines the structure and validation for all portfolio content.
 * All content files must conform to these schemas.
 */

// ============================================================================
// PROJECT SCHEMA
// ============================================================================

export const ProjectSchema = z.object({
  // Core fields (existing)
  id: z.string().min(1, 'Project ID is required'),
  name: z.string().min(1, 'Project name is required'),
  description: z.string().min(1, 'Short description is required'),
  link: z.string().url('Must be a valid URL'),
  video: z.string().url('Must be a valid URL'),

  // Enhanced fields
  longDescription: z.string().optional(),
  technologies: z.array(z.string()).default([]),
  keyFeatures: z.array(z.string()).default([]),
  challenges: z.string().optional(),
  solutions: z.string().optional(),
  duration: z.object({
    start: z.string(),
    end: z.string().optional(),
  }).optional(),
  teamSize: z.number().positive().optional(),
  role: z.string().optional(),
  githubUrl: z.string().url().optional().or(z.literal('')),
  images: z.array(z.string().url()).default([]),
  metrics: z.array(z.object({
    label: z.string(),
    value: z.string(),
  })).default([]),
  featured: z.boolean().default(false),
  order: z.number().default(0),
})

export type Project = z.infer<typeof ProjectSchema>

// ============================================================================
// WORK EXPERIENCE SCHEMA
// ============================================================================

export const WorkExperienceSchema = z.object({
  // Core fields (existing)
  id: z.string().min(1, 'Experience ID is required'),
  company: z.string().min(1, 'Company name is required'),
  title: z.string().min(1, 'Job title is required'),
  start: z.string().min(1, 'Start date is required'),
  end: z.string().min(1, 'End date is required (use "Present" for current)'),
  link: z.string().url('Must be a valid URL'),

  // Enhanced fields
  responsibilities: z.array(z.string()).default([]),
  achievements: z.array(z.string()).default([]),
  technologies: z.array(z.string()).default([]),
  teamSize: z.number().positive().optional(),
  location: z.string().optional(),
  employmentType: z.enum([
    'Full-time',
    'Part-time',
    'Contract',
    'Internship',
    'Freelance',
  ]).default('Full-time'),
  projects: z.array(z.string()).default([]), // Project IDs
  order: z.number().default(0),
})

export type WorkExperience = z.infer<typeof WorkExperienceSchema>

// ============================================================================
// EDUCATION SCHEMA
// ============================================================================

export const EducationSchema = z.object({
  // Core fields (existing)
  id: z.string().min(1, 'Education ID is required'),
  school: z.string().min(1, 'School name is required'),
  title: z.string().min(1, 'Degree title is required'),
  start: z.string().min(1, 'Start date is required'),
  end: z.string().min(1, 'End date is required'),
  link: z.string().url('Must be a valid URL'),

  // Enhanced fields
  description: z.string().optional(),
  gpa: z.string().optional(),
  honors: z.array(z.string()).default([]),
  relevantCourses: z.array(z.string()).default([]),
  order: z.number().default(0),
})

export type Education = z.infer<typeof EducationSchema>

// ============================================================================
// SKILLS SCHEMA
// ============================================================================

export const SkillCategorySchema = z.object({
  // Core fields (existing)
  uid: z.string().min(1, 'Skill UID is required'),
  title: z.string().min(1, 'Skill title is required'),
  description: z.string().min(1, 'Skill description is required'),
  link: z.string().default(''),

  // Enhanced fields
  proficiencyLevel: z.enum(['Beginner', 'Intermediate', 'Advanced', 'Expert']).optional(),
  yearsOfExperience: z.number().positive().optional(),
  certifications: z.array(z.string()).default([]),
  relatedProjects: z.array(z.string()).default([]), // Project IDs
  order: z.number().default(0),
})

export type SkillCategory = z.infer<typeof SkillCategorySchema>

export const SkillsGroupSchema = z.object({
  category: z.string().min(1, 'Category name is required'),
  skills: z.array(SkillCategorySchema),
})

export type SkillsGroup = z.infer<typeof SkillsGroupSchema>

// ============================================================================
// SOCIAL LINKS SCHEMA
// ============================================================================

export const SocialLinkSchema = z.object({
  label: z.string().min(1, 'Social link label is required'),
  link: z.string().url('Must be a valid URL'),
  icon: z.string().optional(),
  order: z.number().default(0),
})

export type SocialLink = z.infer<typeof SocialLinkSchema>

// ============================================================================
// PROFILE SCHEMA
// ============================================================================

export const ProfileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  title: z.string().min(1, 'Title is required'),
  email: z.string().email('Must be a valid email'),
  about: z.string().min(1, 'About text is required'),
  resumeUrl: z.string().url().optional(),
  avatar: z.string().url().optional(),
  location: z.string().optional(),
})

export type Profile = z.infer<typeof ProfileSchema>

// ============================================================================
// VALIDATION HELPERS
// ============================================================================

/**
 * Validates data against a Zod schema and returns typed data
 * @throws {ZodError} if validation fails
 */
export function validateData<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
  context?: string
): T {
  try {
    return schema.parse(data)
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error(`Validation error${context ? ` in ${context}` : ''}:`)
      console.error((error as any).issues || error)
    }
    throw error
  }
}

/**
 * Validates data against a Zod schema and returns result with error info
 */
export function safeValidateData<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; error: z.ZodError } {
  const result = schema.safeParse(data)
  if (result.success) {
    return { success: true, data: result.data }
  } else {
    return { success: false, error: result.error }
  }
}

// ============================================================================
// LEGACY TYPE COMPATIBILITY
// ============================================================================

/**
 * Legacy types for backward compatibility with existing app/data.ts
 * These map to the core fields of the enhanced schemas
 */
export type LegacyProject = Pick<
  Project,
  'id' | 'name' | 'description' | 'link' | 'video'
>

export type LegacyWorkExperience = Pick<
  WorkExperience,
  'id' | 'company' | 'title' | 'start' | 'end' | 'link'
>

export type LegacyEducation = Pick<
  Education,
  'id' | 'school' | 'title' | 'start' | 'end' | 'link'
>

export type LegacySkillCategory = Pick<
  SkillCategory,
  'uid' | 'title' | 'description' | 'link'
>

// ============================================================================
// COLLECTION TYPES
// ============================================================================

/**
 * Type for the entire content structure
 */
export interface ContentCollection {
  projects: Project[]
  experience: WorkExperience[]
  education: Education[]
  devOpsSkills: SkillCategory[]
  devSkills: SkillCategory[]
  socialLinks: SocialLink[]
  profile: Profile
}
