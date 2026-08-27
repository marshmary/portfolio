'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useDesktop } from './context'
import { THEMES, WINDOW_META, type WindowId } from './types'
import { SOCIAL_LINKS, EMAIL } from '@/app/data'

interface Command {
  id: string
  label: string
  hint: string
  run: () => void
}

/**
 * Rofi-style command palette (DESIGN.md §4, §5):
 * ⌘/Ctrl+K opens, Esc closes, fuzzy search, arrow navigation.
 */
export function Launcher() {
  const { windows, dispatch, launcherOpen } = useDesktop()
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(0)

  const focusWindow = (id: WindowId) => {
    const win = windows[id]
    if (win.closed || win.minimized) dispatch({ type: 'open', id })
    else dispatch({ type: 'focus', id })
  }

  const commands = useMemo<Command[]>(() => {
    const focusCommands: Command[] = (
      ['about', 'neofetch', 'projects', 'skills', 'contact'] as WindowId[]
    ).map((id) => ({
      id: `focus-${id}`,
      label: `go to ${WINDOW_META[id].label.toLowerCase()}`,
      hint: 'window',
      run: () => focusWindow(id),
    }))

    return [
      ...focusCommands,
      {
        id: 'email',
        label: 'email me',
        hint: EMAIL,
        run: () => window.open(`mailto:${EMAIL}`),
      },
      {
        id: 'resume',
        label: 'open resume (plain text)',
        hint: '/resume',
        run: () => router.push('/resume'),
      },
      ...SOCIAL_LINKS.map((s) => ({
        id: `social-${s.label}`,
        label: `open ${s.label.toLowerCase()}`,
        hint: 'link',
        run: () => window.open(s.link, '_blank', 'noopener'),
      })),
      ...THEMES.map((t) => ({
        id: `theme-${t.id}`,
        label: `theme: ${t.label.toLowerCase()}`,
        hint: 'appearance',
        run: () => dispatch({ type: 'set-theme', theme: t.id }),
      })),
      {
        id: 'reset',
        label: 'reset window layout',
        hint: 'desktop',
        run: () => dispatch({ type: 'reset-layout' }),
      },
    ]
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [windows, dispatch, router])

  /** Subsequence fuzzy match, lower score = better */
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return commands
    const scored: { cmd: Command; score: number }[] = []
    for (const cmd of commands) {
      const hay = `${cmd.label} ${cmd.hint}`.toLowerCase()
      let qi = 0
      let score = 0
      let lastHit = -1
      for (let hi = 0; hi < hay.length && qi < q.length; hi++) {
        if (hay[hi] === q[qi]) {
          if (lastHit === hi - 1) score -= 2
          lastHit = hi
          qi++
        }
      }
      if (qi === q.length) {
        score += hay.indexOf(q) === 0 ? -4 : 0
        scored.push({ cmd, score })
      }
    }
    return scored.sort((a, b) => a.score - b.score).map((s) => s.cmd)
  }, [query, commands])

  useEffect(() => {
    setSelected(0)
  }, [query])

  useEffect(() => {
    if (launcherOpen) {
      setQuery('')
      setSelected(0)
      const t = setTimeout(() => inputRef.current?.focus(), 30)
      return () => clearTimeout(t)
    }
  }, [launcherOpen])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        dispatch({ type: 'toggle-launcher' })
        return
      }
      if (e.key === 'Escape') {
        dispatch({ type: 'toggle-launcher', open: false })
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [dispatch])

  if (!launcherOpen) return null

  const runCommand = (cmd: Command | undefined) => {
    if (!cmd) return
    dispatch({ type: 'toggle-launcher', open: false })
    cmd.run()
  }

  return (
    <div
      className="fixed inset-0 z-[10001] flex items-start justify-center pt-[14vh]"
      style={{ background: 'rgba(0,0,0,0.35)' }}
      onPointerDown={() => dispatch({ type: 'toggle-launcher', open: false })}
    >
      <div
        className="glass w-[min(92vw,520px)] overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-label="Command launcher"
        onPointerDown={(e) => e.stopPropagation()}
      >
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown') {
              e.preventDefault()
              setSelected((s) => Math.min(s + 1, filtered.length - 1))
            } else if (e.key === 'ArrowUp') {
              e.preventDefault()
              setSelected((s) => Math.max(s - 1, 0))
            } else if (e.key === 'Enter') {
              e.preventDefault()
              runCommand(filtered[selected])
            }
          }}
          className="w-full border-b bg-transparent px-4 py-3 font-mono text-sm outline-none"
          style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
          placeholder="run a command…"
          aria-label="Search commands"
          autoComplete="off"
          spellCheck={false}
        />
        <ul
          className="max-h-[46vh] overflow-y-auto p-1.5"
          role="listbox"
          id="launcher-list"
        >
          {filtered.length === 0 && (
            <li className="px-3 py-2 text-xs" style={{ color: 'var(--faint)' }}>
              no matching command — try &apos;theme&apos; or
              &apos;projects&apos;
            </li>
          )}
          {filtered.map((cmd, index) => (
            <li key={cmd.id} role="option" aria-selected={index === selected}>
              <button
                type="button"
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-[13px] ${
                  index === selected ? 'font-medium' : ''
                }`}
                style={{
                  background:
                    index === selected
                      ? 'color-mix(in srgb, var(--accent) 15%, transparent)'
                      : 'transparent',
                  color: index === selected ? 'var(--accent)' : 'var(--muted)',
                }}
                onPointerEnter={() => setSelected(index)}
                onClick={() => runCommand(cmd)}
              >
                <span>
                  <span aria-hidden style={{ color: 'var(--faint)' }}>
                    ❯{' '}
                  </span>
                  {cmd.label}
                </span>
                <span className="text-[11px]" style={{ color: 'var(--faint)' }}>
                  {cmd.hint}
                </span>
              </button>
            </li>
          ))}
        </ul>
        <div
          className="border-t px-4 py-2 text-[11px]"
          style={{ borderColor: 'var(--border)', color: 'var(--faint)' }}
        >
          ↑↓ navigate · ↵ run · esc close
        </div>
      </div>
    </div>
  )
}
