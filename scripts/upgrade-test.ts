// スクリプトのテスト実行（3件のみ、DBは更新しない）
import { GoogleGenAI } from '@google/genai'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! })

const EXTERNAL_LINKS: Record<string, Array<{ name: string; url: string; desc: string }>> = {
  'ES・自己PR': [
    { name: 'マイナビES', url: 'https://job.mynavi.jp/conts/jikoPR/', desc: '内定者のES・自己PR例文多数' },
    { name: '就活会議', url: 'https://syukatsu-kaigi.jp', desc: 'ES通過実績・口コミデータ' },
    { name: 'ワンキャリア ES記事', url: 'https://one-career.jp/articles/es', desc: '内定者ESデータベース' },
    { name: 'マイナビ就活', url: 'https://job.mynavi.jp', desc: '就活生の3人に1人が利用する就活サイト' },
  ],
  '面接対策': [
    { name: 'マイナビ面接対策', url: 'https://job.mynavi.jp/conts/mensetsu/', desc: '面接対策コンテンツ完全版' },
    { name: 'アガルート面接対策', url: 'https://www.agaroot.jp/career/column/interview/', desc: 'プロが教える面接攻略法' },
    { name: '就活会議', url: 'https://syukatsu-kaigi.jp', desc: '面接体験談データベース' },
    { name: 'マイナビ就活', url: 'https://job.mynavi.jp', desc: '就活生の3人に1人が利用する就活サイト' },
  ],
}

function getExternalLinks(category: string) {
  return EXTERNAL_LINKS[category] ?? [
    { name: 'マイナビ就活', url: 'https://job.mynavi.jp', desc: '就活生の3人に1人が利用する就活サイト' },
    { name: '就活会議', url: 'https://syukatsu-kaigi.jp', desc: '選考情報・口コミデータベース' },
    { name: 'ワンキャリア', url: 'https://one-career.jp/articles/es', desc: '内定実績データが豊富' },
    { name: 'OpenWork', url: 'https://www.openwork.jp', desc: '社員口コミ・年収データ' },
  ]
}

function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)) }

async function generateHighQualityArticle(keyword: string, category: string): Promise<{ content: string; meta_desc: string }> {
  const externalLinks = getExternalLinks(category)
  const linksSection = externalLinks.map(l => `- [${l.name}](${l.url}): ${l.desc}`).join('\n')

  const prompt = `あなたはSEOに精通した就活ライター・キャリアアドバイザーです。2026年卒（28卒）の就活生向けに、以下のキーワードで検索エンジン最適化された充実した記事を書いてください。

キーワード: ${keyword}
カテゴリ: ${category}

以下のフォーマットで出力してください。JSONは使わず、区切り線のみで分けてください：

===META_DESC_START===
（ここにメタディスクリプション80〜120文字を書く）
===META_DESC_END===

===CONTENT_START===
（ここに記事本文をマークダウン形式で書く）
===CONTENT_END===

=== 記事本文の必須構成（厳守） ===

## [悩みに共感するH2見出し（例：なぜ○○が重要なのか）]
### [H3サブ見出し]
（200〜300字）
### [H3サブ見出し]
（200〜300字）

> 💡 **ポイント**: ここに重要なポイントを1〜2文で記載

## [具体的な方法・手順のH2見出し]
### [H3サブ見出し]
（具体的な手順・箇条書き、200〜300字）
### [H3サブ見出し]
（200〜300字）
### [H3サブ見出し]
（200〜300字）

> 💡 **ポイント**: 実践的なアドバイスを1〜2文

## [比較・種類の違いを解説するH2見出し]
（比較表を必ず1〜2個含めること）

| 項目 | 選択肢A | 選択肢B |
|------|--------|--------|
| 特徴 | ... | ... |
| メリット | ... | ... |
| デメリット | ... | ... |

### [H3サブ見出し]
（200〜300字）
### [H3サブ見出し]
（200〜300字）

> 💡 **ポイント**: 比較のポイントを1〜2文

## [例文・実例のH2見出し（「${keyword} 例文」的な内容）]
### 弱め（初心者向け）の例文
（300〜400字の実践的な例文、引用ブロックで囲む）

### 標準的な例文
（300〜400字の実践的な例文、引用ブロックで囲む）

### 強め（上級者向け）の例文
（300〜400字の実践的な例文、引用ブロックで囲む）

> 💡 **ポイント**: 例文を使う際の注意点・カスタマイズ方法

## [よくある失敗・注意点のH2見出し]
### [H3サブ見出し]
（200〜300字）
### [H3サブ見出し]
（200〜300字）

> 💡 **ポイント**: 失敗を避けるための重要アドバイス

> 📌 **無料登録**: [マイナビ就活](https://job.mynavi.jp)（就活生の3人に1人が利用）

## [最新トレンド・統計データのH2見出し]
### [H3サブ見出し]
（2026年最新の統計・データを含む、200〜300字）
### [H3サブ見出し]
（200〜300字）

> 📌 **無料登録**: [マイナビ就活](https://job.mynavi.jp)（就活生の3人に1人が利用）

## よくある質問
### Q. [よくある質問1]
（200〜300字の回答）

### Q. [よくある質問2]
（200〜300字の回答）

### Q. [よくある質問3]
（200〜300字の回答）

### Q. [よくある質問4]
（200〜300字の回答）

### Q. [よくある質問5]
（200〜300字の回答）

## 参考記事・おすすめサービス
${linksSection}

## まとめ
（300〜400字でまとめ）

> 📌 **無料登録**: [マイナビ就活](https://job.mynavi.jp)（就活生の3人に1人が利用）

=== 記事の条件 ===
- 合計文字数: 必ず5000字以上（6000〜7000字が理想）
- H2: 6〜8個、H3: 各H2の下に2〜4個
- 比較表: 1〜2個必須
- ポイントブロック（💡）: 3〜5か所
- CTAブロック（📌）: 3か所
- FAQ: H3×4〜5問
- 例文: 弱め・標準・強めの3パターン
- 読者: 28卒（2026年卒）の就活中大学生
- 具体的な数字・統計データを含める（例：「就活生の73%が...」「平均○時間...」等）
- 画像タグは使用しない（画像なし）
- 自然な日本語、読みやすい文体`

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: { maxOutputTokens: 16384 },
  })

  const rawText = response.text ?? ''

  // セパレーター形式でパース
  const metaMatch = rawText.match(/===META_DESC_START===\s*([\s\S]*?)\s*===META_DESC_END===/)
  const contentMatch = rawText.match(/===CONTENT_START===\s*([\s\S]*?)\s*===CONTENT_END===/)

  if (metaMatch && contentMatch) {
    return {
      content: contentMatch[1].trim(),
      meta_desc: metaMatch[1].trim(),
    }
  }

  // フォールバック: JSON形式
  const raw = rawText.replace(/^```json\s*/m, '').replace(/\s*```\s*$/m, '').trim()
  const jsonMatch = raw.match(/\{[\s\S]*\}/)
  if (jsonMatch) {
    const sanitized = jsonMatch[0].replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    const parsed = JSON.parse(sanitized)
    return {
      content: parsed.content as string,
      meta_desc: parsed.meta_desc as string,
    }
  }

  throw new Error('セパレーターもJSONも見つからない')
}

