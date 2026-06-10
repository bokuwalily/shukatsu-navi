/** サイト共通定数。運営者名・連絡先は env で上書き可能（未設定時はプレースホルダ） */
export const SITE_NAME = '就活ナビ'
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://shukatsunavi.vercel.app'

/** 運営者名（AdSense 運営者情報用）。env: NEXT_PUBLIC_SITE_OPERATOR */
export const SITE_OPERATOR =
  process.env.NEXT_PUBLIC_SITE_OPERATOR ?? '就活ナビ編集部'

/** 問い合わせ用メール。env: NEXT_PUBLIC_CONTACT_EMAIL（未設定時は要差し替え） */
export const CONTACT_EMAIL =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? ''
