'use client'

import { cn } from '@/lib/utils'

interface CommandLinkProps {
  /** Command shown inside the chip, e.g. `help` */
  command: string
  onClick?: () => void
  className?: string
  children?: React.ReactNode
}

/**
 * Clickable command chip — `[help]` style pill for non-typing visitors
 * (mobile) and keyboard users (DESIGN.md §7).
 */
export function CommandLink({
  command,
  onClick,
  className,
  children,
}: CommandLinkProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'rounded-lg border px-2.5 py-1 font-mono text-xs transition-all duration-200',
        'hover:scale-[1.03] active:scale-[0.98]',
        className,
      )}
      style={{
        borderColor: 'var(--window-border)',
        color: 'var(--accent)',
        background: 'var(--glass-fill)',
      }}
      aria-label={`Run command: ${command}`}
    >
      <span aria-hidden style={{ color: 'var(--term-faint)' }}>
        [
      </span>{' '}
      {children ?? command}{' '}
      <span aria-hidden style={{ color: 'var(--term-faint)' }}>
        ]
      </span>
    </button>
  )
}
