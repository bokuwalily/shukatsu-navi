import type { MetadataRoute } from 'next'
import { getAllSlugs } from '@/lib/supabase'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://your-site.vercel.app'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await getAllSlugs()

  const articles = slugs.map((slug) => ({
    url: `${BASE_URL}/articles/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    ...articles,
  ]
}
