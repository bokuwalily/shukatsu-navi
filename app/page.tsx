import Link from 'next/link'
import { getArticles, getCategories, getTotalCount, getTopArticlesByCategories } from '@/lib/supabase'
import { ArticleSearch } from '@/components/ArticleSearch'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import { Pagination } from '@/components/Pagination'

export const revalidate = 1800

const PER_PAGE = 20

// カテゴリアイコンと説明
const CATEGORY_CARDS = [
  { name: 'ES・自己PR',   icon: '✍️', desc: 'ガクチカ・自己PRの書き方を徹底解説' },
  { name: '面接対策',     icon: '🎤', desc: '頻出質問から逆質問まで完全対策' },
  { name: 'インターン',   icon: '💼', desc: '選考突破から参加後の活かし方まで' },
  { name: '業界研究',     icon: '🔍', desc: '業界別の傾向と対策を詳しく解説' },
  { name: 'OB・OG訪問',  icon: '🤝', desc: 'アポ取りから質問例まで完全ガイド' },
]

// カテゴリ別特集で使うカテゴリ一覧
const FEATURED_CATEGORIES = [
  'ES・自己PR',
  '面接対策',
  'インターン',
  'OB・OG訪問',
  '業界研究',
  'SPI・筆記',
]

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; category?: string }>
}) {
  const { page: pageParam, category: categoryParam } = await searchParams
  const currentPage = Math.max(1, parseInt(pageParam ?? '1', 10))
  const activeCategory = categoryParam ?? ''

  const [articles, { categories, tags }, totalCount, featuredArticles] = await Promise.all([
    getArticles(PER_PAGE, (currentPage - 1) * PER_PAGE, activeCategory || undefined),
    getCategories(),
    getTotalCount(activeCategory || undefined),
    getTopArticlesByCategories(FEATURED_CATEGORIES),
  ])

  const totalPages = Math.ceil(totalCount / PER_PAGE)
  const basePath = activeCategory
    ? `/?category=${encodeURIComponent(activeCategory)}`
    : '/'

  return (
    <div style={{ backgroundColor: 'var(--bg)', minHeight: '100vh' }}>
      <SiteHeader />

      {/* ===== Hero Section ===== */}
      <section
        style={{
          background: 'linear-gradient(135deg, var(--dark) 0%, var(--dark-mid) 60%, #1e3a5f 100%)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div className="max-w-6xl mx-auto px-6 py-16 md:py-24">
          <div className="max-w-2xl">
            {/* バッジ */}
            <span
              className="inline-block text-xs font-bold px-3 py-1 rounded-full mb-6 tracking-widest uppercase"
              style={{ backgroundColor: 'var(--accent)', color: 'white' }}
            >
              28卒 就活完全攻略
            </span>

            <h1
              className="text-3xl md:text-5xl font-black text-white leading-tight mb-5"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              就活を制する者が<br />
              <span style={{ color: 'var(--accent)' }}>内定</span>を制する
            </h1>

            <p className="text-base md:text-lg leading-relaxed mb-8" style={{ color: '#9CA3AF' }}>
              ES・自己PR・面接・インターンまで、内定獲得の全ステップを徹底ナビゲート。
              <br className="hidden md:block" />
              全<span className="font-bold text-white">{totalCount}</span>記事が無料でご覧いただけます。
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/?category=ES・自己PR"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-sm transition-all hover:opacity-90"
                style={{ backgroundColor: 'var(--accent)', color: 'white' }}
              >
                ✍️ ES対策を始める
              </Link>
              <Link
                href="/?category=面接対策"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-sm transition-all hover:bg-white/20"
                style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}
              >
                🎤 面接対策を見る
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 人気カテゴリカード ===== */}
      <section style={{ backgroundColor: 'var(--surface-alt)', borderBottom: '1px solid var(--border)' }}>
        <div className="max-w-6xl mx-auto px-6 py-10">
          <h2
            className="text-xs font-bold tracking-widest uppercase mb-6"
            style={{ color: 'var(--text-muted)' }}
          >
            カテゴリから探す
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {CATEGORY_CARDS.map((cat) => (
              <Link
                key={cat.name}
                href={`/?category=${encodeURIComponent(cat.name)}`}
                className="group flex flex-col items-start p-4 rounded-xl transition-all hover:-translate-y-1"
                style={{
                  backgroundColor: 'var(--surface)',
                  border: '1px solid var(--border)',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                }}
              >
                <span className="text-2xl mb-2" aria-hidden="true">{cat.icon}</span>
                <span
                  className="text-sm font-bold mb-1 leading-tight group-hover:opacity-60 transition-opacity"
                  style={{ color: 'var(--text)', fontFamily: 'var(--font-serif)' }}
                >
                  {cat.name}
                </span>
                <span className="text-xs leading-snug" style={{ color: 'var(--text-muted)' }}>
                  {cat.desc}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== カテゴリ別特集セクション ===== */}
      {featuredArticles.length > 0 && (
        <section style={{ backgroundColor: 'var(--bg)', borderBottom: '1px solid var(--border)' }}>
          <div className="max-w-6xl mx-auto px-6 py-10">
            <div className="flex items-center gap-3 mb-6">
              <div style={{ width: 28, height: 2, backgroundColor: 'var(--accent)' }} />
              <h2 className="text-xs font-bold tracking-widest uppercase" style={{ color: 'var(--text-muted)' }}>
                カテゴリ別特集
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {featuredArticles.map((article) => (
                <Link
                  key={article.slug}
                  href={`/articles/${article.slug}`}
                  className="group flex flex-col rounded-xl overflow-hidden transition-all hover:-translate-y-0.5"
                  style={{
                    backgroundColor: 'var(--surface)',
                    border: '1px solid var(--border)',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                  }}
                >
                  <div className="px-5 pt-5 pb-4 flex-1">
                    <span
                      className="inline-block text-xs font-bold px-2.5 py-1 rounded-full mb-3"
                      style={{ backgroundColor: 'var(--accent)', color: 'white' }}
                    >
                      {article.category}特集
                    </span>
                    <p
                      className="text-sm font-bold leading-snug group-hover:opacity-60 transition-opacity line-clamp-2"
                      style={{ fontFamily: 'var(--font-serif)', color: 'var(--text)' }}
                    >
                      {article.title}
                    </p>
                    {article.meta_desc && (
                      <p className="text-xs mt-2 line-clamp-2" style={{ color: 'var(--text-muted)' }}>
                        {article.meta_desc}
                      </p>
                    )}
                  </div>
                  <div
                    className="px-5 py-3 flex items-center justify-between"
                    style={{ borderTop: '1px solid var(--border)' }}
                  >
                    <span className="text-xs font-bold" style={{ color: 'var(--accent)' }}>
                      記事を読む →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex flex-col lg:flex-row gap-10">

          {/* ===== メインコンテンツ ===== */}
          <div className="flex-1 min-w-0">

            {/* カテゴリタブ */}
            {activeCategory && (
              <div className="mb-6 flex items-center gap-2">
                <Link
                  href="/"
                  className="text-xs hover:opacity-70 transition-opacity"
                  style={{ color: 'var(--text-muted)' }}
                >
                  すべて
                </Link>
                <span style={{ color: 'var(--border)' }}>/</span>
                <span className="text-xs font-bold" style={{ color: 'var(--accent)' }}>
                  {activeCategory}
                </span>
              </div>
            )}

            {/* カテゴリフィルタバー */}
            <div className="mb-6 overflow-x-auto">
              <div className="flex items-center gap-2 min-w-max pb-2">
                <Link
                  href="/"
                  className="px-4 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap"
                  style={{
                    backgroundColor: !activeCategory ? 'var(--accent)' : 'var(--surface)',
                    color: !activeCategory ? 'white' : 'var(--text-muted)',
                    border: `1px solid ${!activeCategory ? 'var(--accent)' : 'var(--border)'}`,
                  }}
                >
                  すべて
                </Link>
                {categories.map(([cat, count]) => (
                  <Link
                    key={cat}
                    href={`/?category=${encodeURIComponent(cat)}`}
                    className="px-4 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap"
                    style={{
                      backgroundColor: activeCategory === cat ? 'var(--accent)' : 'var(--surface)',
                      color: activeCategory === cat ? 'white' : 'var(--text-muted)',
                      border: `1px solid ${activeCategory === cat ? 'var(--accent)' : 'var(--border)'}`,
                    }}
                  >
                    {cat}
                    <span className="ml-1.5 text-xs opacity-70">({count})</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* 検索 + 記事グリッド（Client Component） */}
            <ArticleSearch articles={articles} totalCount={totalCount} />

            {/* ページネーション */}
            {!activeCategory && (
              <Pagination currentPage={currentPage} totalPages={totalPages} basePath={basePath} />
            )}
          </div>

          {/* ===== サイドバー ===== */}
          <aside className="lg:w-72 shrink-0 space-y-8">

            {/* タグクラウド */}
            <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}>
              <h2 className="text-sm font-bold tracking-widest uppercase mb-5" style={{ color: 'var(--text-muted)' }}>
                人気タグ
              </h2>
              <div className="flex flex-wrap gap-2">
                {tags.map(([tag, count]) => (
                  <Link
                    key={tag}
                    href={`/tag/${encodeURIComponent(tag)}`}
                    className="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-full transition-all hover:opacity-70"
                    style={{
                      backgroundColor: 'var(--accent-light)',
                      color: 'var(--accent)',
                      border: '1px solid rgba(200,75,49,0.15)',
                    }}
                  >
                    #{tag}
                    <span className="opacity-60">{count}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* カテゴリ */}
            <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}>
              <h2 className="text-sm font-bold tracking-widest uppercase mb-5" style={{ color: 'var(--text-muted)' }}>
                カテゴリ
              </h2>
              <ul className="space-y-3">
                {categories.map(([cat, count]) => (
                  <li key={cat}>
                    <Link
                      href={`/category/${encodeURIComponent(cat)}`}
                      className="flex items-center justify-between group"
                    >
                      <span className="text-sm font-medium group-hover:opacity-60 transition-opacity" style={{ color: 'var(--text)' }}>
                        {cat}
                      </span>
                      <span
                        className="text-xs font-bold px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: 'var(--accent-light)', color: 'var(--accent)' }}
                      >
                        {count}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA バナー */}
            <div
              className="rounded-xl p-6 text-center"
              style={{
                background: 'linear-gradient(135deg, var(--dark) 0%, var(--dark-mid) 100%)',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <p className="text-lg font-black text-white mb-2" style={{ fontFamily: 'var(--font-serif)' }}>
                内定まで<br />全力でサポート
              </p>
              <p className="text-xs mb-5" style={{ color: '#9CA3AF' }}>
                全記事無料・28卒最新情報を随時更新
              </p>
              <Link
                href="/"
                className="inline-block w-full py-2.5 rounded-lg text-sm font-bold transition-all hover:opacity-90 text-center"
                style={{ backgroundColor: 'var(--accent)', color: 'white' }}
              >
                記事を読む →
              </Link>
            </div>
          </aside>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
