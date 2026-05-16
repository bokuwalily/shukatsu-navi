import Link from 'next/link'
import { notFound } from 'next/navigation'
import { marked } from 'marked'
import DOMPurify from 'isomorphic-dompurify'
import { getArticleBySlug, getAllSlugs } from '@/lib/supabase'
import { AffiliateBlock } from '@/components/AffiliateBlock'
import type { Metadata } from 'next'

export const revalidate = 3600

export async function generateStaticParams() {
  const slugs = await getAllSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const article = await getArticleBySlug(slug)
  if (!article) return {}
  return {
    title: article.title,
    description: article.meta_desc,
    openGraph: {
      title: article.title,
      description: article.meta_desc,
      type: 'article',
    },
  }
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const article = await getArticleBySlug(slug)
  if (!article) notFound()

  const htmlContent = DOMPurify.sanitize(marked.parse(article.content) as string)

  return (
    <div style={{ backgroundColor: 'var(--bg)', minHeight: '100vh' }}>

      {/* ===== Header ===== */}
      <header style={{ backgroundColor: 'var(--dark)', borderBottom: '3px solid var(--accent)' }}>
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link href="/" className="group">
            <p className="text-white text-xl font-black tracking-tight group-hover:opacity-80 transition-opacity"
              style={{ fontFamily: 'var(--font-serif)' }}>
              就活ナビ
            </p>
            <p className="text-xs tracking-widest uppercase mt-0.5" style={{ color: 'var(--accent)', opacity: 0.8 }}>
              Job Hunting Guide
            </p>
          </Link>
          <Link
            href="/"
            className="text-xs font-bold tracking-widest uppercase flex items-center gap-1.5 hover:opacity-70 transition-opacity"
            style={{ color: '#9CA3AF' }}
          >
            ← 記事一覧
          </Link>
        </div>
      </header>

      {/* ===== Article Hero ===== */}
      <div style={{ backgroundColor: 'var(--dark-mid)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-3xl mx-auto px-6 py-14">
          <span
            className="inline-block text-xs font-bold px-3 py-1 rounded-full mb-6"
            style={{ backgroundColor: 'var(--accent)', color: 'white' }}
          >
            {article.category}
          </span>
          <h1
            className="text-3xl md:text-4xl font-black leading-tight text-white mb-5"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            {article.title}
          </h1>
          <p className="text-base leading-relaxed mb-6" style={{ color: '#9CA3AF' }}>
            {article.meta_desc}
          </p>
          <time className="text-xs tracking-wide" style={{ color: '#6B7280' }}>
            {new Date(article.created_at).toLocaleDateString('ja-JP', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
        </div>
      </div>

      {/* ===== Article Body ===== */}
      <main className="max-w-3xl mx-auto px-6 py-12">
        {/* Ad placeholder */}
        <div
          className="rounded-lg flex items-center justify-center text-sm mb-10"
          style={{
            backgroundColor: 'var(--surface-alt)',
            border: '1px dashed var(--border)',
            height: 72,
            color: 'var(--text-muted)',
          }}
        >
          広告スペース（Google AdSense）
        </div>

        {/* Article content */}
        <div
          className="article-body"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />

        {/* Affiliate CTA */}
        <AffiliateBlock />

        {/* Back link */}
        <div className="mt-14 pt-8" style={{ borderTop: '1px solid var(--border)' }}>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-bold hover:opacity-70 transition-opacity"
            style={{ color: 'var(--accent)' }}
          >
            ← 記事一覧へ戻る
          </Link>
        </div>
      </main>

      {/* ===== Footer ===== */}
      <footer style={{ backgroundColor: 'var(--dark)', marginTop: '4rem' }}>
        <div className="max-w-6xl mx-auto px-6 py-10 text-center">
          <Link href="/" className="font-black text-white hover:opacity-80 transition-opacity"
            style={{ fontFamily: 'var(--font-serif)' }}>
            就活ナビ
          </Link>
          <p className="text-xs mt-2" style={{ color: '#6B7280' }}>
            © 2026 就活ナビ. All rights reserved.
          </p>
          <p className="text-xs mt-1" style={{ color: '#4B5563' }}>
            当サイトはアフィリエイト広告を利用しています
          </p>
        </div>
      </footer>
    </div>
  )
}
