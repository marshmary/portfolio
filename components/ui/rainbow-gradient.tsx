'use client'

import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'

export function RainbowGradient() {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = mounted && resolvedTheme === 'dark'

  return (
    <div
      className="pointer-events-none fixed inset-0 z-40"
      data-gradient
      style={{
        background:
          'linear-gradient(135deg, #ff6b6b, #feca57, #48dbfb, #ff9ff3, #54a0ff, #5f27cd, #ff6b6b)',
        backgroundSize: '300% 300%',
        opacity: mounted ? (isDark ? 0.1 : 0.2) : 0,
        filter: isDark ? 'saturate(0.4) brightness(0.7)' : 'none',
        transition: 'opacity 0.5s ease, filter 0.5s ease',
        animation: 'gradient-shift 15s ease infinite',
      }}
    />
  )
}
