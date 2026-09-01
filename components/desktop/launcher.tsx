'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useDesktop } from './context'
import { THEMES, WINDOW_META, type WindowId } from './types'
import { SOCIAL_LINKS, EMAIL } from '@/app/data'
import { rot13 } from '@/lib/obfuscate'
import { scrollToWindow } from './scroll-to-window'

const DECODED_EMAIL = rot13(EMAIL)

interface Command {
  id: string
  label: string
  hint: string
  run: () => void
}

type Mode = 'run' | 'split'

const SPLITTABLE: WindowId[] = [
  'about',
  'neofetch',
  'projects',
  'skills',
  'contact',
]

/**
 * Rofi-style command palette (DESIGN.md §4, §5):
 * - ⌘/Ctrl+K opens the run palette, ⌘/Ctrl+\ opens the split box
 * - Esc closes; arrow keys navigate; the list scrolls to follow the selection
 */
export function Launcher() {
  const {
    windows,
    dispatch,
    launcherOpen,
    mode: desktopMode,
    reducedMotion,
  } = useDesktop()
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const [mode, setMode] = useState<Mode>('run')
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(0)

  const focusedId = useMemo(
    () =>
      SPLITTABLE.find((id) => {
        const w = windows[id]
        return (
          !w.closed &&
          !w.minimized &&
          w.z ===
            Math.max(
              ...SPLITTABLE.map((wid) =>
                windows[wid].closed || windows[wid].minimized
                  ? 0
                  : windows[wid].z,
              ),
            )
        )
      }) ?? 'about',
    [windows],
  )

  const focusWindow = (id: WindowId) => {
    if (desktopMode === 'stack') {
      scrollToWindow(id, reducedMotion)
      return
    }
    const win = windows[id]
    if (win.closed || win.minimized) dispatch({ type: 'open', id })
    else dispatch({ type: 'focus', id })
  }

  const commands = useMemo<Command[]>(() => {
    const focusCommands: Command[] = SPLITTABLE.map((id) => ({
      id: `focus-${id}`,
      label: `go to ${WINDOW_META[id].label.toLowerCase()}`,
      hint: 'window',
      run: () => focusWindow(id),
    }))

    return [
      ...focusCommands,
      ...(desktopMode === 'desktop'
        ? [
            {
              id: 'split',
              label: 'split view (pick a window)',
              hint: '⌘\\',
              run: () => setMode('split'),
            },
          ]
        : []),
      {
        id: 'email',
        label: 'email me',
        hint: DECODED_EMAIL,
        run: () => window.open(`mailto:${DECODED_EMAIL}`),
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
  }, [windows, dispatch, router, desktopMode, reducedMotion])

  const splitTargets = useMemo(
    () => SPLITTABLE.filter((id) => id !== focusedId),
    [focusedId],
  )

  const close = useCallback(
    () => dispatch({ type: 'toggle-launcher', open: false }),
    [dispatch],
  )

  const splitWith = useCallback(
    (id: WindowId | undefined) => {
      if (!id) return
      dispatch({ type: 'split-windows', left: focusedId, right: id })
      close()
    },
    [dispatch, focusedId, close],
  )

  /** Subsequence fuzzy match, lower score = better */
  const filtered = useMemo<Command[]>(() => {
    if (mode === 'split') {
      const q = query.trim().toLowerCase()
      return splitTargets
        .filter((id) => WINDOW_META[id].label.toLowerCase().includes(q))
        .map<Command>((id) => ({
          id: `split-${id}`,
          label: WINDOW_META[id].label.toLowerCase(),
          hint: WINDOW_META[id].title,
          run: () => splitWith(id),
        }))
    }
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
  }, [query, commands, mode, splitTargets, splitWith])

  // Keep the selected item visible when navigating past the visible box
  useEffect(() => {
    const el = listRef.current?.children[selected] as HTMLElement | undefined
    el?.scrollIntoView({ block: 'nearest' })
  }, [selected, filtered])

  useEffect(() => {
    setSelected(0)
  }, [query, mode])

  useEffect(() => {
    if (launcherOpen) {
      setQuery('')
      setSelected(0)
      const t = setTimeout(() => inputRef.current?.focus(), 30)
      return () => clearTimeout(t)
    }
  }, [launcherOpen])

  // Always land back in "run" mode when the palette is dismissed, so a reopen
  // via the top-bar button never resurrects the split picker.
  useEffect(() => {
    if (!launcherOpen) setMode('run')
  }, [launcherOpen])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setMode('run')
        dispatch({ type: 'toggle-launcher', open: true })
        return
      }
      if (
        (e.metaKey || e.ctrlKey) &&
        e.key === '\\' &&
        desktopMode === 'desktop'
      ) {
        e.preventDefault()
        setMode('split')
        dispatch({ type: 'toggle-launcher', open: true })
        return
      }
      if (e.key === 'Escape') {
        dispatch({ type: 'toggle-launcher', open: false })
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [dispatch, desktopMode])

  if (!launcherOpen) return null

  const runCommand = (cmd: Command | undefined) => {
    if (!cmd) return
    if (cmd.id === 'split') {
      setMode('split')
      setQuery('')
      setSelected(0)
      inputRef.current?.focus()
      return
    }
    close()
    cmd.run()
  }

  const placeholder =
    mode === 'split' ? 'split desktop with…' : 'run a command…'

  return (
    <div
      className="fixed inset-0 z-[10001] flex items-start justify-center pt-[14vh]"
      style={{ background: 'rgba(0,0,0,0.35)' }}
      onPointerDown={close}
    >
      <div
        className="glass w-[min(92vw,520px)] overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-label={mode === 'split' ? 'Split desktop' : 'Command launcher'}
        onPointerDown={(e) => e.stopPropagation()}
      >
        {mode === 'split' && (
          <p
            className="border-b px-4 pt-2.5 text-[11px]"
            style={{
              borderColor: 'var(--border)',
              color: 'var(--faint)',
            }}
          >
            <span aria-hidden style={{ color: 'var(--accent)' }}>
              ❯{' '}
            </span>
            left: {WINDOW_META[focusedId].label.toLowerCase()} — pick the right
            half
          </p>
        )}
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
              if (mode === 'split') splitWith(splitTargets[selected])
              else runCommand(filtered[selected])
            }
          }}
          className="w-full border-b bg-transparent px-4 py-3 font-mono text-sm outline-none"
          style={{
            borderColor: 'var(--border)',
            color: 'var(--text)',
          }}
          placeholder={placeholder}
          aria-label={
            mode === 'split' ? 'Pick split window' : 'Search commands'
          }
          autoComplete="off"
          spellCheck={false}
        />
        <ul
          ref={listRef}
          className="max-h-[46vh] overflow-y-auto p-1.5"
          role="listbox"
          id="launcher-list"
        >
          {filtered.length === 0 && (
            <li className="px-3 py-2 text-xs" style={{ color: 'var(--faint)' }}>
              {mode === 'split'
                ? 'no matching window'
                : 'no matching command — try &apos;theme&apos; or &apos;projects&apos;'}
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
          ↑↓ navigate · ↵ {mode === 'split' ? 'split' : 'run'} · esc close
        </div>
      </div>
    </div>
  )
}
