// scripts/fetch-keywords-to-batches.ts
// 未使用キーワードをSupabaseから取得し、バッチJSONファイルに分割する

import { createClient } from '@supabase/supabase-js'
import { writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const BATCH_SIZE = 20   // 高品質版: 8000字×20件 = エージェント1回分
const OUTPUT_DIR = join(process.cwd(), 'tmp-batches')

async function main() {
  mkdirSync(OUTPUT_DIR, { recursive: true })

  const { data, error } = await supabase
    .from('keywords')
    .select('*')
    .eq('used', false)
    .order('category')

  if (error) throw error
  const keywords = data ?? []

  console.log(`未使用キーワード: ${keywords.length}件`)

  const batches: typeof keywords[] = []
  for (let i = 0; i < keywords.length; i += BATCH_SIZE) {
    batches.push(keywords.slice(i, i + BATCH_SIZE))
  }

  for (let i = 0; i < batches.length; i++) {
    const path = join(OUTPUT_DIR, `batch_${String(i).padStart(2, '0')}.json`)
    writeFileSync(path, JSON.stringify(batches[i], null, 2))
    console.log(`batch_${String(i).padStart(2, '0')}.json: ${batches[i].length}件`)
  }

  console.log(`\n合計${batches.length}バッチ生成完了 → ${OUTPUT_DIR}`)
}

main().catch(e => { console.error(e); process.exit(1) })
