import type { Metadata } from 'next'
import Link from 'next/link'
import { StaticPage } from '@/components/StaticPage'
import { SITE_NAME, SITE_OPERATOR } from '@/lib/site'

export const metadata: Metadata = {
  title: 'プライバシーポリシー',
  description: `${SITE_NAME}のプライバシーポリシー。広告配信（Google AdSense）・アクセス解析・Cookieの利用と、お客様の個人情報の取り扱いについて説明します。`,
  alternates: { canonical: '/privacy' },
}

export default function PrivacyPage() {
  return (
    <StaticPage
      title="プライバシーポリシー"
      lead={`${SITE_NAME}（以下「当サイト」）における個人情報・Cookie・広告配信の取り扱いについて定めます。`}
      updated="2026年6月10日"
    >
      <h2>1. 個人情報の利用目的</h2>
      <p>
        当サイトでは、お問い合わせやコメントの際に、氏名・メールアドレス等の個人情報を
        ご入力いただく場合があります。取得した個人情報は、お問い合わせへの回答や必要な
        情報を電子メール等でご連絡する目的にのみ利用し、それ以外の目的では利用しません。
      </p>

      <h2>2. 広告配信について（Google AdSense）</h2>
      <p>
        当サイトは、第三者配信の広告サービス「Google AdSense（グーグルアドセンス）」を
        利用する場合があります。広告配信事業者は、ユーザーの興味に応じた広告を表示する
        ため、Cookie（クッキー）を使用することがあります。
      </p>
      <ul>
        <li>
          Cookie を使用することで、当サイトや他サイトへの過去のアクセス情報に基づいて
          広告が配信されます。
        </li>
        <li>
          Google が広告 Cookie を使用することにより、ユーザーが当サイトや他サイトに
          アクセスした際の情報に基づいて、Google やそのパートナーが適切な広告を表示します。
        </li>
        <li>
          ユーザーは
          <Link href="https://adssettings.google.com/" target="_blank" rel="noopener noreferrer">
            広告設定
          </Link>
          で、パーソナライズ広告を無効にできます。また
          <Link href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer">
            www.aboutads.info
          </Link>
          にアクセスすれば、第三者配信事業者の Cookie を無効にできます。
        </li>
      </ul>
      <p>
        Google による広告 Cookie の取り扱いの詳細は、
        <Link href="https://policies.google.com/technologies/ads?hl=ja" target="_blank" rel="noopener noreferrer">
          Google のポリシーと規約
        </Link>
        をご確認ください。
      </p>

      <h2>3. アクセス解析ツールについて</h2>
      <p>
        当サイトでは、サイトの利用状況を把握するためにアクセス解析ツールを利用する場合が
        あります。これらのツールはトラフィックデータの収集のために Cookie を使用すること
        があります。このトラフィックデータは匿名で収集されており、個人を特定するものでは
        ありません。Cookie を無効にすることで収集を拒否することができますので、ご利用の
        ブラウザの設定をご確認ください。
      </p>

      <h2>4. アフィリエイトプログラムについて</h2>
      <p>
        当サイトは、第三者が提供するアフィリエイトプログラムに参加しています。これにより、
        当サイトを経由して各サービスへ登録・申込みが行われた場合、当サイトが報酬を受け取る
        ことがあります。掲載内容は当サイトが独自に編集したものであり、報酬の有無が記事の
        評価や順位を不当に左右しないよう努めています。
      </p>

      <h2>5. 免責事項</h2>
      <ul>
        <li>
          当サイトのコンテンツは情報提供を目的としたものであり、正確性・完全性を保証する
          ものではありません。
        </li>
        <li>
          当サイトの情報を利用して生じたいかなる損害についても、当サイトは一切の責任を
          負いかねます。各種サービスの最終的な利用判断はご自身の責任で行ってください。
        </li>
        <li>
          当サイトからリンクやバナーによって他サイトへ移動した場合、移動先サイトで提供
          される情報・サービスについて当サイトは責任を負いません。
        </li>
      </ul>

      <h2>6. 著作権について</h2>
      <p>
        当サイトに掲載されている文章・画像等の著作権は、当サイトまたは正当な権利を有する
        第三者に帰属します。無断転載・複製を禁止します。引用の範囲を超える利用を希望される
        場合は、お問い合わせよりご連絡ください。
      </p>

      <h2>7. プライバシーポリシーの変更</h2>
      <p>
        当サイトは、必要に応じて本ポリシーの内容を変更することがあります。変更後の
        プライバシーポリシーは、本ページに掲載した時点から効力を生じるものとします。
      </p>

      <h2>8. 運営者・お問い合わせ</h2>
      <p>
        運営者：{SITE_OPERATOR}
        <br />
        本ポリシーに関するお問い合わせは
        <Link href="/contact">お問い合わせページ</Link>
        よりご連絡ください。
      </p>
    </StaticPage>
  )
}
