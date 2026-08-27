'use client'

import { PROJECTS, PROFILE, CERTIFICATIONS, WORK_EXPERIENCE } from '@/app/data'

/**
 * `neofetch` info panel (DESIGN.md §4): stats-as-facts —
 * OS→Location, Uptime→Years experience, Shell→role, Packages→# projects.
 */
export function Neofetch() {
  const startYear = Number(
    WORK_EXPERIENCE[0]?.start ?? new Date().getFullYear(),
  )
  const years = Math.max(1, new Date().getFullYear() - startYear)

  const rows: { key: string; value: string; color: string }[] = [
    { key: 'OS', value: PROFILE.location ?? 'Unknown', color: 'var(--accent)' },
    { key: 'Host', value: 'phutran.dev', color: 'var(--accent)' },
    { key: 'Uptime', value: `${years}+ yrs in DevOps`, color: 'var(--accent)' },
    { key: 'Shell', value: PROFILE.title, color: 'var(--accent)' },
    {
      key: 'Packages',
      value: `${PROJECTS.length} projects`,
      color: 'var(--accent)',
    },
    {
      key: 'Certs',
      value:
        CERTIFICATIONS.map((c) => c.name.split(' ').slice(-2).join(' ')).join(
          ', ',
        ) || 'none',
      color: 'var(--accent)',
    },
    { key: 'WM', value: PROFILE.tagline ?? '', color: 'var(--accent)' },
  ]

  return (
    <div className="flex h-full items-start gap-4 overflow-y-auto">
      <pre
        className="shrink-0 text-[11px] leading-tight select-none sm:text-xs"
        style={{ color: 'var(--accent)' }}
        aria-hidden
      >
        {`      ▲
     ▲ ▲
    ▲   ▲
   ▲     ▲
  ▲       ▲`}
      </pre>
      <div className="min-w-0 flex-1">
        <p className="text-sm" style={{ color: 'var(--heading)' }}>
          <span style={{ color: 'var(--accent)' }}>
            {PROFILE.displayName || PROFILE.name}
          </span>
          @site
        </p>
        <p
          className="mb-2 text-sm select-none"
          style={{ color: 'var(--faint)' }}
          aria-hidden
        >
          ─────────
        </p>
        <dl className="flex flex-col gap-0.5">
          {rows.map((row) => (
            <div key={row.key} className="flex gap-2 text-[13px]">
              <dt className="w-20 shrink-0" style={{ color: 'var(--accent)' }}>
                {row.key}:
              </dt>
              <dd className="min-w-0" style={{ color: 'var(--text)' }}>
                {row.value}
              </dd>
            </div>
          ))}
        </dl>
        {/* palette strip — classic neofetch flavor */}
        <div className="mt-3 flex gap-1" aria-hidden>
          {[
            '#bf616a',
            '#ebcb8b',
            '#a3be8c',
            '#88c0d0',
            '#81a1c1',
            '#b48ead',
          ].map((c) => (
            <span
              key={c}
              className="h-3 w-5 rounded-sm"
              style={{ background: c }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
