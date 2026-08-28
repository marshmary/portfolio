import type { MetadataRoute } from 'next'
import { WEBSITE_URL } from '@/lib/constants'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // PII (plan-performance-seo-privacy F7): keep the resume PDF out of
      // indexes; /private/ stays reserved for future non-public assets
      disallow: ['/private/', '/resume*.pdf'],
    },
    sitemap: `${WEBSITE_URL}/sitemap.xml`,
  }
}
