// components/AffiliateBlock.tsx
export function AffiliateBlock() {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 my-8">
      <p className="font-semibold text-blue-800 mb-3">おすすめ就活サービス</p>
      <div className="flex flex-col gap-2">
        <a
          href="https://job.mynavi.jp/?af=affiliate_id_here"
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="bg-blue-600 text-white text-center py-2 px-4 rounded hover:bg-blue-700"
        >
          マイナビ就活に無料登録する
        </a>
        <a
          href="https://job.rikunabi.com/?af=affiliate_id_here"
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="bg-red-600 text-white text-center py-2 px-4 rounded hover:bg-red-700"
        >
          リクナビに無料登録する
        </a>
      </div>
    </div>
  )
}
