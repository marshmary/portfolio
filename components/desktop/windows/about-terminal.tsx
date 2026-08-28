'use client'

import { useEffect, useRef, useState } from 'react'
import { Cursor } from '@/components/ui/cursor'
import { PromptLine } from '@/components/ui/prompt-line'
import { execute } from '@/lib/terminal-commands'
import type { TerminalColor, TerminalLine } from '@/lib/terminal-commands'
import { PROFILE } from '@/app/data'
import { useDesktop } from '../context'
import type { WindowId } from '../types'

const COLOR_VARS: Record<TerminalColor, string> = {
  text: 'var(--text)',
  muted: 'var(--muted)',
  faint: 'var(--faint)',
  accent: 'var(--accent)',
  green: 'var(--green)',
  red: 'var(--red)',
  yellow: 'var(--yellow)',
  peach: 'var(--accent-2)',
  blue: 'var(--accent)',
  teal: 'var(--accent)',
}

type BootStep =
  | { kind: 'output'; lines: TerminalLine[] }
  | { kind: 'command'; text: string }

const BOOT_STEPS: BootStep[] = [
  {
    kind: 'output',
    lines: [{ text: '[ ok ] riced desktop ready', color: 'green' }],
  },
  { kind: 'command', text: 'whoami' },
  {
    kind: 'output',
    lines: [
      {
        text: `${PROFILE.displayName || PROFILE.name} — ${PROFILE.title}`,
        color: 'text',
      },
    ],
  },
  { kind: 'command', text: 'cat tagline.txt' },
  {
    kind: 'output',
    lines: [{ text: `"${PROFILE.tagline}"`, color: 'peach' }],
  },
  { kind: 'command', text: 'cat about.txt' },
  { kind: 'output', lines: [{ text: PROFILE.about, color: 'muted' }] },
  ...(PROFILE.highlights ?? []).map(
    (h) =>
      ({
        kind: 'output',
        lines: [{ text: `+ ${h}`, color: 'green' }],
      }) as BootStep,
  ),
]

type HistoryEntry =
  | { kind: 'cmd'; text: string; echo?: boolean }
  | { kind: 'out'; lines: TerminalLine[] }

const WINDOW_NAMES: WindowId[] = [
  'about',
  'neofetch',
  'projects',
  'skills',
  'contact',
]

function bootHistory(): HistoryEntry[] {
  return BOOT_STEPS.map((step) =>
    step.kind === 'command'
      ? { kind: 'cmd' as const, text: step.text }
      : { kind: 'out' as const, lines: step.lines },
  )
}

/**
 * `~/about` terminal window (DESIGN.md §4): typed bio on first load,
 * live command prompt afterwards.
 */
