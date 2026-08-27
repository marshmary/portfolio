'use client'

import { DEVOPS_SKILLS, DEV_SKILLS } from '@/app/data'

/**
 * `btop — skills` system monitor (DESIGN.md §4): skills as a process
 * table (PID / NAME / CATEGORY / CPU%). Proficiency maps to CPU%.
 * Owner request: NO bars — percentages as text only.
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

function percentColor(pct: number): string {
  if (pct >= 80) return 'var(--green)'
  if (pct >= 60) return 'var(--yellow)'
  return 'var(--muted)'
}

export function SkillsMonitor() {
  const rows = [
    ...DEVOPS_SKILLS.map((s) => ({
      name: s.title,
      category: 'devops',
      pct: levelPercent(s.proficiencyLevel),
      detail: s.description,
    })),
    ...DEV_SKILLS.map((s) => ({
      name: s.title,
      category: 'dev',
      pct: levelPercent(s.proficiencyLevel),
      detail: s.description,
    })),
  ].sort((a, b) => b.pct - a.pct)

  return (
    <div className="flex flex-col gap-2 font-mono">
      <p className="shrink-0 text-xs select-none" aria-hidden>
        <span style={{ color: 'var(--accent)' }}>btop</span>
        <span style={{ color: 'var(--faint)' }}>
          {' '}
          — skills monitor · {rows.length} tasks
        </span>
      </p>

      {/* Header row */}
      <div
        className="grid shrink-0 grid-cols-[44px_1fr_60px_48px] gap-2 border-b pb-1 text-[11px] select-none"
        style={{ borderColor: 'var(--border)', color: 'var(--faint)' }}
        aria-hidden
      >
        <span>PID</span>
        <span>NAME</span>
        <span>CAT</span>
        <span className="text-right">CPU%</span>
      </div>

      {/* Process rows */}
      <ul className="flex flex-col gap-0.5" aria-label="Skills as processes">
        {rows.map((row, index) => (
          <li
            key={row.name}
            className="grid grid-cols-[44px_1fr_60px_48px] items-baseline gap-2 rounded px-0.5 py-0.5 text-[12px] transition-colors hover:bg-[color-mix(in_srgb,var(--accent)_10%,transparent)] sm:text-[13px]"
            title={row.detail}
          >
            <span style={{ color: 'var(--faint)' }}>
              {String(index + 1).padStart(4, '0')}
            </span>
            <span className="min-w-0 truncate" style={{ color: 'var(--text)' }}>
              {row.name}
            </span>
            <span className="text-[11px]" style={{ color: 'var(--accent-2)' }}>
              {row.category}
            </span>
            <span
              className="text-right tabular-nums"
              style={{ color: percentColor(row.pct) }}
            >
              {row.pct}%
            </span>
          </li>
        ))}
      </ul>

      <p
        className="shrink-0 pt-1 text-[11px]"
        style={{ color: 'var(--faint)' }}
      >
        proficiency mapped to cpu% — no processes were harmed
      </p>
    </div>
  )
}
