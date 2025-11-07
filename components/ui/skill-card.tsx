'use client'

/**
 * Skill Card Component with Proficiency Indicator
 *
 * Displays skill with visual proficiency level
 */

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

interface SkillCardProps {
  skill: SkillCategory
  'data-id': string
}

const proficiencyLevels = {
  Beginner: {
    label: 'Beginner',
    color: 'bg-zinc-300 dark:bg-zinc-700',
    dots: 1,
  },
  Intermediate: {
    label: 'Intermediate',
    color: 'bg-blue-400 dark:bg-blue-600',
    dots: 2,
  },
  Advanced: {
    label: 'Advanced',
    color: 'bg-green-500 dark:bg-green-600',
    dots: 3,
  },
  Expert: {
    label: 'Expert',
    color: 'bg-purple-500 dark:bg-purple-600',
    dots: 4,
  },
}

export function SkillCard({ skill, ...props }: SkillCardProps) {
  const proficiency = skill.proficiencyLevel
    ? proficiencyLevels[skill.proficiencyLevel as keyof typeof proficiencyLevels]
    : null

  return (
    <div className="-mx-3 rounded-xl px-3 py-3" {...props}>
      <div className="flex flex-col space-y-1.5">
        {/* Title and Proficiency */}
        <div className="flex items-center justify-between gap-2">
          <h4 className="font-normal dark:text-zinc-100">{skill.title}</h4>
          {proficiency && (
            <div className="flex items-center gap-1" title={proficiency.label}>
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 w-1.5 rounded-full transition-colors ${
                    i < proficiency.dots
                      ? proficiency.color
                      : 'bg-zinc-200 dark:bg-zinc-800'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Description */}
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          {skill.description}
        </p>

        {/* Years of Experience */}
        {skill.yearsOfExperience && (
          <p className="text-xs text-zinc-400 dark:text-zinc-500">
            {skill.yearsOfExperience} {skill.yearsOfExperience === 1 ? 'year' : 'years'} of experience
          </p>
        )}

        {/* Certifications */}
        {skill.certifications && skill.certifications.length > 0 && (
          <div className="pt-1">
            <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
              Certifications:
            </p>
            <ul className="mt-1 space-y-0.5 text-xs text-zinc-600 dark:text-zinc-400">
              {skill.certifications.map((cert, index) => (
                <li key={index} className="flex items-start gap-1.5">
                  <span className="mt-1 h-1 w-1 flex-shrink-0 rounded-full bg-green-500 dark:bg-green-600"></span>
                  <span>{cert}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
