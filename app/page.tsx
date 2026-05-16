// app/page.tsx
import { getArticles } from '@/lib/supabase'
import { ArticleCard } from '@/components/ArticleCard'

export const revalidate = 3600

export default async function Home() {
  const articles = await getArticles(20)

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">就活攻略ガイド</h1>
      <p className="text-gray-600 mb-8">ES・面接・インターンを攻略する最新情報</p>
      <div className="grid gap-4">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
        {articles.length === 0 && (
          <p className="text-gray-400">記事を準備中です...</p>
        )}
      </div>
    </main>
  )
}
