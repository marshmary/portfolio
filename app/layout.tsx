import type { Metadata, Viewport } from 'next'
import { Geist, JetBrains_Mono } from 'next/font/google'
import './globals.css'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#2e3440',
}

export const metadata: Metadata = {
  metadataBase: new URL('https://portfolio.phutran.dev/'),
  alternates: {
    canonical: '/',
  },
  title: {
    default: 'Phu Tran — DevOps Engineer',
    template: '%s | Phu Tran',
  },
  description:
    'Interactive desktop-rice portfolio of Phu Tran, DevOps Engineer. Draggable windows, riced themes, real CV content.',
}

const geist = Geist({
  variable: '--font-geist',
  subsets: ['latin'],
})

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains',
  subsets: ['latin'],
})

/**
 * Applies the persisted theme before hydration to avoid a wallpaper flash.
 */
const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem('ricey-theme');if(t!=='nord'&&t!=='gruvbox'&&t!=='sakura'){t='nord'}document.documentElement.setAttribute('data-theme',t)}catch(e){document.documentElement.setAttribute('data-theme','nord')}})()`

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      data-theme="nord"
      suppressHydrationWarning
      className={`${geist.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="tracking-tight antialiased">{children}</body>
    </html>
  )
}
