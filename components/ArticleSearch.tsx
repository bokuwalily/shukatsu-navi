'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { ArticleListItem } from '@/lib/supabase'
import { ArticleCard } from '@/components/ArticleCard'

interface Props {
  articles: ArticleListItem[]
  totalCount: number
  /** サーバー側で /?q= 検索済みのクエリ。このとき articles は全記事からの検索結果 */
  serverQuery?: string
}

export function ArticleSearch({ articles, totalCount, serverQuery = '' }: Props) {
  const [query, setQuery] = useState(serverQuery)

  // 入力がサーバー検索クエリと同じ間は、articles（サーバー検索結果）をそのまま表示
  const isServerResult = serverQuery.trim().length > 0 && query.trim() === serverQuery.trim()

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q || isServerResult) return articles
    return articles.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.meta_desc.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q) ||
        (a.tags ?? []).some((t) => t.toLowerCase().includes(q))
    )
  }, [query, articles, isServerResult])

  return (
    <>
      {/* 検索バー（GETフォーム: Enter/ボタンで /?q=... へ遷移し全記事から検索） */}
      <form action="/" method="get" className="mb-8" role="search">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <span
              className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-muted)' }}>
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </span>
            <input
              type="search"
              name="q"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="記事を検索... （タイトル・カテゴリ・タグ）"
              className="w-full pl-12 pr-10 py-3.5 rounded-xl text-sm outline-none transition-all"
              style={{
                backgroundColor: 'var(--surface)',
                border: '2px solid var(--border)',
                color: 'var(--text)',
                fontFamily: 'var(--font-sans)',
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--accent)' }}
              onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border)' }}
            />
            {query && (
              serverQuery ? (
                <Link
                  href="/"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm hover:opacity-60 transition-opacity"
                  style={{ color: 'var(--text-muted)' }}
                  aria-label="検索をクリア"
                >
                  ✕
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm hover:opacity-60 transition-opacity"
                  style={{ color: 'var(--text-muted)' }}
                  aria-label="検索をクリア"
                >
                  ✕
                </button>
              )
            )}
          </div>
          <button
            type="submit"
            className="shrink-0 px-5 py-3.5 rounded-xl text-sm font-bold transition-all hover:opacity-90 whitespace-nowrap"
            style={{ backgroundColor: 'var(--accent)', color: 'white' }}
          >
            全記事から検索
          </button>
        </div>
        {query && !isServerResult && (
          <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
            表示中の記事から絞り込んでいます。Enter または「全記事から検索」でサイト全体（全記事）を検索できます。
          </p>
        )}
      </form>

      {/* 件数表示 */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          {isServerResult ? (
            <>
              <span className="font-bold" style={{ color: 'var(--accent)' }}>「{serverQuery}」</span>
              {' '}の全記事検索結果&nbsp;
              <span className="font-bold" style={{ color: 'var(--text)' }}>{totalCount}件</span>
            </>
          ) : query ? (
            <>
              <span className="font-bold" style={{ color: 'var(--accent)' }}>「{query}」</span>
              {' '}の絞り込み結果&nbsp;
              <span className="font-bold" style={{ color: 'var(--text)' }}>{filtered.length}件</span>
            </>
          ) : (
            <>
              すべての記事&nbsp;
              <span className="font-bold" style={{ color: 'var(--text)' }}>全{totalCount}件</span>
            </>
          )}
        </p>
      </div>

      {/* 記事グリッド */}
      {filtered.length > 0 ? (
        <div className="grid sm:grid-cols-2 gap-5">
          {filtered.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      ) : (
        <div
          className="text-center py-24 rounded-xl"
          style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}
        >
          <p className="text-2xl mb-3">🔍</p>
          <p style={{ color: 'var(--text-muted)' }}>「{query}」に一致する記事が見つかりませんでした</p>
          {serverQuery ? (
            <Link
              href="/"
              className="inline-block mt-4 text-sm font-bold hover:opacity-70 transition-opacity"
              style={{ color: 'var(--accent)' }}
            >
              検索をリセット
            </Link>
          ) : (
            <button
              onClick={() => setQuery('')}
              className="mt-4 text-sm font-bold hover:opacity-70 transition-opacity"
              style={{ color: 'var(--accent)' }}
            >
              検索をリセット
            </button>
          )}
        </div>
      )}
    </>
  )
}
