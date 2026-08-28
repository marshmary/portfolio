'use client'

import { useEffect, useMemo, useState } from 'react'
import { DEVOPS_SKILLS, DEV_SKILLS } from '@/app/data'

/**
 * `btop — skills` mock system monitor (DESIGN.md §4): sits there and shows
 * "running" data — live clock, CPU/MEM/NET meters, load average.
 * Two main processes (devops, dev); each TOOL from the skill descriptions
 * is a thread underneath (docker, k8s, js, terraform, …).
 * Proficiency of the parent skill maps to the thread's base CPU%.
 * Owner request: NO bars — numbers only.
 */

const LEVEL_MAP: Record<string, number> = {
  expert: 95,
  advanced: 85,
  intermediate: 65,
  familiar: 40,
  beginner: 25,
}

function levelPercent(level?: string): number {
  return LEVEL_MAP[(level ?? '').toLowerCase()] ?? 60
}

/** Deterministic pseudo-random in [0, 1) from a seed. */
function noise(seed: number): number {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453
  return x - Math.floor(x)
}

const clamp = (v: number, min: number, max: number) =>
  Math.min(Math.max(v, min), max)

function percentColor(pct: number): string {
  if (pct >= 80) return 'var(--green)'
  if (pct >= 60) return 'var(--yellow)'
  return 'var(--muted)'
}

/** Rice-y short process names for known tools. */
const TOOL_ALIAS: Record<string, string> = {
  kubernetes: 'k8s',
  javascript: 'js',
  'docker compose': 'docker-compose',
  'github actions': 'github-actions',
  'gitlab ci': 'gitlab-ci',
  'elk stack': 'elk',
}

function toolName(raw: string): string {
  const clean = raw.trim().toLowerCase()
  return TOOL_ALIAS[clean] ?? clean.replace(/\s+/g, '-')
}

interface Thread {
  tid: string
  name: string
  category: string
  base: number
  detail: string
  time: number
}

interface ProcGroup {
  pid: string
  name: string
  threads: Thread[]
}

