/**
 * 全記事の content から AI生成プレースホルダ自己紹介文
 * （例:「キャリアアドバイザーの〇〇です。」「〇〇と申します。」）を検出・除去する。
 *
 * 使い方:
 *   走査のみ: node --env-file=.env.local --import tsx scripts/fix-placeholder-intros.ts
 *   除去実行: node --env-file=.env.local --import tsx scripts/fix-placeholder-intros.ts --fix
 *     （--fix には SUPABASE_SERVICE_ROLE_KEY が必要。無ければ走査のみにフォールバック）
 */
import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!url || (!serviceKey && !anonKey)) {
  console.error('環境変数 NEXT_PUBLIC_SUPABASE_URL / キーが未設定です')
  process.exit(1)
}

const wantFix = process.argv.includes('--fix')
const canFix = wantFix && !!serviceKey
if (wantFix && !serviceKey) {
  console.warn('⚠ SUPABASE_SERVICE_ROLE_KEY が無いため走査のみ実行します')
}

const supabase = createClient(url, (canFix ? serviceKey : anonKey ?? serviceKey)!)

/**
 * プレースホルダ「筆者自己紹介文」にマッチする正規表現。
 * - 「キャリアアドバイザーの〇〇です。」「就活ライター・キャリアアドバイザーの〇〇です。」等、
 *   記事の書き手がAI生成のまま名乗っている壊れた文だけを対象にする
 * - メール例文・自己PR例文の「○○大学の○○です」「私の強みは〇〇です」等は
 *   読者が埋める意図的なテンプレなので除去しない（全768記事走査で86文が該当、要保持）
 * - 文単位（直前の 。！？ または行頭から、直後の 。！？ まで）で安全に除去する
 */
const SENTENCE_RE = /[^。！？\n]*(?:キャリアアドバイザー|就活ライター|就活アドバイザー|筆者)の[〇○]{1,4}(?:です|と申します)[^。！？\n]*[。！？]?/g

type Row = { id: string; slug: string; title: string; content: string }

function findPlaceholderSentences(content: string): string[] {
  return [...content.matchAll(SENTENCE_RE)].map((m) => m[0])
}

function removePlaceholderSentences(content: string): string {
  // 該当文のみを除去。前後の文・改行・markdown構造は触らない
  return content.replace(SENTENCE_RE, '')
}

async function fetchAll(): Promise<Row[]> {
  const rows: Row[] = []
  const PAGE = 500
  for (let from = 0; ; from += PAGE) {
    const { data, error } = await supabase
      .from('articles')
      .select('id, slug, title, content')
      .order('slug', { ascending: true })
      .range(from, from + PAGE - 1)
    if (error) throw error
    rows.push(...((data as Row[]) ?? []))
    if (!data || data.length < PAGE) break
  }
  return rows
}

async function main() {
  const rows = await fetchAll()
  console.log(`記事総数: ${rows.length}`)

  const hits = rows
    .map((r) => ({ ...r, sentences: findPlaceholderSentences(r.content ?? '') }))
    .filter((r) => r.sentences.length > 0)

  console.log(`プレースホルダ検出記事: ${hits.length}件`)
  for (const h of hits.slice(0, 20)) {
    console.log(`- [${h.slug}] ${h.title}`)
    for (const s of h.sentences) console.log(`    除去対象: 「${s.trim()}」`)
  }
  if (hits.length > 20) console.log(`  ...ほか ${hits.length - 20} 件`)

  if (!canFix) {
    console.log('\n（走査のみ。除去するには --fix を付けて SUPABASE_SERVICE_ROLE_KEY を設定）')
    return
  }

  let updated = 0
  for (const h of hits) {
    const next = removePlaceholderSentences(h.content)
    if (next === h.content) continue
    const { error } = await supabase.from('articles').update({ content: next }).eq('id', h.id)
    if (error) {
      console.error(`✗ UPDATE失敗 [${h.slug}]:`, error.message)
      continue
    }
    updated++
  }
  console.log(`\n✓ ${updated}件の記事を更新しました`)

  // 再走査で0件確認
  const recheck = (await fetchAll())
    .map((r) => findPlaceholderSentences(r.content ?? '').length)
    .reduce((a, b) => a + b, 0)
  console.log(`再走査: 残存プレースホルダ文 ${recheck}件`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
