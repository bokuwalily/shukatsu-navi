import type { Metadata } from 'next'
import Link from 'next/link'
import { StaticPage } from '@/components/StaticPage'
import { SITE_NAME, SITE_OPERATOR } from '@/lib/site'

export const metadata: Metadata = {
  title: '運営者情報',
  description: `${SITE_NAME}の運営者情報・運営方針・編集ポリシーについて。28卒就活生に向けた情報発信の目的とスタンスを説明します。`,
  alternates: { canonical: '/about' },
}

export default function AboutPage() {
  return (
    <StaticPage
      title="運営者情報"
      lead={`${SITE_NAME}がどんなメディアで、どんな方針で記事を作っているかをまとめています。`}
      updated="2026年6月10日"
    >
      <h2>当サイトについて</h2>
      <p>
        {SITE_NAME}は、28卒（2026年卒）をはじめとする就活生に向けて、エントリーシート・
        自己PR・面接対策・インターン・業界研究・OB/OG訪問・グループディスカッションなど、
        就職活動のあらゆるステップを網羅的に解説するメディアです。
      </p>
      <p>
        「就活の進め方が分からない」「何から手をつければいいか迷う」という学生が、
        必要な情報に最短でたどり着き、納得のいく内定獲得につなげられること。それが
        当サイトの目的です。
      </p>

      <h2>運営方針・編集ポリシー</h2>
      <h3>1. 就活生の意思決定に役立つことを最優先する</h3>
      <p>
        記事は「読んだ人が次の一歩を踏み出せること」を基準に構成しています。抽象論で
        終わらせず、具体的な手順・例文・チェックリストを示すことを心がけています。
      </p>
      <h3>2. 情報の鮮度と正確性に配慮する</h3>
      <p>
        就活のスケジュールや採用トレンドは年度ごとに変化します。当サイトでは可能な限り
        最新の動向を反映し、誤りに気づいた場合は速やかに修正します。なお、最終的な
        選考情報・応募要項は必ず各企業・各サービスの公式情報をご確認ください。
      </p>
      <h3>3. 広告・アフィリエイトとの関係を明示する</h3>
      <p>
        当サイトは運営費を賄うため、広告（Google AdSense）およびアフィリエイト
        プログラムを利用しています。紹介するサービスは編集方針に基づいて選定しており、
        報酬の有無によって評価や掲載順位を不当に操作することはありません。詳しくは
        <Link href="/privacy">プライバシーポリシー</Link>
        をご覧ください。
      </p>

      <h2>運営者概要</h2>
      <dl>
        <dt>サイト名</dt>
        <dd>{SITE_NAME}</dd>
        <dt>運営者</dt>
        <dd>{SITE_OPERATOR}</dd>
        <dt>対象</dt>
        <dd>28卒を中心とした就職活動中の学生</dd>
        <dt>お問い合わせ</dt>
        <dd>
          <Link href="/contact">お問い合わせページ</Link>
          よりご連絡ください
        </dd>
      </dl>
    </StaticPage>
  )
}
