import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function main() {
  const { data, error } = await supabase
    .from('articles')
    .select('id, title, keyword, category, content')
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Error:', error)
    return
  }

  const lowQuality = data?.filter(a => (a.content?.length ?? 0) < 4000) ?? []
  const highQuality = data?.filter(a => (a.content?.length ?? 0) >= 4000) ?? []

  console.log(`総記事数: ${data?.length}`)
  console.log(`低品質（4000字未満）: ${lowQuality.length}`)
  console.log(`高品質（4000字以上）: ${highQuality.length}`)
  console.log('\n低品質記事一覧（最初の30件）:')
  lowQuality.slice(0, 30).forEach(a => {
    console.log(`  id=${a.id} len=${a.content?.length ?? 0} category=${a.category} keyword=${a.keyword?.slice(0,30)}`)
  })
}

main()
