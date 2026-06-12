import type { MetadataRoute } from 'next'
import { getAllSlugs, getCategories } from '@/lib/supabase'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://shukatsunavi.vercel.app'

/** 静的ページの固定 lastmod（内容を更新したら手で進める） */
const STATIC_LASTMOD = new Date('2026-06-01')

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [slugs, { categories, tags }] = await Promise.all([
    getAllSlugs(),
    getCategories(),
  ])

  // 全記事の中で最新の created_at（一覧系ページの lastmod に使う）
  const latestCreatedAt = slugs.reduce<Date>((latest, { created_at }) => {
    const d = new Date(created_at)
    return d > latest ? d : latest
  }, STATIC_LASTMOD)

  const articles: MetadataRoute.Sitemap = slugs.map(({ slug, created_at }) => ({
    url: `${BASE_URL}/articles/${slug}`,
    lastModified: new Date(created_at),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  const categoryPages: MetadataRoute.Sitemap = categories.map(([name]) => ({
    url: `${BASE_URL}/category/${encodeURIComponent(name)}`,
    lastModified: latestCreatedAt,
    changeFrequency: 'daily',
    priority: 0.7,
  }))

  const tagPages: MetadataRoute.Sitemap = tags.map(([name]) => ({
    url: `${BASE_URL}/tag/${encodeURIComponent(name)}`,
    lastModified: latestCreatedAt,
    changeFrequency: 'weekly',
    priority: 0.5,
  }))

  const staticPages: MetadataRoute.Sitemap = ['/about', '/privacy', '/contact'].map(
    (path) => ({
      url: `${BASE_URL}${path}`,
      lastModified: STATIC_LASTMOD,
      changeFrequency: 'monthly',
      priority: 0.3,
    }),
  )

  return [
    {
      url: BASE_URL,
      lastModified: latestCreatedAt,
      changeFrequency: 'daily',
      priority: 1,
    },
    ...categoryPages,
    ...articles,
    ...tagPages,
    ...staticPages,
  ]
}
