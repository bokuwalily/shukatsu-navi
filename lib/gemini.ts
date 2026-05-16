// lib/gemini.ts
import { GoogleGenAI } from '@google/genai'

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! })

export type ArticleData = {
  title: string
  content: string
  meta_desc: string
  slug: string
  keyword: string
  category: string
}

function toSlug(keyword: string): string {
  return keyword
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '')
    + '-' + Date.now()
}

export async function generateArticle(keyword: string, category: string): Promise<ArticleData> {
  const prompt = `あなたはSEOに精通した就活ライターです。以下のキーワードで検索する就活生のために、SEO最適化された記事を書いてください。

キーワード: ${keyword}
カテゴリ: ${category}

以下の形式でJSONのみを返してください（コードブロックや説明文は不要）:
{"title":"記事タイトル（32文字以内）","meta_desc":"メタディスクリプション（80〜120文字）","content":"記事本文（マークダウン形式、2000〜3000字、H2・H3見出しあり）"}

記事の条件:
- 読者は就活中の大学生
- 具体的な例文・数字を含める
- 自然な日本語
- 冒頭100字で読者の悩みに共感する`

  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: prompt,
  })

  const responseText = response.text ?? ''
  const raw = responseText.replace(/```json\n?|\n?```/g, '').trim()
  const parsed = JSON.parse(raw)

  return {
    title: parsed.title,
    content: parsed.content,
    meta_desc: parsed.meta_desc,
    slug: toSlug(keyword),
    keyword,
    category,
  }
}
