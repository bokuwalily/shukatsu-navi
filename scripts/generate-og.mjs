/**
 * デフォルトOG画像生成（1200x630）。public/og-default.png に出力。
 * サイトの墨色（--dark #0D1B2A 系）＋アクセント #C84B31、明朝系の雰囲気。
 *
 * 使い方: node scripts/generate-og.mjs
 */
import sharp from 'sharp'
import { writeFile } from 'node:fs/promises'

const W = 1200
const H = 630
const ACCENT = '#C84B31'
const DARK = '#0D1B2A'
const DARK_MID = '#1A2E42'
const CREAM = '#F8F3EA'

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${DARK}"/>
      <stop offset="0.6" stop-color="${DARK_MID}"/>
      <stop offset="1" stop-color="#1e3a5f"/>
    </linearGradient>
    <linearGradient id="bar" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="${ACCENT}"/>
      <stop offset="1" stop-color="#E8693A"/>
    </linearGradient>
  </defs>

  <rect width="${W}" height="${H}" fill="url(#bg)"/>

  <!-- 細い枠線（和の落ち着き） -->
  <rect x="28" y="28" width="${W - 56}" height="${H - 56}" fill="none"
        stroke="rgba(255,255,255,0.12)" stroke-width="2"/>

  <!-- 背景の大きな「就」透かし -->
  <text x="${W - 180}" y="${H / 2}" font-family="'Hiragino Mincho ProN', 'Yu Mincho', 'Noto Serif JP', serif"
        font-size="460" font-weight="700" fill="rgba(255,255,255,0.05)"
        text-anchor="middle" dominant-baseline="central">就</text>

  <!-- アクセントバー -->
  <rect x="96" y="180" width="72" height="8" fill="url(#bar)"/>

  <!-- バッジ -->
  <rect x="96" y="218" width="248" height="44" rx="22" fill="${ACCENT}"/>
  <text x="220" y="241" font-family="'Hiragino Sans', 'Noto Sans JP', sans-serif"
        font-size="20" font-weight="700" fill="white" letter-spacing="4"
        text-anchor="middle" dominant-baseline="central">28卒 就活完全攻略</text>

  <!-- サイト名（明朝・大） -->
  <text x="92" y="372" font-family="'Hiragino Mincho ProN', 'Yu Mincho', 'Noto Serif JP', serif"
        font-size="128" font-weight="700" fill="${CREAM}" letter-spacing="6">就活ナビ</text>

  <!-- サブコピー -->
  <text x="96" y="448" font-family="'Hiragino Mincho ProN', 'Yu Mincho', 'Noto Serif JP', serif"
        font-size="34" fill="rgba(248,243,234,0.78)" letter-spacing="3">就活を制する者が、内定を制する。</text>

  <!-- フッター（URL + 落款風の朱印） -->
  <text x="96" y="540" font-family="'Hiragino Sans', 'Noto Sans JP', sans-serif"
        font-size="22" fill="rgba(255,255,255,0.45)" letter-spacing="2">shukatsunavi.vercel.app</text>
  <rect x="${W - 168}" y="${H - 168}" width="72" height="72" rx="10" fill="${ACCENT}"/>
  <text x="${W - 132}" y="${H - 130}" font-family="'Hiragino Mincho ProN', 'Yu Mincho', serif"
        font-size="44" font-weight="700" fill="${CREAM}"
        text-anchor="middle" dominant-baseline="central">就</text>
</svg>`

const png = await sharp(Buffer.from(svg)).png().toBuffer()
await writeFile('public/og-default.png', png)

const meta = await sharp(png).metadata()
console.log(`✓ generated public/og-default.png (${meta.width}x${meta.height}, ${(png.length / 1024).toFixed(1)}KB)`)
