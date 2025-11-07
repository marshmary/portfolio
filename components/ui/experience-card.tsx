'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { ChevronDown } from 'lucide-react'
import { Spotlight } from './spotlight'
import { TechBadge } from './tech-badge'
/**
 * Enhanced Work Experience Card Component
 *
 * Displays work experience with expandable responsibilities and achievements
 */

interface WorkExperience {
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

interface ExperienceCardProps {
  experience: WorkExperience
}

export function ExperienceCard({ experience }: ExperienceCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const hasResponsibilities =
    experience.responsibilities && experience.responsibilities.length > 0
  const hasAchievements =
    experience.achievements && experience.achievements.length > 0
  const hasTechnologies =
    experience.technologies && experience.technologies.length > 0
  const hasExpandableContent =
    hasResponsibilities || hasAchievements || hasTechnologies

  // Ensure arrays exist or provide defaults
  const responsibilities = experience.responsibilities || []
  const achievements = experience.achievements || []
  const technologies = experience.technologies || []

  return (
    <div className="relative overflow-hidden rounded-2xl bg-zinc-300/30 p-[1px] dark:bg-zinc-600/30">
      <Spotlight
        className="blur-2xl from-zinc-900 via-zinc-800 to-zinc-700 dark:from-zinc-100 dark:via-zinc-200 dark:to-zinc-50"
        size={64}
      />
      <div className="relative h-full w-full rounded-[15px] bg-white p-4 dark:bg-zinc-950">
        {/* Header */}
        <div className="relative flex w-full flex-col gap-3 sm:flex-row sm:justify-between">
          <div className="flex-1">
            <h4 className="font-normal dark:text-zinc-100">
              {experience.title}
            </h4>
            <p className="text-zinc-500 dark:text-zinc-400">
              {experience.company}
            </p>
            {experience.employmentType && (
              <p className="text-xs text-zinc-400 dark:text-zinc-500">
                {experience.employmentType}
              </p>
            )}
          </div>
          <div className="flex items-start gap-2">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              {experience.start} - {experience.end}
            </p>
            {hasExpandableContent && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                aria-label={isExpanded ? 'Show less' : 'Show more'}
              >
                <motion.div
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="h-5 w-5" />
                </motion.div>
              </button>
            )}
          </div>
        </div>

        {/* Expandable Content */}
        <AnimatePresence>
          {isExpanded && hasExpandableContent && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="space-y-3 pt-4">
                {/* Technologies */}
                {hasTechnologies && (
                  <div>
                    <p className="mb-2 text-xs font-medium text-zinc-600 dark:text-zinc-400">
                      Technologies
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {technologies.map((tech) => (
                        <TechBadge key={tech} label={tech} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Responsibilities */}
                {hasResponsibilities && (
                  <div>
                    <p className="mb-2 text-xs font-medium text-zinc-600 dark:text-zinc-400">
                      Key Responsibilities
                    </p>
                    <ul className="space-y-1.5 text-sm text-zinc-600 dark:text-zinc-400">
                      {responsibilities.map((resp, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-zinc-400 dark:bg-zinc-600"></span>
                          <span>{resp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Achievements */}
                {hasAchievements && (
                  <div>
                    <p className="mb-2 text-xs font-medium text-zinc-600 dark:text-zinc-400">
                      Key Achievements
                    </p>
                    <ul className="space-y-1.5 text-sm text-zinc-600 dark:text-zinc-400">
                      {achievements.map((achievement, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-500 dark:bg-blue-400"></span>
                          <span>{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
