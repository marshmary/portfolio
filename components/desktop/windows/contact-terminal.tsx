'use client'

import Link from 'next/link'
import { PROFILE, SOCIAL_LINKS } from '@/app/data'
import { EmailReveal } from '@/components/ui/email-reveal'

/**
 * `~/contact.sh` terminal window (DESIGN.md §4): contact lines
 * styled as shell output, social chips, `/resume` hint.
 */
export function ContactTerminal() {
  return (
    <div className="flex h-full flex-col gap-3 overflow-y-auto">
      <div className="flex flex-col gap-1">
        <p className="text-xs select-none" aria-hidden>
          <span style={{ color: 'var(--accent)' }}>$</span>{' '}
          <span style={{ color: 'var(--text)' }}>contact --info</span>
        </p>
        <p
          className="flex items-baseline gap-2"
          style={{ color: 'var(--muted)' }}
        >
          <span
            className="w-16 shrink-0 select-none"
            style={{ color: 'var(--faint)' }}
          >
            email
          </span>
          <EmailReveal
            className="underline decoration-dotted underline-offset-4 transition-colors hover:text-[color:var(--accent)]"
            style={{ color: 'var(--accent)' }}
          />
        </p>
        {PROFILE.phone && (
          <p
            className="flex items-baseline gap-2"
            style={{ color: 'var(--muted)' }}
          >
            <span
              className="w-16 shrink-0 select-none"
              style={{ color: 'var(--faint)' }}
            >
              phone
            </span>
            <a
              href={`tel:${PROFILE.phone.replace(/\s/g, '')}`}
              className="underline decoration-dotted underline-offset-4 transition-colors hover:text-[color:var(--accent)]"
              style={{ color: 'var(--accent)' }}
            >
              {PROFILE.phone}
            </a>
          </p>
        )}
        {PROFILE.location && (
          <p
            className="flex items-baseline gap-2"
            style={{ color: 'var(--muted)' }}
          >
            <span
              className="w-16 shrink-0 select-none"
              style={{ color: 'var(--faint)' }}
            >
              location
            </span>
            <span>{PROFILE.location}</span>
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <p className="text-xs select-none" aria-hidden>
          <span style={{ color: 'var(--accent)' }}>$</span>{' '}
          <span style={{ color: 'var(--text)' }}>social --list</span>
        </p>
        <div className="flex flex-wrap gap-1.5">
          {SOCIAL_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.link}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border px-2.5 py-1 text-xs transition-colors hover:text-[color:var(--accent)]"
              style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}
            >
              {link.label} <span aria-hidden>↗</span>
            </a>
          ))}
        </div>
      </div>

      <p className="mt-auto text-[11px]" style={{ color: 'var(--faint)' }}>
        plain-text version:{' '}
        <Link
          href="/resume"
          className="underline decoration-dotted underline-offset-2 transition-colors hover:text-[color:var(--accent)]"
          style={{ color: 'var(--accent)' }}
        >
          /resume
        </Link>
      </p>
    </div>
  )
}
