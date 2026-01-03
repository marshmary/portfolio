'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Menu, X } from 'lucide-react'

interface Section {
  id: string
  title: string
}

const sections: Section[] = [
  { id: 'about', title: 'About' },
  { id: 'work', title: 'Experience' },
  { id: 'skills', title: 'Skills' },
  { id: 'education', title: 'Education' },
  { id: 'certifications', title: 'Certifications' },
  { id: 'projects', title: 'Projects' },
  { id: 'contact', title: 'Connect' },
]

export function NavBar() {
  const [activeSection, setActiveSection] = useState('')
  const [hoveredSection, setHoveredSection] = useState<string | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0.3,
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id)
        }
      })
    }, observerOptions)

    sections.forEach((section) => {
      const element = document.getElementById(section.id)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      setIsMobileMenuOpen(false)
    }
  }

  return (
    <>
      {/* Desktop Navigation - Right aligned dots */}
      <nav className="fixed top-1/2 right-8 z-50 hidden -translate-y-1/2 flex-col items-center gap-8 md:flex">
        {sections.map((section, index) => (
          <div
            key={section.id}
            className="group relative flex items-center"
            onMouseEnter={() => setHoveredSection(section.id)}
            onMouseLeave={() => setHoveredSection(null)}
          >
            {/* Section Title (shows on hover) */}
            <motion.span
              initial={{ opacity: 0, x: 10 }}
              animate={{
                opacity: hoveredSection === section.id ? 1 : 0,
                x: hoveredSection === section.id ? 0 : 10,
              }}
              transition={{ duration: 0.2 }}
              className="absolute right-6 w-max text-sm font-medium whitespace-nowrap text-zinc-600 dark:text-zinc-400"
            >
              {section.title}
            </motion.span>

            {/* Dot */}
            <button
              onClick={() => scrollToSection(section.id)}
              className={`relative z-10 h-3 w-3 rounded-full transition-all duration-300 ${
                activeSection === section.id
                  ? 'scale-125 bg-green-600 dark:bg-green-500'
                  : 'bg-zinc-300 hover:bg-zinc-500 dark:bg-zinc-700 dark:hover:bg-zinc-500'
              }`}
              aria-label={section.title}
            />

            {/* Connecting Line (below dot) */}
            {index < sections.length - 1 && (
              <div className="absolute top-3 left-1/2 h-11 w-px -translate-x-1/2 bg-zinc-300 group-hover:bg-zinc-400 dark:bg-zinc-700 dark:group-hover:bg-zinc-600" />
            )}
          </div>
        ))}
      </nav>

      {/* Desktop Navigation - Left aligned current section */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed top-1/2 left-8 z-50 hidden -translate-y-1/2 flex-col items-start md:flex"
      >
        <span className="text-sm font-medium text-zinc-900 dark:text-white">
          {sections.find((s) => s.id === activeSection)?.title || ''}
        </span>
      </motion.div>

      {/* Mobile Navigation Button (Top Right) */}
      <div className="fixed top-6 right-6 z-50 md:hidden">
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className="absolute top-16 right-0 w-48 rounded-xl border border-zinc-200 bg-white/95 p-2 shadow-lg backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900/95"
            >
              <ul className="space-y-1">
                {sections.map((section) => (
                  <li key={section.id}>
                    <button
                      onClick={() => scrollToSection(section.id)}
                      className={`w-full rounded-lg px-4 py-2 text-left text-sm font-medium transition-colors ${
                        activeSection === section.id
                          ? 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-white'
                          : 'text-zinc-600 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-800'
                      }`}
                    >
                      {section.title}
                    </button>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Toggle Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 text-zinc-900 shadow-lg dark:bg-zinc-800 dark:text-white"
          aria-label={isMobileMenuOpen ? 'Close navigation' : 'Open navigation'}
        >
          <AnimatePresence mode="wait" initial={false}>
            {isMobileMenuOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X className="h-5 w-5" />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Menu className="h-5 w-5" />
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Progress Bar (Top - indicates scroll position) */}
      <div className="fixed top-0 right-0 left-0 z-50 h-1 bg-zinc-100 dark:bg-zinc-800">
        <motion.div
          className="h-full bg-zinc-900 dark:bg-white"
          initial={{ width: 0 }}
          animate={{
            width: `${((sections.findIndex((s) => s.id === activeSection) + 1) / sections.length) * 100}%`,
          }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </>
  )
}
