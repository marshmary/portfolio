'use client'

import { useEffect, useRef } from 'react'
import { DesktopProvider, useDesktop } from './context'
import { TopBar } from './top-bar'
import { Dock } from './dock'
import { Launcher } from './launcher'
import { Window } from './window'
import { AboutTerminal } from './windows/about-terminal'
import { Neofetch } from './windows/neofetch'
import { ProjectsFiles } from './windows/projects-files'
import { ProjectDetail } from './windows/project-detail'
import { SkillsMonitor } from './windows/skills-monitor'
import { ContactTerminal } from './windows/contact-terminal'
import { PROJECTS } from '@/app/data'
import type { WindowId } from './types'

function DesktopCanvas() {
  const { mode, activeProject, dispatch } = useDesktop()
  const areaRef = useRef<HTMLDivElement>(null)

  // Measure the desktop area (viewport minus bars).
  // set-area re-tiles automatically while the layout is not customized.
  useEffect(() => {
    const el = areaRef.current
    if (!el) return
    const measure = () => {
      const rect = el.getBoundingClientRect()
      if (rect.width > 0 && rect.height > 0) {
        dispatch({ type: 'set-area', w: rect.width, h: rect.height })
      }
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => observer.disconnect()
  }, [dispatch, mode])

  const projectTitle = activeProject
    ? `~/projects/${activeProject.name.toLowerCase()}`
    : '~/projects'

  const windowDefs: {
    id: WindowId
    title: string
    delay: number
    body: React.ReactNode
    footer?: React.ReactNode
    bodyClassName?: string
  }[] = [
    {
      id: 'about',
      title: 'phu@site: ~/about',
      delay: 0,
      body: <AboutTerminal />,
      footer: (
        <span>
          zsh · 80×24 · UTF-8
          <span className="ml-3 hidden sm:inline">
            try &apos;help&apos;, &apos;open projects&apos;
          </span>
        </span>
      ),
    },
    {
      id: 'neofetch',
      title: 'neofetch',
      delay: 100,
      body: <Neofetch />,
    },
    {
      id: 'projects',
      title: 'phu@site: ~/projects',
      delay: 200,
      body: <ProjectsFiles />,
      footer: <span>{PROJECTS.length} folders · click to open</span>,
    },
    {
      id: 'skills',
      title: 'btop — skills',
      delay: 300,
      body: <SkillsMonitor />,
    },
    {
      id: 'contact',
      title: 'phu@site: ~/contact.sh',
      delay: 400,
      body: <ContactTerminal />,
    },
    {
      id: 'project-detail',
      title: projectTitle,
      delay: 0,
      body: activeProject ? (
        <ProjectDetail project={activeProject} />
      ) : (
        <p style={{ color: 'var(--faint)' }}>open a folder from ~/projects</p>
      ),
      bodyClassName: 'p-4',
    },
  ]

  return (
    <>
      {/* Wallpaper */}
      <div
        aria-hidden
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: 'var(--wallpaper)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.85)',
        }}
      />
      <div
        aria-hidden
        className="fixed inset-0 z-0"
        style={{ background: 'var(--wallpaper-dim)' }}
      />

      <TopBar />

      {mode === 'stack' ? (
        <main
          className="relative z-10 mx-auto flex w-full max-w-2xl flex-col gap-4 px-3 pt-14 pb-8"
          aria-label="Desktop (mobile card stack)"
        >
          {windowDefs.map(({ id, title, delay, body, footer }) =>
            id === 'project-detail' ? null : (
              <Window
                key={id}
                id={id}
                title={title}
                openDelay={delay}
                footer={footer}
              >
                {body}
              </Window>
            ),
          )}
        </main>
      ) : (
        <main
          ref={areaRef}
          className="absolute inset-x-0 top-10 bottom-16 z-10 overflow-hidden"
          aria-label="Desktop"
        >
          {windowDefs.map(
            ({ id, title, delay, body, footer, bodyClassName }) => (
              <Window
                key={id}
                id={id}
                title={title}
                openDelay={delay}
                footer={footer}
                bodyClassName={bodyClassName}
              >
                {body}
              </Window>
            ),
          )}
        </main>
      )}

      {mode === 'desktop' && <Dock />}
      <Launcher />

      {/* Screen-reader summary — full content lives in the windows and /resume */}
      <div className="sr-only">
        <h1>Phu Tran — DevOps Engineer</h1>
        <p>
          Interactive desktop CV. Use the command launcher or visit /resume.
        </p>
      </div>
    </>
  )
}

export function Desktop() {
  return (
    <DesktopProvider>
      <DesktopCanvas />
    </DesktopProvider>
  )
}
