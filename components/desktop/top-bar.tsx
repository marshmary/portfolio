'use client'

import { useEffect, useState } from 'react'
import { RotateCcw, Search } from 'lucide-react'
import { useDesktop } from './context'
import { THEMES, WINDOW_META, type WindowId } from './types'

const TASKBAR_ORDER: WindowId[] = [
  'about',
  'neofetch',
  'projects',
  'skills',
  'contact',
]

/**
 * Waybar-style top bar (DESIGN.md §1, §3):
 * workspace indicators · clock · theme picker + layout reset + launcher.
 */
export function TopBar() {
  const { windows, dispatch, theme, launcherOpen } = useDesktop()
  const [clock, setClock] = useState<string | null>(null)

  useEffect(() => {
    const format = () => {
      const now = new Date()
      setClock(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) +
          ' · ' +
          now.toLocaleDateString([], {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
          }),
      )
    }
    format()
    const interval = setInterval(format, 10_000)
    return () => clearInterval(interval)
  }, [])

  const activateWindow = (id: WindowId) => {
    const win = windows[id]
    if (win.closed || win.minimized) {
      dispatch({ type: 'open', id })
    } else {
      dispatch({ type: 'focus', id })
    }
  }

  const setTheme = (t: (typeof THEMES)[number]['id']) => {
    dispatch({ type: 'set-theme', theme: t })
  }

  return (
    <header
      className="glass-strong fixed inset-x-0 top-0 z-[10000] flex h-10 items-center justify-between gap-2 rounded-none border-x-0 border-t-0 px-2 sm:px-3"
      role="banner"
    >
      {/* Workspaces */}
      <nav aria-label="Windows" className="flex min-w-0 items-center gap-0.5">
        <span
          className="mr-1 hidden shrink-0 text-xs select-none sm:inline"
          style={{ color: 'var(--accent)' }}
          aria-hidden
        >
          ❯~
        </span>
        {TASKBAR_ORDER.map((id, index) => {
          const win = windows[id]
          const isActive =
            win.z === Math.max(...TASKBAR_ORDER.map((w) => windows[w].z)) &&
            !win.closed &&
            !win.minimized
          const dimmed = win.closed || win.minimized
          return (
            <button
              key={id}
              type="button"
              onClick={() => activateWindow(id)}
              className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs transition-colors"
              style={{
                background: isActive
                  ? 'color-mix(in srgb, var(--accent) 18%, transparent)'
                  : 'transparent',
                color: isActive
                  ? 'var(--accent)'
                  : dimmed
                    ? 'var(--faint)'
                    : 'var(--muted)',
              }}
              aria-label={`${index + 1} ${WINDOW_META[id].label} window${
                dimmed ? ' (closed)' : ''
              }`}
              aria-current={isActive ? 'true' : undefined}
            >
              <span aria-hidden>{index + 1}</span>{' '}
              <span className="hidden md:inline">{WINDOW_META[id].label}</span>
            </button>
          )
        })}
      </nav>

      {/* Clock */}
      <div
        className="absolute left-1/2 hidden -translate-x-1/2 text-xs sm:block"
        style={{ color: 'var(--muted)' }}
        suppressHydrationWarning
      >
        {clock ?? ''}
      </div>

      {/* Right cluster */}
      <div className="flex shrink-0 items-center gap-1">
        <div
          className="flex items-center gap-1"
          role="group"
          aria-label="Theme"
        >
          {THEMES.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTheme(t.id)}
              className="flex h-6 w-6 items-center justify-center rounded-full transition-transform hover:scale-110"
              style={{
                outline: theme === t.id ? '2px solid var(--accent)' : 'none',
                outlineOffset: 1,
              }}
              aria-label={`${t.label} theme`}
              aria-pressed={theme === t.id}
              title={`${t.label} theme`}
            >
              <span
                className="h-3 w-3 rounded-full"
                style={{ background: t.dot }}
                aria-hidden
              />
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => dispatch({ type: 'reset-layout' })}
          className="flex h-7 w-7 items-center justify-center rounded-lg transition-colors hover:text-[color:var(--accent)]"
          style={{ color: 'var(--faint)' }}
          aria-label="Reset window layout"
          title="Reset layout"
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={() =>
            dispatch({ type: 'toggle-launcher', open: !launcherOpen })
          }
          className="flex h-7 items-center gap-1.5 rounded-lg px-2 text-xs transition-colors hover:text-[color:var(--accent)]"
          style={{ color: 'var(--faint)' }}
          aria-label="Open command launcher (⌘K)"
          aria-expanded={launcherOpen}
        >
          <Search className="h-3.5 w-3.5" />
          <kbd
            className="hidden rounded border px-1 text-[10px] md:inline"
            style={{ borderColor: 'var(--border)' }}
          >
            ⌘K
          </kbd>
        </button>
      </div>
    </header>
  )
}
