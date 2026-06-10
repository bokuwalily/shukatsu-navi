import type { Metadata } from 'next'
import Link from 'next/link'
import { StaticPage } from '@/components/StaticPage'
import { SITE_NAME, CONTACT_EMAIL } from '@/lib/site'

export const metadata: Metadata = {
  title: 'お問い合わせ',
  description: `${SITE_NAME}へのお問い合わせ窓口。記事内容・掲載・取材・その他のご連絡はこちらから。`,
  alternates: { canonical: '/contact' },
}

export default function ContactPage() {
  return (
    <StaticPage
      title="お問い合わせ"
      lead="記事内容に関するご指摘、掲載・取材のご依頼、その他のご連絡はこちらから承ります。"
      updated="2026年6月10日"
    >
      <h2>お問い合わせ方法</h2>
      <p>
        下記のメールアドレス宛に、お名前・ご用件を明記のうえご連絡ください。内容を確認の
        うえ、担当者より順次返信いたします。返信までに数日いただく場合があります。
      </p>

      {CONTACT_EMAIL ? (
        <div className="lead-note">
          <p style={{ margin: 0 }}>
            <strong>メール：</strong>{' '}
            <Link href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</Link>
          </p>
        </div>
      ) : (
        <div className="lead-note">
          <p style={{ margin: 0 }}>
            お問い合わせ先メールアドレスは準備中です。設定後、こちらに掲載します。
          </p>
        </div>
      )}

      <h2>お問い合わせ前のお願い</h2>
      <ul>
        <li>
          記事の内容・特定のサービスに関するご質問でも、個別の就活相談・選考結果の保証等には
          お答えできない場合があります。
        </li>
        <li>
          各種就活サービスの登録方法・キャンペーン等については、運営元の公式窓口へ直接
          お問い合わせいただくほうが早く解決する場合があります。
        </li>
        <li>
          いただいた個人情報は、お問い合わせへの対応のみに利用します。詳しくは
          <Link href="/privacy">プライバシーポリシー</Link>
          をご確認ください。
        </li>
      </ul>
    </StaticPage>
  )
}
