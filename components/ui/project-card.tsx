'use client'

import { motion } from 'motion/react'
import { ExternalLink, Github } from 'lucide-react'
import { TechBadge } from './tech-badge'

/**
 * Enhanced Project Card Component
 *
 * Displays project information with technologies, features, and links
 */

interface Project {
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

interface ProjectCardProps {
  project: Project
  renderVideo: (src: string) => React.ReactNode
}

export function ProjectCard({ project, renderVideo }: ProjectCardProps) {
  const hasTechnologies = project.technologies && project.technologies.length > 0
  const hasFeatures = project.keyFeatures && project.keyFeatures.length > 0

  return (
    <div className="space-y-3">
      {/* Video Preview */}
      <div className="relative rounded-2xl bg-zinc-50/40 p-1 ring-1 ring-zinc-200/50 ring-inset dark:bg-zinc-950/40 dark:ring-zinc-800/50">
        {renderVideo(project.video)}
      </div>

      {/* Project Info */}
      <div className="space-y-2 px-1">
        {/* Title and Links */}
        <div className="flex items-start justify-between gap-2">
          <a
            className="font-base group relative inline-block font-[450] text-zinc-900 dark:text-zinc-50"
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
          >
            {project.name}
            <span className="absolute bottom-0.5 left-0 block h-[1px] w-full max-w-0 bg-zinc-900 transition-all duration-200 group-hover:max-w-full dark:bg-zinc-50"></span>
          </a>

          {/* External Links */}
          <div className="flex gap-1.5">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                title="View on GitHub"
              >
                <Github className="h-4 w-4" />
              </a>
            )}
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
              title="View Project"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          {project.longDescription || project.description}
        </p>

        {/* Technologies */}
        {hasTechnologies && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {project.technologies.slice(0, 5).map((tech) => (
              <TechBadge key={tech} label={tech} />
            ))}
            {project.technologies.length > 5 && (
              <TechBadge
                label={`+${project.technologies.length - 5} more`}
                variant="secondary"
              />
            )}
          </div>
        )}

        {/* Key Features - Show first 2 */}
        {hasFeatures && (
          <div className="pt-1">
            <ul className="space-y-0.5 text-xs text-zinc-600 dark:text-zinc-400">
              {project.keyFeatures.slice(0, 2).map((feature, index) => (
                <li key={index} className="flex items-start gap-1.5">
                  <span className="mt-1 h-1 w-1 flex-shrink-0 rounded-full bg-zinc-400 dark:bg-zinc-600"></span>
                  <span>{feature}</span>
                </li>
              ))}
              {project.keyFeatures.length > 2 && (
                <li className="text-zinc-500 dark:text-zinc-500">
                  +{project.keyFeatures.length - 2} more features
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
