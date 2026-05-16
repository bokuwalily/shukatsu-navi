import Link from 'next/link'
import { Article } from '@/lib/supabase'

export function ArticleCard({ article, featured = false }: { article: Article; featured?: boolean }) {
  return (
    <article
      className="card-lift rounded-xl overflow-hidden"
      style={{
        backgroundColor: 'var(--surface)',
        border: '1px solid var(--border)',
      }}
    >
      <div className={featured ? 'p-7' : 'p-5'}>
        <div className="flex items-center justify-between mb-3">
          <span
            className="text-xs font-bold px-2.5 py-1 rounded-full tracking-wide"
            style={{ backgroundColor: 'var(--accent-light)', color: 'var(--accent)' }}
          >
            {article.category}
          </span>
          <time
            className="text-xs"
            style={{ color: 'var(--text-muted)' }}
          >
            {new Date(article.created_at).toLocaleDateString('ja-JP', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </time>
        </div>

        <Link href={`/articles/${article.slug}`} className="group block">
          <h2
            className={`font-black leading-snug mb-3 group-hover:opacity-60 transition-opacity duration-200 ${featured ? 'text-2xl' : 'text-base'}`}
            style={{ fontFamily: 'var(--font-serif)', color: 'var(--text)' }}
          >
            {article.title}
          </h2>
        </Link>

        <p
          className="text-sm leading-relaxed mb-5"
          style={{ color: 'var(--text-muted)' }}
        >
          {article.meta_desc.length > 90 ? article.meta_desc.slice(0, 88) + '…' : article.meta_desc}
        </p>

        <Link
          href={`/articles/${article.slug}`}
          className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest uppercase hover:gap-3 transition-all duration-200"
          style={{ color: 'var(--accent)' }}
        >
          続きを読む <span>→</span>
        </Link>
      </div>
    </article>
  )
}
