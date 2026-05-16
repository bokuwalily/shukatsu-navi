// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

export type Article = {
  id: string
  slug: string
  title: string
  content: string
  meta_desc: string
  keyword: string
  category: string
  published: boolean
  created_at: string
}

export type Keyword = {
  id: string
  keyword: string
  category: string
  used: boolean
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export function supabaseAdmin() {
  return createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY!)
}

export async function getArticles(limit = 10): Promise<Article[]> {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false })
    .limit(limit)
  if (error) throw error
  return data ?? []
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single()
  if (error) return null
  return data
}

export async function getAllSlugs(): Promise<string[]> {
  const { data, error } = await supabase
    .from('articles')
    .select('slug')
    .eq('published', true)
  if (error) return []
  return (data ?? []).map((r) => r.slug)
}

export async function getUnusedKeyword(): Promise<Keyword | null> {
  const admin = supabaseAdmin()
  const { data, error } = await admin
    .from('keywords')
    .select('*')
    .eq('used', false)
    .limit(1)
    .single()
  if (error) return null
  return data
}

export async function saveArticle(article: Omit<Article, 'id' | 'created_at'>): Promise<void> {
  const admin = supabaseAdmin()
  const { error } = await admin.from('articles').insert(article)
  if (error) throw error
}

export async function markKeywordUsed(id: string): Promise<void> {
  const admin = supabaseAdmin()
  const { error } = await admin.from('keywords').update({ used: true }).eq('id', id)
  if (error) throw error
}
