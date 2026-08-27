'use client'

import { cn } from '@/lib/utils'

interface PromptLineProps {
  /** Prompt symbol (DESIGN.md §5: `$` for commands, `❯` for user echo) */
  symbol?: string
  command?: string
  children?: React.ReactNode
  className?: string
}

/**
 * A terminal prompt line: `$ command`.
 * Pass `children` for rich/typed content instead of plain `command`.
 */
export function PromptLine({
  symbol = '$',
  command,
  children,
  className,
}: PromptLineProps) {
  return (
    <p className={cn('flex items-baseline gap-2', className)}>
      <span
        aria-hidden
        className="shrink-0 select-none"
        style={{ color: 'var(--accent)' }}
      >
        {symbol}
      </span>
      <span className="min-w-0" style={{ color: 'var(--term-text)' }}>
        {children ?? command}
      </span>
    </p>
  )
}
