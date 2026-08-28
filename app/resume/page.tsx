import type { Metadata } from 'next'
import Link from 'next/link'
import {
  PROFILE,
  PROJECTS,
  WORK_EXPERIENCE,
  EDUCATIONS,
  DEVOPS_SKILLS,
  DEV_SKILLS,
  SOCIAL_LINKS,
  CERTIFICATIONS,
} from '../data'
import { EmailReveal } from '@/components/ui/email-reveal'

export const metadata: Metadata = {
  title: 'Resume',
  description:
    'Plain-text resume of Phu Tran, DevOps Engineer — the same content as the interactive desktop, without window chrome.',
}

/**
 * Plain semantic HTML fallback (DESIGN.md §11): ATS / screen readers /
 * printing. Same content as the desktop windows, no window chrome.
 */
export default function ResumePage() {
  return (
    <div className="min-h-screen bg-[#eceff4]">
      <div className="mx-auto max-w-2xl px-5 py-10 font-mono text-[#3b4252]">
        <div className="fixed top-4 right-4">
          <Link
            href="/"
            className="rounded-lg border border-[#4c566a] px-3 py-1.5 text-xs transition-colors hover:bg-[#4c566a] hover:text-[#eceff4]"
          >
            ← back to desktop
          </Link>
        </div>

        <header className="mb-8">
          <h1 className="text-2xl font-bold text-[#2e3440]">
            {PROFILE.displayName || PROFILE.name}
          </h1>
          <p className="mt-1">{PROFILE.title}</p>
          <p className="mt-2 text-sm">
            <EmailReveal className="text-[#81a1c1] underline" />
            {PROFILE.location ? ` · ${PROFILE.location}` : ''}
          </p>
          <ul className="mt-2 flex flex-wrap gap-3 text-sm">
            {SOCIAL_LINKS.map((s) => (
              <li key={s.label}>
                <a
                  className="text-[#81a1c1] underline"
                  href={s.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </header>

        <section className="mb-8">
          <h2 className="mb-2 text-lg font-semibold text-[#2e3440]">About</h2>
          <p>{PROFILE.about}</p>
          {PROFILE.highlights && PROFILE.highlights.length > 0 && (
            <ul className="mt-2 list-disc pl-5 text-sm">
              {PROFILE.highlights.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
          )}
        </section>

        <section className="mb-8">
          <h2 className="mb-2 text-lg font-semibold text-[#2e3440]">
            Work Experience
          </h2>
          <div className="flex flex-col gap-5">
            {WORK_EXPERIENCE.map((job) => (
              <article key={job.id}>
                <h3 className="font-semibold">
                  {job.title} —{' '}
                  <a
                    className="text-[#81a1c1] underline"
                    href={job.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {job.company}
                  </a>
                </h3>
                <p className="text-sm text-[#4c566a]">
                  {job.start} – {job.end}
                  {job.employmentType ? ` · ${job.employmentType}` : ''}
                  {job.location ? ` · ${job.location}` : ''}
                </p>
                {job.responsibilities && job.responsibilities.length > 0 && (
                  <ul className="mt-1 list-disc pl-5 text-sm">
                    {job.responsibilities.map((r) => (
                      <li key={r}>{r}</li>
                    ))}
                  </ul>
                )}
                {job.achievements && job.achievements.length > 0 && (
                  <ul className="mt-1 list-disc pl-5 text-sm">
                    {job.achievements.map((a) => (
                      <li key={a}>{a}</li>
                    ))}
                  </ul>
                )}
                {job.technologies && job.technologies.length > 0 && (
                  <p className="mt-1 text-sm text-[#4c566a]">
                    Stack: {job.technologies.join(', ')}
                  </p>
                )}
              </article>
            ))}
          </div>
        </section>

        <section className="mb-8">
          <h2 className="mb-2 text-lg font-semibold text-[#2e3440]">Skills</h2>
          <h3 className="font-semibold">Cloud Native DevOps</h3>
          <ul className="text-sm">
            {DEVOPS_SKILLS.map((s) => (
              <li key={s.uid}>
                <span className="font-medium">{s.title}</span> — {s.description}{' '}
                {s.proficiencyLevel ? `(${s.proficiencyLevel})` : ''}
              </li>
            ))}
          </ul>
          <h3 className="mt-3 font-semibold">Development</h3>
          <ul className="text-sm">
            {DEV_SKILLS.map((s) => (
              <li key={s.uid}>
                <span className="font-medium">{s.title}</span> — {s.description}{' '}
                {s.proficiencyLevel ? `(${s.proficiencyLevel})` : ''}
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="mb-2 text-lg font-semibold text-[#2e3440]">
            Education
          </h2>
          {EDUCATIONS.map((school) => (
            <article key={school.id}>
              <h3 className="font-semibold">{school.title}</h3>
              <p className="text-sm">
                <a
                  className="text-[#81a1c1] underline"
                  href={school.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {school.school}
                </a>{' '}
                · {school.start} – {school.end}
              </p>
            </article>
          ))}
        </section>

        <section className="mb-8">
          <h2 className="mb-2 text-lg font-semibold text-[#2e3440]">
            Certifications
          </h2>
          <ul className="text-sm">
            {CERTIFICATIONS.map((cert) => (
              <li key={cert.id}>
                <span className="font-medium">{cert.name}</span> — {cert.issuer}{' '}
                {cert.issueDate ? `(${cert.issueDate})` : ''}
                {cert.credentialUrl && (
                  <>
                    {' — '}
                    <a
                      className="text-[#81a1c1] underline"
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      verify
                    </a>
                  </>
                )}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-[#2e3440]">
            Projects
          </h2>
          <div className="flex flex-col gap-4">
            {PROJECTS.map((project) => (
              <article key={project.id}>
                <h3 className="font-semibold">{project.name}</h3>
                <p className="text-sm">
                  {project.longDescription || project.description}
                </p>
                {project.technologies && project.technologies.length > 0 && (
                  <p className="text-sm text-[#4c566a]">
                    Stack: {project.technologies.join(', ')}
                  </p>
                )}
                {project.link && (
                  <a
                    className="text-sm text-[#81a1c1] underline"
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {project.link}
                  </a>
                )}
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
