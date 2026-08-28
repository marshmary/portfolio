import type { MetadataRoute } from 'next'
import fs from 'node:fs'
import path from 'node:path'
import { WEBSITE_URL } from '@/lib/constants'

/** Blog posts are folder-based MDX routes: app/blog/<slug>/page.mdx */
function blogSlugs(): string[] {
  try {
    const blogDir = path.join(process.cwd(), 'app', 'blog')
    return fs
      .readdirSync(blogDir)
      .filter(
        (entry) =>
          fs.statSync(path.join(blogDir, entry)).isDirectory() &&
          fs.existsSync(path.join(blogDir, entry, 'page.mdx')),
      )
  } catch {
    return []
  }
}

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  return [
    {
      url: `${WEBSITE_URL}/`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${WEBSITE_URL}/resume`,
      lastModified,
      changeFrequency: 'yearly',
      priority: 0.8,
    },
    ...blogSlugs().map((slug) => ({
      url: `${WEBSITE_URL}/blog/${slug}`,
      lastModified,
      changeFrequency: 'yearly' as const,
      priority: 0.6,
    })),
  ]
}
