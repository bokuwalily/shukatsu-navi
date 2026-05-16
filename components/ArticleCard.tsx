// components/ArticleCard.tsx
import Link from 'next/link'
import { Article } from '@/lib/supabase'

export function ArticleCard({ article }: { article: Article }) {
  return (
    <article className="border rounded-lg p-4 hover:shadow-md transition-shadow">
      <Link href={`/articles/${article.slug}`}>
        <h2 className="text-lg font-semibold text-blue-700 hover:underline mb-2">
          {article.title}
        </h2>
      </Link>
      <p className="text-gray-600 text-sm mb-2">{article.meta_desc}</p>
      <div className="flex items-center gap-2 text-xs text-gray-400">
        <span className="bg-gray-100 px-2 py-1 rounded">{article.category}</span>
        <time>{new Date(article.created_at).toLocaleDateString('ja-JP')}</time>
      </div>
    </article>
  )
}
