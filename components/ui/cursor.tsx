'use client'

import { cn } from '@/lib/utils'

interface CursorProps {
  className?: string
}

/**
 * Blinking block cursor (DESIGN.md §5): `▊`, accent color, subtle glow.
 * Static under `prefers-reduced-motion` (globals.css).
 */
export function Cursor({ className }: CursorProps) {
  return (
    <span
      aria-hidden
      className={cn(
        'caret text-glow inline-block h-[1.15em] w-[0.53em] translate-y-[0.15em]',
        className,
      )}
      style={{
        background: 'var(--accent)',
        animation: 'caret-blink 1s step-end infinite',
      }}
    />
  )
}
