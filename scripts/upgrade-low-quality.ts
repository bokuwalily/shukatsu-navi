// scripts/upgrade-low-quality.ts
// 4000字未満の低品質記事を5000字以上の高品質版に差し替えるスクリプト
// レート: 8秒間隔（Gemini 2.5 Flash フリー枠 10 RPM 安全圏）

import { createClient } from '@supabase/supabase-js'
import { GoogleGenAI } from '@google/genai'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! })

const BATCH_SIZE = 20   // 一度に処理する記事数
const MAX_ARTICLES = 80 // 今回の最大処理件数
const API_INTERVAL_MS = 8000 // 8秒間隔

function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)) }

// カテゴリ別外部リンク定義（ユーザー指定）
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
  'インターン': [
    { name: 'マイナビインターン', url: 'https://internship.mynavi.jp/', desc: 'インターン情報検索' },
    { name: 'ワンキャリア', url: 'https://one-career.jp', desc: 'インターン選考情報・体験談' },
    { name: '就活会議', url: 'https://syukatsu-kaigi.jp', desc: 'インターン選考通過率データ' },
    { name: 'マイナビ就活', url: 'https://job.mynavi.jp', desc: '就活生の3人に1人が利用する就活サイト' },
  ],
  '就活サイト比較': [
    { name: 'マイナビ就活', url: 'https://job.mynavi.jp', desc: '業界最大手・就活生の3人に1人が利用' },
    { name: 'OfferBox', url: 'https://offerbox.jp/columns/', desc: 'オファー型就活・スカウト受け取り' },
    { name: '就活会議', url: 'https://syukatsu-kaigi.jp', desc: '口コミ・ES通過率データ' },
    { name: 'ワンキャリア', url: 'https://one-career.jp', desc: '内定実績データが豊富' },
  ],
  'SPI・筆記試験': [
    { name: 'リアシュ SPI対策', url: 'https://reashu.com/spi/', desc: 'SPI無料対策問題集' },
    { name: 'アガルート SPI', url: 'https://www.agaroot.jp/career/column/spi/', desc: 'SPI対策コラム' },
    { name: 'マイナビ就活', url: 'https://job.mynavi.jp', desc: '就活生の3人に1人が利用する就活サイト' },
  ],
  '就活マナー': [
    { name: 'マイナビ就活マナー', url: 'https://job.mynavi.jp/conts/manner/', desc: '就活マナー完全ガイド' },
    { name: '就活会議', url: 'https://syukatsu-kaigi.jp', desc: '就活マナー体験談' },
    { name: 'マイナビ就活', url: 'https://job.mynavi.jp', desc: '就活生の3人に1人が利用する就活サイト' },
  ],
  '業界研究': [
    { name: 'OpenWork', url: 'https://www.openwork.jp', desc: '社員口コミ・年収データ' },
    { name: '就職四季報', url: 'https://str.toyokeizai.net/', desc: '業界・企業データ公式版' },
    { name: '就活会議', url: 'https://syukatsu-kaigi.jp', desc: '選考情報・口コミ' },
    { name: 'マイナビ就活', url: 'https://job.mynavi.jp', desc: '就活生の3人に1人が利用する就活サイト' },
  ],
  '企業研究': [
    { name: 'OpenWork', url: 'https://www.openwork.jp', desc: '社員口コミ・評価・年収データ' },
    { name: '就職四季報', url: 'https://str.toyokeizai.net/', desc: '財務・業績データ' },
    { name: '就活会議', url: 'https://syukatsu-kaigi.jp', desc: '選考通過率・面接質問データ' },
    { name: 'マイナビ就活', url: 'https://job.mynavi.jp', desc: '就活生の3人に1人が利用する就活サイト' },
  ],
  'OB・OG訪問': [
    { name: 'Matcher', url: 'https://matcher.jp/', desc: 'OB・OG訪問マッチングサービス' },
    { name: '就活会議', url: 'https://syukatsu-kaigi.jp', desc: 'OB訪問体験談・口コミ' },
    { name: 'マイナビ就活', url: 'https://job.mynavi.jp', desc: '就活生の3人に1人が利用する就活サイト' },
  ],
  '就活スケジュール': [
    { name: 'リアシュ スケジュール', url: 'https://reashu.com/daigakusei-shukatsu-itsukara/', desc: '就活スケジュール完全解説' },
    { name: '就活会議', url: 'https://syukatsu-kaigi.jp', desc: '選考情報・スケジュール体験談' },
    { name: 'マイナビ就活', url: 'https://job.mynavi.jp', desc: '就活生の3人に1人が利用する就活サイト' },
  ],
  'キャリア設計': [
    { name: 'OfferBox', url: 'https://offerbox.jp/columns/', desc: 'キャリア設計コラム' },
    { name: 'OpenWork', url: 'https://www.openwork.jp', desc: '年収・キャリアデータ' },
    { name: '就活会議', url: 'https://syukatsu-kaigi.jp', desc: 'キャリア体験談・口コミ' },
    { name: 'マイナビ就活', url: 'https://job.mynavi.jp', desc: '就活生の3人に1人が利用する就活サイト' },
  ],
  '留学・海外就活': [
    { name: 'JICA', url: 'https://www.jica.go.jp/', desc: '国際協力・海外勤務情報' },
    { name: 'OpenWork', url: 'https://www.openwork.jp', desc: 'グローバル企業の口コミデータ' },
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

  let result: { content: string; meta_desc: string } | null = null
  let lastError = ''

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
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
        const meta_desc = metaMatch[1].trim()
        const content = contentMatch[1].trim()
        const contentLength = content.length

        if (contentLength >= 4500) {
          result = { content, meta_desc }
          break
        }
        console.log(`    ⚠️  attempt ${attempt}: 文字数不足 ${contentLength}字 → リトライ`)
        lastError = `文字数不足: ${contentLength}字`
      } else {
        // フォールバック: JSON形式も試みる
        const raw = rawText.replace(/^```json\s*/m, '').replace(/\s*```\s*$/m, '').trim()
        const jsonMatch = raw.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          const sanitized = jsonMatch[0].replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
          const parsed = JSON.parse(sanitized)
          if (parsed?.content && parsed?.meta_desc && parsed.content.length >= 4500) {
            result = { content: parsed.content as string, meta_desc: parsed.meta_desc as string }
            break
          }
        }
        lastError = 'セパレーターが見つからない'
      }
    } catch (e) {
      lastError = e instanceof Error ? e.message.slice(0, 100) : String(e)
      if (attempt < 3) await sleep(3000 * attempt)
    }
  }

  if (!result) {
    throw new Error(`Gemini failed after 3 attempts: ${lastError}`)
  }

  return result
}