export function AboutTerminal() {
  const {
    dispatch,
    reducedMotion,
    mode,
    windows: desktopWindows,
  } = useDesktop()
  // Full boot content is server-rendered so the bio exists in the served
  // HTML (SEO/a11y) and stack-mode cards never grow after hydration
  // (CLS: plan-performance-seo-privacy Phase 2). The desktop-mode typing
  // animation below clears and retypes it; desktop windows are absolutely
  // positioned with fixed heights, so that causes zero layout shift.
  const [history, setHistory] = useState<HistoryEntry[]>(bootHistory)
  const [bootDone, setBootDone] = useState(true)
  const [typingCommand, setTypingCommand] = useState('')
  const [input, setInput] = useState('')
  const [cmdHistory, setCmdHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [inputFocused, setInputFocused] = useState(false)
  const skippedRef = useRef(false)
  const finishedRef = useRef(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const finishBoot = () => {
    if (finishedRef.current) return
    finishedRef.current = true
    skippedRef.current = true
    setHistory(bootHistory())
    setTypingCommand('')
    setBootDone(true)
  }

  useEffect(() => {
    const visited = localStorage.getItem('ricey-visited')
    if (reducedMotion || visited || mode === 'stack') {
      finishBoot()
      localStorage.setItem('ricey-visited', '1')
      return
    }
    localStorage.setItem('ricey-visited', '1')

    let cancelled = false
    const sleep = (ms: number) =>
      new Promise<void>((resolve) => setTimeout(resolve, ms))

    async function run() {
      await sleep(400)
      if (cancelled || skippedRef.current) return
      setHistory([])
      for (const step of BOOT_STEPS) {
        if (cancelled || skippedRef.current) return
        if (step.kind === 'output') {
          await sleep(200)
          if (cancelled || skippedRef.current) return
          setHistory((h) => [...h, { kind: 'out', lines: step.lines }])
          await sleep(150)
        } else {
          setTypingCommand('')
          await sleep(180)
          for (let i = 1; i <= step.text.length; i++) {
            if (cancelled || skippedRef.current) return
            setTypingCommand(step.text.slice(0, i))
            await sleep(30)
          }
          await sleep(240)
          if (cancelled || skippedRef.current) return
          setHistory((h) => [...h, { kind: 'cmd', text: step.text }])
          setTypingCommand('')
        }
      }
      if (!cancelled && !skippedRef.current) finishBoot()
    }

    run()
    return () => {
      cancelled = true
    }
  }, [reducedMotion, mode])

  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [history, typingCommand, bootDone])

  const runCommand = (raw: string) => {
    const trimmed = raw.trim()
    if (!trimmed) return
    setCmdHistory((h) => [...h, trimmed])
    setHistoryIndex(-1)

    if (trimmed.toLowerCase() === 'clear') {
      setHistory([])
      setInput('')
      return
    }

    const [name, , target] = trimmed.split(/\s+/)
    if ((name === 'open' || name === 'focus') && target) {
      const match = WINDOW_NAMES.find((w) => w === target.toLowerCase())
      if (match) {
        setHistory((h) => [...h, { kind: 'cmd', text: trimmed, echo: true }])
        setHistory((h) => [
          ...h,
          {
            kind: 'out',
            lines: [{ text: `opening ${match}…`, color: 'green' }],
          },
        ])
        setInput('')
        const winState = desktopWindows[match]
        dispatch(
          winState.closed || winState.minimized
            ? { type: 'open', id: match }
            : { type: 'focus', id: match },
        )
        return
      }
    }

    const output = execute(trimmed)
    setHistory((h) => [...h, { kind: 'cmd', text: trimmed, echo: true }])
    if (output.length > 0) {
      setHistory((h) => [...h, { kind: 'out', lines: output }])
    }
    setInput('')
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      runCommand(input)
      return
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (cmdHistory.length === 0) return
      const next =
        historyIndex < 0 ? cmdHistory.length - 1 : Math.max(0, historyIndex - 1)
      setHistoryIndex(next)
      setInput(cmdHistory[next])
      return
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (historyIndex < 0) return
      const next = historyIndex + 1
      if (next >= cmdHistory.length) {
        setHistoryIndex(-1)
        setInput('')
      } else {
        setHistoryIndex(next)
        setInput(cmdHistory[next])
      }
    }
  }

  return (
    <div
      ref={scrollRef}
      className="flex h-full flex-col gap-2 overflow-y-auto"
      onClick={() => inputRef.current?.focus()}
    >
      {history.map((entry, index) =>
        entry.kind === 'cmd' ? (
          <PromptLine
            key={index}
            symbol={entry.echo ? '❯' : '$'}
            command={entry.text}
          />
        ) : (
          <div key={index} className="flex flex-col gap-1">
            {entry.lines.map((l, i) => (
              <p
                key={i}
                className="whitespace-pre-wrap"
                style={{ color: COLOR_VARS[l.color ?? 'muted'] }}
              >
                {l.text}
              </p>
            ))}
          </div>
        ),
      )}

      {!typingCommand ? null : <PromptLine command={typingCommand} />}

      <div className="mt-auto flex items-baseline gap-2 pt-1">
        <span
          aria-hidden
          className="shrink-0 select-none"
          style={{ color: 'var(--accent)' }}
        >
          ❯
        </span>
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setInputFocused(true)}
          onBlur={() => setInputFocused(false)}
          className="min-w-0 shrink grow-0 bg-transparent font-mono text-[13px] outline-none"
          style={{
            color: 'var(--text)',
            width: `${Math.max(input.length, 12)}ch`,
          }}
          placeholder="type 'help'"
          aria-label="Terminal input"
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
        />
        {!inputFocused && <Cursor />}
      </div>
    </div>
  )
}
