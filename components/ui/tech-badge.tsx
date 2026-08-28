'use client'

/**
 * Technology badge — terminal tag style: `[ docker ]` (DESIGN.md §5).
 */

interface TechBadgeProps {
  label: string
  variant?: 'default' | 'primary' | 'secondary'
  size?: 'sm' | 'md'
}

export function TechBadge({
  label,
  variant = 'default',
  size = 'sm',
}: TechBadgeProps) {
  const colors = {
    default: 'var(--term-muted)',
    primary: 'var(--accent-green)',
    secondary: 'var(--accent-pink)',
  }

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  }

  return (
    <span
      className={`inline-flex items-center rounded-lg border font-mono font-medium ${sizes[size]}`}
      style={{
        borderColor: 'var(--window-border)',
        background: 'var(--glass-fill)',
        color: colors[variant],
      }}
    >
      <span aria-hidden className="mr-1 opacity-50 select-none">
        [
      </span>
      {label}
      <span aria-hidden className="ml-1 opacity-50 select-none">
        ]
      </span>
    </span>
  )
}
