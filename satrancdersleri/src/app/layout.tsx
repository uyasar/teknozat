import type { Metadata } from 'next'
import './globals.css'
import { Providers } from '@/components/Providers'

export const metadata: Metadata = {
  title: {
    default: 'Satranç Dersleri - Online Satranç Eğitimi',
    template: '%s | Satranç Dersleri',
  },
  description: 'Çocuklar ve yetişkinler için interaktif satranç dersleri. Video dersler, AI destekli analiz ve bulmacalarla satranç öğren.',
  keywords: ['satranç', 'satranç dersleri', 'satranç öğren', 'çocuk satranç'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://unpkg.com/@chrisoakman/chessboardjs@1.0.0/dist/chessboard-1.0.0.min.css"
        />
        <script
          src="https://code.jquery.com/jquery-3.5.1.min.js"
          crossOrigin="anonymous"
          defer
        ></script>
        <script
          src="https://unpkg.com/@chrisoakman/chessboardjs@1.0.0/dist/chessboard-1.0.0.min.js"
          defer
        ></script>
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
