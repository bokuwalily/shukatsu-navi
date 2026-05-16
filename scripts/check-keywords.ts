import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function check() {
  const { data, error, count } = await supabase
    .from('keywords')
    .select('category', { count: 'exact' })
  
  if (error) throw error
  
  const counts: Record<string, number> = {}
  for (const row of data!) {
    counts[row.category] = (counts[row.category] || 0) + 1
  }
  
  let total = 0
  for (const [cat, c] of Object.entries(counts).sort()) {
    console.log(`${cat}: ${c}件`)
    total += c
  }
  console.log(`\n合計: ${total}件`)
}

check().catch(console.error)
