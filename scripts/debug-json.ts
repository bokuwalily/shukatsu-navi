// JSONパース問題のデバッグ
import { GoogleGenAI } from '@google/genai'

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! })

function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)) }

async function main() {
  const keyword = 'ES 通過率 高い 書き方'
  const category = 'ES・自己PR'

  const prompt = `あなたはSEOに精通した就活ライターです。28卒向けに「${keyword}」の記事を書いてください。

以下の形式でJSONのみを返してください（コードブロック・説明文は不要）:
{"meta_desc":"メタディスクリプション（80〜120文字）","content":"記事本文（マークダウン形式）"}

記事本文は3000字程度、マークダウン形式で書いてください。`

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: { maxOutputTokens: 8192 },
  })

  const rawText = response.text ?? ''
  console.log('生文字数:', rawText.length)
  console.log('最初の200字:')
  console.log(rawText.slice(0, 200))
  console.log('\n問題のある文字コード:')

  // position 2929あたりを調べる
  const around = rawText.slice(2900, 2960)
  console.log('2900-2960文字目周辺:', JSON.stringify(around))
  for (let i = 2900; i < Math.min(2960, rawText.length); i++) {
    const code = rawText.charCodeAt(i)
    if (code < 32 && code !== 9 && code !== 10 && code !== 13) {
      console.log(`  位置${i}: 制御文字 0x${code.toString(16).padStart(2,'0')} (${code})`)
    }
  }

  // 全制御文字を探す
  console.log('\n全制御文字（改行・タブ以外）の位置:')
  let count = 0
  for (let i = 0; i < rawText.length && count < 10; i++) {
    const code = rawText.charCodeAt(i)
    if (code < 32 && code !== 9 && code !== 10 && code !== 13) {
      console.log(`  位置${i}: 0x${code.toString(16).padStart(2,'0')} 周辺: ${JSON.stringify(rawText.slice(Math.max(0,i-20), i+20))}`)
      count++
    }
  }
  if (count === 0) {
    console.log('  見つからなかった（別の問題かも）')
    // パースを試みる
    try {
      const raw = rawText.replace(/```json\n?|\n?```/g, '').trim()
      const jsonMatch = raw.match(/\{[\s\S]*\}/)
      const jsonStr = jsonMatch ? jsonMatch[0] : raw
      const parsed = JSON.parse(jsonStr)
      console.log('\nパース成功！content length:', (parsed.content as string).length)
    } catch (e) {
      console.log('\nパース失敗:', e instanceof Error ? e.message : String(e))
      // 生テキストの構造を確認
      const jsonStartIdx = rawText.indexOf('{')
      const jsonEndIdx = rawText.lastIndexOf('}')
      console.log('JSON開始:', jsonStartIdx, '終了:', jsonEndIdx)

      // JSONを自分でサニタイズする
      if (jsonStartIdx >= 0) {
        const rawJson = rawText.slice(jsonStartIdx, jsonEndIdx + 1)
        // content フィールドの値を抽出してみる
        const contentMatch = rawJson.match(/"content"\s*:\s*"([\s\S]*?)",?\s*"meta_desc"/)
        if (contentMatch) {
          console.log('content フィールド発見、長さ:', contentMatch[1].length)
        }
      }
    }
  }
}

main().catch(console.error)
