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

export function SkillCard({ skill, ...props }: SkillCardProps) {
  return (
    <div className="-mx-3 mt-6 rounded-xl px-4 pb-4" {...props}>
      <div className="flex flex-col space-y-2">
        {/* Title */}
        <h4 className="font-normal dark:text-zinc-100">{skill.title}</h4>

        {/* Description */}
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          {skill.description}
        </p>

        {/* Years of Experience */}
        {skill.yearsOfExperience && (
          <p className="text-xs text-zinc-400 dark:text-zinc-500">
            {skill.yearsOfExperience}{' '}
            {skill.yearsOfExperience === 1 ? 'year' : 'years'} of experience
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
