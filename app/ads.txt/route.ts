/**
 * ads.txt を AdSense の client ID から動的生成する。
 * NEXT_PUBLIC_ADSENSE_CLIENT_ID（例: ca-pub-1234567890123456）を設定すれば
 * google.com 行を自動で返す。未設定なら空（ビルド済みでも env だけで有効化可）。
 */
export const dynamic = 'force-dynamic'

export function GET() {
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID ?? ''
  // ca-pub-XXXX -> pub-XXXX
  const pubId = clientId.replace(/^ca-/, '')

  const body = pubId
    ? `google.com, ${pubId}, DIRECT, f08c47fec0942fa0\n`
    : '# ads.txt: AdSense client ID 未設定です（NEXT_PUBLIC_ADSENSE_CLIENT_ID を設定してください）\n'

  return new Response(body, {
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'cache-control': 'public, max-age=3600',
    },
  })
}
