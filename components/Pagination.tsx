import Link from 'next/link'

interface PaginationProps {
  currentPage: number
  totalPages: number
  basePath: string
}

function buildPageNumbers(current: number, total: number): (number | '...')[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }
  const pages: (number | '...')[] = []
  // 常に1ページ目を表示
  pages.push(1)
  if (current > 3) pages.push('...')
  // currentの前後2ページを表示
  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)
  for (let i = start; i <= end; i++) pages.push(i)
  if (current < total - 2) pages.push('...')
  // 常に最終ページを表示
  pages.push(total)
  return pages
}

export function Pagination({ currentPage, totalPages, basePath }: PaginationProps) {
  if (totalPages <= 1) return null

  const pageNumbers = buildPageNumbers(currentPage, totalPages)

  const makeHref = (page: number) =>
    page === 1
      ? basePath.includes('?')
        ? basePath.replace(/[?&]page=\d+/, '')
        : basePath
      : basePath.includes('?')
        ? `${basePath.replace(/[?&]page=\d+/, '')}&page=${page}`
        : `${basePath}?page=${page}`

  return (
    <nav className="flex items-center justify-center gap-2 mt-12" aria-label="ページネーション">
      {currentPage > 1 && (
        <Link
          href={makeHref(currentPage - 1)}
          className="px-4 py-2 text-sm font-bold rounded-lg transition-all hover:opacity-70"
          style={{ border: '1px solid var(--border)', color: 'var(--text)', backgroundColor: 'var(--surface)' }}
        >
          ← 前へ
        </Link>
      )}

      <div className="flex items-center gap-1">
        {pageNumbers.map((page, idx) => {
          if (page === '...') {
            return (
              <span
                key={`ellipsis-${idx}`}
                className="w-9 h-9 flex items-center justify-center text-sm"
                style={{ color: 'var(--text-muted)' }}
              >
                …
              </span>
            )
          }
          const isActive = page === currentPage
          return (
            <Link
              key={page}
              href={makeHref(page)}
              className="w-9 h-9 flex items-center justify-center text-sm font-bold rounded-lg transition-all"
              style={{
                backgroundColor: isActive ? 'var(--accent)' : 'var(--surface)',
                color: isActive ? 'white' : 'var(--text)',
                border: `1px solid ${isActive ? 'var(--accent)' : 'var(--border)'}`,
              }}
              aria-current={isActive ? 'page' : undefined}
            >
              {page}
            </Link>
          )
        })}
      </div>

      {currentPage < totalPages && (
        <Link
          href={makeHref(currentPage + 1)}
          className="px-4 py-2 text-sm font-bold rounded-lg transition-all hover:opacity-70"
          style={{ border: '1px solid var(--border)', color: 'var(--text)', backgroundColor: 'var(--surface)' }}
        >
          次へ →
        </Link>
      )}
    </nav>
  )
}
