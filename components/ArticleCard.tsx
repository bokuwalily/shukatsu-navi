import Link from 'next/link'
import Image from 'next/image'
import { Article } from '@/lib/supabase'

// カテゴリごとの色定義
const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  'ES・自己PR':           { bg: '#FEF3C7', text: '#92400E', border: '#FDE68A' },
  '面接対策':             { bg: '#DBEAFE', text: '#1E40AF', border: '#BFDBFE' },
  'インターン':           { bg: '#D1FAE5', text: '#065F46', border: '#A7F3D0' },
  '業界研究':             { bg: '#EDE9FE', text: '#5B21B6', border: '#DDD6FE' },
  'OB・OG訪問':          { bg: '#FCE7F3', text: '#9D174D', border: '#FBCFE8' },
  'グループディスカッション': { bg: '#FFEDD5', text: '#9A3412', border: '#FED7AA' },
  'マインドセット':       { bg: '#F0FDF4', text: '#14532D', border: '#BBF7D0' },
}

const DEFAULT_COLOR = { bg: 'var(--accent-light)', text: 'var(--accent)', border: 'rgba(200,75,49,0.2)' }

function getCategoryColor(category: string) {
  return CATEGORY_COLORS[category] ?? DEFAULT_COLOR
}

export function ArticleCard({ article, featured = false }: { article: Article; featured?: boolean }) {
  const readingTime = Math.max(1, Math.ceil(article.content.length / 400))
  const color = getCategoryColor(article.category)
  const thumbUrl = `https://picsum.photos/seed/shukatsu-${article.slug}/400/200`

  return (
    <article
      className="card-lift rounded-xl overflow-hidden flex flex-col"
      style={{
        backgroundColor: 'var(--surface)',
        border: '1px solid var(--border)',
      }}
    >
      {/* サムネイル */}
      <Link href={`/articles/${article.slug}`} className="block relative overflow-hidden" style={{ aspectRatio: '2/1' }}>
        <Image
          src={thumbUrl}
          alt={article.title}
          fill
          sizes="(max-width: 640px) 100vw, 400px"
          className="object-cover transition-transform duration-300 hover:scale-105"
          unoptimized
        />
        {/* カテゴリオーバーレイ */}
        <div className="absolute top-3 left-3">
          <span
            className="text-xs font-bold px-2.5 py-1 rounded-full tracking-wide"
            style={{
              backgroundColor: color.bg,
              color: color.text,
              border: `1px solid ${color.border}`,
            }}
          >
            {article.category}
          </span>
        </div>
      </Link>

      {/* コンテンツ */}
      <div className={`flex flex-col flex-1 ${featured ? 'p-7' : 'p-5'}`}>
        {/* メタ情報 */}
        <div className="flex items-center gap-2 text-xs mb-3" style={{ color: 'var(--text-muted)' }}>
          <span className="flex items-center gap-1">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
            約{readingTime}分
          </span>
          <span>·</span>
          <time dateTime={article.created_at}>
            {new Date(article.created_at).toLocaleDateString('ja-JP', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </time>
        </div>

        {/* タイトル */}
        <Link href={`/articles/${article.slug}`} className="group block mb-3">
          <h2
            className={`font-black leading-snug group-hover:opacity-60 transition-opacity duration-200 ${featured ? 'text-2xl' : 'text-base'}`}
            style={{ fontFamily: 'var(--font-serif)', color: 'var(--text)' }}
          >
            {article.title}
          </h2>
        </Link>

        {/* 概要 */}
        <p
          className="text-sm leading-relaxed mb-4 flex-1"
          style={{ color: 'var(--text-muted)' }}
        >
          {article.meta_desc.length > 90 ? article.meta_desc.slice(0, 88) + '…' : article.meta_desc}
        </p>

        {/* タグ（最大3個） */}
        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {article.tags.slice(0, 3).map((tag) => (
              <Link
                key={tag}
                href={`/tag/${encodeURIComponent(tag)}`}
                className="text-xs px-2 py-0.5 rounded transition-all hover:opacity-70"
                style={{ backgroundColor: 'var(--surface-alt)', color: 'var(--text-muted)' }}
              >
                #{tag}
              </Link>
            ))}
          </div>
        )}

        {/* 続きを読むリンク */}
        <Link
          href={`/articles/${article.slug}`}
          className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest uppercase hover:gap-3 transition-all duration-200 mt-auto"
          style={{ color: 'var(--accent)' }}
        >
          続きを読む <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  )
}
