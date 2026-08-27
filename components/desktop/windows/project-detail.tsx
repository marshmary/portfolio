'use client'

import { ExternalLink, Github } from 'lucide-react'
import type { Project } from '../types'
import { TechBadge } from '@/components/ui/tech-badge'

/**
 * Project detail viewer window (DESIGN.md §4): media, description,
 * `[stack]` tags, `+` features, live/repo links.
 */
export function ProjectDetail({ project }: { project: Project }) {
  const hasImage = project.images && project.images.length > 0

  return (
    <div className="flex h-full flex-col gap-3 overflow-y-auto">
      {/* Media */}
      <div
        className="shrink-0 overflow-hidden rounded-lg border"
        style={{ borderColor: 'var(--border)' }}
      >
        {hasImage ? (
          <img
            src={project.images![0]}
            alt={`${project.name} preview`}
            width="1200"
            height="675"
            className="aspect-video w-full object-contain"
            style={{
              background:
                'color-mix(in srgb, var(--panel-solid) 70%, transparent)',
            }}
          />
        ) : (
          <video
            src={project.video}
            autoPlay
            loop
            muted
            className="aspect-video w-full"
          />
        )}
      </div>

      {/* Description */}
      <p style={{ color: 'var(--muted)' }}>
        {project.longDescription || project.description}
      </p>

      {/* Stack */}
      {project.technologies && project.technologies.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {project.technologies.map((tech) => (
            <TechBadge key={tech} label={tech} />
          ))}
        </div>
      )}

      {/* Features */}
      {project.keyFeatures && project.keyFeatures.length > 0 && (
        <ul className="flex flex-col gap-1">
          {project.keyFeatures.slice(0, 4).map((feature) => (
            <li
              key={feature}
              className="flex items-start gap-2"
              style={{ color: 'var(--muted)' }}
            >
              <span
                aria-hidden
                className="shrink-0 select-none"
                style={{ color: 'var(--green)' }}
              >
                +
              </span>
              <span className="min-w-0">{feature}</span>
            </li>
          ))}
        </ul>
      )}

      {/* Links */}
      <div className="mt-auto flex flex-wrap items-center gap-3 pt-1">
        {project.link && (
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 underline decoration-dotted underline-offset-4 transition-colors hover:text-[color:var(--accent)]"
            style={{ color: 'var(--accent)' }}
          >
            live <ExternalLink className="h-3.5 w-3.5" aria-hidden />
          </a>
        )}
        {project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 underline decoration-dotted underline-offset-4 transition-colors hover:text-[color:var(--accent)]"
            style={{ color: 'var(--accent)' }}
          >
            source <Github className="h-3.5 w-3.5" aria-hidden />
          </a>
        )}
        {project.role && (
          <span
            className="ml-auto text-[11px]"
            style={{ color: 'var(--faint)' }}
          >
            {project.role}
            {project.duration
              ? ` · ${project.duration.start}${project.duration.end ? ` – ${project.duration.end}` : ''}`
              : ''}
          </span>
        )}
      </div>
    </div>
  )
}
