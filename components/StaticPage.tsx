import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'

type StaticPageProps = {
  title: string
  lead?: string
  updated?: string
  children: React.ReactNode
}

/** プライバシー・運営者情報・問い合わせ等、静的ページ共通の外枠 */
export function StaticPage({ title, lead, updated, children }: StaticPageProps) {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        {/* ヘッダー帯 */}
        <div style={{ backgroundColor: 'var(--dark)' }}>
          <div className="max-w-3xl mx-auto px-6 py-12">
            <p
              className="text-xs tracking-widest uppercase mb-3"
              style={{ color: 'var(--accent)', opacity: 0.9 }}
            >
              {title}
            </p>
            <h1
              className="text-white text-3xl sm:text-4xl font-black leading-tight"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              {title}
            </h1>
            {lead && (
              <p className="mt-4 text-sm leading-relaxed" style={{ color: '#9CA3AF' }}>
                {lead}
              </p>
            )}
          </div>
        </div>

        {/* 本文 */}
        <article className="max-w-3xl mx-auto px-6 py-12">
          <div className="static-prose">{children}</div>
          {updated && (
            <p className="mt-12 text-xs" style={{ color: 'var(--text-muted)' }}>
              最終更新日：{updated}
            </p>
          )}
        </article>
      </main>
      <SiteFooter />
    </>
  )
}
