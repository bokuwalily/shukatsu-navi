import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: '就活攻略ガイド', template: '%s | 就活攻略ガイド' },
  description: 'ES・面接・インターンを攻略する就活生のための情報サイト',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@400;600;700;900&family=Noto+Sans+JP:wght@300;400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
