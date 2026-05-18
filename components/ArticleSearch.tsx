'use client'

import { useState, useMemo } from 'react'
import { Article } from '@/lib/supabase'
import { ArticleCard } from '@/components/ArticleCard'

interface Props {
  articles: Article[]
  totalCount: number
}

export function ArticleSearch({ articles, totalCount }: Props) {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return articles
    return articles.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.meta_desc.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q) ||
        (a.tags ?? []).some((t) => t.toLowerCase().includes(q))
    )
  }, [query, articles])

  return (
    <>
      {/* 検索バー */}
      <div className="mb-8">
        <div className="relative">
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
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="記事を検索... （タイトル・カテゴリ・タグ）"
            className="w-full pl-12 pr-4 py-3.5 rounded-xl text-sm outline-none transition-all"
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
            <button
              onClick={() => setQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-sm hover:opacity-60 transition-opacity"
              style={{ color: 'var(--text-muted)' }}
              aria-label="検索をクリア"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* 件数表示 */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          {query ? (
            <>
              <span className="font-bold" style={{ color: 'var(--accent)' }}>「{query}」</span>
              {' '}の検索結果&nbsp;
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
          <button
            onClick={() => setQuery('')}
            className="mt-4 text-sm font-bold hover:opacity-70 transition-opacity"
            style={{ color: 'var(--accent)' }}
          >
            検索をリセット
          </button>
        </div>
      )}
    </>
  )
}
