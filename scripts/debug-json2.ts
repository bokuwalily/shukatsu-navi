// 制御文字の正確な位置とタイプを調べる
import { GoogleGenAI } from '@google/genai'

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! })

async function main() {
  const keyword = 'ES 書き方 構成 STAR'
  const category = 'ES・自己PR'

  const prompt = `あなたはSEOに精通した就活ライターです。28卒向けに「${keyword}」の記事を書いてください。

以下の形式でJSONのみを返してください（コードブロック・説明文は不要）:
{"meta_desc":"メタディスクリプション（80〜120文字）","content":"記事本文（マークダウン形式、5000字以上）"}

記事本文は5000字以上、マークダウン形式で書いてください。H2×6、H3×各2、比較表1個、FAQ4問、例文3種類を含めてください。`

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: { maxOutputTokens: 16384 },
  })

  const rawText = response.text ?? ''
  console.log('生文字数:', rawText.length)

  // 全文字をスキャン
  let problemCount = 0
  for (let i = 0; i < rawText.length && problemCount < 20; i++) {
    const code = rawText.charCodeAt(i)
    if (code < 32 && code !== 9 && code !== 10 && code !== 13) {
      problemCount++
      const context = rawText.slice(Math.max(0, i-30), i+30)
      console.log(`位置${i}: 0x${code.toString(16).padStart(2,'0')} (decimal: ${code})`)
      console.log(`  周辺: ${JSON.stringify(context)}`)
    }
  }
  if (problemCount === 0) {
    console.log('制御文字なし')
  }

  // 最初と最後の200字を確認
  console.log('\n--- 最初200字 ---')
  console.log(rawText.slice(0, 200))
  console.log('\n--- 最後200字 ---')
  console.log(rawText.slice(-200))

  // パース試行
  try {
    const raw = rawText.replace(/^```json\s*/m, '').replace(/\s*```\s*$/m, '').trim()
    const jsonMatch = raw.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      const jsonStr = jsonMatch[0]
      console.log('\nJSON文字数:', jsonStr.length)

      // position 3507 付近の文字を確認
      if (jsonStr.length > 3400) {
        console.log('\nposition 3400-3600:')
        for (let i = 3400; i < Math.min(3600, jsonStr.length); i++) {
          const code = jsonStr.charCodeAt(i)
          if (code < 32 && code !== 9 && code !== 10 && code !== 13) {
            console.log(`  pos${i}: 0x${code.toString(16).padStart(2,'0')} 周辺: ${JSON.stringify(jsonStr.slice(i-20, i+20))}`)
          }
        }
      }

      const sanitized = jsonStr.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
      const parsed = JSON.parse(sanitized)
      console.log('\n✅ パース成功! content length:', (parsed.content as string).length)
    }
  } catch (e) {
    console.log('\n❌ パース失敗:', e instanceof Error ? e.message : String(e))
    // もっと aggressive なサニタイズを試みる
    try {
      const raw2 = rawText.replace(/[\x00-\x1F\x7F]/g, c => {
        const code = c.charCodeAt(0)
        if (code === 9) return '\\t'  // タブ→エスケープ
        if (code === 10) return '\\n' // 改行→エスケープ
        if (code === 13) return '\\r' // CR→エスケープ
        return ''  // その他の制御文字は削除
      })
      const jsonMatch2 = raw2.match(/\{[\s\S]*\}/)
      if (jsonMatch2) {
        const parsed2 = JSON.parse(jsonMatch2[0])
        console.log('✅ Aggressive サニタイズで成功! content length:', (parsed2.content as string).length)
      }
    } catch (e2) {
      console.log('❌ Aggressive サニタイズも失敗:', e2 instanceof Error ? e2.message : String(e2))
    }
  }
}

main().catch(console.error)
