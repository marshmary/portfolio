'use client'

import { Activity, Folder, Mail, SquareTerminal, Tags } from 'lucide-react'
import { useDesktop } from './context'
import { WINDOW_META, type WindowId } from './types'

const DOCK_ITEMS: {
  id: WindowId
  label: string
  icon: React.ReactNode
}[] = [
  { id: 'about', label: 'About', icon: <SquareTerminal className="h-5 w-5" /> },
  { id: 'neofetch', label: 'Neofetch', icon: <Tags className="h-5 w-5" /> },
  { id: 'projects', label: 'Projects', icon: <Folder className="h-5 w-5" /> },
  { id: 'skills', label: 'Skills', icon: <Activity className="h-5 w-5" /> },
  { id: 'contact', label: 'Contact', icon: <Mail className="h-5 w-5" /> },
]

/**
 * Dock / taskbar (DESIGN.md §1, §4): running app icons.
 * Click: reopen closed → restore minimized → focus open (toggle-minimize when focused).
 */
export function Dock() {
  const { windows, maxZ, dispatch } = useDesktop()

  const activate = (id: WindowId) => {
    const win = windows[id]
    if (win.closed) {
      dispatch({ type: 'open', id })
    } else if (win.minimized) {
      dispatch({ type: 'open', id })
    } else if (win.z === maxZ) {
      dispatch({ type: 'toggle-minimize', id })
    } else {
      dispatch({ type: 'focus', id })
    }
  }

  return (
    <nav
      className="glass-strong fixed bottom-3 left-1/2 z-[10000] flex -translate-x-1/2 items-center gap-1 rounded-xl px-2 py-2"
      aria-label="Dock"
    >
      {DOCK_ITEMS.map(({ id, label, icon }) => {
        const win = windows[id]
        const state = win.closed
          ? 'closed'
          : win.minimized
            ? 'min'
            : win.z === maxZ
              ? 'focus'
              : 'open'
        return (
          <button
            key={id}
            type="button"
            onClick={() => activate(id)}
            className="relative flex h-10 w-10 items-center justify-center rounded-lg transition-transform hover:scale-110"
            style={{
              color:
                state === 'closed'
                  ? 'var(--faint)'
                  : state === 'focus'
                    ? 'var(--accent)'
                    : 'var(--muted)',
            }}
            aria-label={`${WINDOW_META[id].label} — ${
              state === 'closed'
                ? 'reopen'
                : state === 'min'
                  ? 'restore'
                  : state === 'focus'
                    ? 'minimize'
                    : 'focus'
            }`}
            title={`${label} — ${
              state === 'closed'
                ? 'reopen'
                : state === 'min'
                  ? 'restore'
                  : state === 'focus'
                    ? 'minimize'
                    : 'focus'
            }`}
          >
            {icon}
            <span
              className="absolute bottom-0.5 h-1 w-1 rounded-full"
              style={{
                background:
                  state === 'focus'
                    ? 'var(--green)'
                    : state === 'min'
                      ? 'var(--yellow)'
                      : state === 'open'
                        ? 'var(--accent)'
                        : 'transparent',
              }}
              aria-hidden
            />
          </button>
        )
      })}
    </nav>
  )
}
