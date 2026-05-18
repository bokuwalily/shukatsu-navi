import Link from 'next/link'

interface PopularArticle {
  slug: string
  title: string
  category: string
}

interface PopularInCategoryProps {
  articles: PopularArticle[]
  category: string
}

export function PopularInCategory({ articles, category }: PopularInCategoryProps) {
  if (articles.length === 0) return null

  return (
    <div
      className="rounded-xl p-6"
      style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}
    >
      <div className="flex items-center gap-2 mb-4">
        <div style={{ width: 20, height: 2, backgroundColor: 'var(--accent)' }} />
        <h2 className="text-xs font-bold tracking-widest uppercase" style={{ color: 'var(--text-muted)' }}>
          {category}の人気記事
        </h2>
      </div>
      <ol className="space-y-3">
        {articles.map((article, index) => (
          <li key={article.slug} className="flex items-start gap-3">
            <span
              className="shrink-0 w-5 h-5 flex items-center justify-center text-xs font-black rounded"
              style={{
                backgroundColor: index === 0 ? 'var(--accent)' : 'var(--surface-alt)',
                color: index === 0 ? 'white' : 'var(--text-muted)',
              }}
            >
              {index + 1}
            </span>
            <Link
              href={`/articles/${article.slug}`}
              className="text-xs leading-snug font-medium hover:opacity-60 transition-opacity line-clamp-2"
              style={{ color: 'var(--text)' }}
            >
              {article.title}
            </Link>
          </li>
        ))}
      </ol>
      <Link
        href={`/category/${encodeURIComponent(category)}`}
        className="inline-flex items-center gap-1 text-xs font-bold mt-5 hover:opacity-70 transition-opacity"
        style={{ color: 'var(--accent)' }}
      >
        {category}の記事をもっと見る →
      </Link>
    </div>
  )
}
