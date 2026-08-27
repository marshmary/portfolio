'use client'

import { cn } from '@/lib/utils'

interface TerminalOutputProps {
  /** Line prefix, e.g. `+` for achievements, `·` for bullets (DESIGN.md §5) */
  lines: string[]
  prefix?: string
  prefixColor?: string
  className?: string
  /** Render each line as its own <p> (default) or joined with \n */
  as?: 'lines' | 'block'
}

/**
 * Terminal output block — mono, muted text (DESIGN.md §7).
 */
export function TerminalOutput({
  lines,
  prefix,
  prefixColor = 'var(--accent-green)',
  className,
  as = 'lines',
}: TerminalOutputProps) {
  if (as === 'block') {
    return (
      <div
        className={cn('whitespace-pre-wrap', className)}
        style={{ color: 'var(--term-muted)' }}
      >
        {lines.join('\n')}
      </div>
    )
  }

  return (
    <div className={cn('space-y-1', className)}>
      {lines.map((line, index) => (
        <p
          key={index}
          className="flex items-start gap-2"
          style={{ color: 'var(--term-muted)' }}
        >
          {prefix && (
            <span
              aria-hidden
              className="shrink-0 select-none"
              style={{ color: prefixColor }}
            >
              {prefix}
            </span>
          )}
          <span className="min-w-0">{line}</span>
        </p>
      ))}
    </div>
  )
}
