'use client'

import { useEffect, useState, type CSSProperties } from 'react'
import { EMAIL } from '@/app/data'
import { rot13 } from '@/lib/obfuscate'

/**
 * Reveals the build-obfuscated email after hydration so the raw address
 * never appears in served HTML (plan-performance-seo-privacy F6).
 * `mailto:` works once revealed; clicking before reveal just reveals.
 */
export function EmailReveal({
  className,
  style,
}: {
  className?: string
  style?: CSSProperties
}) {
  const [email, setEmail] = useState<string | null>(null)

  useEffect(() => {
    setEmail(rot13(EMAIL))
  }, [])

  return (
    <a
      href={email ? `mailto:${email}` : undefined}
      className={className}
      style={style}
      onClick={(e) => {
        if (!email) {
          e.preventDefault()
          setEmail(rot13(EMAIL))
        }
      }}
      title={email ? email : 'reveal email'}
    >
      {email ?? '[hidden]'}
    </a>
  )
}
