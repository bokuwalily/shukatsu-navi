// scripts/bulk-insert-hq.ts
// HQフォーマット（numbered slug）の記事をSupabaseに投入

import { createClient } from '@supabase/supabase-js'
import { readdirSync, readFileSync } from 'fs'
import { join } from 'path'

const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
const DIR = join(process.cwd(), 'tmp-batches')

async function main() {
  const files = readdirSync(DIR)
    .filter(f => f.startsWith('articles_hq_') && f.endsWith('.json'))
    .sort()

  if (files.length === 0) { console.log('articles_hq_*.json が見つかりません'); return }

  let inserted = 0, skipped = 0, errors = 0

  for (const file of files) {
    const articles = JSON.parse(readFileSync(join(DIR, file), 'utf-8'))
    console.log(`\n📄 ${file}: ${articles.length}件`)

    for (const a of articles) {
      try {
        const row = {
          title:     a.title,
          slug:      String(a.article_no ?? a.slug),
          keyword:   a.keyword,
          category:  a.category,
          content:   a.content,
          meta_desc: a.meta_desc,
          tags:      Array.isArray(a.tags) ? a.tags : [],
          published: true,
        }
        const { error } = await sb.from('articles').insert(row)
        if (error?.code === '23505') { skipped++; continue }
        if (error) throw error

        if (a.keyword_id) {
          await sb.from('keywords').update({ used: true }).eq('id', a.keyword_id)
        }
        inserted++
        process.stdout.write(`\r  ✅ ${inserted}件投入 / ${skipped}件スキップ`)
      } catch (e) {
        errors++
        const msg = e instanceof Error ? e.message.slice(0, 60) : String(e)
        console.error(`\n  ❌ [${a.keyword}] ${msg}`)
      }
    }
  }

  const { count } = await sb.from('articles').select('*', { count: 'exact', head: true })
  console.log(`\n\n🎉 完了: 投入${inserted} / スキップ${skipped} / エラー${errors}`)
  console.log(`📊 DB総記事数: ${count}件`)
}

main().catch(e => { console.error(e); process.exit(1) })
