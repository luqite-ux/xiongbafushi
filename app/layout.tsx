import type { Metadata, Viewport } from 'next'
import { Hanken_Grotesk, Newsreader } from 'next/font/google'
import { SiteFooter } from '@/components/site/site-footer'
import { SiteHeader } from '@/components/site/site-header'
import { siteConfig } from '@/lib/site'
import './globals.css'

const display = Newsreader({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

const body = Hanken_Grotesk({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://www.xiongbafushi.com'),
  title: {
    default: `${siteConfig.name} | Children's and Teen Thermal Underwear Manufacturer`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  icons: {
    icon: [{ url: '/icon.svg', type: 'image/svg+xml' }],
  },
  openGraph: {
    type: 'website',
    siteName: siteConfig.name,
    title: `${siteConfig.name} | Children's and Teen Thermal Underwear Manufacturer`,
    description: siteConfig.description,
    images: [{ url: '/images/hero/hero-teens.jpg', alt: 'Two teenagers in cream thermal sets' }],
  },
    generator: 'v0.app'
}

export const viewport: Viewport = {
  themeColor: '#f8f1e6',
  width: 'device-width',
  initialScale: 1,
}

const motionReadyScript = `(function(){try{var d=document.documentElement;if(window.matchMedia('(prefers-reduced-motion: reduce)').matches||!('IntersectionObserver' in window))return;d.setAttribute('data-motion','ready');window.addEventListener('error',function(){d.removeAttribute('data-motion')})}catch(e){}})();`

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: motionReadyScript }} />
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;transform:none!important}.hero-slide:not([data-active='true']){display:none}.hero-slide[data-active='true']{opacity:1;visibility:visible}`}</style>
        </noscript>
      </head>
      <body className="font-sans antialiased">
        <a
          href="#main"
          className="bg-ink text-ink-foreground sr-only z-50 px-4 py-3 text-sm font-semibold focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
      </body>
    </html>
  )
}
