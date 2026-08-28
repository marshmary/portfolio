import { Desktop } from '@/components/desktop/desktop'
import { PROFILE, SOCIAL_LINKS } from './data'
import { WEBSITE_URL } from '@/lib/constants'

/**
 * Person structured data (plan-performance-seo-privacy F4).
 * PII rule: no email/phone/location in structured data.
 */
const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: PROFILE.displayName || PROFILE.name,
  jobTitle: PROFILE.title,
  url: WEBSITE_URL,
  sameAs: SOCIAL_LINKS.map((s) => s.link),
}

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <Desktop />
    </>
  )
}
