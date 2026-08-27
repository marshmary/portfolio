'use client'

import { Folder } from 'lucide-react'
import { PROJECTS } from '@/app/data'
import { useDesktop } from '../context'

/**
 * `~/projects` file manager (DESIGN.md §4): Nautilus-style grid,
 * folder-per-project. Click opens the project-detail window.
 */
export function ProjectsFiles() {
  const { dispatch } = useDesktop()

  return (
    <div className="flex h-full flex-col gap-3">
      <p
        className="shrink-0 text-xs select-none"
        style={{ color: 'var(--faint)' }}
        aria-hidden
      >
        <span style={{ color: 'var(--accent)' }}>$</span> ls ~/projects
      </p>
      <div className="grid min-h-0 flex-1 auto-rows-min grid-cols-2 gap-2 overflow-y-auto sm:grid-cols-3">
        {PROJECTS.map((project) => (
          <button
            key={project.id}
            type="button"
            onClick={() => dispatch({ type: 'open-project', project })}
            className="flex flex-col items-center gap-1.5 rounded-lg border p-3 text-center transition-colors"
            style={{ borderColor: 'transparent' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--border)'
              e.currentTarget.style.background =
                'color-mix(in srgb, var(--accent) 8%, transparent)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'transparent'
              e.currentTarget.style.background = 'transparent'
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = 'var(--accent)'
            }}
          >
            <Folder
              className="h-9 w-9"
              style={{
                color: 'var(--accent)',
                fill: 'color-mix(in srgb, var(--accent) 25%, transparent)',
              }}
              aria-hidden
            />
            <span
              className="w-full truncate text-xs"
              style={{ color: 'var(--text)' }}
            >
              {project.name}
            </span>
            <span
              className="line-clamp-2 w-full text-[10px] leading-tight"
              style={{ color: 'var(--faint)' }}
            >
              {project.description}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