async function main() {
  console.log('🧪 テスト実行（3件、DB更新なし）\n')

  // 低品質記事を3件取得
  const { data, error } = await supabase
    .from('articles')
    .select('id, title, keyword, category, content')
    .order('created_at', { ascending: true })

  if (error) { console.error(error); return }

  const lowQuality = (data ?? []).filter(a => (a.content?.length ?? 0) < 4000).slice(0, 3)

  for (let i = 0; i < lowQuality.length; i++) {
    const a = lowQuality[i]
    console.log(`[${i + 1}/3] keyword: ${a.keyword} | category: ${a.category}`)
    console.log(`  現在: ${a.content?.length ?? 0}字`)

    try {
      const result = await generateHighQualityArticle(a.keyword, a.category)
      const len = result.content.length

      // 構成チェック
      const h2count = (result.content.match(/^## /gm) ?? []).length
      const h3count = (result.content.match(/^### /gm) ?? []).length
      const hasTable = result.content.includes('|')
      const pointCount = (result.content.match(/💡/g) ?? []).length
      const ctaCount = (result.content.match(/📌/g) ?? []).length
      const hasFaq = result.content.includes('よくある質問')
      const hasExamples = result.content.includes('弱め') || result.content.includes('例文')

      console.log(`  生成後: ${len}字 ✅`)
      console.log(`  H2: ${h2count}個 | H3: ${h3count}個 | 表: ${hasTable ? '✅' : '❌'}`)
      console.log(`  💡: ${pointCount}か所 | 📌: ${ctaCount}か所`)
      console.log(`  FAQ: ${hasFaq ? '✅' : '❌'} | 例文: ${hasExamples ? '✅' : '❌'}`)
      console.log(`  meta_desc: ${result.meta_desc}`)
      console.log(`  冒頭100字: ${result.content.slice(0, 100)}...\n`)
    } catch (e) {
      console.log(`  ❌ エラー: ${e instanceof Error ? e.message.slice(0, 100) : String(e)}\n`)
    }

    if (i < lowQuality.length - 1) {
      console.log('  ⏳ 8秒待機...')
      await sleep(8000)
    }
  }

  console.log('✅ テスト完了')
}

main().catch(console.error)