export function SkillsMonitor() {
  const groups = useMemo<ProcGroup[]>(() => {
    let offset = 0
    const build = (
      skills: typeof DEVOPS_SKILLS,
      category: string,
      pid: string,
    ): ProcGroup => {
      const threads: Thread[] = skills
        .flatMap((s) => {
          const base = levelPercent(s.proficiencyLevel)
          return s.description.split(',').map((raw) => ({
            tid: '',
            name: toolName(raw),
            category,
            base,
            detail: `${toolName(raw)} — ${s.title}`,
            time: 0,
          }))
        })
        .sort((a, b) => b.base - a.base || a.name.localeCompare(b.name))
      return {
        pid,
        name: category,
        threads: threads.map((t, i) => ({
          ...t,
          tid: `T${String(i + 1).padStart(2, '0')}`,
          time: 937 + offset++ * 617,
        })),
      }
    }
    return [
      build(DEVOPS_SKILLS, 'devops', '0001'),
      build(DEV_SKILLS, 'dev', '0002'),
    ]
  }, [])

  const [tick, setTick] = useState(0)
  const [clock, setClock] = useState('--:--:--')

  useEffect(() => {
    const update = () => {
      setTick((t) => t + 1)
      setClock(
        new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }),
      )
    }
    update()
    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  }, [])

  const threadCpu = (t: Thread, i: number) =>
    clamp(t.base + Math.round((noise(tick * 3.7 + i * 13.3) - 0.5) * 16), 3, 99)

  const threadTime = (t: Thread) => {
    const total = t.time + tick * 3
    const m = Math.floor(total / 60)
    const s = total % 60
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }

  const groupCpu = (g: ProcGroup) => {
    const avg =
      g.threads.reduce(
        (acc, t, i) => acc + threadCpu(t, g.pid === '0001' ? i : i + 8),
        0,
      ) / g.threads.length
    return Math.round(avg)
  }

  const groupTime = (g: ProcGroup) => {
    const total = g.threads.reduce((acc, t) => acc + t.time + tick * 3, 0)
    const h = Math.floor(total / 3600)
    const m = Math.floor((total % 3600) / 60)
    const s = total % 60
    return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }

  const sysCpu = Math.round(
    groups.reduce((acc, g) => acc + groupCpu(g), 0) / groups.length,
  )
  const memUsed = (5.2 + noise(tick * 5.1) * 1.6).toFixed(1)
  const netDown = (0.4 + noise(tick * 9.3) * 2.4).toFixed(1)
  const netUp = (0.1 + noise(tick * 11.7) * 0.6).toFixed(1)
  const load = [0, 1, 2]
    .map((k) => (0.3 + noise(tick * 2.3 + k) * 1.3).toFixed(2))
    .join('  ')

  const totalThreads = groups.reduce((acc, g) => acc + g.threads.length, 0)

  return (
    <div className="flex flex-col gap-2 font-mono tabular-nums">
      {/* Header */}
      <p className="flex shrink-0 items-center justify-between text-xs select-none">
        <span>
          <span style={{ color: 'var(--accent)' }}>btop</span>
          <span style={{ color: 'var(--faint)' }}>
            {' '}
            — skills monitor · {groups.length} processes · {totalThreads}{' '}
            threads
          </span>
        </span>
        <span style={{ color: 'var(--muted)' }} suppressHydrationWarning>
          {clock}
        </span>
      </p>

      {/* System meters — live mock data */}
      <div
        className="flex shrink-0 flex-wrap gap-x-4 gap-y-0.5 rounded-lg border px-2.5 py-1.5 text-[11px] sm:text-xs"
        style={{ borderColor: 'var(--border)' }}
        aria-label="Mock system meters"
      >
        <span style={{ color: 'var(--faint)' }}>
          CPU <span style={{ color: percentColor(sysCpu) }}>{sysCpu}%</span>
        </span>
        <span style={{ color: 'var(--faint)' }}>
          MEM <span style={{ color: 'var(--muted)' }}>{memUsed}/16GiB</span>
        </span>
        <span style={{ color: 'var(--faint)' }}>
          NET{' '}
          <span style={{ color: 'var(--muted)' }}>
            ↓{netDown} ↑{netUp} MiB/s
          </span>
        </span>
        <span style={{ color: 'var(--faint)' }}>
          UPTIME{' '}
          <span style={{ color: 'var(--accent)' }}>3+ yrs in devops</span>
        </span>
      </div>

      {/* Table header */}
      <div
        className="grid shrink-0 grid-cols-[44px_1fr_50px_44px_56px] gap-2 border-b pb-1 text-[11px] select-none"
        style={{ borderColor: 'var(--border)', color: 'var(--faint)' }}
        aria-hidden
      >
        <span>PID</span>
        <span>NAME</span>
        <span>CAT</span>
        <span className="text-right">CPU%</span>
        <span className="text-right">TIME+</span>
      </div>

      {/* Process tree — groups as main processes, skills as threads */}
      <ul
        className="flex flex-col gap-0.5"
        aria-label="Skills as processes and threads"
      >
        {groups.map((group) => (
          <li key={group.pid} className="flex flex-col gap-0.5">
            {/* Main process row */}
            <div
              className="grid grid-cols-[44px_1fr_50px_44px_56px] items-baseline gap-2 rounded px-0.5 py-1 text-[13px] font-medium"
              title={`main process — ${group.threads.length} threads`}
            >
              <span style={{ color: 'var(--accent)' }}>{group.pid}</span>
              <span
                className="min-w-0 truncate"
                style={{ color: 'var(--heading)' }}
              >
                {group.name}
              </span>
              <span
                className="text-[11px]"
                style={{ color: 'var(--accent-2)' }}
              >
                main
              </span>
              <span
                className="text-right"
                style={{ color: percentColor(groupCpu(group)) }}
              >
                {groupCpu(group)}%
              </span>
              <span className="text-right" style={{ color: 'var(--faint)' }}>
                {groupTime(group)}
              </span>
            </div>

            {/* Thread rows */}
            {group.threads.map((thread, i) => {
              const isLast = i === group.threads.length - 1
              return (
                <div
                  key={thread.name}
                  className="grid grid-cols-[44px_1fr_50px_44px_56px] items-baseline gap-2 rounded px-0.5 py-0.5 text-[12px] transition-colors hover:bg-[color-mix(in_srgb,var(--accent)_10%,transparent)]"
                  title={thread.detail}
                >
                  <span style={{ color: 'var(--faint)' }}>{thread.tid}</span>
                  <span className="flex min-w-0 items-baseline gap-1.5 pl-2">
                    <span
                      aria-hidden
                      className="shrink-0 select-none"
                      style={{ color: 'var(--accent)' }}
                    >
                      {isLast ? '└─' : '├─'}
                    </span>
                    <span
                      className="min-w-0 flex-1 truncate"
                      style={{ color: 'var(--muted)' }}
                    >
                      {thread.name}
                    </span>
                  </span>
                  <span
                    className="text-[11px]"
                    style={{ color: 'var(--accent-2)' }}
                  >
                    {thread.category}
                  </span>
                  <span
                    className="text-right"
                    style={{ color: percentColor(threadCpu(thread, i)) }}
                  >
                    {threadCpu(thread, i)}%
                  </span>
                  <span
                    className="text-right"
                    style={{ color: 'var(--faint)' }}
                  >
                    {threadTime(thread)}
                  </span>
                </div>
              )
            })}
          </li>
        ))}
      </ul>

      <p
        className="shrink-0 pt-1 text-[11px]"
        style={{ color: 'var(--faint)' }}
      >
        load average: {load} · proficiency mapped to cpu% — no processes were
        harmed
      </p>
    </div>
  )
}
