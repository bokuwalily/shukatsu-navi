'use client'

import Link from 'next/link'
import { useState } from 'react'

const NAV_CATEGORIES = [
  { name: 'ES・自己PR', icon: '✍️' },
  { name: '面接対策', icon: '🎤' },
  { name: 'インターン', icon: '💼' },
  { name: '業界研究', icon: '🔍' },
  { name: 'OB・OG訪問', icon: '🤝' },
]

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header
      className="sticky top-0 z-50"
      style={{
        backgroundColor: 'var(--dark)',
        borderBottom: '3px solid var(--accent)',
        boxShadow: '0 2px 16px rgba(0,0,0,0.25)',
      }}
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* ロゴ */}
        <Link href="/" className="group">
          <p
            className="text-white text-xl font-black tracking-tight group-hover:opacity-80 transition-opacity"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            就活ナビ
          </p>
          <p className="text-xs tracking-widest uppercase mt-0.5" style={{ color: 'var(--accent)', opacity: 0.8 }}>
            Job Hunting Guide
          </p>
        </Link>

        {/* PC ナビ */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_CATEGORIES.map((cat) => (
            <Link
              key={cat.name}
              href={`/category/${encodeURIComponent(cat.name)}`}
              className="flex items-center gap-1.5 text-sm px-3 py-2 rounded-lg transition-all duration-150 hover:text-white hover:bg-white/10"
              style={{ color: '#9CA3AF' }}
            >
              <span className="text-base" aria-hidden="true">{cat.icon}</span>
              {cat.name}
            </Link>
          ))}
        </nav>

        {/* ハンバーガー（モバイル） */}
        <button
          className="md:hidden flex flex-col justify-center items-center w-10 h-10 gap-1.5 rounded-lg transition-colors hover:bg-white/10"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="メニューを開く"
          aria-expanded={menuOpen}
        >
          <span
            className="block w-6 h-0.5 bg-white transition-all duration-300 origin-center"
            style={{ transform: menuOpen ? 'rotate(45deg) translate(2px, 3px)' : 'none' }}
          />
          <span
            className="block w-6 h-0.5 bg-white transition-all duration-300"
            style={{ opacity: menuOpen ? 0 : 1 }}
          />
          <span
            className="block w-6 h-0.5 bg-white transition-all duration-300 origin-center"
            style={{ transform: menuOpen ? 'rotate(-45deg) translate(2px, -3px)' : 'none' }}
          />
        </button>
      </div>

      {/* モバイルメニュー */}
      <div
        className="md:hidden overflow-hidden transition-all duration-300"
        style={{
          maxHeight: menuOpen ? '320px' : '0px',
          borderTop: menuOpen ? '1px solid rgba(255,255,255,0.08)' : 'none',
        }}
      >
        <nav className="px-6 py-4 flex flex-col gap-1">
          {NAV_CATEGORIES.map((cat) => (
            <Link
              key={cat.name}
              href={`/category/${encodeURIComponent(cat.name)}`}
              className="flex items-center gap-3 text-sm px-4 py-3 rounded-lg transition-all hover:bg-white/10"
              style={{ color: '#D1D5DB' }}
              onClick={() => setMenuOpen(false)}
            >
              <span className="text-lg" aria-hidden="true">{cat.icon}</span>
              {cat.name}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
