import Link from 'next/link'
import { getArticles } from '@/lib/supabase'
import { ArticleCard } from '@/components/ArticleCard'

export const revalidate = 3600

const CATEGORIES = ['ES・自己PR', '面接対策', 'インターン', '就活サイト比較']

export default async function Home() {
  const articles = await getArticles(20)
  const featured = articles[0]
  const rest = articles.slice(1)

  return (
    <div style={{ backgroundColor: 'var(--bg)', minHeight: '100vh' }}>

      {/* ===== Header ===== */}
      <header style={{ backgroundColor: 'var(--dark)', borderBottom: '3px solid var(--accent)' }}>
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <div>
            <p className="text-white text-xl font-black tracking-tight" style={{ fontFamily: 'var(--font-serif)' }}>
              就活ナビ
            </p>
            <p className="text-xs tracking-widest uppercase mt-0.5" style={{ color: 'var(--accent)', opacity: 0.8 }}>
              Job Hunting Guide
            </p>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            {CATEGORIES.map((cat) => (
              <span key={cat} className="text-sm cursor-pointer transition-colors duration-150 hover:text-white"
                style={{ color: '#9CA3AF' }}>
                {cat}
              </span>
            ))}
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-14">

        {/* ===== Featured Article ===== */}
        {featured ? (
          <section className="mb-20">
            <div className="flex items-center gap-3 mb-8">
              <div style={{ width: 36, height: 2, backgroundColor: 'var(--accent)' }} />
              <span className="text-xs font-bold tracking-widest uppercase" style={{ color: 'var(--accent)' }}>
                注目記事
              </span>
            </div>

            <div className="grid md:grid-cols-5 gap-10 items-start">
              {/* Main featured */}
              <div className="md:col-span-3">
                <span
                  className="inline-block text-xs font-bold px-3 py-1 rounded-full mb-5"
                  style={{ backgroundColor: 'var(--accent-light)', color: 'var(--accent)' }}
                >
                  {featured.category}
                </span>
                <Link href={`/articles/${featured.slug}`} className="group block mb-4">
                  <h2
                    className="text-4xl font-black leading-tight group-hover:opacity-60 transition-opacity duration-200"
                    style={{ fontFamily: 'var(--font-serif)', color: 'var(--text)' }}
                  >
                    {featured.title}
                  </h2>
                </Link>
                <p className="text-base leading-relaxed mb-8" style={{ color: 'var(--text-muted)' }}>
                  {featured.meta_desc}
                </p>
                <Link
                  href={`/articles/${featured.slug}`}
                  className="inline-flex items-center gap-2 text-sm font-bold px-7 py-3.5 rounded-lg transition-opacity hover:opacity-80"
                  style={{ backgroundColor: 'var(--dark)', color: 'white' }}
                >
                  記事を読む <span>→</span>
                </Link>
              </div>

              {/* Recent sidebar */}
              <aside
                className="md:col-span-2 rounded-xl p-6"
                style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}
              >
                <p className="text-xs font-bold tracking-widest uppercase mb-5" style={{ color: 'var(--text-muted)' }}>
                  最新記事
                </p>
                <div className="space-y-5">
                  {rest.slice(0, 5).map((article, i) => (
                    <Link key={article.id} href={`/articles/${article.slug}`} className="group flex gap-3 items-start">
                      <span
                        className="text-xs font-black pt-0.5 shrink-0"
                        style={{ color: 'var(--accent)', fontVariantNumeric: 'tabular-nums' }}
                      >
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <div>
                        <p
                          className="text-sm font-medium leading-snug group-hover:opacity-60 transition-opacity"
                          style={{ fontFamily: 'var(--font-serif)' }}
                        >
                          {article.title}
                        </p>
                        <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                          {new Date(article.created_at).toLocaleDateString('ja-JP')}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </aside>
            </div>
          </section>
        ) : (
          <div className="text-center py-32">
            <p style={{ color: 'var(--text-muted)' }}>記事を準備中です…</p>
          </div>
        )}

        {/* ===== Article Grid ===== */}
        {rest.length > 0 && (
          <section>
            <div className="flex items-center gap-4 mb-10">
              <div style={{ flex: 1, height: 1, backgroundColor: 'var(--border)' }} />
              <span className="text-xs font-bold tracking-widest uppercase" style={{ color: 'var(--text-muted)' }}>
                すべての記事
              </span>
              <div style={{ flex: 1, height: 1, backgroundColor: 'var(--border)' }} />
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {rest.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          </section>
        )}
      </main>

      {/* ===== Footer ===== */}
      <footer style={{ backgroundColor: 'var(--dark)', marginTop: '6rem' }}>
        <div className="max-w-6xl mx-auto px-6 py-10 text-center">
          <p className="font-black text-white" style={{ fontFamily: 'var(--font-serif)' }}>
            就活ナビ
          </p>
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