async function getLowQualityArticles(limit: number) {
  const { data, error } = await supabase
    .from('articles')
    .select('id, title, keyword, category, content')
    .order('created_at', { ascending: true })

  if (error) throw error

  const allArticles = data ?? []
  const lowQuality = allArticles.filter(a => (a.content?.length ?? 0) < 4000)
  return lowQuality.slice(0, limit)
}

async function updateArticle(id: string, content: string, meta_desc: string) {
  const { error } = await supabase
    .from('articles')
    .update({ content, meta_desc })
    .eq('id', id)
  if (error) throw error
}

async function countArticles() {
  const { count, error } = await supabase
    .from('articles')
    .select('*', { count: 'exact', head: true })
  if (error) throw error
  return count ?? 0
}

async function main() {
  console.log('\n🚀 低品質記事アップグレード開始')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

  // 低品質記事を取得（最大80件）
  const articles = await getLowQualityArticles(MAX_ARTICLES)
  console.log(`📊 対象記事数: ${articles.length}件（4000字未満）`)
  console.log(`⚙️  処理予定: 最大${MAX_ARTICLES}件（${BATCH_SIZE}件ずつ）`)
  console.log(`⏱️  レート: 8秒間隔 = 約7.5 req/min\n`)

  let successCount = 0
  let failCount = 0
  const startTime = Date.now()

  // バッチ処理
  for (let batchStart = 0; batchStart < articles.length; batchStart += BATCH_SIZE) {
    const batch = articles.slice(batchStart, batchStart + BATCH_SIZE)
    const batchNum = Math.floor(batchStart / BATCH_SIZE) + 1
    const totalBatches = Math.ceil(articles.length / BATCH_SIZE)

    console.log(`\n📦 バッチ ${batchNum}/${totalBatches}（${batch.length}件）`)
    console.log('─'.repeat(50))

    for (let i = 0; i < batch.length; i++) {
      const article = batch[i]
      const globalIdx = batchStart + i + 1
      const elapsed = Math.round((Date.now() - startTime) / 1000)

      console.log(`[${globalIdx}/${articles.length}] ${article.keyword?.slice(0, 30)} (${article.category}) - 現在${article.content?.length ?? 0}字`)

      try {
        const result = await generateHighQualityArticle(article.keyword, article.category)
        const newLength = result.content.length

        await updateArticle(article.id, result.content, result.meta_desc)
        successCount++
        console.log(`    ✅ 更新完了: ${newLength}字（+${newLength - (article.content?.length ?? 0)}字）`)
      } catch (e) {
        failCount++
        const msg = e instanceof Error ? e.message.slice(0, 80) : String(e)
        console.log(`    ❌ 失敗: ${msg}`)
      }

      // レート制限（最後の1件以外）
      if (i < batch.length - 1 || batchStart + BATCH_SIZE < articles.length) {
        process.stdout.write(`    ⏳ ${API_INTERVAL_MS / 1000}秒待機中...`)
        await sleep(API_INTERVAL_MS)
        process.stdout.write(' 完了\n')
      }
    }

    const elapsed = Math.round((Date.now() - startTime) / 1000)
    console.log(`\n📈 バッチ${batchNum}完了 | 経過${elapsed}秒 | 成功${successCount}件 / 失敗${failCount}件`)
  }

  // 最終集計
  const totalCount = await countArticles()
  const elapsed = Math.round((Date.now() - startTime) / 1000)

  console.log('\n' + '━'.repeat(50))
  console.log('🎉 処理完了！')
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
  console.log(`✅ 成功: ${successCount}件`)
  console.log(`❌ 失敗: ${failCount}件`)
  console.log(`📚 DB総記事数: ${totalCount}件`)
  console.log(`⏱️  処理時間: ${Math.floor(elapsed / 60)}分${elapsed % 60}秒`)
  console.log('━'.repeat(50))
}

main().catch(console.error)
