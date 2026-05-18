// scripts/bulk-insert-from-files.ts
// tmp-batches/articles_*.json を読み込んでSupabaseに一括投入

import { createClient } from '@supabase/supabase-js'
import { readdirSync, readFileSync } from 'fs'
import { join } from 'path'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const DIR = join(process.cwd(), 'tmp-batches')

async function main() {
  const files = readdirSync(DIR)
    .filter(f => f.startsWith('articles_') && f.endsWith('.json'))
    .sort()
    // 既に投入済みファイルは除外したい場合はここでフィルタ可能

  if (files.length === 0) {
    console.log('articles_*.json が見つかりません')
    return
  }

  let totalInserted = 0
  let totalError = 0

  for (const file of files) {
    const articles = JSON.parse(readFileSync(join(DIR, file), 'utf-8'))
    console.log(`\n📄 ${file}: ${articles.length}件投入中...`)

    for (const article of articles) {
      try {
        const row = {
          title:     article.title,
          slug:      article.slug,
          keyword:   article.keyword,
          category:  article.category,
          content:   article.content,
          meta_desc: article.meta_desc,
          tags:      Array.isArray(article.tags) ? article.tags : [],
          published: true,
        }
        const { error: e1 } = await supabase.from('articles').insert(row)
        // slug重複は無視（既に投入済み）
        if (e1 && !e1.message?.includes('duplicate') && !e1.code?.includes('23505')) throw e1
        if (e1) { continue }

        if (article.keyword_id) {
          await supabase.from('keywords').update({ used: true }).eq('id', article.keyword_id)
        }
        totalInserted++
        process.stdout.write(`\r  ✅ ${totalInserted}件投入済み`)
      } catch (e) {
        totalError++
        const msg = e instanceof Error ? e.message : String(e)
        console.error(`\n  ❌ [${article.keyword}] ${msg.slice(0, 80)}`)
      }
    }
  }

  const { count } = await supabase.from('articles').select('*', { count: 'exact', head: true })
  console.log(`\n\n🎉 完了！ 投入: ${totalInserted}件 | エラー: ${totalError}件`)
  console.log(`📊 DB総記事数: ${count}件`)
}

main().catch(e => { console.error(e); process.exit(1) })
