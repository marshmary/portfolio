'use client'

/**
 * Technology Badge Component
 *
 * Displays a technology/skill badge with consistent styling
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
  const variants = {
    default: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300',
    primary:
      'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
    secondary:
      'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  }

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  }

  return (
    <span
      className={`inline-flex items-center rounded-md font-medium ${variants[variant]} ${sizes[size]} `}
    >
      {label}
    </span>
  )
}
