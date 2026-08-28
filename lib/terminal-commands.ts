import {
  PROJECTS,
  WORK_EXPERIENCE,
  EDUCATIONS,
  DEVOPS_SKILLS,
  DEV_SKILLS,
  EMAIL,
  SOCIAL_LINKS,
  CERTIFICATIONS,
  PROFILE,
} from '@/app/data'
import { rot13 } from '@/lib/obfuscate'

/**
 * Terminal command engine — pure, testable (DESIGN.md §4).
 * Zero content duplication: everything renders from `app/data.ts`.
 * `clear`, `open <window>` and `focus <window>` are handled by the
 * terminal component (they need access to the desktop state).
 */

export type TerminalColor =
  | 'text'
  | 'muted'
  | 'faint'
  | 'accent'
  | 'green'
  | 'red'
  | 'yellow'
  | 'peach'
  | 'blue'
  | 'teal'

export interface TerminalLine {
  text: string
  color?: TerminalColor
}

export interface TerminalCommand {
  name: string
  description: string
  aliases?: string[]
  run: (args: string[]) => TerminalLine[]
}

const line = (text: string, color?: TerminalColor): TerminalLine => ({
  text,
  color,
})

const NOT_FOUND = (input: string): TerminalLine[] => [
  line(`command not found: ${input} — try 'help'`, 'red'),
]

export const COMMANDS: TerminalCommand[] = [
  {
    name: 'help',
    description: 'list available commands',
    aliases: ['?'],
    run: () => [
      line('available commands:', 'faint'),
      ...COMMANDS.filter((c) => c.name !== 'help').map((c) =>
        line(`  ${c.name.padEnd(12)}${c.description}`, 'muted'),
      ),
      line("hint: ↑/↓ for history, 'clear' to reset", 'faint'),
    ],
  },
  {
    name: 'whoami',
    description: 'print current user',
    run: () => [
      line(`${PROFILE.displayName || PROFILE.name} — ${PROFILE.title}`, 'text'),
    ],
  },
  {
    name: 'about',
    description: 'print profile summary',
    run: () => [
      line(PROFILE.about, 'muted'),
      ...(PROFILE.highlights?.map((h) => line(`+ ${h}`, 'green')) ?? []),
    ],
  },
  {
    name: 'experience',
    description: 'list work experience',
    aliases: ['exp', 'work'],
    run: () => [
      ...WORK_EXPERIENCE.map((job) =>
        line(
          `${job.company.padEnd(14)}${job.title} (${job.start} – ${job.end})`,
          'text',
        ),
      ),
      line('see ~/projects for what I built', 'faint'),
    ],
  },
  {
    name: 'skills',
    description: 'list skills',
    run: () => [
      line('# devops', 'faint'),
      ...DEVOPS_SKILLS.map((s) =>
        line(`${s.title}: ${s.description}`, 'muted'),
      ),
      line('# development', 'faint'),
      ...DEV_SKILLS.map((s) => line(`${s.title}: ${s.description}`, 'muted')),
    ],
  },
  {
    name: 'projects',
    description: 'list projects',
    run: () => [
      ...PROJECTS.map((p) =>
        line(`${p.name.padEnd(10)}${p.description}`, 'text'),
      ),
      ...PROJECTS.filter((p) => p.link).map((p) =>
        line(`${p.name}: ${p.link}`, 'blue'),
      ),
    ],
  },
  {
    name: 'certs',
    description: 'list certifications',
    aliases: ['certifications'],
    run: () => [
      ...CERTIFICATIONS.map((c) =>
        line(`${c.name} — ${c.issuer} (${c.issueDate ?? 'n/a'})`, 'text'),
      ),
      ...CERTIFICATIONS.filter((c) => c.credentialUrl).map((c) =>
        line(`verify: ${c.credentialUrl}`, 'blue'),
      ),
    ],
  },
  {
    name: 'education',
    description: 'list education',
    aliases: ['edu'],
    run: () => [
      ...EDUCATIONS.map((e) =>
        line(`${e.school}: ${e.title} (${e.start} – ${e.end})`, 'text'),
      ),
    ],
  },
  {
    name: 'contact',
    description: 'print contact info',
    run: () => [
      line(`email    ${rot13(EMAIL)}`, 'muted'),
      ...(PROFILE.phone ? [line(`phone    ${PROFILE.phone}`, 'muted')] : []),
      ...(PROFILE.location
        ? [line(`location ${PROFILE.location}`, 'muted')]
        : []),
    ],
  },
  {
    name: 'social',
    description: 'list social links',
    aliases: ['links'],
    run: () => SOCIAL_LINKS.map((s) => line(`${s.label}: ${s.link}`, 'blue')),
  },
  {
    name: 'ls',
    description: 'list windows',
    run: () => [
      line('about/  neofetch/  projects/  skills/  contact/', 'peach'),
    ],
  },
  {
    name: 'neofetch',
    description: 'print system info',
    run: () => [
      line(' /\\_/\\      phu@site', 'accent'),
      line('( o.o )     ──────────', 'accent'),
      line(` > ^ <      OS:      ${PROFILE.location}`, 'muted'),
      line('            Host:    phutran.dev', 'muted'),
      line('            Shell:   glass-term', 'muted'),
      line(`            Title:   ${PROFILE.title}`, 'muted'),
      line(`            Packages: ${PROJECTS.length} projects`, 'muted'),
    ],
  },
  {
    name: 'sudo',
    description: 'execute as superuser',
    run: (args) => {
      const target = args.join(' ')
      if (target === 'hire-me') {
        return [
          line('[sudo] permission granted', 'green'),
          line(`=> ${rot13(EMAIL)}`, 'accent'),
          ...(PROFILE.phone ? [line(`=> ${PROFILE.phone}`, 'accent')] : []),
          line('looking forward to hearing from you o/', 'green'),
        ]
      }
      return [
        line(
          'phu is not in the sudoers file. This incident will be reported.',
          'red',
        ),
      ]
    },
  },
  {
    name: 'rm',
    description: 'remove files',
    run: (args) => {
      if (args.join(' ').startsWith('-rf')) {
        return [
          line('rm: it is dangerous to operate recursively on `/`', 'red'),
          line(
            'rm: nice try. this desktop is immutable infrastructure.',
            'yellow',
          ),
        ]
      }
      return [line('rm: missing operand', 'red')]
    },
  },
  {
    name: 'exit',
    description: 'close the session',
    run: () => [
      line('logout', 'faint'),
      line(
        'thanks for stopping by — the session stays open for you o/',
        'green',
      ),
    ],
  },
]

/** Find a command by name or alias. */
export function findCommand(input: string): TerminalCommand | undefined {
  const needle = input.trim().toLowerCase()
  return COMMANDS.find((c) => c.name === needle || c.aliases?.includes(needle))
}

/** Execute raw input; returns output lines. */
export function execute(raw: string): TerminalLine[] {
  const trimmed = raw.trim()
  if (!trimmed) return []
  const [name, ...args] = trimmed.split(/\s+/)
  const command = findCommand(name)
  if (!command) return NOT_FOUND(name)
  try {
    return command.run(args)
  } catch {
    return [line(`${command.name}: something went wrong`, 'red')]
  }
}
